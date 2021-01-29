"use strict";
const faker = require("faker");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductModelSchema = new Schema({
  sku: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

//generate 20 fake products
ProductModelSchema.statics.generateProduct = async function () {
  let products = [];

  for (let i = 1; i <= 20; i++) {
    products.push({
      sku: new Date().getTime() + i,
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      quantity: 20,
      price: faker.commerce.price(),
    });
  }

  const prod = await this.insertMany(products);
  return !!prod;
};

ProductModelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

ProductModelSchema.pre("update", function () {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

ProductModelSchema.pre("findOneAndUpdate", function () {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

//get random product
ProductModelSchema.statics.getRandom = async function () {
  var count = await this.countDocuments();
  return await this.findOne().skip(Math.floor(Math.random() * count));
};

module.exports = mongoose.model("Product", ProductModelSchema);
