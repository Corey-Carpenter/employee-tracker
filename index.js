const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    },
);

async function queryRoles () {
    return new Promise((resolve, reject) => {
        connection.query(sql, parameters, function (err, results) {
            if (err) return reject(err);
            resolve(results);
        })
    })
}


function init() {
    inquirer.createPromptModule(
        {
            name: "initialQuestion",
            type: "list",
            message: "What do you want to do",
            choices: [
                "view all departments",
                "viwe all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee role",
                "EXIT",
            ],
        }
    ).then((answers) => {
        switch (answers.initialQuestion) {
            case "view all departments":
                viewAllDepartments();
                break;
            case "viwe all roles":
                viewAllRoles();
                break;
            case "view all employees":
                viewAllEmployees();
                break;
            case "add a department":
                addDepartment();
                break;
            case "add a role":
                addRole();
                break;
            case "add an employee":
                addEmployee();
                break;
            case "update an employee role":
                updateEmployeeRole();
                break;
            case "EXIT":
                db.end();
                break;
            default:
                break;
        }
    });
}


function viewAllDepartments() {

}

function viewAllRoles() {

}

function viewAllEmployees() {

}

function addDepartment() {

}

function addRole() {

}

function addEmployee() {

}

function updateEmployeeRole() {

}


init();