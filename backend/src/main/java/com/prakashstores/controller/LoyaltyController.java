package com.prakashstores.controller;

import com.prakashstores.dto.LoyaltyPointsDto;
import com.prakashstores.service.LoyaltyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.prakashstores.security.CurrentUser;

@RestController
@RequestMapping("/api/v1/loyalty")
public class LoyaltyController {

    private final LoyaltyService loyaltyService;

    @Autowired
    public LoyaltyController(LoyaltyService loyaltyService) {
        this.loyaltyService = loyaltyService;
    }

    @GetMapping("/my")
    public ResponseEntity<LoyaltyPointsDto> getMyLoyaltyPoints(@CurrentUser Integer userId) {
        LoyaltyPointsDto loyaltyPoints = loyaltyService.getLoyaltyPointsByUserId(userId);
        return ResponseEntity.ok(loyaltyPoints);
    }
}