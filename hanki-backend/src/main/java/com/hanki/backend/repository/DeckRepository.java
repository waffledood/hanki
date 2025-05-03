package com.hanki.backend.repository;

import com.hanki.backend.model.Deck;
import com.hanki.backend.model.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface DeckRepository extends CrudRepository<Deck, Integer> {
    List<Deck> findByOwner(User owner);
}
