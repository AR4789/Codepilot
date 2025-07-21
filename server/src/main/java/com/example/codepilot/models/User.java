package com.example.codepilot.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    private String id;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    @Indexed(unique = true)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Indexed(unique = true)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private Integer credits = 20; // Free credits on signup

    private Double totalSpent = 0.0;

    private List<String> roles = new ArrayList<>();

    private boolean enabled = true;

    @CreatedDate
    private LocalDateTime createdAt;

    private LocalDateTime lastLogin;

    private String oauthProvider; // "google", "github", or null for regular users

    // Constructor for registration
    public User(String username, String email, String password, String fullName) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName != null ? fullName : username;
        this.credits = 20;
        this.totalSpent = 0.0;
        this.roles = new ArrayList<>(List.of("USER"));
        this.enabled = true;
        this.createdAt = LocalDateTime.now();
    }

    // Constructor for OAuth users
    public User(String username, String email, String provider) {
        this.username = username;
        this.email = email;
        this.fullName = username;
        this.credits = 20;
        this.totalSpent = 0.0;
        this.roles = new ArrayList<>(List.of("USER"));
        this.enabled = true;
        this.createdAt = LocalDateTime.now();
        this.oauthProvider = provider;
    }

    public void deductCredit() {
        if (this.credits > 0) {
            this.credits--;
        }
    }

    public void addCredits(Integer amount) {
        this.credits += amount;
    }

    public boolean hasCredits() {
        return this.credits > 0;
    }
}
