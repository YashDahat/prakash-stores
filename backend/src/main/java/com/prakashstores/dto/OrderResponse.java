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
import com.prakashstores.dto.ShippingAddressDto;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Integer userId;
    private java.time.Instant orderDate;
    private java.math.BigDecimal totalAmount;
    private com.prakashstores.model.OrderStatus status;
    private com.prakashstores.dto.ShippingAddressDto shippingAddress;
    private java.util.List<com.prakashstores.dto.OrderItemResponse> orderItems;
    private String paymentGatewayOrderId;
}
