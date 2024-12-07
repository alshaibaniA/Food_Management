package com.example.Food_Management.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")  // Assuming the table name is 'users'
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;  // You can change the type based on your preference (e.g., Long, String, etc.)

    private String username;
    private String password;
    private String role;  // E.g., "USER", "ADMIN"
    @Column(name = "is_active", nullable = false)
    private boolean isActive = false;  // Default value is false when a user is first created.
    // Additional fields like email, name, etc. can be added if necessary.
// Getter and Setter for isActive
    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
