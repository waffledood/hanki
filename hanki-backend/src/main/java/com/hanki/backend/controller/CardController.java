package com.hanki.backend.controller;

import com.hanki.backend.model.Card;
import com.hanki.backend.service.CardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
