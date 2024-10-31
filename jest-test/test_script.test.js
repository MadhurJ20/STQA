/**
 * @jest-environment jsdom
 */
import {
  loadTasks,
  addTaskToDOM,
  saveTaskToLocalStorage,
  removeTaskFromLocalStorage,
  setupEventListeners,
} from "./script";

describe("To-Do List Functions", () => {
  beforeEach(() => {
    // Clear local storage before each test
    localStorage.clear();

    // Set up the DOM elements needed for the tests
    document.body.innerHTML = `
            <input id="task-input" type="text" />
            <button id="add-task">Add Task</button>
            <ul id="task-list"></ul>
        `;

    // Call the function to set up event listeners
    setupEventListeners();
  });

  test("addTaskToDOM adds a task to the DOM", () => {
    addTaskToDOM("Test Task");
    const taskList = document.getElementById("task-list");
    expect(taskList.children.length).toBe(1);
    expect(taskList.children[0].textContent).toBe("Test TaskDelete");
  });

  test("saveTaskToLocalStorage saves a task", () => {
    saveTaskToLocalStorage("Test Task");
    expect(localStorage.getItem("tasks")).toBe(JSON.stringify(["Test Task"]));
  });

  test("removeTaskFromLocalStorage removes a task", () => {
    localStorage.setItem("tasks", JSON.stringify(["Task 1", "Task 2"]));
    removeTaskFromLocalStorage("Task 1");
    expect(localStorage.getItem("tasks")).toBe(JSON.stringify(["Task 2"]));
  });

  test("loadTasks loads tasks from local storage", () => {
    localStorage.setItem("tasks", JSON.stringify(["Task 1", "Task 2"]));
    loadTasks();
    const taskList = document.getElementById("task-list");
    expect(taskList.children.length).toBe(2);
    expect(taskList.children[0].textContent).toBe("Task 1Delete");
    expect(taskList.children[1].textContent).toBe("Task 2Delete");
  });

  test("add-task button triggers adding a task", () => {
    const input = document.getElementById("task-input");
    input.value = "New Task";

    // Simulate button click
    document.getElementById("add-task").onclick();

    const taskList = document.getElementById("task-list");
    expect(taskList.children.length).toBe(1);
    expect(taskList.children[0].textContent).toBe("New TaskDelete");
  });
});
