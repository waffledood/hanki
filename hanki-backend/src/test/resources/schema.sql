-- Creation of users table

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creation of decks table

CREATE TABLE IF NOT EXISTS decks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  description TEXT NOT NULL,
  owner_id INT NOT NULL,
  CONSTRAINT fk_decks_users FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Creation of cards table

CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    deck_id INT NOT NULL,
    owner_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_cards_decks FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE,
    CONSTRAINT fk_cards_users FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
