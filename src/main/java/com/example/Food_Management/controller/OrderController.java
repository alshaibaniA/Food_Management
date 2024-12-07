package com.example.Food_Management.controller;

import com.example.Food_Management.model.Order;
import com.example.Food_Management.model.OrderItem;
import com.example.Food_Management.model.OrderRequest;
import com.example.Food_Management.service.OrderService;
import com.example.Food_Management.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000")  // Allow requests from React frontend

public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ItemService itemService;

    // Place an order (expects phone number and list of items with quantities)
    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest orderRequest) {
        System.out.println("Received order type: " + orderRequest.getOrder_type());

        // Use the service to create and save the order
        Order order = orderService.placeOrder(orderRequest);
        if (order != null) {
            return ResponseEntity.ok(order);  // Return the order object, including orderId
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/pending")
    public List<Order> getPendingOrders(){
        return orderService.getOrdersByStatus("pending");
    }

    @GetMapping("/under_process")
    public List<Order> getUnderProcessOrder(){
        return orderService.getOrdersByStatus("under_process");
    }

    @GetMapping("/successful")
    public List<Order> getSuccessfulOrder(){
        return orderService.getOrdersByStatus("successful");
    }
    @GetMapping("/done-order")
    public List<Order> getDoneOrder(){
        return orderService.getOrdersByStatus("done");
    }
    // Update the status of an order to "under_process"
    @PutMapping ("/update/{orderId}")
    public Order updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> status) {
        return orderService.updateOrderStatus(orderId, status.get("status"));
    }
}
