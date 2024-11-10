document.addEventListener("DOMContentLoaded", () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskInput = document.getElementById("taskInput");
    const taskDateInput = document.getElementById("taskDateInput");
    const taskTimeInput = document.getElementById("taskTimeInput");
    const taskList = document.getElementById("taskList");
    const addButton = document.getElementById("addButton");
    const clearCompletedButton = document.getElementById("clearCompletedButton");

    addButton.addEventListener("click", () => {
        const newTask = taskInput.value.trim();
        const newTaskDate = taskDateInput.value;
        const newTaskTime = taskTimeInput.value;

        if (newTask !== "" && newTaskDate !== "" && newTaskTime !== "") {
            tasks.push({ text: newTask, date: newTaskDate, time: newTaskTime, completed: false });
            taskInput.value = "";
            taskDateInput.value = "";
            taskTimeInput.value = "";
            saveTasks();
            renderTasks();
        }
    });

    clearCompletedButton.addEventListener("click", () => {
        const updatedTasks = tasks.filter(task => !task.completed);
        tasks.length = 0; 
        tasks.push(...updatedTasks); 
        saveTasks();
        renderTasks();
    });

    function renderTasks() {
        taskList.innerHTML = ""; 
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="text ${task.completed ? 'completed' : ''}">${task.text} (${task.date} ${task.time})</span>
                <div>
                    <button class="complete-button" onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="edit-button" onclick="editTask(${index})">Edit</button>
                    <button class="delete-button" onclick="deleteTask(${index})">Delete</button>
                    <button class="move-button" onclick="moveTaskUp(${index})">☝</button>
                    <button class="move-button" onclick="moveTaskDown(${index})">👇</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    window.toggleComplete = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    window.editTask = (index) => {
        const newText = prompt("Edit task:", tasks[index].text);
        const newDate = prompt("Edit date:", tasks[index].date);
        const newTime = prompt("Edit time:", tasks[index].time);
        if (newText !== null && newText.trim() !== "" && newDate !== null && newTime !== null) {
            tasks[index].text = newText.trim();
            tasks[index].date = newDate;
            tasks[index].time = newTime;
            saveTasks();
            renderTasks();
        }
    };

    window.moveTaskUp = (index) => {
        if (index > 0) {
            [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
            saveTasks();
            renderTasks();
        }
    };

    window.moveTaskDown = (index) => {
        if (index < tasks.length - 1) {
            [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
            saveTasks();
            renderTasks();
        }
    };

    renderTasks(); 
});
