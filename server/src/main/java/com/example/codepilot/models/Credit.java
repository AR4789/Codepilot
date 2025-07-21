package com.example.codepilot.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Document(collection = "credits")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Credit {
    
    @Id
    private String id;

    private String userId;

    private Integer amount;

    private Double price; // Price paid in rupees

    private String transactionId; // Razorpay transaction ID

    private String status; // PENDING, SUCCESS, FAILED

    private String paymentMethod; // RAZORPAY, FREE_SIGNUP, ADMIN

    @CreatedDate
    private LocalDateTime createdAt;

    // Constructor for free credits
    public Credit(String userId, Integer amount, String paymentMethod) {
        this.userId = userId;
        this.amount = amount;
        this.price = 0.0;
        this.status = "SUCCESS";
        this.paymentMethod = paymentMethod;
        this.createdAt = LocalDateTime.now();
    }

    // Constructor for paid credits
    public Credit(String userId, Integer amount, Double price, String transactionId, String paymentMethod) {
        this.userId = userId;
        this.amount = amount;
        this.price = price;
        this.transactionId = transactionId;
        this.status = "PENDING";
        this.paymentMethod = paymentMethod;
        this.createdAt = LocalDateTime.now();
    }
}
