// dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

// establishing connection to mySql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "company_db"
});

// confirming that we have connected 
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    go()
});

// first prompt to pop, user chooses from list what to do
function runSearch() {
    inquirer
        .prompt({
            name: "choose",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "view employees",
                "view departments",
                "view roles",
                "add department",
                "add role",
                "add employee",
                "update employee role",
            ]
        })
        // depending on what is chosen, will determine what function is run
        .then(function (answer) {
            switch (answer.choose) {
                case "view employees":
                    allEmp();
                    break;

                case "view departments":
                    allDept();
                    break;

                case "view roles":
                    allRoles();
                    break;

                case "add department":
                    addDept();
                    break;

                case "add role":
                    addRole();
                    break;

                case "add employee":
                    addEmployee();
                    break;

                case "update employee role":
                    updateEmployeeRole();
                    break;
            }
        });
}

function go() {
    runSearch()
}

// if user wants to view a chart of all employees
function allEmp() {
    var getAll = "SELECT * FROM employee"
    connection.query(getAll, function (err, res) {
        if (err) throw err;
        console.table(res)
        runSearch()
    });
};

// if user wants to see a chart of all departments
function allDept() {
    var getAll = "SELECT * FROM department"
    connection.query(getAll, function (err, res) {
        if (err) throw err;
        console.table(res)
        runSearch()
    });
};

// if user wants to see a chart of all the roles
function allRoles() {
    var getAll = "SELECT * FROM role"
    connection.query(getAll, function (err, res) {
        if (err) throw err;
        console.table(res)
        runSearch()
    });
};

// if user wants to add a department
function addDept() {

    inquirer
        // will ask user for the name of the department
        .prompt({
            name: "addDept",
            type: "input",
            message: "What department would you like to add?",
        })
        // then it will insert that back into the database using users response
        .then(function (answer) {
            var setDept = "INSERT INTO department SET ?"
            connection.query(setDept, {
                name: answer.addDept
            },
                function (err, res) {
                    if (err) throw err;
                    console.log("Your department has been succesfully added")
                    runSearch()
                });
            go()
        });

};

// if user wants to add role 
function addRole() {
    // prompt for info about the item being put up for auction
    inquirer
        // will ask user for the name, salary, and department of that role
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the role you would like to submit?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of this position?"
            },
            {
                name: "department",
                type: "input",
                message: "what is the department?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        // then it will insert that information back into database
        .then(function (answer) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department,
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your role was created successfully!");
                    runSearch()
                }
            );
        });
}

// if user wants to add employee
function addEmployee() {
    // prompt for info about the employee
    inquirer
        .prompt([
            {
                name: "first",
                type: "input",
                message: "What is the first name of this employee?"
            },
            {
                name: "last",
                type: "input",
                message: "What is the last name of this employee?"
            },
            {
                name: "roleID",
                type: "input",
                message: "What is the role ID of this employee?"
            },
            {
                name: "managerID",
                type: "input",
                message: "What is the manager id of this employee?"
            },
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.first,
                    last_name: answer.last,
                    role_id: answer.roleID,
                    manager_id: answer.managerID
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your employee was created successfully!");
                    // re-prompt the user for if they want to bid or post
                    runSearch()
                }
            );
        });
};

// if user wants to update the role of an employee
function updateEmployeeRole() {
    // query the database for all employees
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        // once you have the employees, prompt the user for which they'd like to update
        inquirer
            .prompt([
                {
                    //   shows all employees for user to choose from
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name);
                        }
                        return choiceArray;
                    },
                    message: "What employee would you like to update?"
                },
                {
                    name: "newRoleID",
                    type: "input",
                    message: "what is the new role id?"
                }
            ])
            .then(function (answer) {
                // get the information of the chosen employee
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].first_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }

                // take the info and push into database
                connection.query(
                    "UPDATE employee SET ? WHERE ?",
                    [
                        {
                            role_id: answer.newRoleID
                        },
                        {
                            id: chosenItem.id
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("employee succesfully updated!");
                        runSearch()
                    }
                );
            }
            );
    });
}