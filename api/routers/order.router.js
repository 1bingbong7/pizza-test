const express = require("express");
const { submitOrders, getOrders } = require("../controllers/order.controller");
const router_order = express.Router();
const LOGGER = require("../util/log.util");

router_order.route("/").post(async (req, res, nxt) => {
  LOGGER.methodIn("submitOrders");
  const { result, error } = await submitOrders(req.body);
  if (error) {
    res.status(error.statusCode).send(error.body);
  } else {
    res.json(JSON.parse(result.body));
  }
  LOGGER.methodOut("submitOrders");
});

router_order.route("/").get(async (req, res, nxt) => {
  LOGGER.methodIn("getOrders");
  const { result, error } = await getOrders(req.query);
  if (error) {
    res.status(error.statusCode).send(error.body);
  } else {
    res.json(JSON.parse(result.body));
  }
  LOGGER.methodOut("getOrders");
});

module.exports = {
  router_order,
};
