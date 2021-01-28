"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var moment = require("moment");
const Product = require("./ProductModel");

const OrderModelSchema = new Schema({
  shipping: {},
  payment: {},
  products: [
    {
      product_id: {
        type: Schema.ObjectId,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      unit_total: {
        type: Number,
        required: true,
      },
    },
  ],
  netAmount: {
    type: Number,
  },
  orderCreatedAt: {
    type: Date,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

OrderModelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

OrderModelSchema.pre("update", function () {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

OrderModelSchema.pre("findOneAndUpdate", function () {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

//generate fake orders
OrderModelSchema.statics.generateOrder = async function () {
  let orders = [];
  for (let i = 1; i <= 5; i++) {
    let products = [];
    let netAmount = 0;
    for (let j = 1; j <= 3; j++) {
      let product = await Product.getRandom();
      let qty = Math.floor(Math.random() * 5) + 1;
      netAmount += qty * product.price;
      products.push({
        product_id: product._id,
        quantity: qty,
        price: product.price,
        unit_total: qty * product.price,
      });
    }

    let days = Math.floor(Math.random() * 14);
    orders.push({
      products: products,
      orderCreatedAt: moment("2021-01-01", "YYYY-MM-DD")
        .add(days, "days")
        .format("YYYY-MM-DD"),
      netAmount: netAmount,
    });
  }

  const order = await this.insertMany(orders);
  return !!order;
};

module.exports = mongoose.model("test_order", OrderModelSchema);
