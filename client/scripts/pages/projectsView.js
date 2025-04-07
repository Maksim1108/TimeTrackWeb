import renderBarChart from "../../utils/charts/barChart.js";
import renderGantChart from "../../utils/charts/gantChart.js";

const projectName = document.querySelector('.projectView__name');
const button = document.querySelector('.projectView__button');
const statisticsButton = document.querySelectorAll('.projectView__button')[1];
const chartContainer = document.querySelector('.projectView__chart')
const closeButton = document.querySelector('.projectView__form-close');
const tasksList = document.querySelector('.projectView__list');
const form = document.querySelector('.projectView__form');
const gantt2 = document.getElementById('ganttChart');

const projectID = new URLSearchParams(window.location.search).get('id');
let activeTimer = null;
let currentTaskId = null;

document.addEventListener("DOMContentLoaded", async () => {
    const projectResponse = await fetch(`http://localhost:1828/get-project/${projectID}`);
    const project = await projectResponse.json();

    projectName.textContent += project.name;

    const tasksResponse = await fetch("http://localhost:1828/get-tasks", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({project_id: projectID})
    });

    const tasks = await tasksResponse.json();

    if (tasks.length > 0) {
        document.querySelector('.projectView__list-empty').style.display = 'none';
    }

    tasks.forEach(task => tasksList.appendChild(createTask(task)));

    tasks.length > 0 ? renderChart(tasks, gantt2) : chartContainer.style.display = 'none';
});

const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0')
    ].join(':');
};

const createTask = task => {
    const li = document.createElement('li');
    li.classList.add('projectView__item');
    li.dataset.taskId = task.task_id;

    const taskName = document.createElement('div');
    taskName.textContent = task.name;

    const timerDisplay = document.createElement('span');
    timerDisplay.classList.add('projectView__item-timer');
    timerDisplay.textContent = task.timer || '00:00:00';
    taskName.appendChild(timerDisplay);

    const date = document.createElement('span');
    date.classList.add('projectView__item-date');
    date.textContent = date.textContent = `${task.created_at ? task.created_at.split("T")[0] : '—'} / ${task.completed_at ? task.completed_at.split("T")[0] : '—'}`;

    const startButton = document.createElement('button');
    startButton.classList.add('projectView__item-button');
    startButton.textContent = 'Start Timer';

    const stopButton = document.createElement('button');
    stopButton.classList.add('projectView__item-button');
    stopButton.textContent = 'Stop Timer';
    stopButton.disabled = true;

    const buttonContainer = document.createElement('div');
    buttonContainer.appendChild(startButton);
    buttonContainer.appendChild(stopButton);

    li.appendChild(taskName);
    li.appendChild(date);
    li.appendChild(buttonContainer);

    const parseTime = (timeStr) => {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    let currentSeconds = parseTime(task.timer || '00:00:00');

    startButton.addEventListener('click', () => {
        if (activeTimer) return;

        currentTaskId = task.task_id;
        activeTimer = setInterval(() => {
            currentSeconds++;
            timerDisplay.textContent = formatTime(currentSeconds);
        }, 1000);

        startButton.disabled = true;
        stopButton.disabled = false;
    });

    stopButton.addEventListener('click', async () => {
        if (!activeTimer || currentTaskId !== task.task_id) return;

        clearInterval(activeTimer);
        activeTimer = null;

        const timeSpent = formatTime(currentSeconds);

        try {
            await fetch("http://localhost:1828/update-task-time", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task_id: task.task_id,
                    time_spent: timeSpent
                })
            });
        } catch (error) {
            console.error("Ошибка при сохранении времени:", error);
        }

        startButton.disabled = false;
        stopButton.disabled = true;
    });

    return li;
};

button.addEventListener('click', () => {
    document.body.style.overflow = "hidden";
    form.style.display = 'flex'
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const taskName = new FormData(form).get("projectView__form-name");

    if (!taskName) {
        alert("Ошибка: Введите название");
        return;
    } else {
        const taskData = {
            project_id: projectID,
            name: taskName,
            timer: '00:00:00',
            created_at: new Date().toISOString(),
        }

        const taskResponse = await fetch("http://localhost:1828/add-task", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });

        form.style.display = "none";
        document.body.style.overflow = "visible";
        location.reload();
    }
});

closeButton.addEventListener('click', () => {
    form.style.display = 'none'
    document.body.style.overflow = "visible";
});

statisticsButton.addEventListener('click', () => {
    chartContainer.style.display = 'flex';
    chartContainer.style.width = "50%";
})

const renderChart = (tasks, element) => {
    renderBarChart(tasks);
    renderGantChart(tasks, element);
};