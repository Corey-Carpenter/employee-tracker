const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Corey444$$',
        database: 'employees_db'
    },
);

async function queryRoles() {
    return new Promise((resolve, reject) => {
        db.query("select * from role", function (err, results) {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

async function queryEmployees() {
    return new Promise((resolve, reject) => {
        db.query("select * from employee", function (err, results) {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

async function queryDepartments() {
    return new Promise((resolve, reject) => {
        db.query("select * from department", function (err, results) {
            if (err) return reject(err);
            resolve(results);
        });
    });
}


function init() {
    inquirer
      .prompt({
            name: "initialQuestion",
            type: "list",
            message: "What do you want to do",
            choices: [
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee role",
                "EXIT",
            ],
        })
      .then((answers) => {
        switch (answers.initialQuestion) {
            case "view all departments":
                viewAllDepartments();
                break;
            case "view all roles":
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
    db.query("select * from department", function (err, res) {
        console.log("Viewing all departments");
        console.table(res);
        init();
    });
}

function viewAllRoles() {
    db.query("select * from role", function (err, res) {
        console.log("Viewing all roles");
        console.table(res);
        init();
    });
}

function viewAllEmployees() {
    db.query("select e1.first_name, e1.last_name, CONCAT(e2.first_name, ' ', e2.last_name) AS manager from employee e1 INNER JOIN employee e2 ON e1.manager_id = e2.id", function (err, res) {
        console.log("Viewing all employees");
        console.table(res);
        init();
    });
}

function addDepartment() {
    //ask user for department name
    inquirer.prompt({
        type: "input",
        name: "deptName",
        message: "What's the department name?"
    }).then((answer) => {
        console.log(answer.deptName);
        db.query("INSERT INTO department SET ?",
            { name: answer.deptName },
            async function (err) {
                if (err) throw err;
                const departments = await queryDepartments();
                console.table(departments);
                init();
            }
        )
    })
}

async function addRole() {
    const departments = await queryDepartments();
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the title of the role?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary of this role?",
            validate: (value) => {
                if (isNaN(value)) {
                    return "Please enter a valid number.";
                }
                return true;
            },
        },
        {
            name: "department",
            type: "list",
            message: "Select the department for this role:",
            choices: departments.map((dept) => ({ name: dept.name, value: dept.id })),
        },
    ]).then((answers) => {
        db.query(
            "INSERT INTO role SET ?",
            {
                title: answers.title,
                salary: parseFloat(answers.salary),
                department_id: answers.department,
            },
            async function (err) {
                if (err) throw err;
                const roles = await queryRoles();
                console.log("New role added successfully.");
                console.table(roles);
                init();
            }
        );
    });
    }


async function addEmployee() {
    const roles = await queryRoles()
    console.log(roles);
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What's your first name?"
        },
        {
            name: "lastName",
            type: "input",
            message: "What's your last name?"
        },
        {
            name: "roleId",
            type: "list",
            message: "What's the role?",
            choices: roles.map((role) => ({ name: role.title, value: role.id }))
        },
        {
            name: "managerId",
            type: "input",
            message: "What's the manager id?"
        }
    ]).then((answers) => {
        db.query(
            "INSERT INTO employee SET ?",
            {
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: answers.roleId,
                manager_id: answers.managerId,
            },
            function (err) {
                if (err) throw err;
                init();
            }
        )
    })
}



async function updateEmployeeRole() {
    const roles = await queryRoles();
    const employees = await queryEmployees();

    inquirer.prompt([
        {
            name: "employeeToUpdate",
            message: "Which employee would you like to update?",
            type: "list",
            choices: employees.map((employee) => ({name: employee.first_name + " " + employee.last_name, value: employee.id}))
        },
        {
            name: "roleId",
            type: "list",
            message: "What's the updated role?",
            choices: roles.map((role) => ({ name: role.title, value: role.id }))
        }
    ]).then((answers) => {
        db.query(
            "UPDATE employee SET ? WHERE ?",
            [
                {
                    role_id: answers.roleId,
                },
                {
                    id: answers.employeeToUpdate,
                },
            ],

            function (err) {
                if (err) throw err;
                init();
            }
        );
    });
}


init();
