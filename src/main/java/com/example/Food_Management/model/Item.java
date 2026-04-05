package com.example.Food_Management.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Setter;

@Data
@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    private String itemName;
    private String category;
    private double price;
    @Setter
    @Column(name = "is_delete", nullable = false)
    @JsonProperty("isDelete")
    private boolean isDelete = false;
    private String image;
    @Setter
    @Column(name = "is_removed", nullable = false)
    @JsonProperty("isRemoved")
    private boolean isRemoved = false;  // New field for permanent delete

    public boolean isDelete() {
        return isDelete;
    }

    public void setDelete(boolean delete) {
        this.isDelete = delete;

    }

    public boolean isRemoved() {
        return isRemoved;
    }

    public void setRemoved(boolean removed) {
        this.isRemoved = removed;
    }
}
