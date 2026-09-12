package com.prakashstores.service;

import com.prakashstores.dto.CreateOrderRequest;
import com.prakashstores.dto.OrderItemRequest;
import com.prakashstores.dto.OrderResponse;
import com.prakashstores.dto.ShippingAddressDto;
import com.prakashstores.model.Order;
import com.prakashstores.model.OrderItem;
import com.prakashstores.model.OrderStatus;
import com.prakashstores.model.Product;
import com.prakashstores.model.ShippingAddress;
import com.prakashstores.repository.OrderRepository;
import com.prakashstores.repository.ProductRepository;
import com.prakashstores.exception.ResourceNotFoundException;
import com.prakashstores.exception.PaymentGatewayException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import PaymentService;
import CreatePaymentRequest;
import PaymentOrderResponse;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import com.prakashstores.service.PaymentService;
import com.prakashstores.dto.CreatePaymentRequest;
import com.prakashstores.dto.PaymentOrderResponse;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final PaymentService paymentService;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, PaymentService paymentService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.paymentService = paymentService;
    }

    @Transactional
    public OrderResponse createOrder(Integer userId, CreateOrderRequest request) {
        Order order = new Order();
        order.setUserId(userId);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(BigDecimal.ZERO);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getOrderItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + itemRequest.getProductId()));

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(order); // This will be set correctly after order is saved
            orderItem.setProductId(product.getId());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());
            orderItem.setOrder(order); // Set the back-reference
            orderItems.add(orderItem);

            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));

            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        ShippingAddress shippingAddress = new ShippingAddress();
        ShippingAddressDto shippingAddressDto = request.getShippingAddress();
        shippingAddress.setFullName(shippingAddressDto.getFullName());
        shippingAddress.setStreetAddress(shippingAddressDto.getStreetAddress());
        shippingAddress.setCity(shippingAddressDto.getCity());
        shippingAddress.setState(shippingAddressDto.getState());
        shippingAddress.setPostalCode(shippingAddressDto.getPostalCode());
        shippingAddress.setPhoneNumber(shippingAddressDto.getPhoneNumber());
        order.setShippingAddress(shippingAddress);

        Order savedOrder = orderRepository.save(order);

        try {
            CreatePaymentRequest createPaymentRequest = new CreatePaymentRequest(
                    savedOrder.getTotalAmount(), "INR", "order_" + savedOrder.getId());
            PaymentOrderResponse paymentOrderResponse = paymentService.createOrder(createPaymentRequest);
            // Assuming Order entity has a field for paymentGatewayOrderId
            // This field is not in the provided Order entity contract, but the instruction implies it.
            // Adding it here for compilation, but it should ideally be added to the Order entity.
            // For now, we'll just return it in the DTO.
            // savedOrder.setPaymentGatewayOrderId(paymentOrderResponse.getGatewayOrderId());
            // orderRepository.save(savedOrder); // Save again if we update the entity
            return mapToOrderResponse(savedOrder, paymentOrderResponse.getGatewayOrderId());
        } catch (Exception e) {
            throw new PaymentGatewayException("Failed to create payment order: " + e.getMessage());
        }
    }

    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        return mapToOrderResponse(order, null); // paymentGatewayOrderId is not stored in Order entity
    }

    public List<OrderResponse> getOrdersByUserId(Integer userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(order -> mapToOrderResponse(order, null)) // paymentGatewayOrderId is not stored in Order entity
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(order -> mapToOrderResponse(order, null)) // paymentGatewayOrderId is not stored in Order entity
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        return mapToOrderResponse(updatedOrder, null); // paymentGatewayOrderId is not stored in Order entity
    }

    private OrderResponse mapToOrderResponse(Order order, String paymentGatewayOrderId) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .orderDate(order.getOrderDate().atZone(java.time.ZoneId.systemDefault()).toInstant())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(mapToShippingAddressDto(order.getShippingAddress()))
                .orderItems(order.getOrderItems().stream()
                        .map(this::mapToOrderItemResponse)
                        .collect(Collectors.toList()))
                .paymentGatewayOrderId(paymentGatewayOrderId)
                .build();
    }

    private com.prakashstores.dto.ShippingAddressDto mapToShippingAddressDto(ShippingAddress address) {
        return ShippingAddressDto.builder()
                .fullName(address.getFullName())
                .streetAddress(address.getStreetAddress())
                .city(address.getCity())
                .state(address.getState())
                .postalCode(address.getPostalCode())
                .phoneNumber(address.getPhoneNumber())
                .build();
    }

    private com.prakashstores.dto.OrderItemResponse mapToOrderItemResponse(OrderItem item) {
        // OrderItemResponse DTO is not provided, creating a minimal one for compilation.
        // This should be defined in a DTO file if it needs more fields.
        return new com.prakashstores.dto.OrderItemResponse(item.getProductId(), item.getQuantity(), item.getPriceAtPurchase());
    }
}