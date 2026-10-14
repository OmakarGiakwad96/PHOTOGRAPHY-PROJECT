package com.photohub.service;

import com.photohub.dto.ForgotPasswordRequestDto;
import com.photohub.dto.LoginRequest;
import com.photohub.dto.RegisterRequest;
import com.photohub.dto.ResetPasswordRequestDto;
import com.photohub.model.Admin;
import com.photohub.model.Client;
import com.photohub.model.Photographer;
import com.photohub.model.Role;
import com.photohub.repository.AdminRepository;
import com.photohub.repository.ClientRepository;
import com.photohub.repository.PhotographerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private static final Pattern PASSWORD_STRENGTH_PATTERN = Pattern.compile("^(?=.*[a-zA-Z])(?=.*\\d).{8,}$");

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PhotographerRepository photographerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private OtpService otpService;

    @Transactional
    public Object registerUser(RegisterRequest request) {
        if (clientRepository.existsByEmail(request.getEmail()) || 
            photographerRepository.findByEmail(request.getEmail()).isPresent() ||
            adminRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already taken!");
        }

        Role role = Role.valueOf(request.getRole().toUpperCase());

        if (role == Role.PHOTOGRAPHER) {
            Photographer photographer = Photographer.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .phone(request.getPhone())
                    .role(Role.PHOTOGRAPHER)
                    .isVerified(false)
                    .isDeleted(false)
                    .status("active")
                    .build();
            return photographerRepository.save(photographer);
        } else if (role == Role.ADMIN) {
            Admin admin = Admin.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .phone(request.getPhone())
                    .role(Role.ADMIN)
                    .build();
            return adminRepository.save(admin);
        } else {
            Client client = Client.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .phone(request.getPhone())
                    .role(Role.CLIENT)
                    .status("active")
                    .isDeleted(false)
                    .build();
            return clientRepository.save(client);
        }
    }

    /**
     * Initiates forgot-password process with strict Anti-Enumeration behavior.
     * Always returns the same user-safe response regardless of whether the account exists.
     */
    @Transactional
    public Map<String, Object> initiateForgotPassword(ForgotPasswordRequestDto request, String clientIp) {
        String identifier = request.getIdentifier() != null ? request.getIdentifier().trim() : "";
        String channel = request.getChannel() != null && request.getChannel().equalsIgnoreCase("SMS") ? "SMS" : "EMAIL";

        // Check if an account exists for this email or phone
        boolean accountExists = false;
        if (identifier.contains("@")) {
            accountExists = clientRepository.findByEmail(identifier).isPresent() ||
                    photographerRepository.findByEmail(identifier).isPresent() ||
                    adminRepository.findByEmail(identifier).isPresent();
        } else {
            accountExists = clientRepository.findByPhone(identifier).isPresent() ||
                    photographerRepository.findByPhone(identifier).isPresent() ||
                    adminRepository.findByPhone(identifier).isPresent();
        }

        if (accountExists) {
            try {
                otpService.createAndSendOtp(identifier, channel, "FORGOT_PASSWORD", clientIp);
                logger.info("Forgot password instructions initiated for authorized account");
            } catch (Exception ex) {
                logger.warn("Notice during OTP dispatch: {}", ex.getMessage());
            }
        } else {
            // Anti-enumeration: Log quietly on server, never tell client that account does not exist
            logger.info("Forgot password requested for non-existing identifier. Anti-enumeration active.");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "If an eligible PhotoHub account is associated with this " + 
                ("SMS".equals(channel) ? "phone number" : "email address") + 
                ", password reset instructions have been sent.");
        return response;
    }

    /**
     * Validates a password reset link token without consuming it.
     */
    public Map<String, Object> validateResetToken(String token) {
        String identifier = otpService.verifyResetToken(token);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("valid", true);
        response.put("message", "Reset token is valid.");
        response.put("identifier", maskIdentifier(identifier));
        return response;
    }

    /**
     * Completes password reset after verifying the reset token or OTP.
     */
    @Transactional
    public Map<String, Object> completePasswordReset(ResetPasswordRequestDto request) {
        if (request.getNewPassword() == null || request.getConfirmPassword() == null) {
            throw new IllegalArgumentException("New password and confirm password are required.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match. Please verify and try again.");
        }

        if (!PASSWORD_STRENGTH_PATTERN.matcher(request.getNewPassword()).matches()) {
            throw new IllegalArgumentException("Password must be at least 8 characters long and include both letters and numbers.");
        }

        String targetIdentifier = null;

        // Path A: Verification via Link Token
        if (request.getToken() != null && !request.getToken().trim().isEmpty()) {
            targetIdentifier = otpService.verifyResetToken(request.getToken().trim());
        } 
        // Path B: Verification via OTP Code
        else if (request.getOtp() != null && !request.getOtp().trim().isEmpty()) {
            if (request.getIdentifier() == null || request.getIdentifier().trim().isEmpty()) {
                throw new IllegalArgumentException("Email or phone number is required for OTP verification.");
            }
            targetIdentifier = request.getIdentifier().trim();
            otpService.verifyOtp(targetIdentifier, "FORGOT_PASSWORD", request.getOtp().trim());
        } else {
            throw new IllegalArgumentException("Either a reset token or an OTP code must be provided.");
        }

        // Apply updated password with BCrypt
        String encodedPassword = passwordEncoder.encode(request.getNewPassword());
        boolean updated = false;

        if (targetIdentifier.contains("@")) {
            Optional<Client> client = clientRepository.findByEmail(targetIdentifier);
            if (client.isPresent()) {
                client.get().setPassword(encodedPassword);
                clientRepository.save(client.get());
                updated = true;
            }

            Optional<Photographer> photographer = photographerRepository.findByEmail(targetIdentifier);
            if (photographer.isPresent()) {
                photographer.get().setPassword(encodedPassword);
                photographerRepository.save(photographer.get());
                updated = true;
            }

            Optional<Admin> admin = adminRepository.findByEmail(targetIdentifier);
            if (admin.isPresent()) {
                admin.get().setPassword(encodedPassword);
                adminRepository.save(admin.get());
                updated = true;
            }
        } else {
            // Find by phone
            Optional<Client> client = clientRepository.findByPhone(targetIdentifier);
            if (client.isPresent()) {
                client.get().setPassword(encodedPassword);
                clientRepository.save(client.get());
                updated = true;
            }

            Optional<Photographer> photographer = photographerRepository.findByPhone(targetIdentifier);
            if (photographer.isPresent()) {
                photographer.get().setPassword(encodedPassword);
                photographerRepository.save(photographer.get());
                updated = true;
            }

            Optional<Admin> admin = adminRepository.findByPhone(targetIdentifier);
            if (admin.isPresent()) {
                admin.get().setPassword(encodedPassword);
                adminRepository.save(admin.get());
                updated = true;
            }
        }

        // Consume reset challenge to ensure single-use
        otpService.consumeResetChallenge(targetIdentifier);

        logger.info("Password successfully reset for account associated with [{}]", maskIdentifier(targetIdentifier));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Password has been successfully updated. You may now log in with your new password.");
        return response;
    }

    @Transactional
    public void changePassword(String email, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        clientRepository.findByEmail(email).ifPresent(c -> {
            c.setPassword(encodedPassword);
            clientRepository.save(c);
        });
        photographerRepository.findByEmail(email).ifPresent(p -> {
            p.setPassword(encodedPassword);
            photographerRepository.save(p);
        });
        adminRepository.findByEmail(email).ifPresent(a -> {
            a.setPassword(encodedPassword);
            adminRepository.save(a);
        });
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
