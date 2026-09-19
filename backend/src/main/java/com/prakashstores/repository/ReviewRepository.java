package com.prakashstores.repository;

import com.prakashstores.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdAndStatus(Long productId, ReviewStatus status);
    List<Review> findByStatus(ReviewStatus status);
}