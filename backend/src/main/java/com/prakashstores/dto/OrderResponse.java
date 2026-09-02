package com.prakashstores.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.prakashstores.model.OrderStatus;
import com.prakashstores.model.OrderType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Integer userId;
    private java.time.LocalDateTime orderDate;
    private java.math.BigDecimal totalAmount;
    private OrderStatus status;
    private OrderType orderType;
    private String shippingAddress;
    private String contactPhone;
    private java.util.List<OrderItemResponse> items;
}
