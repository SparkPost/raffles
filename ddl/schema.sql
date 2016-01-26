CREATE SCHEMA IF NOT EXISTS spraffles;
CREATE TABLE IF NOT EXISTS spraffles.email
(
  id SERIAL PRIMARY KEY,
  friendly_from TEXT NOT NULL,
  rcpt_to TEXT NOT NULL,
  body TEXT NOT NULL,
  batch_id UUID,
  saved BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS spraffles.raffle
(
  id SERIAL PRIMARY KEY,
  name TEXT,
  slug TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  winner_email_id INT 
);

CREATE TABLE IF NOT EXISTS spraffles.entrant
(
  id SERIAL PRIMARY KEY,
  raffle_id INT REFERENCES spraffles.raffle,
  email_id INT,
  from_addr TEXT
);

