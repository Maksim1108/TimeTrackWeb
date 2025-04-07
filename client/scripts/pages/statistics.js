const list = document.querySelector(".statistics__list");

const createEmptyInscription = () => {
    const empty = document.createElement("span");
    empty.classList.add("projects__empty");
    empty.textContent = "Projects list is empty...";
    projectList?.appendChild(empty);
};

window.addEventListener("load", async () => {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:1828/get-user", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    const userData = await response.json();

    const projectsResponse = await fetch("http://localhost:1828/get-projects", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userData.user_id })
    });

    const projects = await projectsResponse.json();

    if (projects.length === 0) {
        createEmptyInscription()
    } else {
        projects.forEach((project) => {
            const li = document.createElement("li");
            li.classList.add("statistics__list-item");
            li.textContent = project.name;
            list.appendChild(li)
        });
    }
});