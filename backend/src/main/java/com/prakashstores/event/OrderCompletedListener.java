package com.prakashstores.event;

import com.prakashstores.service.LoyaltyService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class OrderCompletedListener {

    private final LoyaltyService loyaltyService;

    @Autowired
    public OrderCompletedListener(LoyaltyService loyaltyService) {
        this.loyaltyService = loyaltyService;
    }

    @EventListener
    public void handleOrderCompletedEvent(OrderCompletedEvent event) {
        loyaltyService.awardLoyaltyPoints(event.getUserId(), event.getOrderTotal());
    }
}