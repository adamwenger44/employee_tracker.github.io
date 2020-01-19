// dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

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

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    go()
});


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
                "update employee role"

            ]
        })
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


function allEmp() {
    var getAll = "SELECT * FROM employee"
    connection.query(getAll, function (err, res) {
        if (err) throw err;
        console.table(res)
go()
    });
};

function allDept() {
    var getAll = "SELECT * FROM department"
    connection.query(getAll, function (err, res) {
        if (err) throw err;
        console.table(res)
go()
    });
};

function allRoles() {
    var getAll = "SELECT * FROM role"
    connection.query(getAll, function (err, res) {
        if (err) throw err;
        console.table(res)
go()
    });
};


