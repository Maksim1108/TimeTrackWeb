import { updateTaskTime } from "../api/task.js";


let activeTimer = null;
let currentTaskId = null;
let lastUpdateTime = 0;

const formatTime = totalSeconds => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
        .map(part => part.toString().padStart(2, '0'))
        .join(':');
};

const parseTime = timeStr => {
    const [h = 0, m = 0, s = 0] = (timeStr || '00:00:00').split(':').map(Number);
    return h * 3600 + m * 60 + s;
};

export const createTask = task => {
    const taskElement = document.createElement('li');
    taskElement.classList.add('projectView__item');
    taskElement.dataset.taskId = task.task_id;

    const nameElement = document.createElement('div');
    nameElement.textContent = task.name || 'Без названия';

    const timerElement = document.createElement('span');
    timerElement.classList.add('projectView__item-timer');
    timerElement.textContent = formatTime(parseTime(task.timer));
    nameElement.appendChild(timerElement);

    const dateElement = document.createElement('span');
    dateElement.classList.add('projectView__item-date');
    const formatDate = dateString => dateString ? dateString.split('T')[0] : '—';
    dateElement.textContent = `${formatDate(task.created_at)} / ${formatDate(task.completed_at)}`;

    const startButton = document.createElement('button');
    startButton.classList.add('projectView__item-button');
    startButton.textContent = 'Start';

    const stopButton = document.createElement('button');
    stopButton.classList.add('projectView__item-button');
    stopButton.textContent = 'Stop';
    stopButton.disabled = true;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.append(startButton, stopButton);

    taskElement.append(nameElement, dateElement, buttonsContainer);

    let currentSeconds = parseTime(task.timer);
    let isTimerRunning = false;

    startButton.addEventListener('click', () => {
        if (isTimerRunning) return;

        if (activeTimer) {
            clearInterval(activeTimer);
        }

        currentTaskId = task.task_id;
        isTimerRunning = true;
        lastUpdateTime = Date.now();

        activeTimer = setInterval(() => {
            currentSeconds++;
            timerElement.textContent = formatTime(currentSeconds);

            if (Date.now() - lastUpdateTime > 30000) {
                saveTime();
            }
        }, 1000);

        startButton.disabled = true;
        stopButton.disabled = false;
    });

    stopButton.addEventListener('click', async () => {
        if (!isTimerRunning || currentTaskId !== task.task_id) return;

        stopTimer();
        await saveTime();
    });

    const saveTime = async () => {
        try {
            await updateTaskTime(task.task_id, formatTime(currentSeconds));
            lastUpdateTime = Date.now();
        } catch (error) {
            console.error('Save time error:', error);
        }
    };


    const stopTimer = () => {
        clearInterval(activeTimer);
        activeTimer = null;
        isTimerRunning = false;
        currentTaskId = null;

        startButton.disabled = false;
        stopButton.disabled = true;
    };

    taskElement.stopTimer = stopTimer;

    return taskElement;
};