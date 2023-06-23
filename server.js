const express = require('express')
// Import and require mysql2
const mysql = require('mysql2')
const inquirer = require('inquirer')
const PORT = process.env.PORT || 3000;
const app = express();
require('console.table')

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_cms'
  },
  console.log(`Connected to the employee_cms database.`)
);

function promptUser() {
  inquirer
    .prompt([
      // first question asked to user then returns a switch case depending on users answer
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'options',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
      }
    ])
    .then((answers) => {
      console.log(answers)
      const choice = answers.options
      // case switch to prompt user depending on choice 
      switch (choice) {
        case 'View All Employees':
          viewAllEmployees()
          break;
        case 'Add Employee':
          addEmployee()
          break;
        case 'View All Roles':
          viewAllRoles()
          break;
        case 'Add Role':
          addRole()
          break;
        case 'Update Employee Role':
          updateEmployeeRole()
          break;
        case 'View All Departments':
          viewAllDepartments()
          break;
        case 'Add Department':
          addDepartment()
          break;
        default:
          console.log('Something went wrong!')
          break;
      }

    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
}

// function to add department
function addDepartment() {
  inquirer.prompt(
    [
      {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department you want to add?'
      }
    ]
  )
    .then((answers) => {
      console.log('Department added!')
      //variable takes deparntment name from user answer and inserts it into table
      let departmentName = answers.departmentName;
      db.query(`INSERT INTO department (name) VALUES ('${departmentName}')`, function (err, results) {
        // inserts name user entered into department table under key name
        (err) ? console.log(err) : console.table(`Added: ${departmentName}`), viewAllDepartments(), promptUser()
      })
    })
}


function addRole() {
  db.query('SELECT * FROM department', function (err, results) {
    if (err) {
      console.log(err)
      return promptUser()
    }
    const existDepart = results.map(deptarment => ({
      value: deptarment.id,
      name: deptarment.name}))
    inquirer.prompt(
      [
        {
          type: 'input',
          name: 'title',
          message: 'Whats the title of the role?'
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Whats the salary for this role?'
        }
      ,
      {
        type: 'list',
        name: 'department',
        message: 'What department does this belong to?',
        choices: existDepart
      }
      ]
    ).then((answers) => {
      console.log('Role added!' + answers.department)
      let title = answers.title; let salary = answers.salary; let department = answers.department
      db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${title}', '${salary}', '${department}')`, function (err, results) {
        (err) ? console.log(err) : console.table(`Added: ${title}`), viewAllRoles(), promptUser()
      })
    })
  })
}

function addEmployee() {
  db.query('SELECT * FROM roles', function (err, results) {
    if (err) {
      console.log(err)
      return promptUser()
    }
    const existRole = results.map(role => ({
      value: role.id,
      name: role.title
    }))
    inquirer.prompt(
      [
        {
          type: 'input',
          name: 'firstName',
          message: 'Whats the persons first name?'
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'Whats the persons last name?'
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'What role would you like?',
          choices: existRole
        }
      ]
    ).then((choiceResponse) => {
      console.log('Employee added!' + choiceResponse.roleId)
      let roleId = choiceResponse.roleId; let employeeName = choiceResponse.firstName; let employeeLast = choiceResponse.lastName
      db.query(`INSERT INTO employees (first_name, last_name, role_id) VALUES ('${employeeName}', '${employeeLast}', ${roleId})`, function (err, results) {
        (err) ? console.log(err) : console.table(`Added: ${employeeName}`), viewAllEmployees(), promptUser()
      })
    })
  })
}


function updateEmployeeRole() {
  db.query('SELECT * FROM employees', function (err, employees) {
    if (err) {
      console.log(err);
      return promptUser();
    }

    const existEmployees = employees.map(employee => ({
      value: employee.id,
      name: `${employee.first_name} ${employee.last_name}`
    }));

    db.query('SELECT * FROM roles', function (err, roles) {
      if (err) {
        console.log(err);
        return promptUser();
      }

      const existRoles = roles.map(role => ({
        value: role.id,
        name: role.title
      }));

      inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Which employee do you want to update?',
          choices: existEmployees
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'What is the new role for the employee?',
          choices: existRoles
        }
      ]).then((answers) => {
        console.log('Employee role updated!');
        let employeeId = answers.employeeId;
        let roleId = answers.roleId;

        db.query(
          `UPDATE employees SET role_id = ${roleId} WHERE id = ${employeeId}`,function (err, results) {
            if (err) {
              console.log(err);
            } else {
              console.log(`Updated employee's role.`);
              viewAllEmployees();
            }
            promptUser();
          }
        );
      });
    });
  });
}

function promptUser() {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'options',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
      }
    ])
    .then((answers) => {
      switch (choice) {
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
      }
    })
    .catch((error) => {
    });
}

// shows all employees
function viewAllEmployees() {
  db.query('SELECT * FROM employees', function (err, results) {
    (err) ? console.log(err) : console.table(results), promptUser()
  })
}
// shows all roles
function viewAllRoles() {
  db.query('SELECT * FROM roles', function (err, results) {
    (err) ? console.log(err) : console.table(results), promptUser()
  })
}
// shows all departments
function viewAllDepartments() {
  db.query('SELECT * FROM department', function (err, results) {
    (err) ? console.log(err) : console.table(results), promptUser()
  })
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

promptUser()