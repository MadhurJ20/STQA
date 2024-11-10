/**
 * @jest-environment jsdom
 */
const { renderTasks, saveTasks } = require("../homepage"); // Exported from homepage.js
const { scheduleNotification, renderNotifications } = require("../notif"); // Exported from notif.js

describe("Integration Tests for Task and Notification Management", () => {
  let taskInput,
    taskDateInput,
    taskTimeInput,
    taskList,
    addButton,
    notificationList;

  beforeEach(() => {
    // Set up the DOM
    document.body.innerHTML = `
      <input id="taskInput" />
      <input id="taskDateInput" />
      <input id="taskTimeInput" />
      <ul id="taskList"></ul>
      <button id="addButton"></button>
      <div id="notificationList"></div>
    `;

    taskInput = document.getElementById("taskInput");
    taskDateInput = document.getElementById("taskDateInput");
    taskTimeInput = document.getElementById("taskTimeInput");
    taskList = document.getElementById("taskList");
    addButton = document.getElementById("addButton");
    notificationList = document.getElementById("notificationList");

    localStorage.clear(); // Clear any previous localStorage
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("should add a task and render it", () => {
    // Simulate adding a task
    taskInput.value = "Test Task";
    taskDateInput.value = "2024-11-12";
    taskTimeInput.value = "15:00";

    addButton.click(); // Trigger the event listener in homepage.js

    // Verify the task is stored in localStorage
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    expect(storedTasks).toHaveLength(1);
    expect(storedTasks[0]).toEqual({
      text: "Test Task",
      date: "2024-11-12",
      time: "15:00",
      completed: false,
    });

    // Verify the task is rendered
    expect(taskList.children).toHaveLength(1);
    expect(taskList.children[0].textContent).toContain("Test Task");
  });

  test("should schedule a notification for a task", () => {
    // Simulate adding a task
    const task = {
      text: "Test Task",
      date: "2024-11-12",
      time: "15:00",
      completed: false,
    };
    localStorage.setItem("tasks", JSON.stringify([task]));
    renderTasks(); // Render the tasks

    // Mock the Notification API
    global.Notification = jest.fn().mockImplementation(() => ({
      permission: "granted",
    }));

    const scheduleButton = taskList.querySelector("button");
    scheduleButton.click(); // Trigger the notification scheduling

    // Verify the notification is stored in localStorage
    const storedNotifications = JSON.parse(
      localStorage.getItem("notifications")
    );
    expect(storedNotifications).toHaveLength(1);
    expect(storedNotifications[0]).toEqual(
      expect.objectContaining({
        title: "Test Task",
        body: "Reminder: Test Task is due!",
      })
    );

    // Verify the notification is rendered
    renderNotifications(); // Render notifications
    expect(notificationList.children).toHaveLength(1);
    expect(notificationList.children[0].textContent).toContain("Test Task");
  });

  test("should delete a notification", () => {
    const notification = {
      title: "Test Task",
      body: "Reminder: Test Task is due!",
      time: Date.now() + 60000,
    };
    localStorage.setItem("notifications", JSON.stringify([notification]));
    renderNotifications(); // Render notifications

    // Verify notification is initially rendered
    expect(notificationList.children).toHaveLength(1);

    // Simulate deleting the notification
    const deleteButton = notificationList.querySelector("button");
    deleteButton.click();

    // Verify the notification is removed from localStorage
    const storedNotifications = JSON.parse(
      localStorage.getItem("notifications")
    );
    expect(storedNotifications).toHaveLength(0);

    // Verify the notification is removed from the DOM
    expect(notificationList.children).toHaveLength(0);
  });

  test("should handle past-due notification scheduling gracefully", () => {
    // Add a task with a past date
    const task = {
      text: "Old Task",
      date: "2023-01-01",
      time: "10:00",
      completed: false,
    };
    localStorage.setItem("tasks", JSON.stringify([task]));
    renderTasks();

    // Mock the global alert function
    global.alert = jest.fn();

    // Attempt to schedule the notification
    const scheduleButton = taskList.querySelector("button");
    scheduleButton.click();

    // Verify alert was called
    expect(global.alert).toHaveBeenCalledWith(
      "Please select a future time for the notification."
    );
  });
});
