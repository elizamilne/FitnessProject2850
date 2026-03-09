
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user','trainer','admin') DEFAULT 'user',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE goals (
    goal_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,

    goal_type ENUM('lose_weight','gain_muscle','maintain','performance','other') NOT NULL,
    target_weight DECIMAL(5,2),
    deadline DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_goals_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    INDEX idx_goals_user (user_id)
);


CREATE TABLE progress (
    progress_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,

    weight DECIMAL(5,2),
    body_fat_percentage DECIMAL(5,2),
    recorded_at DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_progress_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    INDEX idx_progress_user_date (user_id, recorded_at)
);


CREATE TABLE workouts (
    workout_id INT PRIMARY KEY AUTO_INCREMENT,
    trainer_id INT NOT NULL,

    title VARCHAR(120) NOT NULL,
    description TEXT,
    difficulty ENUM('beginner','intermediate','advanced') NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_workouts_trainer
        FOREIGN KEY (trainer_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    INDEX idx_workouts_trainer (trainer_id)
);


CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    trainer_id INT NOT NULL,

    rating TINYINT UNSIGNED NOT NULL,
    comment VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reviews_trainer
        FOREIGN KEY (trainer_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    
    CONSTRAINT uq_user_trainer_review UNIQUE (user_id, trainer_id),

   
    CONSTRAINT chk_rating_range CHECK (rating BETWEEN 1 AND 5)
);