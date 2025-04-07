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

        const user = await pool.query('SELECT user_id, email, username FROM users WHERE email = $1', [payload.email])

        if (user.rows.length === 0) {
            return res.status(404).json({error: 'Пользователь не найден'});
        }

        res.json(user.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Ошибка при получении пользователя!'});
    }
}

module.exports = {getUser};
