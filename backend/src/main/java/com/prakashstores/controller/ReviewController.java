package com.prakashstores.controller;

import com.prakashstores.dto.ReviewDto;
import com.prakashstores.service.ReviewService;
import com.prakashstores.security.CurrentUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/reviews")
    public ResponseEntity<ReviewDto> submitReview(@RequestBody ReviewDto reviewDto, @CurrentUser Integer userId) {
        ReviewDto createdReview = reviewService.submitReview(reviewDto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
    }

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<ReviewDto>> getReviewsByProductId(@PathVariable Long productId) {
        List<ReviewDto> reviewDtos = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviewDtos);
    }
}