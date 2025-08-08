// db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Prefer using Railway-provided vars (MYSQLHOST etc)
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || '127.0.0.1',
  port: process.env.MYSQLPORT ? Number(process.env.MYSQLPORT) : 3306,
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_DATABASE || 'test',
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
