-- Schritt 1: Datenbank erstellen
CREATE DATABASE benutzerdatenbank;

-- Schritt 2: Datenbank verwenden
USE benutzerdatenbank;

-- Schritt 3: Tabelle erstellen
CREATE TABLE benutzer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- Schritt 4: Benutzer hinzufügen
INSERT INTO benutzer (username, password_hash)
VALUES ('benutzername', SHA2('passwort', 256));

-- Schritt 5: Benutzer authentifizieren
SELECT * FROM benutzer
WHERE username = 'benutzername' AND password_hash = SHA2('eingegebenes_passwort', 256);

SELECT * FROM benutzer;
DELETE FROM benutzer where username ="testuser";