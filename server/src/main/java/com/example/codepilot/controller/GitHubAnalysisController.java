package com.example.codepilot.controller;

import com.example.codepilot.models.CodeRequest;
import com.example.codepilot.models.User;
import com.example.codepilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/github")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class GitHubAnalysisController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewController reviewController; // Inject the ReviewController

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeRepository(@Valid @RequestBody CodeRequest request) {
        String githubUrl = request.getCode(); // Assuming the URL is sent in the code field

        // Fetch repository files (this is a placeholder, implement the actual fetching logic)
        List<String> files = fetchRepositoryFiles(githubUrl);

        // Prepare a map to hold the review results
        Map<String, Object> analysisResults = new HashMap<>();
        for (String file : files) {
            // Create a CodeRequest for each file
            CodeRequest codeRequest = new CodeRequest();
            codeRequest.setCode(file); // Set the file content
            codeRequest.setLanguage("JavaScript"); // Set the appropriate language

            // Call the review method from ReviewController
            ResponseEntity<?> reviewResponse = reviewController.reviewCode(codeRequest);
            analysisResults.put(file, reviewResponse.getBody());
        }

        // Prepare final response
        Map<String, Object> result = new HashMap<>();
        result.put("analysis", analysisResults);

        // Check user credits and deduct if necessary
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser  = null;

        if (authentication != null && authentication.getPrincipal() instanceof User) {
            currentUser  = (User ) authentication.getPrincipal();

            // Check if user has credits
            if (!currentUser .hasCredits()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Insufficient credits. Please purchase more credits to continue."));
            }

            // Deduct credit
            currentUser .deductCredit();
            userRepository.save(currentUser );
        }

        return ResponseEntity.ok(result);
    }

    private List<String> fetchRepositoryFiles(String githubUrl) {
    // Use GitHub API to fetch repository contents
    // You may need to parse the URL to get the owner and repo name
    String owner = "username"; // Extract from githubUrl
    String repo = "repository"; // Extract from githubUrl

    // Example API call to GitHub to get repository contents
    String apiUrl = "https://api.github.com/repos/" + owner + "/" + repo + "/contents";
    
    // Use HttpClient to make the request and retrieve the file contents
    // Parse the response to get the file contents
    // Return a list of file contents
    return List.of("file1.js content", "file2.js content"); // Placeholder for actual file contents
}

}
