import {deleteTask, updateTask, updateTaskTime} from "../api/task.js"; // Предполагаем, что эти функции есть в API

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

    const completeButton = document.createElement("button");
    completeButton.classList.add("projectView__complete-button");
    completeButton.textContent = "✓";
    completeButton.title = "Complete task";
    completeButton.style.display = "none";
    task.completed_at ? (completeButton.disabled = true, startButton.disabled = true, stopButton.disabled = true) : (completeButton.disabled = false, startButton.disabled = false,stopButton.disabled = false);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("projectView__delete-button");
    deleteButton.textContent = "🗑";
    deleteButton.title = "Delete task";
    deleteButton.style.display = "none";

    const buttonsContainer = document.createElement('div');
    buttonsContainer.append(startButton, stopButton, completeButton, deleteButton);

    taskElement.append(nameElement, dateElement, buttonsContainer);

    let currentSeconds = parseTime(task.timer);
    let isTimerRunning = false;

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
    };

    startButton.addEventListener('click', () => {
        if (isTimerRunning) return;
        if (activeTimer) clearInterval(activeTimer);

        currentTaskId = task.task_id;
        isTimerRunning = true;
        lastUpdateTime = Date.now();

        activeTimer = setInterval(() => {
            currentSeconds++;
            timerElement.textContent = formatTime(currentSeconds);
            if (Date.now() - lastUpdateTime > 30000) saveTime();
        }, 1000);
    });

    stopButton.addEventListener('click', async () => {
        if (!isTimerRunning || currentTaskId !== task.task_id) return;
        stopTimer();
        await saveTime();
    });

    completeButton.addEventListener("click", async () => {
        if (confirm("Are you sure you want to complete this task?")) {
            try {
                await updateTask(task.task_id, formatDate(new Date().toISOString()));
                dateElement.textContent = `${formatDate(task.created_at)} / ${formatDate(new Date().toISOString())}`;
                completeButton.disabled = true;
                window.location.reload();
            } catch (err) {
                alert("Failed to complete the task");
                console.error(err);
            }
        }
    });

    deleteButton.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this task?")) {
            try {
                await deleteTask(task.task_id);
                taskElement.remove();
                window.location.reload();
            } catch (err) {
                alert("Failed to delete the task");
                console.error(err);
            }
        }
    });

    taskElement.addEventListener("mouseenter", () => {
        completeButton.style.display = "block";
        deleteButton.style.display = "block";
    });

    taskElement.addEventListener("mouseleave", () => {
        completeButton.style.display = "none";
        deleteButton.style.display = "none";
    });

    taskElement.stopTimer = stopTimer;
    return taskElement;
};