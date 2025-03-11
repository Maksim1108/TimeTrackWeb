const projectName = document.querySelector('.projectView__name');
const projectID = new URLSearchParams(window.location.search).get('id');
const button = document.querySelector('.projectView__button');
const closeButton = document.querySelector('.projectView__form-close');
const tasksList = document.querySelector('.projectView__list');
const form = document.querySelector('.projectView__form');

const getProjects = () => JSON.parse(localStorage.getItem("projects")) || [];
const saveProjects = projects => localStorage.setItem("projects", JSON.stringify(projects));

document.addEventListener("DOMContentLoaded", () => {
    const projects = getProjects();
    const project = projects.find(p => p.id == projectID);

    if (!project) {
        projectName.textContent = "Not found";
        return;
    }

    projectName.textContent += project.name;
    if (project.tasks.length > 0) {
        document.querySelector('.projectView__list-empty').style.display = 'none';
    }

    project.tasks.forEach(task => tasksList.appendChild(createTask(task)));
});

const createTask = task => {
    const li = document.createElement('li');
    li.classList.add('projectView__item');

    const taskName = document.createElement('div');
    taskName.textContent = task.taskName;

    const timerDisplay = document.createElement('span');
    timerDisplay.classList.add('projectView__item-timer');
    taskName.appendChild(timerDisplay);

    const startButton = document.createElement('button');
    startButton.classList.add('projectView__item-button');
    startButton.textContent = 'Start Timer';

    const stopButton = document.createElement('button');
    stopButton.classList.add('projectView__item-button');
    stopButton.textContent = 'Stop Timer';

    const buttonContainer = document.createElement('div');
    buttonContainer.appendChild(startButton);
    buttonContainer.appendChild(stopButton);

    li.appendChild(taskName);
    li.appendChild(buttonContainer);

    return li;
};

button.addEventListener('click', () => form.style.display = 'flex');

form.addEventListener('submit', event => {
    event.preventDefault();
    const projects = getProjects();
    const project = projects.find(p => p.id == projectID);
    const taskName = new FormData(form).get("projectView__form-name");

    if (!taskName) {
        alert("Ошибка: Введите название");
        return;
    }

    if (project) {
        project.tasks.push({ taskName, timer: 0 });
        saveProjects(projects);
        form.style.display = "none";
        document.body.style.overflow = "visible";
        location.reload();
    }
});

closeButton.addEventListener('click', () => form.style.display = 'none');