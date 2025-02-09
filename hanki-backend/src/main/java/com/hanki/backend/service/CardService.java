package com.hanki.backend.service;

import com.hanki.backend.dto.CardPostDto;
import com.hanki.backend.model.Card;
import com.hanki.backend.model.Deck;
import com.hanki.backend.repository.CardRepository;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
public class CardService {
    private final CardRepository cardRepository;
    private final DeckService deckService;

    public CardService(CardRepository cardRepository, DeckService deckService) {
        this.cardRepository = cardRepository;
        this.deckService = deckService;
    }

    @PostConstruct
    public void init() {
        System.out.println("Done constructing DeckService bean");
    }

    @PreDestroy
    public void shutdown() {
        System.out.println("Destroying DeckService bean");
    }

    @Transactional
    public Iterable<Card> findAll() {
        return cardRepository.findAll();
    }

    @Transactional
    public Optional<Card> findById(Integer id) {
        return cardRepository.findById(id);
    }

    @Transactional
    public Card createCard(CardPostDto cardPostDto) {
        Card card = new Card();
        card.setFrontText(cardPostDto.getFrontText());
        card.setBackText(cardPostDto.getBackText());

        Integer deckId = cardPostDto.getDeckId();
        Deck deck = deckService.findById(deckId)
                .orElseThrow(() -> new EntityNotFoundException("Deck not found with ID: " + deckId));
        card.setDeck(deck);

        return cardRepository.save(card);
    }
}
