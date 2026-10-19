
CREATE DATABASE IF NOT EXISTS mockmate_db;

USE mockmate_db;

CREATE TABLE IF NOT EXISTS interviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    role VARCHAR(100),
    question TEXT,
    answer TEXT,
    feedback TEXT,
    score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
