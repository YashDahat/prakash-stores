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
import com.prakashstores.model.ShippingMethod;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private Integer userId;
    private java.time.LocalDateTime orderDate;
    private java.math.BigDecimal totalAmount;
    private OrderStatus orderStatus;
    private String shippingAddress;
    private ShippingMethod shippingMethod;
    private String paymentId;
    private java.util.List<OrderItemDto> orderItems;
}
