package com.prakashstores.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.prakashstores.dto.OrderItemRequest;
import com.prakashstores.dto.ShippingAddressDto;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private java.util.List<com.prakashstores.dto.OrderItemRequest> orderItems;
    private com.prakashstores.dto.ShippingAddressDto shippingAddress;
}
