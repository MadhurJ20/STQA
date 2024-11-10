document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.getElementById("taskList");
  const notificationList = document.getElementById("notificationList");
  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];

  // Load tasks from local storage
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks();

  // Render tasks
  function renderTasks() {
    taskList.innerHTML = ""; // Clear previous tasks
    tasks.forEach((task, index) => {
      const div = document.createElement("div");
      div.className = "task";
      div.innerHTML = `
                <div>
                    <strong>${task.text}</strong><br>
                    <small>Due: ${task.date} at ${task.time}</small>
                </div>
                <button onclick="scheduleNotification(${index})">Notify Me</button>
            `;
      taskList.appendChild(div);
    });
  }

  // Schedule a notification for a task
  window.scheduleNotification = (index) => {
    const task = tasks[index];
    const notificationTime = new Date(`${task.date}T${task.time}`).getTime();

    if (notificationTime > Date.now()) {
      const notification = {
        title: task.text,
        body: `Reminder: ${task.text} is due!`,
        time: notificationTime,
      };
      notifications.push(notification);
      saveNotifications();
      renderNotifications();
      scheduleTaskNotification(notification);
    } else {
      alert("Please select a future time for the notification.");
    }
  };

  function renderNotifications() {
    notificationList.innerHTML = ""; // Clear previous notifications
    notifications.forEach((notification, index) => {
      const div = document.createElement("div");
      div.className = "notification";
      div.innerHTML = `
                <div>
                    <strong>${notification.title}</strong><br>
                    <small>${new Date(
                      notification.time
                    ).toLocaleString()}</small>
                </div>
                <button onclick="deleteNotification(${index})">Delete</button>
            `;
      notificationList.appendChild(div);
    });
  }

  function saveNotifications() {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }

  window.deleteNotification = (index) => {
    notifications.splice(index, 1);
    saveNotifications();
    renderNotifications();
  };

  function scheduleTaskNotification(notification) {
    const delay = notification.time - Date.now();
    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.body,
          icon: "path/to/icon.png", // Optional: Add an icon path
        });
      }
    }, delay);
  }

  // Initial rendering of notifications
  renderNotifications();
});
