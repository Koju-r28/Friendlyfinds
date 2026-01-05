const express = require("express");
const router = express.Router();
const { getFurniture } = require("../controllers/furnitureController");

router.get("/", getFurniture);

module.exports = router;
