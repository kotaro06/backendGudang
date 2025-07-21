// backend/routes/produkRoute.js
const express = require("express")
const router = express.Router()
const { getALLJNSProduk, addJNSProduk } = require("../controllers/produkController")

router.get("/jns-produk", getALLJNSProduk)
router.post("/jns-produk", addJNSProduk)

module.exports = router
