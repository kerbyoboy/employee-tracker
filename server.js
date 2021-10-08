const connection = require('./db/connection.js');
const inquirer = require('inquirer');
const cTable = require('console.table');
const dbUtil = require('./db/util.js');
const dbQuery = require('./db/util.js');
const figlet = require('figlet');
const chalk = require('chalk');

    console.log(chalk.blueBright.bold(figlet.textSync('Employee Manager')));
    console.log(``);
       
    init();
function init() {
    inquirer.prompt({
            type: "list",
            choices: [
                "Add Department",
                "Add Roles",
                "Add Employees",
                "View Departments",
                "View Roles",
                "View Employees",
                "Update Employee Role",
                "Remove Employee",
                "Would you like to exit?",
            ],
            message: "What would you like to do?",
            name: "option",
        })
        .then((answer) => {
            console.log(answer);
            switch (answer.option) {
                case "View Employees":
                    return viewEmployees();
                case "View Roles":
                    return viewRoles();
                case "View Departments":
                    return viewDepartments();
                case "Add Employees":
                    return addEmployee();
                case "Add Roles":
                    return addRole();
                case "Add Department":
                    return addDepartment();
                case "Update Employee Role":
                    return updateEmployee();
                case "Remove Employee":
                    return removeEmployee();
                case "Would you like to exit?":
                    return quit();
            }
        });
}

async function viewEmployees() {
    const employees = await dbQuery.getAllEmployees();
    console.table(employees);
    init();
}
async function viewRoles() {
    const role = await dbQuery.viewRoles();
    console.table(role);
    init();
}
async function viewDepartments() {
    const departments = await dbQuery.viewDepartments();
    console.table(departments);
    init();
}
async function addDepartment() {
    const department = await inquirer.prompt({
        type: "input",
        message: "Department name:",
        name: "name",
    });
    console.log(department);
    await dbQuery.createDepartment(department);
    init();
}
async function addEmployee() {
    const roleOptions = await dbUtil.viewRoles();
    const managerOptions = await dbUtil.getAllEmployees();

    const employeeToAdd = await inquirer.prompt([
        {
            type: "input",
            message: "Employee first name:",
            name: "first_name",
        },
        {
            type: "input",
            message: "Employee last name:",
            name: "last_name",
        },
    ]);

    var roleChoicesList = roleOptions.map(({ id, title }) => ({ name: title, value: id }));
    //console.log("role choicesList", roleOptions)

    const { roleId } = await inquirer.prompt({
        type: "list",
        name: "roleId",
        message: "Employee role:",
        choices: roleChoicesList,
    });

    const managerChoicesList = managerOptions.map(({ first_name, last_name, id }) => ({ name: first_name + last_name, value: id }));
    if (managerChoicesList && managerChoicesList.length > 0) {
        const { managerId } = await inquirer.prompt({

            type: "list",
            name: "managerId",
            message: "Employee's manager:",
            choices: managerChoicesList,

        });
        employeeToAdd.manager_id = managerId;
    }

    employeeToAdd.role_id = roleId;
    
    await dbUtil.addEmployee(employeeToAdd);

    init();
}
async function addRole() {
    console.log("hello")
    const departments = await dbQuery.viewDepartments();
        console.log(departments)
    const departmentsList = departments.map(({ id, name }) => ({ name: name, value: id }));
        console.log(departmentsList)
    const roleToAdd = await inquirer.prompt([
        {
            type: "input",
            message: "Role name:",
            name: "title",
        },
        {
            type: "list",
            message: "Department id number:",
            name: "department_id",
            choices: departmentsList,
        },
    ]);

    await dbQuery.addRole(roleToAdd);
    init();
}
async function updateEmployee() {
    const employeeOptions = await dbUtil.getAllEmployees();

    const roleOptions = await dbUtil.viewRoles();
    console.log(roleOptions);

    const employeeOptionsToChooseFrom = employeeOptions.map(({ id, first_name, last_name }) => ({
        name: first_name + last_name,
        value: id,
    }));

    const roleOptionsToChooseFrom = roleOptions.map(({ id, title }) => ({
        name: title,
        value: id,
    }));

    const { employeeId } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Employee requiring role change:",
            choices: employeeOptionsToChooseFrom,
        },
    ]);

    const { roleId } = await inquirer.prompt([
        {
            type: "list",
            name: "roleId",
            message: "Employee's new role:",
            choices: roleOptionsToChooseFrom,
        },
    ]);

    await dbUtil.updateEmployeeRole(employeeId, roleId);
    init();
}
async function deleteEmployee() {
    const employeeOptions = await dbUtil.getAllEmployees();

    const employeeOptionsToChooseFrom = employeeOptions.map(({ id, first_name, last_name }) => ({
        name: first_name + last_name,
        value: id,
    }));

    const { employeeId } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Employee to delete:",
            choices: employeeOptionsToChooseFrom,
        },
    ]);
    await dbUtil.removeEmployee(employeeId);
    init();
}

async function deleteRole() {
    const roleOptions = await dbUtil.viewRoles();

    const roleOptionsToChooseFrom = roleOptions.map(({ id, title }) => ({
        name: title,
        value: id,
    }));

    const { roleId } = await inquirer.prompt([
        {
            type: "list",
            name: "roleId",
            message: "Role to delete:",
            choices: roleOptionsToChooseFrom,
        },
    ]);

    await dbUtil.removeRole(roleId);
    init();
}

async function deleteDepartment() {
    const departmentOptions = await dbUtil.viewDepartments();

    const departmentOptionsToChooseFrom = departmentOptions.map(({ id, name }) => ({ name: name, value: id }));

    const { departmentId } = await inquirer.prompt({
        type: "list",
        name: "departmentId",
        message: "Department to delete:",
        choices: departmentOptionsToChooseFrom,
    });
    await dbUtil.removeDepartment(departmentId);
    init();
}
function quit() {
    process.exit();
}