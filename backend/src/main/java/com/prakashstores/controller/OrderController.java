package com.prakashstores.controller;

import com.prakashstores.dto.CreateOrderRequest;
import com.prakashstores.dto.OrderResponse;
import com.prakashstores.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.prakashstores.exception.ResourceNotFoundException;
import com.prakashstores.exception.PaymentGatewayException; // Assuming this is a general exception for payment issues

import java.util.List;
import com.prakashstores.security.CurrentUser;
import com.prakashstores.model.User;
import com.prakashstores.exception.PaymentGatewayException;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest createOrderRequest, @CurrentUser Integer userId) {
        if (userId == null) {
            // This should ideally be handled by security configuration, but as a fallback
            throw new IllegalArgumentException("User must be authenticated to create an order.");
        }
        try {
            OrderResponse orderResponse = orderService.createOrder(createOrderRequest, userId);
            return new ResponseEntity<>(orderResponse, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (PaymentGatewayException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // Or a more specific status if defined
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders(@CurrentUser Integer userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User must be authenticated to view orders.");
        }
        List<OrderResponse> orders = orderService.getAllOrders(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId, @CurrentUser Integer userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User must be authenticated to view an order.");
        }
        try {
            OrderResponse orderResponse = orderService.getOrderById(orderId, userId);
            return ResponseEntity.ok(orderResponse);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}