package com.prakashstores.controller;

import com.prakashstores.dto.CreateOrderRequest;
import com.prakashstores.dto.OrderDto;
import com.prakashstores.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.prakashstores.exception.ResourceNotFoundException;
import com.prakashstores.exception.PaymentGatewayException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.beans.factory.annotation.Autowired;
import com.prakashstores.security.CurrentUser;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody CreateOrderRequest request, @CurrentUser Integer userId) {
        // ResourceNotFoundException / IllegalArgumentException (e.g. "Insufficient stock…") and the
        // payment/state errors are mapped to bodied responses by GlobalExceptionHandler, so the
        // client sees the real reason instead of a blank 400. Don't swallow them here.
        OrderDto createdOrder = orderService.createOrder(request, userId);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getOrdersByUserId(@CurrentUser Integer userId) {
        List<OrderDto> orders = orderService.getOrdersByUserId(userId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long orderId, @CurrentUser Integer userId) {
        try {
            OrderDto order = orderService.getOrderById(orderId, userId);
            return new ResponseEntity<>(order, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Obscure existence for unauthorized access
        }
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<OrderDto> cancelOrder(@PathVariable Long orderId, @CurrentUser Integer userId) {
        try {
            OrderDto cancelled = orderService.cancelOrder(orderId, userId);
            return new ResponseEntity<>(cancelled, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT); // Order is past the cancellable window
        }
    }
}