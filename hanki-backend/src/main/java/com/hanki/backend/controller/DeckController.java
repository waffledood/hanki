package com.hanki.backend.controller;

import com.hanki.backend.dto.DeckPostDto;
import com.hanki.backend.dto.DeckUpdateDto;
import com.hanki.backend.exception.DeckNotFoundException;
import com.hanki.backend.model.Card;
import com.hanki.backend.model.Deck;
import com.hanki.backend.model.User;
import com.hanki.backend.model.UserPrincipal;
import com.hanki.backend.service.CardService;
import com.hanki.backend.service.DeckService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/decks")
public class DeckController {

    private final DeckService deckService;

    private final CardService cardService;

    public DeckController(DeckService deckService, CardService cardService) {
        this.deckService = deckService;
        this.cardService = cardService;
    }

    @GetMapping
    public Iterable<Deck> getAllDecks(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userPrincipal.getUser();

        return deckService.findDecksOwnedBy(user);
    }

    @PostMapping
    public ResponseEntity<Deck> createDeck(@Valid @RequestBody DeckPostDto deckPostDto,
                                           @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userPrincipal.getUser();

        Deck deck = deckService.createDeck(deckPostDto, user);

        return ResponseEntity.status(HttpStatus.CREATED).body(deck);
    }

    @GetMapping("/{id}")
    public Deck getDeckById(@PathVariable Integer id) {
        return deckService.findById(id).orElseThrow(() -> new DeckNotFoundException("Deck not found with id: " + id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Deck> updateDeck(@PathVariable Integer id, @Valid  @RequestBody DeckUpdateDto dto) {
        Deck updatedDeck = deckService.updateDeck(id, dto);

        return ResponseEntity.ok(updatedDeck);
    }

    @GetMapping("/{id}/cards")
    public Iterable<Card> getCardsOfDeck(@PathVariable Integer id) {
        return cardService.findAllCardsInDeck(id);
    }

    @ExceptionHandler(DeckNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleDeckNotFoundException(DeckNotFoundException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage()); // Return the exception message
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
}
