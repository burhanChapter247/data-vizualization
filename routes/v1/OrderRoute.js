const express = require("express");
const router = express.Router();
const { OrderController } = require("../../controllers");

router.get("/sales-percentage", OrderController.compareSales);
router.get("/order-diff", OrderController.compareOrderCount);
router.get("/generate-order", OrderController.generateOrder);

module.exports = router;
