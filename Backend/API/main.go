package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)


type Todo struct {
    ID          int    `json:"id"`
    Title       string `json:"title"`
    Description string `json:"description"`
    CategoryID  int    `json:"category_id"`
    OrderNumber int    `json:"order_number"`
    IsChecked   bool   `json:"isChecked"`
}

type Category struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

func enableCORS(handler http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:1234")
        w.Header().Set("Access-Control-Allow-Credentials", "true")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        handler.ServeHTTP(w, r)
    })
}

func main() {
    db, err := initDB()
    if err != nil {
        log.Fatalf("Error initializing database: %v", err)
    }
    defer db.Close()

    r := mux.NewRouter()

    r.HandleFunc("/create-user", func(w http.ResponseWriter, r *http.Request) {
        createUserHandler(w, r, db)
    }).Methods("POST")

    r.HandleFunc("/authenticate-user", func(w http.ResponseWriter, r *http.Request) {
        authenticateUserHandler(w, r, db)
    }).Methods("POST")

    r.HandleFunc("/create-todo", func(w http.ResponseWriter, r *http.Request) {
        createTodoHandler(w, r, db)
    }).Methods("POST")

    r.HandleFunc("/update-todo", func(w http.ResponseWriter, r *http.Request) {
        updateTodoHandler(w, r, db)
    }).Methods("POST")

    r.HandleFunc("/delete-todo", func(w http.ResponseWriter, r *http.Request) {
        deleteTodoHandler(w, r, db)
    }).Methods("POST")

    r.HandleFunc("/create-category", func(w http.ResponseWriter, r *http.Request) {
        createCategoryHandler(w, r, db)
    }).Methods("POST")

    r.HandleFunc("/todos", func(w http.ResponseWriter, r *http.Request) {
        loadTodosHandler(w, r, db)
    }).Methods("GET")

    r.HandleFunc("/categories", func(w http.ResponseWriter, r *http.Request) {
        loadCategoriesHandler(w, r, db)
    }).Methods("GET")

    r.HandleFunc("/switch-order", func(w http.ResponseWriter, r *http.Request) {
        switchTodoOrderHandler(w, r, db)
    }).Methods("POST")

    r.HandleFunc("/toggle-todo-checked", func(w http.ResponseWriter, r *http.Request) {
        toggleTodoCheckedHandler(w, r, db)
    }).Methods("POST")

    http.Handle("/", enableCORS(r))

    log.Println("Server is running on port 8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

