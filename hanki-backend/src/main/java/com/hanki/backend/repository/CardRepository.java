package com.hanki.backend.repository;

import com.hanki.backend.model.Card;
import org.springframework.data.repository.CrudRepository;

public interface CardRepository extends CrudRepository<Card, Integer> {
}
