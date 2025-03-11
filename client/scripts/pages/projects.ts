const projectsForm: HTMLFormElement | null = document.querySelector(".projects__form");
const button = document.querySelector(".projects__button");
const closeButton = document.querySelector(".projects__form-close");
const projectList = document.querySelector(".project__list");

const createNewProject = (project: any) => {
    const newDiv = document.createElement("div");
    newDiv.classList.add("projects__item");

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("projects__name");
    nameSpan.textContent = project.name;

    const descriptionP = document.createElement("p");
    descriptionP.classList.add("projects__description");
    descriptionP.textContent = project.description;

    const date = document.createElement("span");
    date.classList.add("projects__date");
    date.textContent = project.date;

    newDiv.appendChild(nameSpan);
    newDiv.appendChild(descriptionP);
    newDiv.appendChild(date);
    projectList?.appendChild(newDiv);

    newDiv.addEventListener("click", () => {
        window.location.href = `projectView.html?id=${project.id}`;
    });
}

const createEmptyInscription = () => {
    const empty = document.createElement("span");
    empty.classList.add("projects__empty");
    empty.textContent = "Projects list is empty...";
    projectList?.appendChild(empty);
}

window.addEventListener("load", () => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");

    if (projects.length === 0) {
        createEmptyInscription()
    } else {
        projects.forEach((project: any) => {
            createNewProject(project);
        });
    }
});

projectsForm.addEventListener("submit", function (e: Event) {
    e.preventDefault();

    const formData = new FormData(projectsForm);
    const name = formData.get("projects__form-name") as string;
    const description = formData.get("projects__form-description") as string;

    if (!name || !description) {
        alert("Ошибка: все поля формы должны быть заполнены");
        return;
    }

    const projectData: any = {
        id: Date.now(),
        name: name,
        description: description,
        date: new Date(Date.now()).toLocaleString(),
        tasks: []
    };

    const projects = JSON.parse(localStorage.getItem("projects") || "[]");

    projects.push(projectData);
    localStorage.setItem("projects", JSON.stringify(projects));

    if (projectList) {
        createNewProject(projectData)
        projectsForm.style.display = "none";
        document.body.style.overflow = "visible";
        if (document.querySelector(".projects__empty")) {
            document.querySelector(".projects__empty").remove();
        }
    }
});

button.addEventListener("click", () => {
    projectsForm.style.display = "flex";
    document.body.style.overflow = "hidden";
});

closeButton.addEventListener("click", () => {
    projectsForm.style.display = "none";
    document.body.style.overflow = "visible";
})