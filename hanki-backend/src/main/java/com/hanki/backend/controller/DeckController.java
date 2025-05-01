package com.hanki.backend.controller;

import com.hanki.backend.dto.DeckPostDto;
import com.hanki.backend.exception.DeckNotFoundException;
import com.hanki.backend.model.Deck;
import com.hanki.backend.model.User;
import com.hanki.backend.model.UserPrincipal;
import com.hanki.backend.service.DeckService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // TODO - Abstract out retrieval user details as a common method
        if (authentication != null && authentication.isAuthenticated()) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User user = userPrincipal.getUser();

            Deck deck = deckService.createDeck(deckPostDto, user);

            return ResponseEntity.status(HttpStatus.CREATED).body(deck);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
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
