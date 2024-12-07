package com.example.Food_Management.service;

import com.example.Food_Management.model.Item;
import com.example.Food_Management.model.Order;
import com.example.Food_Management.model.OrderItem;
import com.example.Food_Management.model.OrderRequest;
import com.example.Food_Management.model.OrderItemRequest; // Add this import
import com.example.Food_Management.repository.OrderRepository;
import com.example.Food_Management.repository.OrderItemRepository;
import com.example.Food_Management.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ItemRepository itemRepository;

    // Method to place an order
    public Order placeOrder(OrderRequest orderRequest) {
        // Create new Order entity
        Order order = new Order();
        order.setPhone(orderRequest.getPhone());
        order.setStatus("pending"); // Set the status to 'pending'
        order.setComment(orderRequest.getComment());
        order.setOrderType(orderRequest.getOrder_type());
        // Save the order (this will auto-generate orderId)
        order = orderRepository.save(order);

        // Process each item in the order request
        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            Item item = itemRepository.findById(itemRequest.getItemId()).orElse(null);
            if (item != null) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);  // Link to the order
                orderItem.setItem(item);  // Link to the item
                orderItem.setQuantity(itemRequest.getQuantity());

                // Save the OrderItem in the repository
                orderItemRepository.save(orderItem);
            }
        }

        return order;  // Return the saved order
    }



    // Get orders by status
    public List<Order> getOrdersByStatus(String status) {
        List<Order> orders = orderRepository.findByStatus(status);

        // Fetch the order items for each order
        for (Order order : orders) {
            // Assuming your Order entity is correctly mapped with a OneToMany relationship to OrderItem
            List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
            // Set the items list for each order, making sure not to include the order itself
            for (OrderItem orderItem : orderItems) {
                // This ensures the orderItem has an Item and quantity, but not the full order object again
                orderItem.setOrder(null);  // Clear reference to avoid circular structure
            }
            order.setItems(orderItems);  // Set the order items for the order (you'll need to create a setter in the Order class)
        }

        return orders;    }

    // Update the status of an order
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order != null) {
            order.setStatus(status);
            return orderRepository.save(order);
        }
        return null;
    }
}
