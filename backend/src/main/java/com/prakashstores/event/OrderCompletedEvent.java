package com.prakashstores.event;

import java.math.BigDecimal;

public class OrderCompletedEvent {

    private final Integer userId;
    private final BigDecimal orderTotal;

    public OrderCompletedEvent(Integer userId, BigDecimal orderTotal) {
        this.userId = userId;
        this.orderTotal = orderTotal;
    }

    public Integer getUserId() {
        return userId;
    }

    public BigDecimal getOrderTotal() {
        return orderTotal;
    }
}
