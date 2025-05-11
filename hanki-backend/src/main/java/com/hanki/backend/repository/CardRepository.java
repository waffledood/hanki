package com.hanki.backend.repository;

import com.hanki.backend.model.Card;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CardRepository extends CrudRepository<Card, Integer> {
    List<Card> findByDeckId(Integer deckId);
}
