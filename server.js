const express = require('express')
// Import and require mysql2
const mysql = require('mysql2')
const inquirer = require('inquirer')
const PORT = process.env.PORT || 3000;
const app = express();

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

inquirer
  .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'options',
      choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department' ]
    },
    {
      type: 'list',
      message: '',
      name: '',
      choices: ['']
    },
  ])
  .then((answers) => { console.log(answers)
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});