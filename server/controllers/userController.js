const pool = require("../db");
const jwt = require("jsonwebtoken");

const getUser = async (req, res) => {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({err: 'Нет токена'});
        }

        const token = header.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await pool.query('SELECT user_id, email, username, role FROM users WHERE email = $1', [payload.email])

        if (user.rows.length === 0) {
            return res.status(404).json({error: 'Пользователь не найден'});
        }

        res.json(user.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Ошибка при получении пользователя!'});
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');

        if (users.rows.length === 0) {
            return res.status(404).json({error: 'Список пользователей пуст'});
        }

        res.json(users.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Ошибка при получении пользователей!'});
    }
}

const updateUserRole = async (req, res) => {
    try {
        const { user_id, role } = req.body;

        const result = await pool.query(
            'UPDATE users SET role = $1 WHERE user_id = $2 RETURNING *',
            [role, user_id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Ошибка обновления роли пользователя'});
    }
}

module.exports = {getUser, getAllUsers, updateUserRole};

