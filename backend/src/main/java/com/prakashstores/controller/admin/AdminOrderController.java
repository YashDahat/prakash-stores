package com.prakashstores.controller.admin;

import com.prakashstores.dto.OrderResponse;
import com.prakashstores.model.OrderStatus;
import com.prakashstores.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    @Autowired
    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders(null); // Passing null for userId to indicate all orders for admin
    }

    @PutMapping("/{orderId}/status")
    public OrderResponse updateOrderStatus(@PathVariable Long orderId, @RequestParam("newStatus") OrderStatus newStatus) {
        return orderService.updateOrderStatus(orderId, newStatus);
    }
}