package com.prakashstores.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.prakashstores.model.ShippingMethod;
import com.prakashstores.dto.OrderItemRequest;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private String shippingAddress;
    private ShippingMethod shippingMethod;
    private java.util.List<OrderItemRequest> items;
}
