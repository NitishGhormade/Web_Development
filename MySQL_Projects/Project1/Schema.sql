-- Table Creation 

CREATE DATABASE IF NOT EXISTS Project1DB;
USE Project1DB;

CREATE TABLE IF NOT EXISTS Project1Table_Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(20) UNIQUE NOT NULL,
    password TEXT NOT NULL
);