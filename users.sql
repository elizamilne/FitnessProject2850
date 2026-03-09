-- USERS
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    gender ENUM('male','female','other') DEFAULT 'other',
    phone VARCHAR(20),
    birth_date DATE,
    city VARCHAR(100),

    role ENUM('member','trainer','admin') DEFAULT 'member',
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- MEMBERSHIP PLANS / MEMBERSHIPS (per user)
CREATE TABLE membership (
    membership_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,

    plan_type VARCHAR(50) NOT NULL,              -- e.g. "monthly", "annual"
    start_date DATE NOT NULL,
    end_date DATE,
    payment_status ENUM('pending','paid','failed','cancelled') DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_membership_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- TRAINERS (linked to users OR standalone)
CREATE TABLE trainer (
    trainer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- BOOKINGS (user books trainer)
CREATE TABLE booking (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    trainer_id INT NOT NULL,

    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
    notes VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_booking_trainer
        FOREIGN KEY (trainer_id) REFERENCES trainer(trainer_id)
        ON DELETE CASCADE,

    -- prevents double-booking the same trainer at same date/time
    CONSTRAINT uq_trainer_slot UNIQUE (trainer_id, booking_date, booking_time)
);