let tasks = JSON.parse(getCookie('tasks') || '[]');

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = `${task.title} - Due: ${new Date(task.dueDate).toLocaleString()}`;
        li.className = task.completed ? 'completed' : '';
        li.addEventListener('click', () => toggleTask(index));
        taskList.appendChild(li);
    });
}

function addTask(task) {
    tasks.push(task);
    setCookie('tasks', JSON.stringify(tasks), 7);
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    setCookie('tasks', JSON.stringify(tasks), 7);
    renderTasks();
}

// Export functionality
function downloadICS() {
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\n';
    tasks.forEach(task => {
        if (!task.completed) {
            const startDate = new Date(task.dueDate).toISOString().replace(/-|:|\.\d+/g, '');
            icsContent += `BEGIN:VEVENT\nSUMMARY:${task.title}\n`;
            icsContent += `DTSTART:${startDate}\n`;
            icsContent += `END:VEVENT\n`;
        }
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

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Initialize
renderTasks();
