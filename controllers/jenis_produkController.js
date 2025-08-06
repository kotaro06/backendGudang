const db = require("../config/db")
const fs = require("fs")
const path = require("path")

const deleteFile = (filename) => {
  if (!filename) return
  
  const filePath = path.join(__dirname, "../uploads", filename)
  
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Gagal hapus file:", filePath)
    } else {
      console.log("🧹 File terhapus:", filePath)
    }
  })
}

const getALLJenisProduk = (req, res) => {
  db.query("SELECT * FROM tbl_jns_produk", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Gagal ambil data", error: err })
    }
    res.json(results)
  })
}

const addJenisProduk = (req, res) => {
  const { jns_produk, diskripsi } = req.body
  const gambar = req.file ? req.file.filename : null

  if (!jns_produk || !diskripsi) {
    // Hapus file yang sudah diupload jika validasi gagal
    if (req.file) deleteFile(req.file.filename)
    return res.status(400).json({ message: "Data tidak lengkap" })
  }

  db.query(
    "INSERT INTO tbl_jns_produk (jns_produk, diskripsi, gambar) VALUES (?, ?, ?)",
    [jns_produk, diskripsi, gambar],
    (err, result) => {
      if (err) {
        // Hapus file jika query gagal
        if (req.file) deleteFile(req.file.filename)
        return res.status(500).json({ message: "Gagal tambah produk", error: err })
      }
      res.status(201).json({ message: "Produk berhasil ditambahkan", id: result.insertId })
    }
  )
}

const updateJenisProduk = (req, res) => {
  const { id } = req.params
  const { jns_produk, diskripsi } = req.body
  const newGambar = req.file ? req.file.filename : null

  db.query("SELECT gambar FROM tbl_jns_produk WHERE id=?", [id], (err, results) => {
    if (err || results.length === 0) {
      if (req.file) deleteFile(req.file.filename)
      return res.status(404).json({ message: "Produk tidak ditemukan" })
    }

    const oldGambar = results[0].gambar
    const gambarToSave = newGambar || oldGambar

    db.query(
      "UPDATE tbl_jns_produk SET jns_produk=?, diskripsi=?, gambar=? WHERE id=?",
      [jns_produk, diskripsi, gambarToSave, id],
      (err2) => {
        if (err2) {
          if (req.file) deleteFile(req.file.filename)
          return res.status(500).json({ message: "Gagal update", error: err2 })
        }

        // Hapus gambar lama jika ada gambar baru
        if (newGambar && oldGambar) {
          deleteFile(oldGambar)
        }

        res.json({ message: "Jenis Produk berhasil diupdate" })
      }
    )
  })
}

const deleteJenisProduk = (req, res) => {
  const { id } = req.params

  db.query("SELECT gambar FROM tbl_jns_produk WHERE id=?", [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" })
    }

    const gambarToDelete = results[0].gambar

    db.query("DELETE FROM tbl_jns_produk WHERE id=?", [id], (err) => {
      if (err) {
        return res.status(500).json({ message: "Gagal hapus", error: err })
      }

      // Hapus file gambar terkait
      if (gambarToDelete) {
        deleteFile(gambarToDelete)
      }

      res.json({ message: "Produk berhasil dihapus" })
    })
  })
}

// ... kode sebelumnya tetap sama ...

const countJenisProduk = (req, res) => {
  console.log("⏱️  Mengakses endpoint countJenisProduk...");
  
  db.query("SELECT COUNT(*) AS count FROM tbl_jns_produk", (err, results) => {
    if (err) {
      console.error("Error counting jenis produk:", err);
      return res.status(500).json({ 
        message: "Gagal mengambil jumlah produk" 
      });
    }
    
    console.log("✅ Hasil count:", results[0].count);
    res.json({ count: results[0].count });
  });
}

// ... ekspor fungsi tetap sama ...

module.exports = {
  getALLJenisProduk,
  addJenisProduk,
  updateJenisProduk,
  deleteJenisProduk,
  countJenisProduk
}