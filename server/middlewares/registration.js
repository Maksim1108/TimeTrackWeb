const validateRegistration = (req, res, next) => {
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Неверный адрес электронной почты' });
    }

    if (!password || password.length < 8 || !/\d/.test(password)) {
        return res.status(400).json({ error: 'Пароль должен быть длиной не менее 8 символов и содержать цифру' });
    }

    next();
}

module.exports = {validateRegistration}