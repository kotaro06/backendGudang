// backend/routes/produkRoute.js
const express = require("express")
const router = express.Router()
const { getALLJenisProduk, addJenisProduk, updateJenisProduk, deleteJenisProduk  } = require("../controllers/produkController")

router.get("/jns-produk", getALLJenisProduk)
router.post("/jns-produk", addJenisProduk)
router.put("/jns-produk/:id", updateJenisProduk)
router.delete("/jns-produk/:id", deleteJenisProduk)

module.exports = router
