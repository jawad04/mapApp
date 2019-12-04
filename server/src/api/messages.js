const express = require("express");
const joi = require("joi");

const router = express.Router();

router.get("/", (req, res) => {
  res.json([]);
});

router.post("/", (req, res) => {
  res.json([]);
});

module.exports = router;
