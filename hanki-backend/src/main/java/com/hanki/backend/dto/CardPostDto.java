package com.hanki.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class CardPostDto {
    @NotBlank(message = "Front text is required")
    private String frontText;

    @NotBlank(message = "Back text is required")
    private String backText;

    @NotNull(message = "Deck ID cannot be null")
    @Min(value = 0, message = "Card ID must be at least 0")
    private Integer deckId;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
}
