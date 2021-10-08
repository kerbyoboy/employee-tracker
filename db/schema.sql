DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;
USE employees;

CREATE TABLE department(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY ,
    name VARCHAR (30) UNIQUE NOT NULL

);

CREATE TABLE role (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY ,
    title VARCHAR (30) ,
    salary DECIMAL ,
    department_id INT UNSIGNED ,
    FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE employee (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY ,
    first_name VARCHAR (30) , 
    last_name VARCHAR (30) ,
    role_id INT UNSIGNED ,
    manager_id INT UNSIGNED,
    FOREIGN KEY (role_id) REFERENCES role (id),
    FOREIGN KEY (manager_id) REFERENCES employee (id)
)
