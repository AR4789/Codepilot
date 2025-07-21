package com.example.codepilot.controller;

import com.example.codepilot.models.CodeRequest;
import com.example.codepilot.models.Review;
import com.example.codepilot.models.User;
import com.example.codepilot.repository.ReviewRepository;
import com.example.codepilot.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/review")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class ReviewController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

@PostMapping
public ResponseEntity<?> reviewCode(@Valid @RequestBody CodeRequest request) {
    try {
        // Get authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = null;
            System.out.println("Authentication====="+authentication);

        if (authentication != null && authentication.getPrincipal() instanceof User) {
            currentUser = (User) authentication.getPrincipal();
            System.out.println("Currentuser======="+currentUser);

            // Check if user has credits
            if (!currentUser.hasCredits()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Insufficient credits. Please purchase more credits to continue."));
            }

            // Deduct credit
            currentUser.deductCredit();
            userRepository.save(currentUser);
        }

        String code = request.getCode();
        String language = request.getLanguage();

        // Prompt for Suggestions
        String suggestionsPrompt = "You're a senior software engineer. Review the following " + language +
                " code and tell the bugs, give improvement suggestions and keep it short and simple to understand. List them as:\n" +
                "1. Bug in the code :-\n2. Suggestion and improvements in code can be :-\n...\n\nCode:\n\n" + code;

        // Prompt for Corrected Code
String correctedCodePrompt = "Return ONLY the corrected " + language + " code with:\n" +
    "- NO explanations\n" +
    "- NO comments\n" +
    "- NO markdown formatting\n" +
    "- NO code blocks (```)\n" +
    "- NO section headers\n" +
    "- NO line numbers\n" +
    "- NO additional text of any kind\n\n" +
    "Just return the pure executable code with proper syntax. If you include anything other than code, the response will be rejected.\n\n" +
    "Code to correct:\n\n" + code;


        // Call Ollama for both prompts
        String suggestionsText = queryOllama(suggestionsPrompt);
        String correctedCodeText = queryOllama(correctedCodePrompt);

        // Prepare response
        Map<String, Object> result = new HashMap<>();
        result.put("review", cleanSuggestions(suggestionsText));
        result.put("correctedCode", extractCleanCode(correctedCodeText.trim()));
        result.put("creditsRemaining", currentUser != null ? currentUser.getCredits() : null);

        // Save to DB if user authenticated
        if (currentUser != null) {
            Review review = new Review();
            review.setLanguage(language);
            review.setCode(code);
            review.setReview(suggestionsText + "\n\n" + correctedCodeText); // Save both
            review.setTimestamp(LocalDateTime.now());
            Review savedReview = reviewRepository.save(review);
            result.put("reviewId", savedReview.getId());
        }

        return ResponseEntity.ok(result);

    } catch (Exception e) {
        e.printStackTrace();

        // Refund credit if request failed
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            User user = (User) auth.getPrincipal();
            user.addCredits(1);
            userRepository.save(user);
        }

        return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to process review: " + e.getMessage()));
    }
}


 private String cleanSuggestions(String suggestions) {
    if (suggestions == null || suggestions.isBlank())
        return "";

    // First remove all code blocks from suggestions
    suggestions = suggestions.replaceAll("```[a-zA-Z]*\\n", "")
                           .replaceAll("```", "");

    // Normalize line endings
    suggestions = suggestions.replace("\r\n", "\n").trim();

    // Fix numbering format
    suggestions = suggestions.replaceAll("(?m)^(\\d+)\\)", "$1.")
                           .replaceAll("(?m)^(\\d+)\\.\\s*", "$1. ");

    // Remove bullet points and other special chars at line start
    suggestions = suggestions.replaceAll("(?m)^[\\s*\\-+]\\s*", "");

    // Remove extra empty lines
    suggestions = suggestions.replaceAll("(?m)^\\s*$[\r\n]+", "");

    // Remove any remaining code fragments
    suggestions = suggestions.replaceAll("\\b(?:public|class|void|static)\\b", "")
                           .replaceAll("\\{[^}]*\\}", "");

    return suggestions.trim();
}

  private String queryOllama(String prompt) throws IOException, InterruptedException {
    String model = "deepseek-coder:6.7b";

    String requestBody = objectMapper.writeValueAsString(Map.of(
        "model", model,
        "prompt", prompt,
        "stream", false,
        "options", Map.of(
            "temperature", 0.2,
            "num_ctx", 2048
        )
    ));

    HttpRequest ollamaRequest = HttpRequest.newBuilder()
            .uri(URI.create("http://localhost:11434/api/generate"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

    HttpResponse<String> response = HttpClient.newHttpClient()
            .send(ollamaRequest, HttpResponse.BodyHandlers.ofString());

    String body = response.body();

    JsonNode json = objectMapper.readTree(body);

    if (json.has("response")) {
        return json.get("response").asText();
    } else {
        // Log entire response for debugging
        System.err.println("Unexpected response from Ollama: " + body);
        throw new IllegalStateException("Ollama response missing 'response' field.");
    }
}

public static String extractCleanCode(String response) {
    // Regex to match code between triple backticks, with optional language label
    Pattern pattern = Pattern.compile("(?s)```(?:\\w+)?\\s*\\n(.*?)\\n```");
    Matcher matcher = pattern.matcher(response);
    
    if (matcher.find()) {
        return matcher.group(1).trim(); // return only the inner code
    }

    // If no code block, return as-is (maybe fallback)
    return response.trim();
}



    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        try {
            List<Review> reviews = reviewRepository.findAllByOrderByTimestampDesc();
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/language/{language}")
    public ResponseEntity<List<Review>> getReviewsByLanguage(@PathVariable String language) {
        try {
            List<Review> reviews = reviewRepository.findByLanguage(language);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}
