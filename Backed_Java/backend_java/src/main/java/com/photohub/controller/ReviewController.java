package com.photohub.controller;

import com.photohub.dto.ReviewDTO;
import com.photohub.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewDTO> addReview(@RequestBody ReviewDTO dto) {
        return ResponseEntity.ok(reviewService.addReview(dto));
    }

    @GetMapping("/photographer/{photographerId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByPhotographer(@PathVariable Long photographerId) {
        return ResponseEntity.ok(reviewService.getReviewsByPhotographer(photographerId));
    }
}
