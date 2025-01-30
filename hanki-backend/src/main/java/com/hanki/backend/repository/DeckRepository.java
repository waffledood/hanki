package com.hanki.backend.repository;

import com.hanki.backend.model.Deck;
import org.springframework.data.repository.CrudRepository;

public interface DeckRepository extends CrudRepository<Deck, Integer> {
}
