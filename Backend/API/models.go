package main

import (
	"api/config"
	"database/sql"
	"errors"
	"fmt"
	"log"

	"github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

//Opens connection to the database
func initDB() (*sql.DB, error) {
    //Load env file
    err := godotenv.Load("config.env")
    if err != nil {
        log.Fatalf("Error loading .env file")
    }
    
    dbConfig := config.NewEnvDBConfig()
    connectionString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", dbConfig.GetUsername(), dbConfig.GetPassword(), dbConfig.GetHost(), dbConfig.GetPort(), dbConfig.GetDatabase())
    db, err := sql.Open("mysql", connectionString)
    if err != nil {
        return nil, err
    }
    return db, nil
}


/*
 * Sends sql query to create a new user
 * 
 * @param {string} username
 * @param {string} password
 * @return {int64} userID  - userID of newly created user
 * @return {error}         - nil if successful else Error
 */
func createUser(db *sql.DB, username, password string) (int64, error) {
    hashedPassword, err := hashPassword(password)
    if err != nil {
        return 0, err
    }

    result, err := db.Exec("INSERT INTO users (username, password) VALUES (?, ?)", username, hashedPassword)
    if err != nil {
        var mysqlErr *mysql.MySQLError
        if errors.As(err, &mysqlErr) && mysqlErr.Number == 1062 {
            // 1062 is the MySQL error number for duplicate entry
            return 0, fmt.Errorf("username already exists")
        }
        return 0, err
    }

    userID, err := result.LastInsertId()
    if err != nil {
        return 0, err
    }

    //automatically creates "None" category for every user which is a category for todos that have no category
    _, err = db.Exec("INSERT INTO categories (user_id, name) VALUES (?, ?)", userID, "None")
    if err != nil {
        return 0, err
    }

    return userID, nil
}

/*
 * Sends sql query to authenticate a user login
 * 
 * @param {string} username
 * @param {string} password
 * @return {int} userID  - userID of authenticated user
 * @return {error}         - nil if successful else Error
 */
func authenticateUser(db *sql.DB, username, password string) (int, error) {
    var userID int
    var storedPassword string
    err := db.QueryRow("SELECT id, password FROM users WHERE username = ?", username).Scan(&userID, &storedPassword)
    if err != nil {
        if err == sql.ErrNoRows {
            return 0, fmt.Errorf("user does not exist")
        }
        return 0, err
    }

    if !checkPasswordHash(password, storedPassword) {
        return 0, fmt.Errorf("incorrect password")
    }

    return userID, nil
}


/*
 * Sends sql query to create a new todo for the user
 * 
 * @param {int} userID
 * @param {string} title
 * @param {string} description
 * @param {int} categoryID
 * @return {int64} userID  - todoID of newly created todo
 * @return {error}         - nil if successful else Error
 */
func createTodo(db *sql.DB, userID int, title, description string, categoryID int) (int64, error) {
    maxOrderNumber, err := getMaxOrderNumber(db, userID)
    if err != nil {
        return 0, err
    }

    result, err := db.Exec("INSERT INTO todos (user_id, title, description, category_id, order_number) VALUES (?, ?, ?, ?, ?)",
        userID, title, description, categoryID, maxOrderNumber+1)
    if err != nil {
        return 0, err
    }

    todoID, err := result.LastInsertId()
    if err != nil {
        return 0, err
    }

    return todoID, nil
}


/*
 * Sends sql query to update an existing todo
 * 
 * @param {int} todoID
 * @param {string} title
 * @param {string} description
 * @param {int} categoryID
 * @return {error}         - nil if successful else Error
 */
func updateTodo(db *sql.DB, todoID int, title, description string, categoryID int) error {
    _, err := db.Exec("UPDATE todos SET title = ?, description = ?, category_id = ? WHERE id = ?",
        title, description, categoryID, todoID)
    return err
}


/*
 * Sends sql query to delete a todo
 * 
 * @param {int} todoID
 * @return {error}         - nil if successful else Error
 */
func deleteTodo(db *sql.DB, todoID int) error {
    _, err := db.Exec("DELETE FROM todos WHERE id = ?", todoID)
    return err
}


/*
 * Sends sql query to create a new category
 * 
 * @param {int} userID
 * @param {string} name         - name of the new category
 * @return {int64} categoryID   - id of new category
 * @return {error}              - nil if successful else Error
 */
func createCategory(db *sql.DB, userID int, name string) (int64, error) {
    result, err := db.Exec("INSERT INTO categories (user_id, name) VALUES (?, ?)", userID, name)
    if err != nil {
        return 0, err
    }

    categoryID, err := result.LastInsertId()
    if err != nil {
        return 0, err
    }

    return categoryID, nil
}


/*
 * Sends sql query to swap the oder_number of two todos
 * 
 * @param {int} todoID1
 * @param {int} todoID2
 * @return {error}              - nil if successful else Error
 */
func switchTodoOrder(db *sql.DB, todoID1, todoID2 int) error {
    // Get current order numbers
    var orderNumber1, orderNumber2 int
    err := db.QueryRow("SELECT order_number FROM todos WHERE id = ?", todoID1).Scan(&orderNumber1)
    if err != nil {
        return err
    }

    err = db.QueryRow("SELECT order_number FROM todos WHERE id = ?", todoID2).Scan(&orderNumber2)
    if err != nil {
        return err
    }

    // Update order numbers
    _, err = db.Exec("UPDATE todos SET order_number = ? WHERE id = ?", orderNumber2, todoID1)
    if err != nil {
        return err
    }

    _, err = db.Exec("UPDATE todos SET order_number = ? WHERE id = ?", orderNumber1, todoID2)
    if err != nil {
        return err
    }

    return nil
}


/*
 * Sends sql query to toggle the isChecked bool of a todo
 * 
 * @param {int} todoID
 * @return {error}      - nil if successful else Error
 */
func toggleTodoChecked(db *sql.DB, todoID int) error {
    _, err := db.Exec("UPDATE todos SET isChecked = NOT isChecked WHERE id = ?", todoID)
    return err
}


/*
 * Sends sql query to get all todos of the login user
 * 
 * @param {int} userID
 * @return {[]Todo}     - Array of todo objects
 * @return {error}      - nil if successful else Error
 */
func getTodosByUserID(db *sql.DB, userID int) ([]Todo, error) {
    var todos []Todo

    rows, err := db.Query("SELECT id, title, description, category_id, order_number, isChecked FROM todos WHERE user_id = ?", userID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    for rows.Next() {
        var todo Todo
        err := rows.Scan(&todo.ID, &todo.Title, &todo.Description, &todo.CategoryID, &todo.OrderNumber, &todo.IsChecked)
        if err != nil {
            return nil, err
        }
        todos = append(todos, todo)
    }

    if err := rows.Err(); err != nil {
        return nil, err
    }

    return todos, nil
}


/*
 * Sends sql query to get all categories of login user
 * 
 * @param {int} userID
 * @return {[]Category}     - Array of category objects
 * @return {error}          - nil if successful else Error
 */
func getCategoriesByUser(db *sql.DB, userID int) ([]Category, error) {
    var categories []Category

    rows, err := db.Query("SELECT id, name FROM categories WHERE user_id = ?", userID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    for rows.Next() {
        var category Category
        err := rows.Scan(&category.ID, &category.Name)
        if err != nil {
            return nil, err
        }
        categories = append(categories, category)
    }

    if err := rows.Err(); err != nil {
        return nil, err
    }

    return categories, nil
}

