import {deleteProject, updateProject} from "../api/project.js";

export const createNewProject = (project, projectList) => {
    if (!project || !projectList) return;

    const projectElement = document.createElement("div");
    projectElement.classList.add("projects__item");
    projectElement.dataset.projectId = project.project_id;

    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add("projects__content");

    const nameElement = document.createElement("span");
    nameElement.classList.add("projects__name");
    nameElement.textContent = project.name || "Without name";

    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("projects__description");
    descriptionElement.textContent = project.description || "Without description";

    const formatDate = (dateString) => dateString ? dateString.split("T")[0] : '—';
    const dateElement = document.createElement("span");
    dateElement.classList.add("projects__date");
    dateElement.textContent = `${formatDate(project.created_at)} / ${formatDate(project.completed_at)}`;


    const completeButton = document.createElement("button");
    completeButton.classList.add("projects__complete-button");
    completeButton.textContent = "✓";
    completeButton.title = "Complete project";
    completeButton.style.display = "none";
    project.completed_at ? completeButton.disabled = true : completeButton.disabled = false
    completeButton.addEventListener("click", async () => {
        if (confirm("Are you sure you want to complete this project?")) {
            try {
                await updateProject(project.project_id, formatDate(new Date().toISOString()));
                dateElement.textContent = `${formatDate(project.created_at)} / ${formatDate(new Date().toISOString())}`;
            } catch (err) {
                alert("Failed to complete the project");
                console.error(err)
            }
        }
    })

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("projects__delete-button");
    deleteButton.textContent = "🗑";
    deleteButton.title = "Delete project";
    deleteButton.style.display = "none";
    deleteButton.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this project?")) {
            try {
                await deleteProject(project.project_id);
                window.location.reload();
            } catch(err) {
                alert("Failed to delete the project:");
                console.error(err)
            }
        }
    })

    contentWrapper.append(nameElement, descriptionElement, dateElement);
    projectElement.append(contentWrapper, completeButton, deleteButton);

    projectElement.addEventListener("mouseenter", () => {
        completeButton.style.display = "block";
        deleteButton.style.display = "block";
    });

    projectElement.addEventListener("mouseleave", () => {
        completeButton.style.display = "none";
        deleteButton.style.display = "none";
    });

    projectElement.addEventListener("click", (e) => {
        if (!e.target.classList.contains("projects__complete-button") && !e.target.classList.contains("projects__delete-button")) {
            window.location.href = `projectView.html?id=${project.project_id}`;
        }
    });

    projectList.appendChild(projectElement);
    return projectElement;
};

export const createEmptyInscription = (projectList) => {
    const empty = document.createElement("span");
    empty.classList.add("projects__empty");
    empty.textContent = "Projects list is empty...";
    projectList?.appendChild(empty);
};