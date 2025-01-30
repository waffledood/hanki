package com.hanki.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "deck")
public class Deck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 255, nullable = false) // Matches VARCHAR(255), nullable based on requirements
    private String name;

    @Column(columnDefinition = "TEXT", nullable = false) // Matches TEXT in PostgreSQL
    private String description;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Deck() {}
}
