
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    daily_calorie_goal INT UNSIGNED,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE foods (
    food_id INT PRIMARY KEY AUTO_INCREMENT,
    food_name VARCHAR(120) NOT NULL,

    calories INT UNSIGNED NOT NULL,
    protein DECIMAL(6,2) DEFAULT 0.00,  -- grams
    carbs   DECIMAL(6,2) DEFAULT 0.00,  -- grams
    fats    DECIMAL(6,2) DEFAULT 0.00,  -- grams

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE meal_log (
    meal_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    food_id INT NOT NULL,

    quantity DECIMAL(8,2) NOT NULL,      -- e.g., servings or grams (set a rule)
    logged_at DATETIME NOT NULL,         -- date + time is usually better than date-only

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_meal_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_meal_food
        FOREIGN KEY (food_id) REFERENCES foods(food_id)
        ON DELETE RESTRICT,

    INDEX idx_meal_user_date (user_id, logged_at)
);