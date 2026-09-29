package com.photohub.service;

import com.photohub.dto.ReviewDTO;
import com.photohub.model.Photographer;
import com.photohub.model.Review;
import com.photohub.model.Client;
import com.photohub.repository.ClientRepository;
import com.photohub.repository.PhotographerRepository;
import com.photohub.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PhotographerRepository photographerRepository;

    public ReviewDTO addReview(ReviewDTO dto) {
        Client client = clientRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        Photographer photographer = photographerRepository.findById(dto.getPhotographerId())
                .orElseThrow(() -> new RuntimeException("Photographer not found"));

        Review review = Review.builder()
                .client(client)
                .photographer(photographer)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .isDeleted(false)
                .build();

        Review saved = reviewRepository.save(review);
        updatePhotographerRating(photographer);

        return mapToDTO(saved);
    }

    public List<ReviewDTO> getReviewsByPhotographer(Long photographerId) {
        return reviewRepository.findByPhotographer_PhotographerIdAndIsDeletedFalse(photographerId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private void updatePhotographerRating(Photographer photographer) {
        List<Review> reviews = reviewRepository.findByPhotographer_PhotographerIdAndIsDeletedFalse(photographer.getPhotographerId());
        if (!reviews.isEmpty()) {
            double average = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
            photographer.setRating(Math.round(average * 10.0) / 10.0);
            photographerRepository.save(photographer);
        }
    }

    private ReviewDTO mapToDTO(Review r) {
        return ReviewDTO.builder()
                .reviewId(r.getReviewId())
                .userId(r.getClient().getClientId())
                .photographerId(r.getPhotographer().getPhotographerId())
                .rating(r.getRating())
                .comment(r.getComment())
                .userName(r.getClient().getName())
                .build();
    }
}
