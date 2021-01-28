"use strict";

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
