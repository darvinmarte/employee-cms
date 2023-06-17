DROP DATABASE IF EXISTS employee_cms;
CREATE DATABASE employee_cms;

USE employee_cms;

CREATE TABLE department(
    id INT PRIMARY KEY,
    name VARCHAR(30)
    -- to hold department name
);

CREATE TABLE role(
    id INT PRIMARY KEY,
    title VARCHAR(30),
    -- to hold role title
    salary DECIMAL,
    -- to hold role salary
    department_id INT,
    -- to hold reference to department role belongs to
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee(
    id INT,
    first_name VARCHAR(30),
    -- to hold employee first name
    last_name VARCHAR(30),
    -- to hold employee last name
    role_id INT,
    -- to hold reference to employee role
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    manager_id INT,
    -- to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

