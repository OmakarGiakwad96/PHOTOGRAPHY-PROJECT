package com.photohub.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "photographers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Photographer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photographer_id")
    private Long photographerId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.PHOTOGRAPHER;

    @Column(columnDefinition = "TEXT")
    private String profilePicture;

    @Builder.Default
    private String status = "active";

    private Integer experience;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String location;

    private Double rating;

    @Column(name = "price_per_hour")
    private Double pricePerHour;

    @Column(name = "is_verified")
    @Builder.Default
    private boolean isVerified = false;

    @Column(name = "cover_image", columnDefinition = "TEXT")
    private String coverImage;

    private String specialties; // Stored as comma-separated values

    @Column(name = "is_deleted")
    @Builder.Default
    private boolean isDeleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
