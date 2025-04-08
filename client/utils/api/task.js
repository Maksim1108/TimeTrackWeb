const API_URL = "http://localhost:1828";

export async function getTasks(projectID) {
    const response = await fetch(`${API_URL}/get-tasks`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_id: projectID })
    });
    return response.json();
}

export async function addTask(taskData) {
    const response = await fetch(`${API_URL}/add-task`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData)
    });
    return response.json();
}

export async function updateTaskTime(task_id, time_spent) {
    return fetch(`${API_URL}/update-task-time`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task_id, time_spent })
    });
}
