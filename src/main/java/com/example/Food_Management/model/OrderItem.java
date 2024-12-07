package com.example.Food_Management.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="orderItems")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    @ManyToOne
    @JsonBackReference  // Prevents infinite recursion
    private Order order;

    @ManyToOne
    private Item item;

    private int quantity;

    // Getters and setters
}
