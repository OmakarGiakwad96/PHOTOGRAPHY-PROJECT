package com.photohub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verifications")
public class OtpVerification {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 private String otp;
 private LocalDateTime expiryTime;
 private Boolean verified = false;

 @Column(name = "email", nullable = false)
 private String email;
 // getters and setters
}
