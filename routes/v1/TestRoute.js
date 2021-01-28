const express = require("express");
const router = express.Router();
const { TestController } = require("../../controllers");

router.get("/test-chart-data", TestController.chartData);

module.exports = router;
