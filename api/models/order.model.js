const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    order_number: {type: Number, required: true },
    pizza: {type: Array, required: true },
    number_of_each_toppings:  {type: Object, required: true},
    number_of_toppings: {type: Number, required: true},
  },
  {
    timestamps: true,
  }
);

const Orders = mongoose.model("Orders", OrderSchema);

module.exports = Orders;
