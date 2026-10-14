package com.photohub.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Supports both phone numbers (e.g. +919876543210) and emails
    @Column(name = "identifier", nullable = false, length = 150)
    private String identifier;

    // Legacy column kept for backwards database compatibility
    @Column(name = "email")
    private String email;

    @Column(name = "channel", length = 20)
    @Builder.Default
    private String channel = "SMS"; // "SMS" or "EMAIL"

    @Column(name = "purpose", length = 50)
    @Builder.Default
    private String purpose = "REGISTRATION"; // "REGISTRATION", "FORGOT_PASSWORD", "LOGIN", "PHONE_VERIFICATION"

    // Secure SHA-256 hash of OTP. Plaintext OTP is NEVER stored.
    @Column(name = "otp_hash", length = 128)
    private String otpHash;

    // Secure SHA-256 hash of reset link token (for email reset links).
    @Column(name = "token_hash", length = 128)
    private String tokenHash;

    @Column(name = "attempts_count")
    @Builder.Default
    private Integer attemptsCount = 0;

    @Column(name = "max_attempts")
    @Builder.Default
    private Integer maxAttempts = 5;

    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;

    @Column(name = "resend_cooldown_until")
    private LocalDateTime resendCooldownUntil;

    @Column(name = "verified")
    @Builder.Default
    private Boolean verified = false;

    @Column(name = "consumed")
    @Builder.Default
    private Boolean consumed = false;

    @Column(name = "ip_address", length = 60)
    private String ipAddress;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
