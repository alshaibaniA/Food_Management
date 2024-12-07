package com.example.Food_Management.repository;

import com.example.Food_Management.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Custom query methods can be added here if needed
    List<Order> findByStatus(String status);

}
