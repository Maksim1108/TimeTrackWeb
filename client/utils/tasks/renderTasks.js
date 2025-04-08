import {updateTaskTime} from "../api/task.js";

let activeTimer = null;
let currentTaskId = null;

const formatTime = totalSeconds => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0')
    ].join(':');
};

export const createTask = task => {
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
    date.textContent = `${task.created_at?.split("T")[0] || '—'} / ${task.completed_at?.split("T")[0] || '—'}`;

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

    const parseTime = timeStr => {
        const [h, m, s] = timeStr.split(':').map(Number);
        return h * 3600 + m * 60 + s;
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
            await updateTaskTime(task.task_id, timeSpent);
        } catch (err) {
            console.error("Ошибка при сохранении времени:", err);
        }

        startButton.disabled = false;
        stopButton.disabled = true;
    });

    return li;
};