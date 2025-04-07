import IUser from "../../models/IUser";

const loginForm = document.getElementById("login-form") as HTMLFormElement;
const registerForm = document.getElementById("register-form") as HTMLFormElement;

const API_URL: string = "http://localhost:1828";

const authenticate = async (user: IUser, endpoint: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {"Content-Type": "application/json"}
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Ошибка запроса");
        }

        const data: { token: string } = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "/TimeTrackWeb/client/pages/projects.html";
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message);
            console.error("Ошибка авторизации:", error);
        }
    }
};

loginForm.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    const email = (loginForm.querySelector("input[type='email']") as HTMLInputElement).value;
    const password = (loginForm.querySelector("input[type='password']") as HTMLInputElement).value;
    await authenticate({email, password}, "login");
});

registerForm.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    const username = (registerForm.querySelector("input[type='text']") as HTMLInputElement).value;
    const email = (registerForm.querySelector("input[type='email']") as HTMLInputElement).value;
    const password = (registerForm.querySelector("input[type='password']") as HTMLInputElement).value;
    await authenticate({username, email, password}, "registration");
});
