import {getUser, getAllUsers, updateUserRole} from "../../utils/api/user.js";
import {getProjects} from "../../utils/api/project.js";
import {getTasks} from "../../utils/api/task.js";
import renderGantChart from "../../utils/charts/gantChart.js";

const userList = document.querySelector(".admin__user-list");
const projectList = document.querySelector(".admin__project-list");
const selectedUserDisplay = document.querySelector(".admin__selected-user");
const makeAdminBtn = document.querySelector(".admin__make-admin");
const statsBtn = document.querySelector(".admin__stats-btn");
const ganttChart = document.getElementById("projects__gantt");
const overlay = document.getElementById("admin-overlay");
const graphContainer = document.querySelector(".projects__graph");

let currentUser = null;
let ganttChartInstance = null;

const initAdminPanel = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/TimeTrackWeb/client/pages/authentication.html";
        return;
    }

    try {
        const user = await getUser(token);
        if (user.role !== "admin") {
            window.location.href = "/TimeTrackWeb/client/pages/projects.html";
            return;
        }

        setupUserDropdown(user);
        const users = await getAllUsers();
        renderUserList(users);
        setupEventListeners();

    } catch (error) {
        console.error("Admin panel init error:", error);
        window.location.href = "/TimeTrackWeb/client/pages/authentication.html";
    }
};

const setupUserDropdown = (userData) => {
    const userNameElems = document.querySelectorAll(".user__name");
    const emailElem = document.querySelector(".user__email");
    const greetingElem = document.querySelector(".user__greeting");

    userNameElems.forEach(el => {
        el.textContent = userData.username[0].toUpperCase();
    });
    emailElem.textContent = userData.email;
    greetingElem.textContent = `Welcome ${userData.username}!`;
};

const formatDate = (dateString) => dateString ? dateString.split("T")[0] : '—';

const renderUserList = (users) => {
    userList.innerHTML = '';
    users.forEach(user => {
        const userItem = document.createElement("li");
        userItem.className = "admin__user-item";
        userItem.dataset.userId = user.user_id;
        userItem.innerHTML = `
            <div>${user.username || 'No name'}</div>
            <div style="font-size: 12px; color: ${user.role === 'admin' ? '#4CAF50' : '#bdbdbd'}; 
                 background-color: #2c2c2c; border-radius: 8px; padding: 2px 8px">
                ${user.role}
            </div>
        `;
        userItem.addEventListener("click", () => selectUser(user));
        userList.appendChild(userItem);
    });
};

const selectUser = async (user) => {
    currentUser = user;

    document.querySelectorAll(".admin__user-item").forEach(item => {
        item.classList.remove("active");
    });
    document.querySelector(`[data-user-id="${user.user_id}"]`).classList.add("active");

    selectedUserDisplay.textContent = `${user.username} (${user.email})`;
    makeAdminBtn.disabled = user.role === 'admin';
    makeAdminBtn.style.opacity = user.role === 'admin' ? '0.5' : '1';

    await loadUserProjects(user.user_id);
};

const loadUserProjects = async (userId) => {
    try {
        const projects = await getProjects(userId);
        projectList.innerHTML = '';

        if (projects.length === 0) {
            projectList.innerHTML = '<li>No projects found</li>';
            statsBtn.disabled = true;
            return;
        }

        statsBtn.disabled = false;
        projects.forEach(project => createProjectItem(project));
    } catch (error) {
        console.error("Error loading projects:", error);
        projectList.innerHTML = '<li>Error loading projects</li>';
        statsBtn.disabled = true;
    }
};

const createProjectItem = async (project) => {
    const tasks = await getTasks(project.project_id);
    const completedTasks = tasks.filter(task => task.completed_at !== null).length;

    const projectItem = document.createElement("li");
    projectItem.className = "admin__project-item";
    projectItem.innerHTML = `
        <div class="admin__project-name">${project.name || 'No name'}</div>
        <div style="display: flex; justify-content: space-between" class="admin__project-stats">
            <div>Tasks: <span>${completedTasks}</span>/${tasks.length}</div>
            <div>${formatDate(project.created_at)} / ${formatDate(project.completed_at)}</div>
        </div>
    `;
    projectList.appendChild(projectItem);
};

const showStatistics = async () => {
    if (!currentUser) {
        alert("Please select a user first");
        return;
    }

    try {
        const projects = await getProjects(currentUser.user_id);
        if (!projects || projects.length === 0) {
            alert("No projects found for this user");
            return;
        }

        const projectsWithTasks = [];
        for (const project of projects) {
            try {
                const tasks = await getTasks(project.project_id);
                projectsWithTasks.push({
                    ...project,
                    tasks: tasks || []
                });
            } catch (error) {
                console.error(`Error loading tasks for project ${project.project_id}:`, error);
                projectsWithTasks.push({
                    ...project,
                    tasks: []
                });
            }
        }
        const canvas = document.getElementById("projects__gantt");
        if (!canvas) {
            throw new Error("Canvas element not found");
        }

        if (ganttChartInstance) {
            try {
                ganttChartInstance.destroy();
            } catch (destroyError) {
                console.error("Error destroying previous chart:", destroyError);
            }
            ganttChartInstance = null;
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ganttChartInstance = renderGantChart(projectsWithTasks, canvas);

        graphContainer.classList.remove("hidden");
        overlay.classList.remove("hidden");
    } catch (error) {
        console.error("Chart rendering failed:", {
            error: error.message,
            stack: error.stack
        });
        alert("Failed to load statistics: " + error.message);
    } finally {
        statsBtn.disabled = false;
        statsBtn.textContent = "Show Statistics";
    }
};

overlay.addEventListener("click", () => {
    if (ganttChartInstance) {
        try {
            ganttChartInstance.destroy();
        } catch (destroyError) {
            console.error("Error destroying chart on close:", destroyError);
        }
        ganttChartInstance = null;
    }
    graphContainer.classList.add("hidden");
    overlay.classList.add("hidden");
    window.location.reload();
});

const makeUserAdmin = async () => {
    if (!currentUser) return;

    try {
        await updateUserRole(currentUser.user_id, 'admin');
        alert(`${currentUser.username} is now an admin`);

        const users = await getAllUsers();
        renderUserList(users);

        const updatedUser = users.find(user => user.user_id === currentUser.user_id);
        if (updatedUser) selectUser(updatedUser);
    } catch (error) {
        console.error("Error updating role:", error);
        alert("Failed to update user role");
    }
};

const setupEventListeners = () => {
    makeAdminBtn.addEventListener("click", makeUserAdmin);
    statsBtn.addEventListener("click", showStatistics);
    overlay.addEventListener("click", () => {
        graphContainer.classList.add("hidden");
        overlay.classList.add("hidden");
    });

    document.querySelector(".user").addEventListener("click", () => {
        document.querySelector(".user__dropdown").classList.toggle("hidden");
    });

    document.querySelector(".user__logout").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "/TimeTrackWeb/client/pages/authentication.html";
    });
};

window.addEventListener("load", initAdminPanel);