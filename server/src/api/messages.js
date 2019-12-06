const express = require("express");
const Joi = require("@hapi/joi");
const db = require("../db");
const messages = db.get("messages");

const schema = Joi.object({
  name: Joi.string().required(),
  message: Joi.string()
    .min(1)
    .max(500)
    .required(),
  latitude: Joi.number()
    .min(-90)
    .max(90)
    .required(),
  longitude: Joi.number()
    .min(-180)
    .max(180)
    .required(),
  date: Joi.date()
})
  .with("username", "birth_year")
  .xor("password", "access_token")
  .with("password", "repeat_password");

const router = express.Router();

router.get("/", (req, res) => {
  messages.find().then(allMessages => {
    res.json(allMessages);
  });
});

router.post("/", (req, res, next) => {
  // add current time
  const { error, value } = schema.validate(req.body);
  if (value) {
    const { name, message, latitude, longitude } = req.body;
    const userMessage = {
      name,
      message,
      latitude,
      longitude,
      date: new Date()
    };
    messages.insert(userMessage).then(insertedMessage => {
      res.json(insertedMessage);
    });
  } else {
    next(result.error);
  }
});

module.exports = router;
