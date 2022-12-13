"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const script_1 = require("./script");
// import * as inquirer from "inquirer";
const inquirer_1 = __importDefault(require("inquirer"));
const jsonTodoCollection_1 = require("./jsonTodoCollection");
let todos = [
    new script_1.TodoItem(1, "Buy Flowers"),
    new script_1.TodoItem(2, "Get Shoes"),
    new script_1.TodoItem(3, "Collect Tickets"),
    new script_1.TodoItem(4, "Call Joe", true),
    new script_1.TodoItem(5, "Todo List", false),
];
// let collection: TodoCollection = new TodoCollection(todos);
let collection = new jsonTodoCollection_1.JsonTodoCollection("Adam", todos);
console.log(collection, "s Todo List");
let showCompleted = true;
function displayTodoList() {
    console.log(collection, "s Todo List " + `(${collection.getItemCounts().incomplete}items to do)`);
    collection.getTodoItems(showCompleted).forEach((item) => item.printDetails());
    collection.getTodoItems(true).forEach((item) => item.printDetails());
}
var Commands;
(function (Commands) {
    Commands["Add"] = "Add New Task";
    Commands["Complete"] = "Complete Task";
    Commands["Toggle"] = "Show/Hide Completed";
    Commands["Purge"] = "Remove Completed Tasks";
    Commands["Quit"] = "Quit";
})(Commands || (Commands = {}));
function promptAdd() {
    console.clear();
    inquirer_1.default
        .prompt({ type: "input", name: "add", message: "Enter task:" })
        .then((answers) => {
        if (answers["add"] !== "") {
            collection.addTodo(answers["add"]);
        }
        promptUser();
    });
}
function promptComplete() {
    console.clear();
    inquirer_1.default
        .prompt({
        type: "checkbox",
        name: "complete",
        message: "Mark Tasks Complete",
        choices: collection.getTodoItems(showCompleted).map((item) => ({
            name: item.task,
            value: item.id,
            checked: item.complete,
        })),
    })
        .then((answers) => {
        let completedTasks = answers["complete"];
        collection
            .getTodoItems(true)
            .forEach((item) => collection.markComplete(item.id, completedTasks.find((id) => id === item.id) != undefined));
        promptUser();
    });
}
function promptUser() {
    console.clear();
    displayTodoList();
    inquirer_1.default
        .prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Commands),
        //   badProperty: true
    })
        .then((answers) => {
        switch (answers["command"]) {
            case Commands.Toggle:
                showCompleted = !showCompleted;
                promptUser();
                break;
            case Commands.Add:
                promptAdd();
                break;
            case Commands.Complete:
                if (collection.getItemCounts().incomplete > 0) {
                    promptComplete();
                }
                else {
                    promptUser();
                }
                break;
            case Commands.Purge:
                collection.removeComplete();
                promptUser();
                break;
        }
    });
}
promptUser();