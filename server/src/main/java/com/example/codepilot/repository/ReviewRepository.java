package com.example.codepilot.repository;

import com.example.codepilot.models.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    
    // Find reviews by programming language
    List<Review> findByLanguage(String language);
    
    // Find reviews ordered by timestamp (most recent first)
    List<Review> findAllByOrderByTimestampDesc();
}
