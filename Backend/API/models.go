package main

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"

	_ "github.com/go-sql-driver/mysql"
)

func initDB() (*sql.DB, error) {
    dsn := "root:bonobo27@tcp(127.0.0.1:3306)/benutzerdatenbank"
    db, err := sql.Open("mysql", dsn)
    if err != nil {
        return nil, err
    }
    if err = db.Ping(); err != nil {
        return nil, err
    }
    return db, nil
}

func HashPassword(password string) string {
    hash := sha256.New()
    hash.Write([]byte(password))
    return hex.EncodeToString(hash.Sum(nil))
}

func CreateUser(db *sql.DB, username, password string) error {
    passwordHash := HashPassword(password)
    query := "INSERT INTO benutzer (username, password_hash) VALUES (?, ?)"
    _, err := db.Exec(query, username, passwordHash)
    return err
}

func AuthenticateUser(db *sql.DB, username, password string) (bool, error) {
    passwordHash := HashPassword(password)
    var dbPasswordHash string
    query := "SELECT password_hash FROM benutzer WHERE username = ?"
    err := db.QueryRow(query, username).Scan(&dbPasswordHash)
    if err != nil {
        if err == sql.ErrNoRows {
            return false, nil // Username not found
        }
        return false, err
    }
    return dbPasswordHash == passwordHash, nil
}
