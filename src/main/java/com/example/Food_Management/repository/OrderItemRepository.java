package com.example.Food_Management.repository;

import com.example.Food_Management.model.Order;
import com.example.Food_Management.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Custom query methods can be added here if needed
    List<OrderItem> findByOrder(Order order);

}
