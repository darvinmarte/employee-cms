INSERT INTO department (id, name)
VALUES (001, "Leadership"),
       (002, "Sales"),
       (003, "Human Resources"),
       (004, "Guest Experience");

INSERT INTO role (id, title, salary, department_id)
VALUES (001, "Store Manager", 110000, 001),
       (002, "Operations Manager", 75000, 003),
       (003, "Guest Experience Manager", 75000,004),
       (004, "Lead Manager", 45000, 001),
       (005, "Sales Associate", 32000, 002);


INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (001, "Chelsea", "Cusmano", 001),
       (002, "John", "Doe", 005, 004),
       (003, "Hillary", "Chocko", 003, 001),
       (004, "Elena", "Hunter", 002, 001);
       (005, "Jack", "Joe", 004, 004);
