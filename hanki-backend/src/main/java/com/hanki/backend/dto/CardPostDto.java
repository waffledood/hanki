package com.hanki.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CardPostDto {
    @NotBlank(message = "Front text is required")
    private String frontText;

    @NotBlank(message = "Back text is required")
    private String backText;

    @NotNull(message = "Deck ID cannot be null")
    @Min(value = 0, message = "Card ID must be at least 0")
    private Integer deckId;

    public String getFrontText() {
        return frontText;
    }

    public void setFrontText(String frontText) {
        this.frontText = frontText;
    }

    public String getBackText() {
        return backText;
    }

    public void setBackText(String backText) {
        this.backText = backText;
    }

    public Integer getDeckId() {
        return deckId;
    }

    public void setDeckId(Integer deckId) {
        this.deckId = deckId;
    }
}
