const express = require('express');
const cors = require("cors");

const {registration, login} = require("./controllers/authController");
const {getUser} = require("./controllers/userController");
const {addProject, getProjects, getProject, updateProject, deleteProject} = require("./controllers/projectController");
const {addTask, getTasks, updateTaskTime} = require("./controllers/taskController");
const {validateRegistration} = require("./middlewares/registration");

const app = express();
const PORT = 1828;

app.use(cors({
    origin: "http://localhost:63342",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Auth
app.post('/registration', validateRegistration, registration);
app.post('/login', login);

// Projects
app.post('/add-project', addProject);
app.post('/get-projects', getProjects);
app.get('/get-project/:id', getProject);
app.patch('/update-project/:id', updateProject);
app.delete('/delete-project/:id', deleteProject);

// Tasks
app.post('/add-task', addTask);
app.post('/get-tasks', getTasks);
app.post('/update-task-time', updateTaskTime);

// User
app.get('/get-user', getUser);

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
