package com.hanki.backend.controller;

import com.hanki.backend.model.Deck;
import com.hanki.backend.service.DeckService;
import org.springframework.web.bind.annotation.GetMapping;
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
}
