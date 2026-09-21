package com.prakashstores.service;

import com.prakashstores.dto.CreateOrderRequest;
import com.prakashstores.dto.OrderDto;
import com.prakashstores.model.Order;
import com.prakashstores.model.OrderItem;
import com.prakashstores.model.OrderStatus;
import com.prakashstores.model.Product;
import com.prakashstores.repository.OrderRepository;
import com.prakashstores.repository.ProductRepository;
import com.prakashstores.exception.ResourceNotFoundException;
import com.prakashstores.exception.PaymentGatewayException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.prakashstores.service.PaymentService;
import com.prakashstores.service.ProductService;
import com.prakashstores.dto.CreatePaymentRequest;
import com.prakashstores.dto.OrderItemDto;
import com.prakashstores.dto.PaymentOrderResponse;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final PaymentService paymentService;
    private final ProductService productService;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, PaymentService paymentService, ProductService productService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.paymentService = paymentService;
        this.productService = productService;
    }

    @Transactional
    public OrderDto createOrder(CreateOrderRequest request, Integer userId) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item.");
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setOrderDate(LocalDateTime.now());
        order.setOrderStatus(OrderStatus.PENDING_PAYMENT);
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingMethod(request.getShippingMethod());

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (var itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + itemRequest.getProductId()));

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());
            orderItem.setOrder(order);
            order.getOrderItems().add(orderItem);

            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
        }
        order.setTotalAmount(totalAmount);

        orderRepository.save(order); // Save to get an ID for payment reference

        try {
            CreatePaymentRequest createPaymentRequest = new CreatePaymentRequest(order.getTotalAmount(), "INR", "order_" + order.getId());
            PaymentOrderResponse paymentOrderResponse = paymentService.createOrder(createPaymentRequest);
            order.setPaymentId(paymentOrderResponse.getGatewayOrderId());
        } catch (Exception e) {
            throw new PaymentGatewayException("Failed to initiate payment: " + e.getMessage());
        }

        for (var item : order.getOrderItems()) {
            productService.updateProductStock(item.getProduct().getId(), -item.getQuantity());
        }

        orderRepository.save(order); // Save again with paymentId and updated stock

        return mapToOrderDto(order);
    }

    public List<OrderDto> getOrdersByUserId(Integer userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(this::mapToOrderDto)
                .collect(Collectors.toList());
    }

    public OrderDto getOrderById(Long orderId, Integer userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (!order.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Order not found with ID: " + orderId + " for the current user.");
        }
        return mapToOrderDto(order);
    }

    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::mapToOrderDto)
                .collect(Collectors.toList());
    }

    public OrderDto getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        return mapToOrderDto(order);
    }

    /**
     * Cancel an order on behalf of its owner. Only the user who placed the order may cancel it, and
     * only while it is still cancellable (PENDING_PAYMENT or PROCESSING) — once SHIPPED/DELIVERED, or
     * already CANCELLED, it cannot be cancelled. Cancelling restores the reserved stock.
     */
    @Transactional
    public OrderDto cancelOrder(Long orderId, Integer userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        // Ownership check — obscure existence for anyone but the owner (same convention as getOrderById).
        if (order.getUserId() == null || !order.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Order not found with ID: " + orderId + " for the current user.");
        }

        OrderStatus status = order.getOrderStatus();
        if (status != OrderStatus.PENDING_PAYMENT && status != OrderStatus.PROCESSING) {
            throw new IllegalStateException("Order cannot be cancelled once it is " + status + ".");
        }

        // Return the reserved stock (reverses the decrement done at order creation).
        for (OrderItem item : order.getOrderItems()) {
            productService.updateProductStock(item.getProduct().getId(), item.getQuantity());
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);
        return mapToOrderDto(updatedOrder);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        order.setOrderStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        return mapToOrderDto(updatedOrder);
    }

    private OrderDto mapToOrderDto(Order order) {
        List<OrderItemDto> itemDtos = order.getOrderItems().stream()
                .map(this::mapToOrderItemDto)
                .collect(Collectors.toList());

        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .orderDate(order.getOrderDate())
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getOrderStatus())
                .shippingAddress(order.getShippingAddress())
                .shippingMethod(order.getShippingMethod())
                .paymentId(order.getPaymentId())
                .orderItems(itemDtos)
                .build();
    }

    private OrderItemDto mapToOrderItemDto(OrderItem orderItem) {
        return OrderItemDto.builder()
                .id(orderItem.getId())
                .productId(orderItem.getProduct().getId())
                .productName(orderItem.getProduct().getName())
                .quantity(orderItem.getQuantity())
                .priceAtPurchase(orderItem.getPriceAtPurchase())
                .build();
    }
}