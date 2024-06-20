package main

import (
	"database/sql"

	"golang.org/x/crypto/bcrypt"
)

func getMaxOrderNumber(db *sql.DB, userID int) (int, error) {
    var maxOrderNumber int
    err := db.QueryRow("SELECT COALESCE(MAX(order_number), 0) FROM todos WHERE user_id = ?", userID).Scan(&maxOrderNumber)
    if err != nil {
        return 0, err
    }
    return maxOrderNumber, nil
}

func hashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}

