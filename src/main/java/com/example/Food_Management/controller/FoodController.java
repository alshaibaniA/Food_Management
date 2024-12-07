package com.example.Food_Management.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FoodController {

    // This endpoint is open to everyone
    @GetMapping("/place-order")
    public String placeOrder() {
        return "Order placed successfully!";
    }

    // This endpoint is only accessible for authenticated users
    @GetMapping("/order-history")
    public String orderHistory() {
        return "Here are your previous orders!";
    }
}
