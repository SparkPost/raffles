CREATE SCHEMA IF NOT EXISTS spraffles;
CREATE TABLE IF NOT EXISTS spraffles.email
(
  id SERIAL PRIMARY KEY,
  body JSON NOT NULL,
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
  winner_email_id INT REFERENCES spraffles.email
);

