package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
)

func authenticateUserHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    var req struct {
        Username string `json:"username"`
        Password string `json:"password"`
    }

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    userID, err := authenticateUser(db, req.Username, req.Password)
    if err != nil {
        if err.Error() == "user does not exist" {
            http.Error(w, err.Error(), http.StatusNotFound)
            return
        } else if err.Error() == "incorrect password" {
            http.Error(w, err.Error(), http.StatusUnauthorized)
            return
        }
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(map[string]interface{}{
        "user_id": userID,
    })
}


func createUserHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    var req struct {
        Username string `json:"username"`
        Password string `json:"password"`
    }

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    userID, err := createUser(db, req.Username, req.Password)
    if err != nil {
        if err.Error() == "username already exists" {
            http.Error(w, err.Error(), http.StatusConflict)
            return
        }
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "user_id": userID,
    })
}

func createTodoHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    var req struct {
        UserID      int    `json:"user_id"`
        Title       string `json:"title"`
        Description string `json:"description"`
        CategoryID  int    `json:"category_id"`
    }

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    todoID, err := createTodo(db, req.UserID, req.Title, req.Description, req.CategoryID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "todo_id": todoID,
    })
}

func loadTodosHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    todoListIDStr := r.URL.Query().Get("todo_list_id")
    if todoListIDStr == "" {
        http.Error(w, "missing todo_list_id parameter", http.StatusBadRequest)
        return
    }

    todoListID, err := strconv.Atoi(todoListIDStr)
    if err != nil {
        http.Error(w, "invalid todo_list_id parameter", http.StatusBadRequest)
        return
    }

    todos, err := getTodosByTodoList(db, todoListID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(todos)
}

func loadCategoriesHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    userIDStr := r.URL.Query().Get("user_id")
    if userIDStr == "" {
        http.Error(w, "missing user_id parameter", http.StatusBadRequest)
        return
    }

    userID, err := strconv.Atoi(userIDStr)
    if err != nil {
        http.Error(w, "invalid user_id parameter", http.StatusBadRequest)
        return
    }

    categories, err := getCategoriesByUser(db, userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(categories)
}

func updateTodoHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    var req struct {
        TodoID      int    `json:"todo_id"`
        Title       string `json:"title"`
        Description string `json:"description"`
        CategoryID  int    `json:"category_id"`
    }

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    err := updateTodo(db, req.TodoID, req.Title, req.Description, req.CategoryID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "message": "Todo updated successfully",
    })
}

func deleteTodoHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    var req struct {
        TodoID int `json:"todo_id"`
    }

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    err := deleteTodo(db, req.TodoID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "message": "Todo deleted successfully",
    })
}

func createCategoryHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    var req struct {
        UserID int    `json:"user_id"`
        Name   string `json:"name"`
    }

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    categoryID, err := createCategory(db, req.UserID, req.Name)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "category_id": categoryID,
    })
}

func switchTodoOrderHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    var req struct {
        TodoID1 int `json:"todo_id_1"`
        TodoID2 int `json:"todo_id_2"`
    }

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    if req.TodoID1 == 0 || req.TodoID2 == 0 {
        http.Error(w, "missing todo_id_1 or todo_id_2 in request", http.StatusBadRequest)
        return
    }

    err := switchTodoOrder(db, req.TodoID1, req.TodoID2)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "message": "Todo order switched successfully",
    })
}