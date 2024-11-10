document.addEventListener("DOMContentLoaded", () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const calendar = document.getElementById("calendar");

    // Create a date range for the current month
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    // Fill the calendar with empty divs
    for (let i = 0; i < startDay; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "day empty";
        calendar.appendChild(emptyDiv);
    }

    // Create day divs and populate tasks
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "day";
        dayDiv.innerHTML = `<h2>${day}</h2>`;

        const taskDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const tasksForDay = tasks.filter(task => task.date === taskDate);

        tasksForDay.forEach(task => {
            const taskDiv = document.createElement("div");
            taskDiv.className = "task";
            taskDiv.textContent = `${task.text} (${task.time})`;
            dayDiv.appendChild(taskDiv);
        });

        calendar.appendChild(dayDiv);
    }

    // Download .ics file functionality
    document.getElementById("downloadButton").addEventListener("click", () => {
        let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\n";

        tasks.forEach(task => {
            icsContent += `BEGIN:VEVENT\n`;
            icsContent += `SUMMARY:${task.text}\n`;
            icsContent += `DTSTART;TZID=UTC:${formatDate(task.date, task.time)}\n`;
            icsContent += `END:VEVENT\n`;
        });

        icsContent += "END:VCALENDAR";

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = "tasks.ics";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    function formatDate(date, time) {
        const [hours, minutes] = time.split(':');
        const dateObj = new Date(date);
        dateObj.setHours(hours, minutes);
        return dateObj.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'; // Format to YYYYMMDDTHHMMSSZ
    }
});
