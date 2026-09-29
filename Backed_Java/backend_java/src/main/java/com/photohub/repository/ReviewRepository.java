package com.photohub.repository;

import com.photohub.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByPhotographer_PhotographerIdAndIsDeletedFalse(Long photographerId);
}
