package com.prakashstores.service;

import com.prakashstores.dto.LoyaltyPointsDto;
import com.prakashstores.model.LoyaltyPoints;
import com.prakashstores.repository.LoyaltyPointsRepository;
import com.prakashstores.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class LoyaltyService {

    private final LoyaltyPointsRepository loyaltyPointsRepository;
    private static final BigDecimal POINTS_PER_RUPEE = BigDecimal.valueOf(0.1); // 10% of order total as points

    public LoyaltyService(LoyaltyPointsRepository loyaltyPointsRepository) {
        this.loyaltyPointsRepository = loyaltyPointsRepository;
    }

    public LoyaltyPointsDto getLoyaltyPointsByUserId(Integer userId) {
        LoyaltyPoints loyaltyPoints = loyaltyPointsRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Loyalty points not found for user ID: " + userId));
        return mapToDto(loyaltyPoints);
    }

    public LoyaltyPointsDto awardLoyaltyPoints(Integer userId, BigDecimal orderTotal) {
        LoyaltyPoints loyaltyPoints = loyaltyPointsRepository.findByUserId(userId)
                .orElseGet(() -> createNewLoyaltyPoints(userId));

        int pointsToAward = orderTotal.multiply(POINTS_PER_RUPEE).intValue();
        loyaltyPoints.setPointsBalance(loyaltyPoints.getPointsBalance() + pointsToAward);
        loyaltyPoints.setLastUpdated(LocalDateTime.now());

        LoyaltyPoints updatedLoyaltyPoints = loyaltyPointsRepository.save(loyaltyPoints);
        return mapToDto(updatedLoyaltyPoints);
    }

    private LoyaltyPoints createNewLoyaltyPoints(Integer userId) {
        LoyaltyPoints newLoyaltyPoints = new LoyaltyPoints();
        newLoyaltyPoints.setUserId(userId);
        newLoyaltyPoints.setPointsBalance(0);
        newLoyaltyPoints.setLastUpdated(LocalDateTime.now());
        return newLoyaltyPoints;
    }

    private LoyaltyPointsDto mapToDto(LoyaltyPoints loyaltyPoints) {
        return LoyaltyPointsDto.builder()
                .userId(loyaltyPoints.getUserId())
                .pointsBalance(loyaltyPoints.getPointsBalance())
                .lastUpdated(loyaltyPoints.getLastUpdated())
                .build();
    }
}