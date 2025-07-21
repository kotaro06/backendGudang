// backend/controllers/produkController.js
const db = require("../config/db")

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

const updateJenisProduk = (req, res) => {
  const { id } = req.params
  const { jns_produk, diskripsi } = req.body

  db.query(
    "UPDATE tbl_jns_produk SET jns_produk=?, diskripsi=? WHERE id=?",
    [jns_produk, diskripsi, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal update", error: err })
      res.json({ message: "Produk berhasil diupdate" })
    }
  )
}

const deleteJenisProduk = (req, res) => {
  const { id } = req.params

  db.query("DELETE FROM tbl_jns_produk WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal hapus", error: err })
    res.json({ message: "Produk dihapus" })
  })
}



module.exports = {
  getALLJenisProduk,
  addJenisProduk,
  updateJenisProduk,
  deleteJenisProduk
}
