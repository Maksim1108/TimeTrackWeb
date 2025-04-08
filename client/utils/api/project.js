const API_URL = "http://localhost:1828";

export async function getProjects(user_id) {
    try {
        const response = await fetch(`${API_URL}/get-projects`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Error when receiving projects:", err);
        throw err;
    }
}

export async function getProjectById(projectID) {
    try {
        const response = await fetch(`${API_URL}/get-project/${projectID}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (err) {
        console.error("Error when receiving project:", err);
        throw err;
    }
}

export async function addProject(projectData) {
    try {
        const response = await fetch(`${API_URL}/add-project`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Error adding project:", err);
        throw err;
    }
}

export async function updateProject(projectID, completed_at) {

    const requestBody = {
        completed_at: completed_at ? new Date(completed_at).toISOString() : null
    };

    try {
        const response = await fetch(`${API_URL}/update-project/${projectID}`, {
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

export async function deleteProject(projectID) {
    try {
        const response = await fetch(`${API_URL}/delete-project/${projectID}`, {
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