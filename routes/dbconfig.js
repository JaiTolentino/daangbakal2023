const express = require('express');
const app = express();
const mysql = require('mysql2'); // avoid using mysql there are issues in connecting
require("dotenv").config();

const pool = mysql.createConnection({ // used in connecting to the database
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3307
})

module.exports = pool;