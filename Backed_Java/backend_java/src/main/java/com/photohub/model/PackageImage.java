package com.photohub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "package_images")
public class PackageImage {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 private String url;
 private String description;
 private LocalDateTime uploadedAt = LocalDateTime.now();

 @ManyToOne
 @JoinColumn(name = "gallery_id")
 private Gallery gallery;
 // getters and setters
}
