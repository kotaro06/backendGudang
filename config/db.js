// backend/config/db.js
const mysql = require("mysql2")
const dotenv = require("dotenv")
dotenv.config()

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

db.connect((err) => {
  if (err) throw err
  console.log("✅ Connected to MySQL Database")
})

module.exports = db
