package main

import (
	"log"
	"net/http"
)

func main() {
    db, err := initDB()
    if err != nil {
        log.Fatalf("Error initializing database: %v", err)
    }
    defer db.Close()

    // HTTP Handlers
    http.HandleFunc("/create-user", func(w http.ResponseWriter, r *http.Request) {
        createUserHandler(w, r, db)
    })
    http.HandleFunc("/authenticate", func(w http.ResponseWriter, r *http.Request) {
        authenticateUserHandler(w, r, db)
    })

    log.Println("Server is running on port 8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
