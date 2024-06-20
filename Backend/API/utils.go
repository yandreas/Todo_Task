package main

import (
	"database/sql"

	"golang.org/x/crypto/bcrypt"
)

/*
 * Finds todo of user in database with highest order_number
 *
 * @param {int} userID          - id of user
 * @return {int} maxOrderNumber - number of highest order_number of all todos of a user
 * @return {error}              - nil if successful else Error
 */
func getMaxOrderNumber(db *sql.DB, userID int) (int, error) {
    var maxOrderNumber int
    err := db.QueryRow("SELECT COALESCE(MAX(order_number), 0) FROM todos WHERE user_id = ?", userID).Scan(&maxOrderNumber)
    if err != nil {
        return 0, err
    }
    return maxOrderNumber, nil
}

/*
 * Encrypts password of new created user
 *
 * @param {string} password - password to encrypt
 * @return {string}         - string of encrypted password
 * @return {error}          - nil if successful else Error
 */
func hashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    return string(bytes), err
}

/*
 * Compares encrypted password hashs to check if password is correct on login
 *
 * @param {string} password - entered password
 * @param {string} hash     - actual user password
 * @return {bool}           - true if password is correct and false if not
 */
func checkPasswordHash(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}

