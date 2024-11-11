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

  test("add-task button does not add a task if input is empty", () => {
    const input = document.getElementById("task-input");
    input.value = "";

    // Simulate button click
    document.getElementById("add-task").onclick();

    const taskList = document.getElementById("task-list");
    expect(taskList.children.length).toBe(0);
  });

  test("removeTaskFromLocalStorage does nothing if task is not found", () => {
    localStorage.setItem("tasks", JSON.stringify(["Task 1", "Task 2"]));
    removeTaskFromLocalStorage("Nonexistent Task");
    expect(localStorage.getItem("tasks")).toBe(
      JSON.stringify(["Task 1", "Task 2"])
    );
  });

  test("loadTasks handles empty local storage gracefully", () => {
    localStorage.setItem("tasks", JSON.stringify([]));
    loadTasks();
    const taskList = document.getElementById("task-list");
    expect(taskList.children.length).toBe(0);
  });

  test("integration: adding and removing tasks updates local storage and DOM", () => {
    const input = document.getElementById("task-input");
    const addButton = document.getElementById("add-task");
    input.value = "Task 1";
    addButton.onclick();

    input.value = "Task 2";
    addButton.onclick();

    // Verify tasks added
    const taskList = document.getElementById("task-list");
    expect(taskList.children.length).toBe(2);
    expect(localStorage.getItem("tasks")).toBe(
      JSON.stringify(["Task 1", "Task 2"])
    );

    // Remove a task
    const deleteButton = taskList.children[0].querySelector("button");
    deleteButton.onclick();

    // Verify tasks updated
    expect(taskList.children.length).toBe(1);
    expect(taskList.children[0].textContent).toBe("Task 2Delete");
    expect(localStorage.getItem("tasks")).toBe(JSON.stringify(["Task 2"]));
  });

  test("add-task button does not add task if input is empty", () => {
    const addButton = document.getElementById("add-task");
    addButton.onclick();

    const taskList = document.getElementById("task-list");
    expect(taskList.children.length).toBe(0);
    expect(localStorage.getItem("tasks")).toBeNull();
  });

  test("loadTasks restores DOM state after multiple operations", () => {
    localStorage.setItem(
      "tasks",
      JSON.stringify(["Task 1", "Task 2", "Task 3"])
    );
    loadTasks();

    const taskList = document.getElementById("task-list");
    expect(taskList.children.length).toBe(3);
    expect(taskList.children[0].textContent).toBe("Task 1Delete");
    expect(taskList.children[1].textContent).toBe("Task 2Delete");
    expect(taskList.children[2].textContent).toBe("Task 3Delete");
  });

  test("setupEventListeners binds events correctly", () => {
    const input = document.getElementById("task-input");
    const addButton = document.getElementById("add-task");
    input.value = "Event Test Task";
    addButton.onclick();

    const taskList = document.getElementById("task-list");
    expect(taskList.children.length).toBe(1);
    expect(taskList.children[0].textContent).toBe("Event Test TaskDelete");
  });
});
