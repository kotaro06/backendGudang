// backend/controllers/produkController.js
const db = require("../config/db")

const getALLJNSProduk = (req, res) => {
  db.query("SELECT * FROM tbl_jns_produk", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Gagal ambil data", error: err })
    }
    res.json(results)
  })
}


const addJNSProduk = (req, res) => {
  const { jns_produk, diskripsi } = req.body
  if (!jns_produk || !diskripsi) {
    return res.status(400).json({ message: "Data tidak lengkap" })
  }

  db.query(
    "INSERT INTO tbl_jns_produk (jns_produk,diskripsi) VALUES (?, ?)",
    [jns_produk, diskripsi],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Gagal tambah produk", error: err })
      }
      res.status(201).json({ message: "Produk berhasil ditambahkan", id: result.insertId })
    }
  )
}

module.exports = {
  getALLJNSProduk,
  addJNSProduk, // tambahkan di sini
}
