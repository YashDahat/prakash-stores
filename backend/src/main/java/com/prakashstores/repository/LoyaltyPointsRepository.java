package com.prakashstores.repository;

import com.prakashstores.model.LoyaltyPoints;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LoyaltyPointsRepository extends JpaRepository<LoyaltyPoints, Long> {
    Optional<LoyaltyPoints> findByUserId(Integer userId);
}