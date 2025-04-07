const pool = require("../db");

const addProject = async (req, res) => {
    try {
        const { user_id, name, description, created_at } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "Пользователь не найден!" });
        }

        const project = await pool.query(
            'INSERT INTO projects (user_id, name, description, created_at) VALUES ($1, $2, $3, $4)',
            [user_id, name, description, created_at]
        );

        res.status(200).json("Проект успешно добавлен!");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при создании проекта. Попробуйте позже.' });
    }
};


const getProjects = async (req, res) => {
    try {
        const {user_id} = req.body;

        if (!user_id) {
            return res.status(400).json({error: "Пользователь не найден!"})
        }

        const projects = await pool.query('SELECT * FROM projects WHERE user_id = $1', [user_id])

        if (!projects) {
            return res.status(400).json({error: "Cписок проектов пуст!"})
        }

        res.status(200).json(projects.rows)
    } catch (err) {
        console.error(err);
        res.status(500).json("Ошибка")
    }
}

const getProject = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID проекта не указан!" });
        }

        const result = await pool.query(
            'SELECT * FROM projects WHERE project_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Проект не найден!" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Ошибка при получении проекта:", err);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};


module.exports = {addProject, getProjects, getProject};