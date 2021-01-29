"use strict";
const { ProductModel, OrderModel } = require("../models/index");
const Helper = require("../utils/helper");
const moment = require("moment");
/**
 * Generate 5 fake orders
 * @param { req, res }
 * @returns JsonResponse
 */
const generateOrder = async (req, res, next) => {
  try {
    // next() or
    const order = await OrderModel.generateOrder();

    return res.status(200).json({
      success: order,
      message: "Orders Generated",
      data: [],
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
 * get sales increase decrease percentage
 * @param { req, res }
 * @returns JsonResponse
 */
const compareSales = async (req, res, next) => {
  try {
    // next() or
    let dayOfCurrentWeek = moment().isoWeekday();
    let CurrentLastWeek = Helper.getCurrentLastWeek();

    //fetching current & last week's data
    let orders = await OrderModel.aggregate([
      {
        $facet: {
          lastWeek: [
            {
              $match: {
                orderCreatedAt: {
                  $gte: new Date(CurrentLastWeek.lastWeek[0]),
                  $lte: new Date(CurrentLastWeek.lastWeek[6]),
                },
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$orderCreatedAt",
                  },
                },
                totalSaleAmount: { $sum: "$netAmount" },
              },
            },
            { $sort: { _id: 1 } },
          ],
          currentWeek: [
            {
              $match: {
                orderCreatedAt: {
                  $gte: new Date(CurrentLastWeek.currentWeek[0]),
                  $lte: new Date(
                    CurrentLastWeek.currentWeek[dayOfCurrentWeek - 1]
                  ),
                },
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$orderCreatedAt",
                  },
                },
                totalSaleAmount: { $sum: "$netAmount" },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);

    //preparing chart data
    let chartData = [];
    for (let i in CurrentLastWeek.currentWeek) {
      let data = {
        currentWeekDate: CurrentLastWeek.currentWeek[i],
        lastWeekDate: CurrentLastWeek.lastWeek[i],
        orderLast: 0,
        orderCurrent: 0,
      };

      let isOrderLast = orders[0].lastWeek.find(
        (obj) => obj._id === CurrentLastWeek.lastWeek[i]
      );

      if (isOrderLast) {
        data.orderLast = isOrderLast.totalSaleAmount;
      }

      let isOrderCurrent = orders[0].currentWeek.find(
        (obj) => obj._id === CurrentLastWeek.currentWeek[i]
      );

      if (isOrderCurrent) {
        data.orderCurrent = isOrderCurrent.totalSaleAmount;
      }

      chartData.push(data);
    }

    //calculating percent
    let saleAmountLast = 0;
    for (const ord of orders[0].lastWeek) {
      saleAmountLast += ord.totalSaleAmount;
    }

    let saleAmountCurrent = 0;
    for (const ord of orders[0].currentWeek) {
      saleAmountCurrent += ord.totalSaleAmount;
    }

    let responseData = {
      lastWeek: orders[0].lastWeek,
      currentWeek: orders[0].currentWeek,
      CurrentLastWeek,
      chartData,
      saleAmountLast,
      saleAmountCurrent,
    };

    if (saleAmountLast > saleAmountCurrent) {
      let diffAmt = saleAmountLast - saleAmountCurrent;
      responseData.percentage = `-${parseFloat(
        diffAmt / (saleAmountLast / 100)
      ).toFixed(2)}%`;
    } else if (saleAmountCurrent > saleAmountLast) {
      let diffAmt = saleAmountCurrent - saleAmountLast;
      responseData.percentage = `+${parseFloat(
        diffAmt / (saleAmountLast / 100)
      ).toFixed(2)}%`;
    } else {
      responseData.percentage = "0%";
    }

    return res.status(200).json({
      success: true,
      message: "Details fatched successfully.",
      data: responseData,
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
 * compare orders count from the past week
 * @param { req, res }
 * @returns JsonResponse
 */
const compareOrderCount = async (req, res, next) => {
  try {
    // next() or
    let dayOfCurrentWeek = moment().isoWeekday();
    let CurrentLastWeek = Helper.getCurrentLastWeek();

    //fetching current & last week's data
    let orders = await OrderModel.aggregate([
      {
        $facet: {
          lastWeek: [
            {
              $match: {
                orderCreatedAt: {
                  $gte: new Date(CurrentLastWeek.lastWeek[0]),
                  $lte: new Date(CurrentLastWeek.lastWeek[6]),
                },
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$orderCreatedAt",
                  },
                },
                totalOrderCount: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          currentWeek: [
            {
              $match: {
                orderCreatedAt: {
                  $gte: new Date(CurrentLastWeek.currentWeek[0]),
                  $lte: new Date(
                    CurrentLastWeek.currentWeek[dayOfCurrentWeek - 1]
                  ),
                },
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$orderCreatedAt",
                  },
                },
                totalOrderCount: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);
    //preparing chart data
    let chartData = [];
    for (let i in CurrentLastWeek.currentWeek) {
      let data = {
        currentWeekDate: CurrentLastWeek.currentWeek[i],
        lastWeekDate: CurrentLastWeek.lastWeek[i],
        orderLast: 0,
        orderCurrent: 0,
      };

      let isOrderLast = orders[0].lastWeek.find(
        (obj) => obj._id === CurrentLastWeek.lastWeek[i]
      );

      if (isOrderLast) {
        data.orderLast = isOrderLast.totalOrderCount;
      }

      let isOrderCurrent = orders[0].currentWeek.find(
        (obj) => obj._id === CurrentLastWeek.currentWeek[i]
      );

      if (isOrderCurrent) {
        data.orderCurrent = isOrderCurrent.totalOrderCount;
      }

      chartData.push(data);
    }

    //calculating increase or decrease orders from the past week
    let orderCountLast = 0;
    for (const ord of orders[0].lastWeek) {
      orderCountLast += ord.totalOrderCount;
    }

    let orderCountCurrent = 0;
    for (const ord of orders[0].currentWeek) {
      orderCountCurrent += ord.totalOrderCount;
    }

    let responseData = {
      lastWeek: orders[0].lastWeek,
      currentWeek: orders[0].currentWeek,
      CurrentLastWeek,
      chartData,
      orderCountLast,
      orderCountCurrent,
      diff: orderCountCurrent - orderCountLast,
    };

    return res.status(200).json({
      success: true,
      message: "Details fatched successfully.",
      data: responseData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: JSON.stringify(error),
    });
  }
};

/**
 * Export as a single common js module
 */
module.exports = {
  compareSales,
  compareOrderCount,
  generateOrder,
};
