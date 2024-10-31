// Load tasks from Local Storage when the page loads
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.time);
    });
}

// Function to add a task to the DOM
function addTaskToDOM(taskText, taskTime) {
    const li = document.createElement('li');
    li.textContent = `${taskText} (Due: ${new Date(taskTime).toLocaleString()})`;

    const moveUpButton = document.createElement('button');
    moveUpButton.textContent = '↑';
    moveUpButton.classList.add('move-button'); // Add class
    moveUpButton.onclick = () => moveTask(li, -1);
    
    const moveDownButton = document.createElement('button');
    moveDownButton.textContent = '↓';
    moveDownButton.classList.add('move-button'); // Add class
    moveDownButton.onclick = () => moveTask(li, 1);
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
        li.remove();
        removeTaskFromLocalStorage(taskText, taskTime);
    };

    li.appendChild(moveUpButton);
    li.appendChild(moveDownButton);
    li.appendChild(deleteButton);
    document.getElementById('task-list').appendChild(li);

    scheduleNotification(taskText, taskTime);
}

// Function to move a task up or down
function moveTask(li, direction) {
    const sibling = direction === -1 ? li.previousElementSibling : li.nextElementSibling;
    if (sibling) {
        if (direction === -1) {
            li.parentNode.insertBefore(li, sibling);
        } else {
            li.parentNode.insertBefore(sibling, li);
        }
    }
}

// Function to save a task to Local Storage
function saveTaskToLocalStorage(taskText, taskTime) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, time: taskTime });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to remove a task from Local Storage
function removeTaskFromLocalStorage(taskText, taskTime) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t.text !== taskText || t.time !== taskTime);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Schedule a notification for a task
function scheduleNotification(taskText, taskTime) {
    const timeToNotify = new Date(taskTime).getTime() - Date.now();
    if (timeToNotify > 0) {
        setTimeout(() => {
            new Notification('Task Reminder', {
                body: `It's time for: ${taskText}`,
            });
        }, timeToNotify);
    }
}

// Function to handle adding a task
function setupEventListeners() {
    const addTaskButton = document.getElementById('add-task');
    if (addTaskButton) {
        addTaskButton.onclick = function() {
            const input = document.getElementById('task-input');
            const timeInput = document.getElementById('task-time');
            const taskText = input.value.trim();
            const taskTime = timeInput.value;

            if (taskText && taskTime) {
                addTaskToDOM(taskText, taskTime);
                saveTaskToLocalStorage(taskText, taskTime);
                input.value = ''; // Clear input field
                timeInput.value = ''; // Clear time input
            } else {
                alert('Please enter a task and a due time!');
            }
        };
    }

    const downloadButton = document.getElementById('download-ics');
    if (downloadButton) {
        downloadButton.onclick = downloadICS;
    }
}

// Initialize the app
function init() {
    setupEventListeners();
    loadTasks();
    Notification.requestPermission();
}

// Call this function to initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Function to download tasks as .ics
function downloadICS() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\n';

    tasks.forEach(task => {
        icsContent += `BEGIN:VEVENT\nSUMMARY:${task.text}\nDTSTART:${new Date(task.time).toISOString().replace(/-|:|\.\d+/g, "")}\nEND:VEVENT\n`;
    });

    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
