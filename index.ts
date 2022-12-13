import { TodoItem } from "./script";
import { TodoCollection } from "./TodoCollection";
// import * as inquirer from "inquirer";
import inquirer from "inquirer";
import { JsonTodoCollection } from "./jsonTodoCollection";

let todos: TodoItem[] = [
  new TodoItem(1, "Buy Flowers"),
  new TodoItem(2, "Get Shoes"),
  new TodoItem(3, "Collect Tickets"),
  new TodoItem(4, "Call Joe", true),
  new TodoItem(5, "Todo List", false),
];
// let collection: TodoCollection = new TodoCollection(todos);
let collection: TodoCollection = new JsonTodoCollection("Adam", todos);
console.log(collection, "s Todo List");
let showCompleted = true;

function displayTodoList(): void {
  console.log(
    collection,
    "s Todo List " + `(${collection.getItemCounts().incomplete}items to do)`
  );
  collection.getTodoItems(showCompleted).forEach((item) => item.printDetails());
  collection.getTodoItems(true).forEach((item) => item.printDetails());
}
enum Commands {
  Add = "Add New Task",
  Complete = "Complete Task",
  Toggle = "Show/Hide Completed",
  Purge = "Remove Completed Tasks",
  Quit = "Quit",
}

function promptAdd(): void {
  console.clear();
  inquirer
    .prompt({ type: "input", name: "add", message: "Enter task:" })
    .then((answers) => {
      if (answers["add"] !== "") {
        collection.addTodo(answers["add"]);
      }
      promptUser();
    });
}

function promptComplete(): void {
  console.clear();
  inquirer
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
      let completedTasks = answers["complete"] as number[];
      collection
        .getTodoItems(true)
        .forEach((item) =>
          collection.markComplete(
            item.id,
            completedTasks.find((id) => id === item.id) != undefined
          )
        );
      promptUser();
    });
}

function promptUser(): void {
  console.clear();
  displayTodoList();
  inquirer
    .prompt({
      type: "list",
      name: "command",
      message: "Choose option",
      choices: Object.values(Commands),
      //   badProperty: true
    })
    .then((answers: any) => {
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
          } else {
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

//Working Code After showCompleted Variable
// let collection: TodoCollection = new TodoCollection();

// let newId = collection.addTodo("Muzammil Rajaa");
// let todoItem = collection.getTodoById(newId);
// console.log(
//   collection,
//   "s Todo List" +
//     `(${collection.getItemCounts().incomplete}
// items to do)`
// );
// collection.getTodoItems(true).forEach((item) => item.printDetails());
// console.log(JSON.stringify(todoItem)), "Items";
