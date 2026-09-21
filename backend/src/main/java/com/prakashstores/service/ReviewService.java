package com.prakashstores.service;

import com.prakashstores.dto.ReviewDto;
import com.prakashstores.model.Review;
import com.prakashstores.repository.ReviewRepository;
import com.prakashstores.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.prakashstores.service.ProductService;
import com.prakashstores.model.Product;
import com.prakashstores.model.ReviewStatus;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;

    public ReviewService(ReviewRepository reviewRepository, ProductService productService) {
        this.reviewRepository = reviewRepository;
        this.productService = productService;
    }

    public ReviewDto submitReview(ReviewDto reviewDto, Integer userId) {
        if (reviewDto.getProductId() == null || reviewDto.getRating() == null || reviewDto.getComment() == null) {
            throw new IllegalArgumentException("Product ID, rating, and comment are required.");
        }
        if (reviewDto.getRating() < 1 || reviewDto.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        productService.getProductById(reviewDto.getProductId()); // Throws ResourceNotFoundException if product doesn't exist

        Review review = new Review();
        review.setProductId(reviewDto.getProductId());
        review.setUserId(userId);
        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());
        review.setReviewDate(LocalDateTime.now());
        review.setStatus(ReviewStatus.PENDING);

        Review savedReview = reviewRepository.save(review);
        return convertToDto(savedReview);
    }

    public List<ReviewDto> getReviewsByProductId(Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdAndStatus(productId, ReviewStatus.APPROVED);
        return reviews.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public ReviewDto getReviewById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));
        return convertToDto(review);
    }

    public List<ReviewDto> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        return reviews.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<ReviewDto> getPendingReviews() {
        List<Review> reviews = reviewRepository.findByStatus(ReviewStatus.PENDING);
        return reviews.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public ReviewDto approveReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));
        review.setStatus(ReviewStatus.APPROVED);
        Review updatedReview = reviewRepository.save(review);
        return convertToDto(updatedReview);
    }

    public ReviewDto rejectReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));
        review.setStatus(ReviewStatus.REJECTED);
        Review updatedReview = reviewRepository.save(review);
        return convertToDto(updatedReview);
    }

    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResourceNotFoundException("Review not found with ID: " + reviewId);
        }
        reviewRepository.deleteById(reviewId);
    }

    private ReviewDto convertToDto(Review review) {
        return ReviewDto.builder()
                .id(review.getId())
                .productId(review.getProductId())
                .userId(review.getUserId())
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewDate(review.getReviewDate())
                .status(review.getStatus())
                .build();
    }
}