package com.example.codepilot.repository;

import com.example.codepilot.models.Credit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CreditRepository extends MongoRepository<Credit, String> {
    
    List<Credit> findByUserIdOrderByCreatedAtDesc(String userId);
    
    Optional<Credit> findByTransactionId(String transactionId);
    
    List<Credit> findByStatus(String status);
    
    List<Credit> findByUserIdAndStatus(String userId, String status);
}
