package com.prakashstores.service;

import com.prakashstores.dto.CreateReviewRequest;
import com.prakashstores.dto.ReviewDto;
import com.prakashstores.exception.ResourceNotFoundException;
import com.prakashstores.model.Review;
import com.prakashstores.model.User;
import com.prakashstores.repository.ReviewRepository;
import com.prakashstores.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.prakashstores.service.ProductService;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, ProductService productService, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productService = productService;
        this.userRepository = userRepository;
    }

    public ReviewDto createReview(Integer userId, CreateReviewRequest request) {
        // Validate product existence
        productService.getProductById(request.getProductId()); // Throws ResourceNotFoundException if product not found

        // Check if user has already reviewed this product
        Optional<Review> existingReview = reviewRepository.findByProductIdAndUserId(request.getProductId(), userId);
        if (existingReview.isPresent()) {
            throw new IllegalArgumentException("User has already reviewed this product.");
        }

        Review review = new Review();
        review.setProductId(request.getProductId());
        review.setUserId(userId);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewDate(LocalDate.now());
        review.setStatus("PENDING"); // Reviews are pending approval by default

        Review savedReview = reviewRepository.save(review);
        return mapToDto(savedReview);
    }

    public List<ReviewDto> getReviewsByProductId(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        return reviews.stream()
                .filter(review -> "APPROVED".equals(review.getStatus())) // Only show approved reviews to public
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ReviewDto> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        return reviews.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ReviewDto getReviewById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        return mapToDto(review);
    }

    public ReviewDto approveReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        review.setStatus("APPROVED");
        Review updatedReview = reviewRepository.save(review);
        return mapToDto(updatedReview);
    }

    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResourceNotFoundException("Review not found with id: " + reviewId);
        }
        reviewRepository.deleteById(reviewId);
    }

    private ReviewDto mapToDto(Review review) {
        String customerName = userRepository.findById(review.getUserId())
                .map(User::getFirstName)
                .orElse("Anonymous");

        return ReviewDto.builder()
                .id(review.getId())
                .productId(review.getProductId())
                .userId(review.getUserId())
                .customerName(customerName)
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewDate(review.getReviewDate())
                .status(review.getStatus())
                .build();
    }
}