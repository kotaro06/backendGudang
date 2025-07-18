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

module.exports = { getALLJNSProduk }
