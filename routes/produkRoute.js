// backend/routes/produkRoute.js
const express = require("express")
const router = express.Router()
const { getALLJNSProduk } = require("../controllers/produkController")

router.get("/jns-produk", getALLJNSProduk)

module.exports = router
