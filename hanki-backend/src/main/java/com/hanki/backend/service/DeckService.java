package com.hanki.backend.service;

import com.hanki.backend.model.Deck;
import com.hanki.backend.repository.DeckRepository;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DeckService {
    private final DeckRepository deckRepository;

    public DeckService(DeckRepository deckRepository) {
        this.deckRepository = deckRepository;
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
    public Iterable<Deck> findAll() {
        return deckRepository.findAll();
    }
}
