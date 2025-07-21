package com.example.codepilot.controller;

import com.example.codepilot.models.User;
import com.example.codepilot.repository.UserRepository;
import com.example.codepilot.security.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@RestController
@RequestMapping("/api/oauth")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class OAuthController {

    private static final Logger logger = LoggerFactory.getLogger(OAuthController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${app.client.url}")
    private String clientUrl;

    @GetMapping("/success")
    public ResponseEntity<?> oauthSuccess(@AuthenticationPrincipal OAuth2User oauth2User) {
        try {
            logger.info("OAuth success callback triggered");

            if (oauth2User == null) {
                logger.error("OAuth2User is null in success callback");
                return ResponseEntity.status(302)
                        .header("Location", clientUrl + "/login?error=oauth_user_null")
                        .build();
            }

            logger.info("OAuth2User attributes: {}", oauth2User.getAttributes().keySet());

            // Extract user information from OAuth2User
            String email = null;
            String name = null;
            String provider = null;

            // Handle GitHub OAuth first (GitHub has both 'login' and 'email' attributes)
            if (oauth2User.getAttributes().containsKey("login")) {
                String login = oauth2User.getAttribute("login");
                email = oauth2User.getAttribute("email");
                
                if (email == null) {
                    // GitHub might not provide email in public scope
                    email = login + "@github.local";
                }
                name = oauth2User.getAttribute("name");
                if (name == null) {
                    name = login;
                }
                provider = "github";
                logger.info("Processing GitHub OAuth for login: {}, email: {}", login, email);
            }
            // Handle Google OAuth
            else if (oauth2User.getAttributes().containsKey("email") && !oauth2User.getAttributes().containsKey("login")) {
                email = oauth2User.getAttribute("email");
                name = oauth2User.getAttribute("name");
                provider = "google";
                logger.info("Processing Google OAuth for email: {}", email);
            }

            if (email == null) {
                logger.error("Unable to retrieve email from OAuth provider");
                return ResponseEntity.status(302)
                        .header("Location", clientUrl + "/login?error=oauth_email_missing")
                        .build();
            }

            // Check if user already exists
            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;

            if (existingUser.isPresent()) {
                user = existingUser.get();
                logger.info("Existing user found: {}", user.getUsername());
                // Update provider info if needed
                if (user.getOauthProvider() == null) {
                    user.setOauthProvider(provider);
                    userRepository.save(user);
                }
            } else {
                String baseUsername = name != null ? name.replaceAll("\\s+", "").toLowerCase() : email.split("@")[0];
                String username = generateUniqueUsername(baseUsername);

                // Create new user
                user = new User();
                user.setUsername(username);
                user.setEmail(email);
                user.setCredits(20); // Give 20 free credits for new OAuth users
                user.setOauthProvider(provider);
                user = userRepository.save(user);
                logger.info("New user created: {} with {} credits", user.getUsername(), user.getCredits());
            }

            // Generate JWT token
            String token = jwtUtils.generateJwtToken(user.getEmail());
            logger.info("JWT token generated for user: {}", user.getUsername());

            // Redirect to frontend with token
            String redirectUrl = clientUrl + "/oauth/callback?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8) +
                    "&user=" + URLEncoder.encode(user.getUsername(), StandardCharsets.UTF_8) +
                    "&credits=" + user.getCredits() +
                    "&provider=" + URLEncoder.encode(provider, StandardCharsets.UTF_8);

            logger.info("Redirecting to: {}", redirectUrl);

            return ResponseEntity.status(302)
                    .header("Location", redirectUrl)
                    .build();

        } catch (Exception e) {
            logger.error("OAuth authentication failed", e);
            return ResponseEntity.status(302)
                    .header("Location", clientUrl + "/login?error=oauth_server_error")
                    .build();
        }
    }

    @GetMapping("/failure")
    public ResponseEntity<?> oauthFailure() {
        logger.error("OAuth failure callback triggered");
        return ResponseEntity.status(302)
                .header("Location", clientUrl + "/login?error=oauth_failed")
                .build();
    }

    @GetMapping("/google")
    public ResponseEntity<?> googleLogin() {
        logger.info("Initiating Google OAuth login");
        return ResponseEntity.status(302)
                .header("Location", "/oauth2/authorization/google")
                .build();
    }

    @GetMapping("/github")
    public ResponseEntity<?> githubLogin() {
        logger.info("Initiating GitHub OAuth login");
        return ResponseEntity.status(302)
                .header("Location", "/oauth2/authorization/github")
                .build();
    }

    private String generateUniqueUsername(String baseUsername) {
    String username = baseUsername;
    int suffix = 1;

    while (userRepository.existsByUsername(username)) {
        username = baseUsername + suffix;
        suffix++;
    }

    return username;
}

}
