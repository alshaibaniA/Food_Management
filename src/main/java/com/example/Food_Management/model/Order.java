package com.example.Food_Management.model;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "orders")  // Use lowercase or snake_case table name

public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "phone")  // Optional: Ensure phone column is explicitly mapped if needed
    private String phone;

    @Column(name = "order_date")  // Optional: Ensure order_date column is explicitly mapped
    private LocalDateTime orderDate = LocalDateTime.now();

    @Column(name = "status")  // Optional: Ensure status column is explicitly mapped
    private String status = "pending";

    @Column(name = "comment")  // Optional: Ensure status column is explicitly mapped
    private String comment;

    @Column(name = "order_type")  // Optional: Ensure status column is explicitly mapped
    private String orderType;


    // One-to-many relationship with OrderItem
    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference  // Prevents infinite recursion
    private List<OrderItem> items = new ArrayList<>();; // This will be populated by the service layer

    public double getTotalPrice() {
        return items.stream().mapToDouble(item -> item.getItem().getPrice() * item.getQuantity()).sum();
    }
}
