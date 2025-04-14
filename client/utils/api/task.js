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

export async function updateTask(taskID, completed_at) {
    const requestBody = {
        completed_at: completed_at ? new Date(completed_at).toISOString() : null
    };

    try {
        const response = await fetch(`${API_URL}/update-task/${taskID}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Error updating project:", err);
        throw err;
    }
}

export async function deleteTask(taskID) {
    try {
        const response = await fetch(`${API_URL}/delete-task/${taskID}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Error deleting project:", err);
        throw err;
    }
}