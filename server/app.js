// Импорт необходимых модулей и файлов
const express = require('express')
const cors = require("cors")
const {registration, login} = require("./controllers/authController");

// Создание серверной оболочки
const app = express()
const PORT = 1828;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:63342",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.get('/', (req, res) => {
    res.send("Hello World!");
})

app.post('/registration', registration);
app.post('/login', login)

// Запуск сервера на указанном порту
app.listen(PORT, () => {
    try {
        console.log(`Server listen on ${PORT} port`)
    } catch (err) {
        console.log(err)
    }
})