package com.example.codepilot.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.TypeAlias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Document(collection = "reviews")
@TypeAlias("Review")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    
    @Id
    private String id;

    @NotBlank(message = "Language is required")
    private String language;

    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Review is required")
    private String review;

    @CreatedDate
    private LocalDateTime timestamp;
}
