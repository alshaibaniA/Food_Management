package com.example.Food_Management.service;

import com.example.Food_Management.model.Item;
import com.example.Food_Management.model.User;
import com.example.Food_Management.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public User registerUser(String username, String password) {
        String hashedPassword = passwordEncoder.encode(password);  // Encrypt the password
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(hashedPassword);
        newUser.setRole("USER"); // Default role
        return userRepository.save(newUser);
    }
    // Authenticate user by comparing the hashed password
    public User authenticateUser(String username, String password) {
        // Find the user by the given username
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Compare the hashed password from the database with the provided password
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;  // Return the authenticated user
            }
        }

        // If authentication fails, return null
        return null;
    }

}


