// backend/server.js
const express = require("express")
const cors = require("cors")
const produkRoutes = require("./routes/jenis_produkRoute")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api", produkRoutes)
//app.use("/uploads", express.static("uploads"))

// dbDiagnostic.js
const mysql = require('mysql2');
const util = require('util');
const sleep = util.promisify(setTimeout);

async function diagnoseDatabaseConnection() {
  const config = {
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME,
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    connectTimeout: 5000
  };

  console.log('=== Memulai Diagnosa Koneksi Database ===');
  console.log('Konfigurasi yang digunakan:', JSON.stringify(config, null, 2));

  // 1. Cek apakah variabel lingkungan sudah terisi
  console.log('\n[1/4] Memeriksa variabel lingkungan...');
  const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  let envValid = true;

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      console.error(`❌ Variabel ${varName} tidak ditemukan`);
      envValid = false;
    } else {
      console.log(`✓ Variabel ${varName} terdeteksi`);
    }
  });

  if (!envValid) {
    console.error('⚠️ Beberapa variabel lingkungan tidak terdefinisi');
    return;
  }

  // 2. Cek koneksi jaringan dasar
  console.log('\n[2/4] Memeriksa koneksi jaringan...');
  try {
    const net = require('net');
    const socket = net.createConnection(config.port, config.host);
    
    await new Promise((resolve, reject) => {
      socket.on('connect', () => {
        console.log(`✓ Berhasil terhubung ke ${config.host}:${config.port}`);
        socket.end();
        resolve();
      });
      
      socket.on('error', (err) => {
        console.error(`❌ Gagal terhubung ke ${config.host}:${config.port}`);
        reject(err);
      });
      
      socket.setTimeout(5000, () => {
        socket.destroy();
        reject(new Error('Timeout koneksi jaringan'));
      });
    });
  } catch (err) {
    console.error('⚠️ Masalah jaringan:', err.message);
    console.error('Kemungkinan penyebab:');
    console.error('- Database service belum siap');
    console.error('- Masalah jaringan internal Railway');
    console.error('- Konfigurasi host/port salah');
    return;
  }

  // 3. Cek koneksi database dengan retry (untuk service yang belum siap)
  console.log('\n[3/4] Memeriksa koneksi database dengan retry...');
  const maxRetries = 5;
  const retryDelay = 5000; // 5 detik
  
  for (let i = 1; i <= maxRetries; i++) {
    console.log(`\nAttempt ${i}/${maxRetries}...`);
    
    try {
      const connection = mysql.createConnection(config);
      await new Promise((resolve, reject) => {
        connection.connect(err => {
          if (err) {
            console.error(`Attempt ${i} gagal:`, err.code || err.message);
            reject(err);
          } else {
            console.log('✓ Berhasil terhubung ke database MySQL');
            resolve();
          }
        });
        
        connection.on('error', err => {
          console.error('Error selama koneksi:', err);
          reject(err);
        });
      });
      
      // Jika berhasil, test query sederhana
      console.log('\n[4/4] Menjalankan test query...');
      const [rows] = await connection.promise().query('SELECT 1 + 1 AS result');
      console.log('✓ Test query berhasil. Result:', rows[0].result);
      
      await connection.end();
      console.log('\n=== Diagnosa selesai: Semua test berhasil ===');
      return;
    } catch (err) {
      console.error(`Attempt ${i} gagal:`, err.code || err.message);
      
      if (i < maxRetries) {
        console.log(`Menunggu ${retryDelay/1000} detik sebelum retry...`);
        await sleep(retryDelay);
      }
    }
  }

  console.error('\n=== Diagnosa selesai dengan error ===');
  console.error('Kemungkinan penyebab:');
  console.error('1. Database service belum siap - Coba deploy ulang atau tunggu beberapa menit');
  console.error('2. Masalah jaringan internal Railway - Coba buat service database baru');
  console.error('3. Konfigurasi tidak sesuai - Periksa kembali variabel lingkungan');
  console.error('4. Izin akses database - Pastikan user memiliki hak akses yang cukup');
}

diagnoseDatabaseConnection().catch(err => {
  console.error('Error selama diagnosa:', err);
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})
