"use strict";

const { ProductModel, OrderModel } = require("../models/index");

/**
 * Get product chart data
 * @param { req, res }
 * @returns JsonResponse
 */
const chartData = async (req, res, next) => {
  try {
    // next() or
    let products = await ProductModel.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "products.product_id",
          as: "inventory_docs",
        },
      },
      {
        $project: {
          _id: "$_id",
          title: "$title",
          count: { $size: "$inventory_docs" },
        },
      },
      { $limit: 20 },
    ]);

    return res.status(200).json({
      success: true,
      message: "Details fatched successfully.",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error,
    });
  }
};

/**
 * Export as a single common js module
 */
module.exports = {
  chartData,
};
