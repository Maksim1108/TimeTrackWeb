const API_URL = "http://localhost:1828";

export async function getUser(token) {
    const response = await fetch(`${API_URL}/get-user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.json();
}

export async function getAllUsers() {
    const response = await fetch(`${API_URL}/get-users`);

    return response.json();
}

export async function updateUserRole(userId, role) {
    const response = await fetch(`${API_URL}/update-user-role`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ user_id: userId, role })
    });
    return response.json();
}