package com.hanki.backend.model;

import org.hibernate.annotations.Formula;

import jakarta.persistence.*;

@Entity
@Table(name = "decks")
public class Deck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 64, nullable = false) // Matches VARCHAR(255), nullable based on requirements
    private String name;

    @Column(columnDefinition = "TEXT", nullable = false) // Matches TEXT in PostgreSQL
    private String description;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false, foreignKey = @ForeignKey(name = "fk_decks_users"))
    private User owner;

    @Formula("(select count(*) from cards c where c.deck_id = id)")
    private int totalCards;

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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public int getTotalCards() {
        return totalCards;
    }

    public void setTotalCards(int totalCards) {
        this.totalCards = totalCards;
    }

    public Deck() {}
}
