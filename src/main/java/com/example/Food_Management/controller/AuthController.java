package com.example.Food_Management.controller;

import com.example.Food_Management.model.User;
import com.example.Food_Management.repository.UserRepository;
import com.example.Food_Management.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import lombok.Getter;
import lombok.Setter;
//import lombok.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.Optional;

import static javax.crypto.Cipher.SECRET_KEY;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")  // Allow frontend requests from localhost:3000
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private  UserRepository userRepository;
    @Autowired
    private  PasswordEncoder passwordEncoder;
    @Value("${jwt.secret.key}")  // This will now inject the secret key from application.properties
    private String secretKey;
    // Use a constant or environment variable for secret key
   // private static final String SECRET_KEY = "your-very-secure-secret-key";  // Change this to a secure key
    //private static final String SECRET_KEY = System.getenv("JWT_SECRET_KEY"); // For environment variables

    // Register endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        String hashedPassword = passwordEncoder.encode(registerRequest.getPassword());
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(hashedPassword);
        user.setRole("USER");
        user.setIsActive(false);  // Explicitly setting isActive to false when registering.
        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(new LoginResponse(user.getUsername(), user.getRole(), null));
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt with username: " + loginRequest.getUsername());
            System.out.println("Login attempt with password: " + loginRequest.getPassword());

            // Directly fetch the user from the database
            Optional<User> optionalUser = userRepository.findByUsername(loginRequest.getUsername());

            if (!optionalUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse("Invalid username or password"));
            }

            User user = optionalUser.get();

            // Check if the user is active
            if (!user.getIsActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)  // Return Forbidden if user is not active
                        .body(new LoginResponse("User account is not active. Please contact support."));
            }
            // Compare the hashed password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse("Invalid username or password"));
            }

            // Generate JWT token
            String token = generateJwtToken(user);
            LoginResponse response = new LoginResponse(user.getUsername(), user.getRole(), token);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();  // Log the stack trace for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred during login: " + e.getMessage());  // Return error message
        }

    }

    private String generateJwtToken(User user) {
        String signingKey = String.valueOf(secretKey); // Make sure secretKey is long enough (32 bytes).
        if (signingKey.length() < 32) {
            throw new IllegalArgumentException("JWT secret key must be at least 32 bytes long.");
        }
        System.out.println("Secret Key: " + secretKey);


        return Jwts.builder()
                .setSubject(user.getUsername())  // The subject of the token (usually the username or user ID)
                .claim("role", user.getRole())   // Add custom claims (e.g., user role)
                .setIssuer("your-app-name")      // Issuer of the token (optional but recommended)
                .setAudience("your-client-app") // Audience (optional but recommended)
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // Token expiration (optional)
                .signWith(SignatureAlgorithm.HS256, secretKey)  // Signing the token using the SECRET_KEY
                .compact();  // Generate the JWT token
    }
    
    // DTO for login request
    @Setter
    @Getter
    public static class LoginRequest {
        // Getters and Setters
        private String username;
        private String password;

    }
    @Setter
    @Getter
    public static class RegisterRequest {
        private String username;
        private String password;
    }
    // DTO for login response
    public static class LoginResponse {
        // Getters and setters
        @Setter
        @Getter
        private String username;
        @Setter
        @Getter
        private String role;
        @Setter
        @Getter
        private String token;  // Optional: Add a JWT token
        private String message;  // Optional: Add a field for error message

        public LoginResponse(String username, String role, String token) {
            this.username = username;
            this.role = role;
            this.token = token;
        }
        // Constructor for error message (when authentication fails)
        public LoginResponse(String message) {
            this.message = message;  // Set the error message
        }

    }

}
