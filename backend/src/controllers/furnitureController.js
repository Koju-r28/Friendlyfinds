const Furniture = require("../models/Furniture");

exports.getFurniture = async (req, res) => {
  const furniture = await Furniture.find({ category: "furniture" });
  res.json(furniture);
};
