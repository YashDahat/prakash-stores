package com.prakashstores.repository;

import com.prakashstores.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductId(Long productId);
    List<Review> findByUserId(Integer userId);
    List<Review> findByProductIdAndUserId(Long productId, Integer userId);
}