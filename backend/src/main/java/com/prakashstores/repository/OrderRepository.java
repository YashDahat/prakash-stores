package com.prakashstores.repository;

import com.prakashstores.model.Order;
import com.prakashstores.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Integer userId);
    List<Order> findByStatus(OrderStatus status);
}