package com.hanki.backend.controller;

import com.hanki.backend.dto.DeckPostDto;
import com.hanki.backend.exception.DeckNotFoundException;
import com.hanki.backend.model.Deck;
import com.hanki.backend.service.DeckService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/decks")
public class DeckController {

    private final DeckService deckService;

    public DeckController(DeckService deckService) {
        this.deckService = deckService;
    }

    @GetMapping
    public Iterable<Deck> getAllDecks() {
        return deckService.findAll();
    }

    @PostMapping
    public ResponseEntity<Deck> createDeck(@Valid @RequestBody DeckPostDto deckPostDto) {
        Deck deck = deckService.createDeck(deckPostDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(deck);
    }

    @GetMapping("/{id}")
    public Deck getDeckById(@PathVariable Integer id) {
        return deckService.findById(id).orElseThrow(() -> new DeckNotFoundException("Deck not found with id: " + id));
    }

    @ExceptionHandler(DeckNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleDeckNotFoundException(DeckNotFoundException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage()); // Return the exception message
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
}
