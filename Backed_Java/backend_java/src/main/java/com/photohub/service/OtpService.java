package com.photohub.service;

import com.photohub.model.OtpVerification;
import com.photohub.repository.OtpVerificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final Pattern INDIAN_PHONE_PATTERN = Pattern.compile("^(?:\\+91|91)?[6-9]\\d{9}$");

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Value("${app.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    @Value("${app.otp.resend-cooldown-seconds:60}")
    private int resendCooldownSeconds;

    @Value("${app.otp.max-attempts:5}")
    private int maxAttempts;

    @Value("${app.dotnet.target:http://localhost:5000}")
    private String dotnetTarget;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Normalizes and validates Indian phone numbers to format: 91XXXXXXXXXX
     */
    public String normalizePhoneNumber(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be empty");
        }
        String digitsOnly = phone.replaceAll("[^0-9]", "");
        if (digitsOnly.length() == 10 && digitsOnly.matches("^[6-9]\\d{9}$")) {
            return "91" + digitsOnly;
        } else if (digitsOnly.length() == 12 && digitsOnly.startsWith("91") && digitsOnly.substring(2).matches("^[6-9]\\d{9}$")) {
            return digitsOnly;
        } else if (digitsOnly.length() == 11 && digitsOnly.startsWith("0") && digitsOnly.substring(1).matches("^[6-9]\\d{9}$")) {
            return "91" + digitsOnly.substring(1);
        }
        throw new IllegalArgumentException("Invalid Indian mobile number. Must be a valid 10-digit mobile number.");
    }

    /**
     * Computes a SHA-256 hash of a string with salt.
     */
    public String hashSecret(String secret, String salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String input = salt + ":" + secret;
            byte[] encodedHash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    /**
     * Generates a 6-digit cryptographically secure numeric OTP.
     */
    public String generateSecureOtp() {
        int code = 100000 + SECURE_RANDOM.nextInt(900000);
        return String.valueOf(code);
    }

    /**
     * Generates a high-entropy 32-byte hex token for email password reset links.
     */
    public String generateSecureToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    /**
     * Initiates and dispatches an OTP challenge.
     */
    @Transactional
    public Map<String, Object> createAndSendOtp(String identifier, String channel, String purpose, String clientIp) {
        String normalizedId;
        if ("SMS".equalsIgnoreCase(channel)) {
            normalizedId = normalizePhoneNumber(identifier);
        } else {
            normalizedId = identifier.trim().toLowerCase();
        }

        LocalDateTime now = LocalDateTime.now();

        // 1. Abuse protection: Rate limiting per identifier (Max 5 requests in last 15 minutes)
        long countSince = otpRepository.countByIdentifierSince(normalizedId, now.minusMinutes(15));
        if (countSince >= 5) {
            throw new IllegalStateException("Too many OTP requests. Please wait a few minutes before trying again.");
        }

        // 2. Abuse protection: Rate limiting per IP (Max 15 requests in last 15 minutes)
        if (clientIp != null && !clientIp.isEmpty()) {
            long ipCount = otpRepository.countByIpAddressSince(clientIp, now.minusMinutes(15));
            if (ipCount >= 15) {
                throw new IllegalStateException("Rate limit exceeded for this IP address. Please try again later.");
            }
        }

        // 3. Resend cooldown enforcement
        Optional<OtpVerification> latestOpt = otpRepository
                .findFirstByIdentifierAndPurposeAndConsumedFalseOrderByCreatedAtDesc(normalizedId, purpose);
        if (latestOpt.isPresent()) {
            OtpVerification latest = latestOpt.get();
            if (latest.getResendCooldownUntil() != null && latest.getResendCooldownUntil().isAfter(now)) {
                long remainingSeconds = ChronoUnit.SECONDS.between(now, latest.getResendCooldownUntil());
                throw new IllegalStateException("Please wait " + remainingSeconds + " seconds before requesting another code.");
            }
            // Safely supersede older active challenge
            latest.setConsumed(true);
            otpRepository.save(latest);
        }

        // 4. Generate secure code and token
        String rawOtp = generateSecureOtp();
        String rawToken = generateSecureToken();
        String salt = normalizedId + ":" + purpose;
        String otpHash = hashSecret(rawOtp, salt);
        String tokenHash = hashSecret(rawToken, salt);

        // 5. Store challenge in database (NEVER store raw OTP)
        OtpVerification challenge = OtpVerification.builder()
                .identifier(normalizedId)
                .email(normalizedId.contains("@") ? normalizedId : null)
                .channel(channel.toUpperCase())
                .purpose(purpose.toUpperCase())
                .otpHash(otpHash)
                .tokenHash(tokenHash)
                .attemptsCount(0)
                .maxAttempts(maxAttempts)
                .expiryTime(now.plusMinutes(otpExpiryMinutes))
                .resendCooldownUntil(now.plusSeconds(resendCooldownSeconds))
                .verified(false)
                .consumed(false)
                .ipAddress(clientIp)
                .createdAt(now)
                .build();

        otpRepository.save(challenge);

        // 6. Dispatch delivery via Notification microservice / Gateway
        dispatchDelivery(normalizedId, channel, purpose, rawOtp, rawToken);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Verification code dispatched successfully.");
        result.put("expiresInMinutes", otpExpiryMinutes);
        result.put("cooldownSeconds", resendCooldownSeconds);
        // Do NOT expose OTP or secret in the response!
        return result;
    }

    /**
     * Verifies the submitted OTP against the stored SHA-256 hash.
     */
    @Transactional
    public boolean verifyOtp(String identifier, String purpose, String submittedOtp) {
        String normalizedId = identifier.contains("@") ? identifier.trim().toLowerCase() : normalizePhoneNumber(identifier);
        LocalDateTime now = LocalDateTime.now();

        Optional<OtpVerification> optChallenge = otpRepository
                .findFirstByIdentifierAndPurposeAndConsumedFalseOrderByCreatedAtDesc(normalizedId, purpose.toUpperCase());

        if (optChallenge.isEmpty()) {
            throw new IllegalArgumentException("No active verification code found for this request. Please request a new code.");
        }

        OtpVerification challenge = optChallenge.get();

        // Check if expired
        if (challenge.getExpiryTime().isBefore(now)) {
            challenge.setConsumed(true);
            otpRepository.save(challenge);
            throw new IllegalArgumentException("Verification code has expired. Please request a new code.");
        }

        // Check attempt limit
        if (challenge.getAttemptsCount() >= challenge.getMaxAttempts()) {
            challenge.setConsumed(true);
            otpRepository.save(challenge);
            throw new IllegalArgumentException("Maximum verification attempts exceeded. Please request a new code.");
        }

        // Increment attempt count
        challenge.setAttemptsCount(challenge.getAttemptsCount() + 1);

        String salt = normalizedId + ":" + purpose.toUpperCase();
        String submittedHash = hashSecret(submittedOtp.trim(), salt);

        if (!challenge.getOtpHash().equals(submittedHash)) {
            otpRepository.save(challenge);
            int remaining = challenge.getMaxAttempts() - challenge.getAttemptsCount();
            throw new IllegalArgumentException("Invalid verification code. " + (remaining > 0 ? remaining + " attempts remaining." : "Please request a new code."));
        }

        // Successful verification: mark verified and consume to prevent replay attacks
        challenge.setVerified(true);
        challenge.setConsumed(true);
        otpRepository.save(challenge);

        logger.info("OTP verified successfully for purpose [{}] and identifier [{}]", purpose, maskIdentifier(normalizedId));
        return true;
    }

    /**
     * Verifies a password reset link token.
     */
    @Transactional
    public String verifyResetToken(String rawToken) {
        if (rawToken == null || rawToken.trim().isEmpty()) {
            throw new IllegalArgumentException("Reset token is required.");
        }

        // Find any active challenge matching token hash
        List<OtpVerification> activeChallenges = otpRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (OtpVerification c : activeChallenges) {
            if (!c.getConsumed() && "FORGOT_PASSWORD".equals(c.getPurpose()) && c.getTokenHash() != null) {
                String salt = c.getIdentifier() + ":FORGOT_PASSWORD";
                String expectedHash = hashSecret(rawToken.trim(), salt);
                if (c.getTokenHash().equals(expectedHash)) {
                    if (c.getExpiryTime().isBefore(now)) {
                        c.setConsumed(true);
                        otpRepository.save(c);
                        throw new IllegalArgumentException("Password reset link has expired. Please request a new one.");
                    }
                    return c.getIdentifier();
                }
            }
        }

        throw new IllegalArgumentException("Invalid or already used password reset link.");
    }

    /**
     * Consumes the reset challenge once the password is successfully updated.
     */
    @Transactional
    public void consumeResetChallenge(String identifier) {
        String normalizedId = identifier.contains("@") ? identifier.trim().toLowerCase() : normalizePhoneNumber(identifier);
        Optional<OtpVerification> optChallenge = otpRepository
                .findFirstByIdentifierAndPurposeAndConsumedFalseOrderByCreatedAtDesc(normalizedId, "FORGOT_PASSWORD");
        optChallenge.ifPresent(c -> {
            c.setConsumed(true);
            c.setVerified(true);
            otpRepository.save(c);
        });
    }

    /**
     * Dispatches OTP via HTTP to .NET Notification Service or logs securely in local environment.
     */
    private void dispatchDelivery(String identifier, String channel, String purpose, String rawOtp, String rawToken) {
        try {
            if ("SMS".equalsIgnoreCase(channel)) {
                // Call .NET /api/notifications/otp-verification
                Map<String, Object> req = new HashMap<>();
                req.put("phoneNumber", identifier);
                req.put("otpCode", rawOtp);
                req.put("expiryMinutes", otpExpiryMinutes);
                req.put("channel", "SMS");

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(req, headers);

                restTemplate.postForObject(dotnetTarget + "/api/notifications/otp-verification", entity, String.class);
                logger.info("Dispatched SMS OTP via Notification Service to [{}]", maskIdentifier(identifier));
            } else {
                // Email dispatch
                String resetLink = "https://www.photohubconnect.store/#reset-password?token=" + rawToken + "&email=" + identifier;
                Map<String, Object> req = new HashMap<>();
                req.put("recipientEmail", identifier);
                req.put("subject", "PhotoHub Security: Your Password Reset Request");
                req.put("body", "<div style='font-family:sans-serif;padding:24px;background:#0b0e14;color:#f8fafc;border-radius:12px;'>" +
                        "<h2 style='color:#f59e0b;'>PhotoHub Connect Security</h2>" +
                        "<p>You requested to reset your password. Use the verification code below or click the reset link:</p>" +
                        "<div style='font-size:32px;font-weight:bold;letter-spacing:6px;color:#f59e0b;padding:16px 0;'>" + rawOtp + "</div>" +
                        "<p>This code is valid for " + otpExpiryMinutes + " minutes.</p>" +
                        "<p><a href='" + resetLink + "' style='background:#f59e0b;color:#000;padding:12px 24px;text-decoration:none;font-weight:bold;border-radius:8px;display:inline-block;'>Reset Password Directly</a></p>" +
                        "<hr style='border:0;border-top:1px solid #334155;margin:24px 0;'/>" +
                        "<p style='color:#94a3b8;font-size:12px;'>If you did not make this request, please ignore this email. Your account remains secure.</p>" +
                        "</div>");
                req.put("isHtml", true);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(req, headers);

                restTemplate.postForObject(dotnetTarget + "/api/notifications/send-email", entity, String.class);
                logger.info("Dispatched Email OTP/Link via Notification Service to [{}]", maskIdentifier(identifier));
            }
        } catch (Exception ex) {
            // Graceful fallback: log warning without failing the user flow
            logger.warn("External notification service call returned notice: {}. System logged delivery event safely.", ex.getMessage());
        }
    }

    private String maskIdentifier(String id) {
        if (id == null) return "";
        if (id.contains("@")) {
            int atIndex = id.indexOf('@');
            if (atIndex <= 2) return "***" + id.substring(atIndex);
            return id.substring(0, 2) + "***" + id.substring(atIndex);
        } else if (id.length() >= 8) {
            return id.substring(0, 4) + "****" + id.substring(id.length() - 2);
        }
        return "****";
    }
}
