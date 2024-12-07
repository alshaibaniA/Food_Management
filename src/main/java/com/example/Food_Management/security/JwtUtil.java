package com.example.Food_Management.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret.key}")  // Define this in application.properties
    private String secretKey;

    // Method to decode the secret key from URL-safe Base64
    private String getDecodedSecretKey() {
        // Decode the secret key if it's encoded in Base64
        return new String(Base64.getUrlDecoder().decode(secretKey), StandardCharsets.UTF_8);
    }

    // Method to extract claims from the JWT
    public DecodedJWT extractClaims(String token) {
        try {
            // Create an algorithm with the decoded secret key
            String decodedKey = getDecodedSecretKey();
            Algorithm algorithm = Algorithm.HMAC256(decodedKey);

            // Decode the JWT
            return JWT.require(algorithm)
                    .build()
                    .verify(token);
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    // Method to validate the JWT token (check expiration)
    public boolean isValidToken(String token) {
        try {
            DecodedJWT decodedJWT = extractClaims(token);
            Date expirationDate = decodedJWT.getExpiresAt();
            return expirationDate != null && expirationDate.after(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
