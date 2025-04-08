const API_URL = "http://localhost:1828";

export async function getUser(token) {
    const response = await fetch(`${API_URL}/get-user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.json();
}
