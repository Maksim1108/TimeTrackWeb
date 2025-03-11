const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Допилить корректное добавление createdAt и lastLogin
const registration = async (req, res) => {
    try {
        const {username, password, email} = req.body;

        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({error: 'Пользователь c таким email уже существует'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await pool.query(
            'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
            [username, hashedPassword, email]
        );

        res.status(201).json(user.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Ошибка при создании пользователя. Попробуйте позже.'});
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({error: 'Неверные учетные данные'});
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({error: 'Неверные учетные данные'});
        }

        const token = jwt.sign({userId: user.rows[0].id, email: user.rows[0].email}, process.env.JWT_SECRET, {
            expiresIn: '12h',
        });

        res.json({message: 'Авторизация успешна', token});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
}

module.exports = {registration, login};
