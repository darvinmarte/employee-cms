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
        case 'View All Departments':
          viewAllDepartments()
          break;
        default:
          console.log('broken')
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
        },
      ]
    ).then((choiceResponse) => {
      console.log('Employee added!' + choiceResponse.roleId)
      let roleId = choiceResponse.roleId; let employeeName = choiceResponse.firstName; let employeeLast = choiceResponse.lastName
      db.query(`INSERT INTO employees (first_name, last_name, role_id) VALUES ('${employeeName}', '${employeeLast}', ${roleId})`, function (err, results) {
        (err) ? console.log(err) : console.table(`Added: ${employeeName}`),viewAllEmployees(), promptUser()
      })
    })
  })
}

function viewAllEmployees() {
  db.query('SELECT * FROM employees', function (err, results) {
    (err) ? console.log(err) : console.table(results), promptUser()
  })
}

function viewAllRoles() {
  db.query('SELECT * FROM roles', function (err, results) {
    (err) ? console.log(err) : console.table(results), promptUser()
  })
}

function viewAllDepartments() {
  db.query('SELECT * FROM department', function (err, results) {
    (err) ? console.log(err) : console.table(results), promptUser()
  })
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

promptUser()