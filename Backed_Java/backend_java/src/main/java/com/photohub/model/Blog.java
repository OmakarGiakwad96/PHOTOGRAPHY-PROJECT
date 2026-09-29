package com.photohub.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "blogs")
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Builder.Default
private LocalDateTime postedAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Admin author;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private BlogCategory category;
}