package com.hanki.backend.service;

import com.hanki.backend.model.Card;
import com.hanki.backend.repository.CardRepository;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
public class CardService {
    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
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
}
