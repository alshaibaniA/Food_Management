package com.example.Food_Management.model;

import java.util.List;
import lombok.Data;
@Data
public class OrderRequest {
    private String phone;
    private List<OrderItemRequest> items;
    private String comment;
    private String order_type;


    }

