// Load tasks from Local Storage when the page loads
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

// Function to add a task to the DOM
function addTaskToDOM(task) {
    console.log("Adding task to DOM:", task); // Debugging line
    const li = document.createElement('li');
    li.textContent = task;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    
    deleteButton.onclick = function() {
        li.remove();
        removeTaskFromLocalStorage(task);
    };

    li.appendChild(deleteButton);
    document.getElementById('task-list').appendChild(li);
}

// Function to save a task to Local Storage
function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log("Task saved to Local Storage:", task); // Debugging line
}

// Function to remove a task from Local Storage
function removeTaskFromLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t !== task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log("Task removed from Local Storage:", task); // Debugging line
}

// Function to handle adding a task
function setupEventListeners() {
    const addTaskButton = document.getElementById('add-task');
    if (addTaskButton) {
        addTaskButton.onclick = function() {
            const input = document.getElementById('task-input');
            const task = input.value.trim();
            
            if (task) {
                addTaskToDOM(task);
                saveTaskToLocalStorage(task);
                input.value = ''; // Clear input field
            } else {
                alert('Please enter a task!');
            }
        };
    }
}

// Initialize the app
function init() {
    setupEventListeners();
    loadTasks();
}

// Call this function to initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', init);
