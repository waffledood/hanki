package com.hanki.backend.controller;

import com.hanki.backend.exception.DeckNotFoundException;
import com.hanki.backend.model.Deck;
import com.hanki.backend.service.DeckService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/{id}")
    public Deck getDeckById(@PathVariable Integer id) {
        return deckService.findById(id).orElseThrow(() -> new DeckNotFoundException("Deck not found with id: " + id));
    }
}
