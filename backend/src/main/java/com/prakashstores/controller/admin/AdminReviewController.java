package com.prakashstores.controller.admin;

import com.prakashstores.dto.ReviewDto;
import com.prakashstores.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/reviews")
public class AdminReviewController {

    private final ReviewService reviewService;

    public AdminReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewDto>> getAllReviews() {
        List<ReviewDto> reviewDtos = reviewService.getAllReviews();
        return ResponseEntity.ok(reviewDtos);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ReviewDto>> getPendingReviews() {
        List<ReviewDto> reviewDtos = reviewService.getPendingReviews();
        return ResponseEntity.ok(reviewDtos);
    }

    @PutMapping("/{reviewId}/approve")
    public ResponseEntity<ReviewDto> approveReview(@PathVariable Long reviewId) {
        ReviewDto approvedReview = reviewService.approveReview(reviewId);
        return ResponseEntity.ok(approvedReview);
    }

    @PutMapping("/{reviewId}/reject")
    public ResponseEntity<ReviewDto> rejectReview(@PathVariable Long reviewId) {
        ReviewDto rejectedReview = reviewService.rejectReview(reviewId);
        return ResponseEntity.ok(rejectedReview);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }
}