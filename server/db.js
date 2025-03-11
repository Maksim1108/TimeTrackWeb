require('dotenv').config()
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.USER,          // Логин PostgreSQL
    host: process.env.HOST,         // Хост
    database: process.env.DATABASE,    // Имя базы данных
    password: process.env.PASSWORD,   // Пароль пользователя
    port: process.env.PORT,      // Порт PostgreSQL
});

module.exports = pool;
