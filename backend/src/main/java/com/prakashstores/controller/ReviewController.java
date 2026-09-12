package com.prakashstores.controller;

import com.prakashstores.dto.CreateReviewRequest;
import com.prakashstores.dto.ReviewDto;
import com.prakashstores.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.prakashstores.model.User;
import com.prakashstores.security.CurrentUser;
import com.prakashstores.model.User; // FENCED FOUNDATION CONTRACT
import org.springframework.security.core.annotation.AuthenticationPrincipal; // FENCED FOUNDATION CONTRACT
import com.prakashstores.annotation.CurrentUser; // FENCED FOUNDATION CONTRACT


@RestController
@RequestMapping("/api/v1")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/reviews")
    public ResponseEntity<ReviewDto> createReview(@CurrentUser Integer userId, @RequestBody CreateReviewRequest request) {
        ReviewDto createdReview = reviewService.createReview(userId, request);
        return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
    }

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<ReviewDto>> getReviewsByProductId(@PathVariable Long productId) {
        List<ReviewDto> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }
}