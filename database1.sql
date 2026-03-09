
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    weight_kg DECIMAL(5,2),      -- e.g. 72.50
    height_cm DECIMAL(5,2),      -- e.g. 178.00
    fitness_goal ENUM('lose_fat','gain_muscle','maintain') NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE workouts (
    workout_id INT PRIMARY KEY AUTO_INCREMENT,
    workout_name VARCHAR(120) NOT NULL,
    difficulty_level ENUM('beginner','intermediate','advanced') NOT NULL,
    duration_minutes SMALLINT UNSIGNED NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE exercise (
    exercise_id INT PRIMARY KEY AUTO_INCREMENT,
    exercise_name VARCHAR(120) NOT NULL,
    muscle_group VARCHAR(80) NOT NULL,
    equipment_needed VARCHAR(120),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE workout_exercises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    workout_id INT NOT NULL,
    exercise_id INT NOT NULL,
    sets TINYINT UNSIGNED NOT NULL,
    reps TINYINT UNSIGNED NOT NULL,

    CONSTRAINT fk_we_workout
        FOREIGN KEY (workout_id) REFERENCES workouts(workout_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_we_exercise
        FOREIGN KEY (exercise_id) REFERENCES exercise(exercise_id)
        ON DELETE CASCADE,

    
    CONSTRAINT uq_workout_exercise UNIQUE (workout_id, exercise_id)
);


CREATE TABLE user_workout_log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    workout_id INT NOT NULL,
    date_completed DATETIME NOT NULL,
    calories_burned INT UNSIGNED,

    CONSTRAINT fk_uwl_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_uwl_workout
        FOREIGN KEY (workout_id) REFERENCES workouts(workout_id)
        ON DELETE CASCADE,

    
    INDEX idx_user_date (user_id, date_completed)
);