const express = require("express");
const router = express.Router();
const { ProductController } = require("../../controllers");

router.get("/chart-data", ProductController.chartData);

module.exports = router;
