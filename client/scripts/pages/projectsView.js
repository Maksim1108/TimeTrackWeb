import renderBarChart from "../../utils/charts/barChart.js";
import renderGantChart from "../../utils/charts/gantChart.js";
import {getProjectById} from "../../utils/api/project.js";
import {getTasks, addTask} from "../../utils/api/task.js";
import {createTask} from "../../utils/tasks/renderTasks.js";

const projectName = document.querySelector('.projectView__name');
const button = document.querySelector('.projectView__button');
const statisticsButton = document.querySelectorAll('.projectView__button')[1];
const chartContainer = document.querySelector('.projectView__chart');
const closeButton = document.querySelector('.projectView__form-close');
const tasksList = document.querySelector('.projectView__list');
const form = document.querySelector('.projectView__form');
const toggleButton = document.getElementById("toggleTasks");
const tasksBlock = document.querySelector(".projectView__tasks");
const gantt2 = document.getElementById('ganttChart');
const overlay = document.getElementById('projectViewOverlay');

const projectID = new URLSearchParams(window.location.search).get('id');

document.addEventListener("DOMContentLoaded", async () => {
    const project = await getProjectById(projectID);
    projectName.textContent += project.name;

    const tasks = await getTasks(projectID);

    if (tasks.length > 0) {
        document.querySelector('.projectView__list-empty').style.display = 'none';
        tasks.forEach(task => tasksList.appendChild(createTask(task)));
        renderChart(tasks, gantt2);
    } else {
        statisticsButton.setAttribute("disabled", "");
        statisticsButton.style.backgroundColor = "#bdbdbd";
        chartContainer.style.display = 'none';
    }
});


button.addEventListener('click', () => {
    document.body.style.overflow = "hidden";
    form.style.display = 'flex';
    overlay.classList.remove('hidden');
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const taskName = new FormData(form).get("projectView__form-name");

    if (!taskName) {
        alert("Ошибка: Введите название");
        return;
    }

    const taskData = {
        project_id: projectID,
        name: taskName,
        timer: '00:00:00',
        created_at: new Date().toISOString(),
    };

    await addTask(taskData);

    form.style.display = "none";
    document.body.style.overflow = "visible";
    location.reload();
});

closeButton.addEventListener('click', () => {
    form.style.display = 'none';
    document.body.style.overflow = "visible";
    overlay.classList.add('hidden');
});

statisticsButton.addEventListener('click', () => {
    chartContainer.style.display = 'flex';
    chartContainer.style.width = "50%";
});

toggleButton.addEventListener("click", () => {
    tasksBlock.classList.toggle("collapsed");
    toggleButton.textContent = tasksBlock.classList.contains("collapsed") ? "Show" : "Hide";
});

const renderChart = (tasks, element) => {
    renderBarChart(tasks);
    renderGantChart(tasks, element);
};