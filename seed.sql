USE employees_db;

INSERT INTO role (title, salary, department_id) VALUES
("Web Developer", 100000, 1),
("Accountant", 80000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
("Linda", "Jones", 1, 1),
("Don", "Giovanni", 2, 1);

INSERT INTO department (name) VALUES
("Accounting")
