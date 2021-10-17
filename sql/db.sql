CREATE DATABASE IF NOT EXISTS scientiapf; 

CREATE TABLE IF NOT EXISTS Course (
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  url VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  id SERIAL PRIMARY KEY,
);

CREATE TABLE IF NOT EXISTS User (
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255)  NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  province VARCHAR(255) NOT NULL,
  postalcode VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  postalcode VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  id SERIAL PRIMARY KEY,
);

CREATE TABLE IF NOT EXISTS Category (
  name VARCHAR(255) NOT NULL,
  id SERIAL PRIMARY KEY,  
)

CREATE TABLE IF NOT EXISTS Review (
  comments VARCHAR(5000) NOT NULL,
  score VARCHAR(255) NOT NULL,
  id SERIAL PRIMARY KEY,  
)

CREATE TABLE IF NOT EXISTS Order (
  state VARCHAR(255) NOT NULL,
  coursesId VARCHAR(255) NOT NULL,
  id SERIAL PRIMARY KEY,  
)

CREATE TABLE IF NOT EXISTS Order_course (
  price INTEGER NOT NULL,
  id SERIAL PRIMARY KEY,  
)


