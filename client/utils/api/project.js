const API_URL = "http://localhost:1828";

export async function getProjects(user_id) {
    const response = await fetch(`${API_URL}/get-projects`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id }),
    });
    return response.json();
}

export async function getProjectById(projectID) {
    const response = await fetch(`${API_URL}/get-project/${projectID}`);
    return response.json();
}

export async function addProject(projectData) {
    const response = await fetch(`${API_URL}/add-project`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
    });
    return response.json();
}
