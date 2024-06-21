package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

//secret jwt key
var jwtKey = []byte(os.Getenv("JWT_SECRET"))

//saves user_id which is used as the user_id for sql queries
type Claims struct {
    UserID int `json:"user_id"`
    jwt.StandardClaims
}

/*
 * Handler for authenticating user login, calling authenticateUser
 * Sets the session jwt token if user login was successful for 12hours in cookies with user_id which is used as as certification variable
 * Request body consists of a username and password
 * Writes "message": "Login user successfully" if successful, else Error
 */
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

    expirationTime := time.Now().Add(12 * time.Hour)
    claims := &Claims{
        UserID: userID,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    tokenString, err := token.SignedString(jwtKey)
    if err != nil {
        http.Error(w, "Error creating JWT", http.StatusInternalServerError)
        return
    }

    http.SetCookie(w, &http.Cookie{
        Name:    "token",
        Value:   tokenString,
        Expires: expirationTime,
    })

    json.NewEncoder(w).Encode(map[string]interface{}{
        "message": "Login user successfully",
    })
}

/*
 * Handler for creating a new user, calling createUser
 * Request body consists of a username and password
 * Writes "message": "User created successfully" if successful, else Error
 */
func createUserHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    var req struct {
        Username string `json:"username"`
        Password string `json:"password"`
    }

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

   _, err := createUser(db, req.Username, req.Password)
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
        "message": "User created successfully",
    })
}

/*
 * Handler for creating a new todo, calling createUser
 * Request body consists of title, description and category
 * Writes "todo_id": todoID if successful, else Error
 */
func createTodoHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {

    claims, err := validateToken(r)
    if err != nil {
        http.Error(w, err.Error(), http.StatusUnauthorized)
        return
    }

    userID := claims.UserID

    var req struct {
        Title       string `json:"title"`
        Description string `json:"description"`
        CategoryID  int    `json:"category_id"`
    }

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    todoID, err := createTodo(db, userID, req.Title, req.Description, req.CategoryID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "todo_id": todoID,
    })
}

/*
 * Handler for retrieving todos, calling getTodosByUserID
 * Writes Array of Todo objects if successful, else Error
 */
func loadTodosHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    claims, err := validateToken(r)
    if err != nil {
        http.Error(w, err.Error(), http.StatusUnauthorized)
        return
    }

    userID := claims.UserID

    todos, err := getTodosByUserID(db, userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(todos)
}


/*
 * Handler for retrieving categories, calling getCategoriesByUser
 * Writes Array of Category objects if successful, else Error
 */
func loadCategoriesHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    claims, err := validateToken(r)
    if err != nil {
        http.Error(w, err.Error(), http.StatusUnauthorized)
        return
    }

    userID := claims.UserID

    categories, err := getCategoriesByUser(db, userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(categories)
}


/*
 * Handler for updating todos, calling updateTodo
 * Request body consists of todoid, title, description and category
 * Writes "message": "Todo updated successfully" if successful, else Error
 */
func updateTodoHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    claims, err := validateToken(r)
    if err != nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    userID := claims.UserID

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

    // Check if the todo belongs to the authenticated user
    var todoOwnerID int
    err = db.QueryRow("SELECT user_id FROM todos WHERE id = ?", req.TodoID).Scan(&todoOwnerID)
    if err != nil {
         http.Error(w, "Todo not found", http.StatusNotFound)
         return
     }

    if todoOwnerID != userID {
        http.Error(w, "Forbidden", http.StatusForbidden)
        return
     }

    err = updateTodo(db, req.TodoID, req.Title, req.Description, req.CategoryID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "message": "Todo updated successfully",
    })
}


/*
 * Handler for deleting todos, calling deleteTodo
 * Request body consists of todoid
 * Writes "message": "Todo deleted successfully" if successful, else Error
 */
func deleteTodoHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    claims, err := validateToken(r)
    if err != nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    userID := claims.UserID

    var req struct {
        TodoID int `json:"todo_id"`
    }

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Check if the todo belongs to the authenticated user
    var todoOwnerID int
    err = db.QueryRow("SELECT user_id FROM todos WHERE id = ?", req.TodoID).Scan(&todoOwnerID)
    if err != nil {
        http.Error(w, "Todo not found", http.StatusNotFound)
        return
    }

    if todoOwnerID != userID {
        http.Error(w, "Forbidden", http.StatusForbidden)
        return
    }


    err = deleteTodo(db, req.TodoID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "message": "Todo deleted successfully",
    })
}


/*
 * Handler for creating new categories, calling createCategory
 * Request body consists of name of the new category
 * Writes "category_id": categoryID if successful, else Error
 */
func createCategoryHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    claims, err := validateToken(r)
    if err != nil {
        http.Error(w, err.Error(), http.StatusUnauthorized)
        return
    }

    userID := claims.UserID

    var req struct {
        Name   string `json:"name"`
    }

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    categoryID, err := createCategory(db, userID, req.Name)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)

    json.NewEncoder(w).Encode(map[string]interface{}{
        "category_id": categoryID,
    })
}


/*
 * Handler for switching the order of two todos, calling switchTodoOrder
 * Request body consists of the id of the two todos
 * Writes "message": "Todo order switched successfully" if successful, else Error
 */
func switchTodoOrderHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    claims, err := validateToken(r)
    if err != nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    userID := claims.UserID

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

    // Check if both todos belong to the authenticated user
    var todoOwnerID1, todoOwnerID2 int
    err = db.QueryRow("SELECT user_id FROM todos WHERE id = ?", req.TodoID1).Scan(&todoOwnerID1)
    if err != nil {
        http.Error(w, "Todo not found", http.StatusNotFound)
        return
    }
    err = db.QueryRow("SELECT user_id FROM todos WHERE id = ?", req.TodoID2).Scan(&todoOwnerID2)
    if err != nil {
        http.Error(w, "Todo not found", http.StatusNotFound)
        return
    }

    if todoOwnerID1 != userID || todoOwnerID2 != userID {
        http.Error(w, "Forbidden", http.StatusForbidden)
        return
    }

    err = switchTodoOrder(db, req.TodoID1, req.TodoID2)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "message": "Todo order switched successfully",
    })
}


/*
 * Handler for switching the order of two todos, calling toggleTodoChecked
 * Request body consists of the todoid
 * Writes "message": "Todo isChecked toggled successfully" if successful, else Error
 */
 func toggleTodoCheckedHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    claims, err := validateToken(r)
    if err != nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    userID := claims.UserID

    var req struct {
        TodoID int `json:"todo_id"`
    }

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Check if the todo belongs to the authenticated user
    var todoOwnerID int
    err = db.QueryRow("SELECT user_id FROM todos WHERE id = ?", req.TodoID).Scan(&todoOwnerID)
    if err != nil {
        http.Error(w, "Todo not found", http.StatusNotFound)
        return
    }

    if todoOwnerID != userID {
        http.Error(w, "Forbidden", http.StatusForbidden)
        return
    }

    // Toggle isChecked status of the todo
    err = toggleTodoChecked(db, req.TodoID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "message": "Todo isChecked toggled successfully",
    })
}


/*
 * Function used to validate the jwt token
 *
 * @return {Claims} claims - object with userid if successful else nil
 * @return {error}         - nil if successful else Error
 */
func validateToken(r *http.Request) (*Claims, error) {
    c, err := r.Cookie("token")
    if err != nil {
        if err == http.ErrNoCookie {
            return nil, fmt.Errorf("no token present")
        }
        return nil, fmt.Errorf("error retrieving token")
    }

    tknStr := c.Value
    claims := &Claims{}

    tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil
    })

    if err != nil {
        if err == jwt.ErrSignatureInvalid {
            return nil, fmt.Errorf("invalid token signature")
        }
        return nil, fmt.Errorf("error parsing token")
    }

    if !tkn.Valid {
        return nil, fmt.Errorf("invalid token")
    }

    return claims, nil
}
