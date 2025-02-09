package com.hanki.backend.controller;

import com.hanki.backend.dto.CardPostDto;
import com.hanki.backend.exception.CardNotFoundException;
import com.hanki.backend.model.Card;
import com.hanki.backend.service.CardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/cards")
public class CardController {
    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping
    public Iterable<Card> getAllCards() {
        return cardService.findAll();
    }

    @PostMapping
    public ResponseEntity<Card> createCard(@Valid @RequestBody CardPostDto cardPostDto) {
        Card card = cardService.createCard(cardPostDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(card);
    }

    @GetMapping("/{id}")
    public Card getCardById(@PathVariable Integer id) {
        return cardService.findById(id).orElseThrow(() -> new CardNotFoundException("Card not found with id: " + id));
    }

    @ExceptionHandler(CardNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleCardNotFoundException(CardNotFoundException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage()); // Return the exception message
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
}
