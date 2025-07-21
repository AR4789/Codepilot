package com.example.codepilot.controller;

import com.example.codepilot.models.Credit;
import com.example.codepilot.models.User;
import com.example.codepilot.repository.CreditRepository;
import com.example.codepilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/credits")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class CreditController {

    @Autowired
    private CreditRepository creditRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/balance")
    public ResponseEntity<?> getCreditBalance() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not authenticated"));
            }

            User currentUser = (User) authentication.getPrincipal();
            User user = userRepository.findById(currentUser.getId()).orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("credits", user.getCredits());
            response.put("totalSpent", user.getTotalSpent());
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to get credit balance: " + e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getCreditHistory() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not authenticated"));
            }

            User currentUser = (User) authentication.getPrincipal();
            List<Credit> credits = creditRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
            
            return ResponseEntity.ok(credits);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to get credit history: " + e.getMessage()));
        }
    }

    @PostMapping("/purchase")
    public ResponseEntity<?> purchaseCredits(@RequestBody CreditPurchaseRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not authenticated"));
            }

            User currentUser = (User) authentication.getPrincipal();

            // Validate credit package
            int credits = request.getCredits();
            double price = request.getPrice();
            
            // Validate pricing (100 credits = ₹50)
            double expectedPrice = (credits / 100.0) * 50.0;
            if (Math.abs(price - expectedPrice) > 0.01) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid pricing"));
            }

            // For demo purposes, directly add credits (in production, integrate with payment gateway)
            User user = userRepository.findById(currentUser.getId()).orElse(null);
            if (user != null) {
                user.addCredits(credits);
                user.setTotalSpent(user.getTotalSpent() + price);
                userRepository.save(user);

                // Save credit record
                Credit credit = new Credit(user.getId(), credits, "DEMO_PURCHASE");
                credit.setPrice(price);
                credit.setStatus("SUCCESS");
                creditRepository.save(credit);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("creditsAdded", credits);
            response.put("newBalance", user.getCredits());
            response.put("message", "Credits purchased successfully!");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to purchase credits: " + e.getMessage()));
        }
    }

    // Request DTO
    public static class CreditPurchaseRequest {
        private int credits;
        private double price;

        public int getCredits() { return credits; }
        public void setCredits(int credits) { this.credits = credits; }
        
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
    }
}
