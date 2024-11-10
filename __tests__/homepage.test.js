/**
 * @jest-environment jsdom
 */
const { saveTasks, renderTasks } = require("../homepage"); // Import the functions

describe("Task Management App", () => {
  let tasks;
  let taskInput,
    taskDateInput,
    taskTimeInput,
    taskList,
    addButton,
    clearCompletedButton;

  beforeEach(() => {
    // Set up the DOM
    document.body.innerHTML = `
      <input id="taskInput" />
      <input id="taskDateInput" />
      <input id="taskTimeInput" />
      <ul id="taskList"></ul>
      <button id="addButton"></button>
      <button id="clearCompletedButton"></button>
    `;

    taskInput = document.getElementById("taskInput");
    taskDateInput = document.getElementById("taskDateInput");
    taskTimeInput = document.getElementById("taskTimeInput");
    taskList = document.getElementById("taskList");
    addButton = document.getElementById("addButton");
    clearCompletedButton = document.getElementById("clearCompletedButton");

    tasks = [];
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    tasks = [];
    localStorage.clear();
  });

  test("should add a new task", () => {
    taskInput.value = "Test Task";
    taskDateInput.value = "2024-11-11";
    taskTimeInput.value = "10:00";

    addButton.click();

    expect(JSON.parse(localStorage.getItem("tasks"))).toEqual([
      {
        text: "Test Task",
        date: "2024-11-11",
        time: "10:00",
        completed: false,
      },
    ]);
    expect(taskInput.value).toBe("");
    expect(taskDateInput.value).toBe("");
    expect(taskTimeInput.value).toBe("");
  });

  test("should clear completed tasks", () => {
    tasks.push(
      { text: "Task 1", date: "2024-11-11", time: "09:00", completed: true },
      { text: "Task 2", date: "2024-11-11", time: "10:00", completed: false }
    );
    localStorage.setItem("tasks", JSON.stringify(tasks));

    clearCompletedButton.click();

    expect(JSON.parse(localStorage.getItem("tasks"))).toEqual([
      { text: "Task 2", date: "2024-11-11", time: "10:00", completed: false },
    ]);
  });

  test("should render tasks correctly", () => {
    tasks.push(
      { text: "Task 1", date: "2024-11-11", time: "09:00", completed: false },
      { text: "Task 2", date: "2024-11-11", time: "10:00", completed: true }
    );
    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();

    expect(taskList.children.length).toBe(2);
    expect(taskList.children[0].textContent).toContain("Task 1");
    expect(taskList.children[1].textContent).toContain("Task 2");
    expect(taskList.children[1].querySelector(".text").classList).toContain(
      "completed"
    );
  });
});
