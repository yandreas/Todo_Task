-- Step 1: Create database
CREATE DATABASE userdatabase;

-- Step 2: Use database
USE userdatabase;

-- Step 3: Create user table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Step 4: Create categorie table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
	CONSTRAINT unique_category_per_user UNIQUE (user_id, name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 5: create todo table
CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    category_id INT NOT NULL,
    order_number INT NOT NULL,
    isChecked BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- SELECT * FROM todos;
-- INSERT INTO categories (user_id, name) VALUES (1, "testupdate");
-- INSERT INTO todos (user_id, title, description, category_id, order_number) VALUES (4, "Testtitle2222222", "Testdesc2222",4,3);
-- UPDATE todos SET isChecked = true WHERE id = 1;
-- DROP DATABASE userdatabase;