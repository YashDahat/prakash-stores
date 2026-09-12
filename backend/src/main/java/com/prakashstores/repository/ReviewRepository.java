package com.prakashstores.repository;

import com.prakashstores.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductId(Long productId);
    List<Review> findByUserId(Integer userId);
    Optional<Review> findByProductIdAndUserId(Long productId, Integer userId);
}