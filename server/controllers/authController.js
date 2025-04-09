const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateConfirmationToken} = require("../utils/mailer");
const {transporter} = require("../utils/mailer");

const registration = async (req, res) => {
    try {
        const {username, password, email} = req.body;

        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({error: 'Пользователь c таким email уже существует'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const confirmation_token = generateConfirmationToken();

        const user = await pool.query(
            'INSERT INTO users (username, password, email, role, isverified, confirmation_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [username, hashedPassword, email, "user", false, confirmation_token]
        );

        const confirmationUrl = `http://localhost:1828/confirm/${confirmation_token}`;

        await transporter.sendMail({
            from: 'TimeTrackWeb',
            to: email,
            subject: 'Подтверждение регистрации',
            html: `Пожалуйста, подтвердите ваш email: <a href="${confirmationUrl}">Подвердить</a>`
        });

        res.status(201).json({
            message: 'Регистрация успешна. Пожалуйста, проверьте ваш email для подтверждения.',
            user: user.rows[0]
        });
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

        if (!user.rows[0].isverified) {
            return res.status(401).json({message: 'Пожалуйста подтвердите учетную запись!'})
        }

        res.json({message: 'Авторизация успешна', token});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
}

const confirm = async (req, res) => {
    try {
        const {token} = req.params;

        const user = await pool.query(
            'SELECT * FROM users WHERE confirmation_token = $1',
            [token]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({error: 'Неверный токен подтверждения'});
        }

        await pool.query(
            'UPDATE users SET isverified = true, confirmation_token = NULL WHERE user_id = $1',
            [user.rows[0].user_id]
        );

        res.status(200).json({message: 'Email успешно подтвержден'});

    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Ошибка при подтверждении email'});
    }
}

module.exports = {registration, login, confirm};
