-- Creation of deck table

CREATE TABLE deck (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

-- Creation of card table

CREATE TABLE card (
    id SERIAL PRIMARY KEY,
    front_text TEXT NOT NULL,
    back_text TEXT NOT NULL,
    deck_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_card_deck FOREIGN KEY (deck_id) REFERENCES deck(id) ON DELETE CASCADE
);
