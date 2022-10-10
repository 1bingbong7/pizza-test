const Orders = require("../models/order.model");

const saveOrders = async (payload) => {
  let result = null,
    error = null;
  const findOrder = await Orders.find({ order_number: payload.order_number });

  if (findOrder && findOrder.length > 0) {
    error = "Order Already Exist";
  } else {
    const order = await Orders.create(payload);

    if (!order) {
      error = "Error Saving Order";
    }
    result = order;
  }
  return { result, error };
};

const getOrders = async (params) => {
  let result = null,
    error = null;

  const agg = [
    {
      $project: {
        order_number: 1,
        pizza: 1,
        number_of_each_toppings: 1,
        number_of_toppings: 1,
      },
    },
    {
      $match: {},
    },
  ];

  let toppingFilter = [];

  for (const p in params) {
    if (Object.hasOwnProperty.call(params, p) && params[p] !== "") {
      if (p === "noOfToppings") {
        agg[1].$match.number_of_toppings = parseInt(params[p]);
      } else {
        toppingFilter.push({ [p]: { $regex: new RegExp(params[p], "i") } });
      }
    }
  }

  if (toppingFilter.length > 0) {
    agg[1].$match.pizza = {
      $elemMatch: { $and: toppingFilter },
    };
  }

  const orders = await Orders.aggregate(agg);
  result = orders;

  return { result, error };
};

module.exports = {
  saveOrders,
  getOrders,
};
