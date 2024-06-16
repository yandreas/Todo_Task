package main

import (
	"log"
	"net/http"
)

type Todo struct {
    ID          int    `json:"id"`
    TodoListID  int    `json:"todo_list_id"`
    Title       string `json:"title"`
    Description string `json:"description"`
    CategoryID  int    `json:"category_id"`
    OrderNumber int    `json:"order_number"`
}

type Category struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

func main() {
    db, err := initDB()
    if err != nil {
        log.Fatalf("Error initializing database: %v", err)
    }
    defer db.Close()

    http.HandleFunc("/create-user", func(w http.ResponseWriter, r *http.Request) {
        createUserHandler(w, r, db)
    })

    http.HandleFunc("/authenticate-user", func(w http.ResponseWriter, r *http.Request) {
        authenticateUserHandler(w, r, db)
    })

    http.HandleFunc("/create-todo", func(w http.ResponseWriter, r *http.Request) {
        createTodoHandler(w, r, db)
    })

    http.HandleFunc("/update-todo", func(w http.ResponseWriter, r *http.Request) {
        updateTodoHandler(w, r, db)
    })

    http.HandleFunc("/delete-todo", func(w http.ResponseWriter, r *http.Request) {
        deleteTodoHandler(w, r, db)
    })

    http.HandleFunc("/create-category", func(w http.ResponseWriter, r *http.Request) {
        createCategoryHandler(w, r, db)
    })

    http.HandleFunc("/todos", func(w http.ResponseWriter, r *http.Request) {
        loadTodosHandler(w, r, db)
    })

    http.HandleFunc("/categories", func(w http.ResponseWriter, r *http.Request) {
        loadCategoriesHandler(w, r, db)
    })

    http.HandleFunc("/switch-order", func(w http.ResponseWriter, r *http.Request) {
        switchTodoOrderHandler(w, r, db)
    })

    log.Println("Server is running on port 8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

