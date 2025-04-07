const pool = require("../db");

const addTask = async (req, res) => {
    try {
        const {project_id, name, timer, created_at, completed_at} = req.body;

        if (!project_id) {
            return res.status(400).json({error: "Проект не найден!"})
        }

        const task = await pool.query(
            'INSERT INTO tasks (project_id, name, timer, created_at, completed_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [project_id, name, timer, created_at, completed_at]
        );

        res.status(200).json("Задача успешно добавлена!");
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Ошибка при создании задачи. Попробуйте позже.'});
    }
}

const getTasks = async (req, res) => {
    try {
        const {project_id} = req.body;

        if (!project_id) {
            return res.status(400).json({error: "Проект не найден!"})
        }

        const tasks = await pool.query('SELECT * FROM tasks WHERE project_id = $1', [project_id])

        if (!tasks) {
            return res.status(400).json({error: "Список задач пуст!"})
        }

        res.status(200).json(tasks.rows)
    } catch (err) {
        console.error(err);
        res.status(500).json("Ошибка")
    }
}

const updateTaskTime = async (req, res) => {
    try {
        const { task_id, time_spent } = req.body;

        if (!task_id || !time_spent) {
            return res.status(400).json({ error: "Не указаны ID задачи или время" });
        }

        const taskExists = await pool.query(
            'SELECT task_id FROM tasks WHERE task_id = $1',
            [task_id]
        );

        if (taskExists.rows.length === 0) {
            return res.status(404).json({ error: "Задача не найдена" });
        }

        await pool.query(
            'UPDATE tasks SET timer = $1 WHERE task_id = $2',
            [time_spent, task_id]
        );

        res.status(200).json({ success: true, message: "Время обновлено" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера при обновлении времени" });
    }
}

module.exports = { addTask, getTasks, updateTaskTime };