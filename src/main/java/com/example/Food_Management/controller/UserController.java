package com.example.Food_Management.controller;
import com.example.Food_Management.model.User;
import com.example.Food_Management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:3000")  // Allow frontend requests from localhost:3000

@RestController
@RequestMapping("/admin")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Endpoint to fetch all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Endpoint to toggle isActive status
    @PutMapping("/users/{id}/toggle-active")
    public ResponseEntity<?> toggleUserActiveStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> status) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOptional.get();
        if (status.containsKey("isActive")) {
            Boolean isActive = status.get("isActive");  // Extract isActive value from the request body
            user.setIsActive(isActive);  // Set the new status explicitly
            userRepository.save(user);  // Save the updated user
            return ResponseEntity.ok(user);  // Return the updated user
        } else {
            return ResponseEntity.badRequest().body("Missing 'isActive' in request body");
        }
    }

}
