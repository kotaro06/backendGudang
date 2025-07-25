const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const {
  getALLJenisProduk,
  addJenisProduk,
  updateJenisProduk,
  deleteJenisProduk
} = require("../controllers/produkController")

// Buat folder uploads jika belum ada
const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})

router.get("/jns-produk", getALLJenisProduk)
router.post("/jns-produk", upload.single("gambar"), addJenisProduk)
router.put("/jns-produk/:id", upload.single("gambar"), updateJenisProduk)
router.delete("/jns-produk/:id", deleteJenisProduk)

module.exports = router