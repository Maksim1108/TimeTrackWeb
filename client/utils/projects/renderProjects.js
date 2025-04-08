export const createNewProject = (project, projectList) => {
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
    date.textContent = `${project.created_at ? project.created_at.split("T")[0] : '—'} / ${project.completed_at ? project.completed_at.split("T")[0] : '—'}`;
    newDiv.appendChild(nameSpan);
    newDiv.appendChild(descriptionP);
    newDiv.appendChild(date);
    projectList?.appendChild(newDiv);
    newDiv.addEventListener("click", () => {
        window.location.href = `projectView.html?id=${project.project_id}`;
    });
};

export const createEmptyInscription = (projectList) => {
    const empty = document.createElement("span");
    empty.classList.add("projects__empty");
    empty.textContent = "Projects list is empty...";
    projectList?.appendChild(empty);
};