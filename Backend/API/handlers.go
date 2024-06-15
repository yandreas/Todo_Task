package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
)

type UserRequest struct {
    Username string `json:"username"`
    Password string `json:"password"`
}

func createUserHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    var userReq UserRequest
    if err := json.NewDecoder(r.Body).Decode(&userReq); err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    if err := CreateUser(db, userReq.Username, userReq.Password); err != nil {
        http.Error(w, fmt.Sprintf("Error creating user: %v", err), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    w.Write([]byte("User created successfully"))
}

func authenticateUserHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    var userReq UserRequest
    if err := json.NewDecoder(r.Body).Decode(&userReq); err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    isAuthenticated, err := AuthenticateUser(db, userReq.Username, userReq.Password)
    if err != nil {
        http.Error(w, fmt.Sprintf("Error authenticating user: %v", err), http.StatusInternalServerError)
        return
    }

    if isAuthenticated {
        w.Write([]byte("User authenticated successfully"))
    } else {
        http.Error(w, "Invalid username or password", http.StatusUnauthorized)
    }
}
