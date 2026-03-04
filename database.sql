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
CREATE TABLE membership (
    membership_id INT PRIMARY KEY AUTO_INCREMENT,
    plan_type VARCHAR(50) NOT NULL,
    start_data
    over_data
    plan_type
    payment_status
CREATE TABLE trainer (
    Trainers
    trainer_id (PK)
    name
    specialization
    phone
    email
)
CREATE TABLE booker (
    booking_id (PK)
    user_id (FK)
    trainer_id (FK)
    date
    time
)


