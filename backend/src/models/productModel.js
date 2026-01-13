const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    address: { type: String },
    category: {
      type: String,
      enum: ["Furniture", "Stationery"],
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    condition: { type: String },
    description: { type: String },
    stock: { type: Number, default: 1 },
    image: { type: String }, // base64 or URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
