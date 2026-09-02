package com.prakashstores.service;

import com.prakashstores.dto.CreateReviewRequest;
import com.prakashstores.dto.ReviewDto;
import com.prakashstores.exception.ResourceNotFoundException;
import com.prakashstores.model.Review;
import com.prakashstores.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.prakashstores.service.ProductService;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;

    public ReviewService(ReviewRepository reviewRepository, ProductService productService) {
        this.reviewRepository = reviewRepository;
        this.productService = productService;
    }

    public ReviewDto createReview(CreateReviewRequest request, Integer userId) {
        // Validate that request.getProductId() corresponds to an existing product
        productService.getProductById(request.getProductId()); // Throws ResourceNotFoundException if not found

        Review review = new Review();
        review.setProductId(request.getProductId());
        review.setUserId(userId);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewDate(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);
        return toDto(savedReview);
    }

    public List<ReviewDto> getReviewsByProductId(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        return reviews.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ReviewDto> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        return reviews.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ReviewDto toDto(Review review) {
        return ReviewDto.builder()
                .id(review.getId())
                .productId(review.getProductId())
                .userId(review.getUserId())
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewDate(review.getReviewDate())
                .build();
    }
}