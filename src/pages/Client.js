import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import request from "../interface/request";
import { SERVER } from "../constants/constant";

const Client = () => {
  const pizzaDetails = {
    sizes: ["small", "medium", "large"],
    crusts: ["thin", "thick", "hand-tossed", "deep dish"],
    types: ["Hawaiian", "Chicken Fajita", "custom"],
    toppingAreas: {
      0: "Whole",
      1: "First-Half",
      2: "Second-Half",
    },
    maxCustomToppingAreas: 3,
    maxCustomToppingItemsPerArea: 12,
  };

  const errorMessages = {
    invalidFormat: "Invalid PML format",
    noOrder: "There is no order.",
    oneOrderPerSubmission: "Only one order per submission is allowed.",
    noOrderNumber: "No order number.",
    pizzaNumberOrder: "Incorrect order of pizzas.",
    noSize: "Please indicate pizza size.",
    oneSizePerPizza: "Only one size per pizza.",
    invalidSize: "Pizza size must be small, medium, or large.",
    noCrust: "Please indicate pizza crust.",
    oneCrustPerPizza: "Only one crust type per pizza.",
    invalidCrust: "Pizza crust must be thin, thick, hand-tossed, or deep dish.",
    noType: "Please indicate pizza type.",
    oneTypePerPizza: "Only one type per pizza.",
    invalidType: "Pizza type must be Hawaiian, Chicken Fajita, or custom.",
    noToppingsAllowedForPizzaType:
      "Selected pizza type cannot have custom toppings.",
    maxCustomToppingAreas: `Up to ${pizzaDetails.maxCustomToppingAreas} topping areas allowed.`,
    maxCustomToppingItemsPerArea: `Up to ${pizzaDetails.maxCustomToppingItemsPerArea} toppings per area allowed.`,
    invalidToppingArea:
      "Topping area must be 0 (whole pizza), 1 (first-half), or 2 (second-half).",
  };

  const predefinedPML = `{order number="123"}
  {pizza number="1"}
    {size}large{\\size}
    {crust}hand-tossed{\\crust}
    {type}custom{\\type}
    {toppings area="0"}
      {item}pepperoni{\\item}
      {item}extra cheese{\\item}
    {\\toppings}
    {toppings area="1"}
      {item}sausage{\\item}
    {\\toppings}
  {toppings area="2"}
      {item}mushrooms{\\item}
    {\\toppings}
  {\\pizza}
  {pizza number="2"}
    {size}medium{\\size}
  {crust}deep dish{\\crust}
    {type}chicken fajita{\\type}
  {\\pizza}
  {\\order}`;

  const [order, setOrder] = useState(predefinedPML);

  const validate = (orders) => {
    const xml = convertToXml(orders);

    if (xml.getElementsByTagName("parsererror").length) {
      return errorMessages.invalidFormat;
    }

    // check if order has number
    const orderTags = xml.getElementsByTagName("order");
    if (orderTags.length === 0) {
      return errorMessages.noOrder;
    }
    const newOrder = orderTags[0];
    if (
      !newOrder.hasAttribute("number") ||
      newOrder.getAttribute("number").trim() === ""
    ) {
      return errorMessages.noOrderNumber;
    }

    const pizzas = newOrder.getElementsByTagName("pizza");
    for (let i = 0; i < pizzas.length; i++) {
      const pizza = pizzas[i];

      // check if pizza numbers are in order and starts at 1.
      if (parseInt(pizza.getAttribute("number")) !== i + 1) {
        return errorMessages.pizzaNumberOrder;
      }

      // check if size is small, medium, or large.
      const size = pizza.getElementsByTagName("size");
      if (size.length === 0) {
        return errorMessages.noSize;
      } else if (size.length > 1) {
        return errorMessages.oneSizePerPizza;
      }
      for (let j = 0; j < pizzaDetails.sizes.length; j++) {
        if (
          pizzaDetails.sizes[j].toLowerCase() ===
          size[0].textContent.toLowerCase()
        ) {
          break;
        }

        if (j === pizzaDetails.sizes.length - 1) {
          return errorMessages.invalidSize;
        }
      }

      // check if crust is thin, thick, hand-tossed, deep dish.
      const crust = pizza.getElementsByTagName("crust");
      if (crust.length === 0) {
        return errorMessages.noCrust;
      } else if (crust.length > 1) {
        return errorMessages.oneCrustPerPizza;
      }
      for (let j = 0; j < pizzaDetails.crusts.length; j++) {
        if (
          pizzaDetails.crusts[j].toLowerCase() ===
          crust[0].textContent.toLowerCase()
        ) {
          break;
        }

        if (j === pizzaDetails.crusts.length - 1) {
          return errorMessages.invalidCrust;
        }
      }

      // check if type is Hawaiian, Chicken Fajita, or custom.
      const pizzaType = pizza.getElementsByTagName("type");
      if (pizzaType.length === 0) {
        return errorMessages.noType;
      } else if (pizzaType.length > 1) {
        return errorMessages.oneTypePerPizza;
      }
      for (let j = 0; j < pizzaDetails.types.length; j++) {
        if (
          pizzaDetails.types[j].toLowerCase() ===
          pizzaType[0].textContent.toLowerCase()
        ) {
          break;
        }

        if (j === pizzaDetails.types.length - 1) {
          return errorMessages.invalidType;
        }
      }

      // check toppings.
      const toppingAreas = pizza.getElementsByTagName("toppings");
      if (
        pizzaType[0].textContent.toLowerCase() !== "custom" &&
        toppingAreas.length > 0
      ) {
        return errorMessages.noToppingsAllowedForPizzaType;
      } else if (toppingAreas.length > pizzaDetails.maxCustomToppingAreas) {
        return errorMessages.maxCustomToppingAreas;
      }

      for (let j = 0; j < toppingAreas.length; j++) {
        const toppingArea = toppingAreas[j];

        // check if topping area is valid
        if (
          !(
            parseInt(toppingArea.getAttribute("area")) in
            pizzaDetails.toppingAreas
          )
        ) {
          return errorMessages.invalidToppingArea;
        }

        const toppings = toppingArea.getElementsByTagName("item");
        if (toppings.length > pizzaDetails.maxCustomToppingItemsPerArea) {
          return errorMessages.maxCustomToppingItemsPerArea;
        }
      }
    }

    return "valid";
  };

  const parseOrder = (pmlOrder) => {
    const payload = {
      order_number: null,
      pizza: [],
    };
    const xml = convertToXml(pmlOrder);
    const orders = xml.getElementsByTagName("order")[0];
    payload.order_number = orders.getAttribute("number");

    const pizzas = orders.getElementsByTagName("pizza");

    for (const pizza of pizzas) {
      const orderPizza = {
        size: null,
        crust: null,
        type: null,
        topping_areas: {
          whole: [],
          first_half: [],
          second_half: [],
        },
      };
      orderPizza.size = pizza.getElementsByTagName("size")[0].textContent;
      orderPizza.crust = pizza.getElementsByTagName("crust")[0].textContent;
      orderPizza.type = pizza.getElementsByTagName("type")[0].textContent;

      if (orderPizza.type.toLowerCase() === "custom") {
        const toppingAreas = pizza.getElementsByTagName("toppings");

        for (const toppingArea of toppingAreas) {
          let area =
            pizzaDetails.toppingAreas[toppingArea.getAttribute("area")];
          area = area.replace("-", "_").toLowerCase();

          const toppings = toppingArea.getElementsByTagName("item");

          for (const topping of toppings) {
            orderPizza.topping_areas[area].push(topping.textContent);
          }
        }
      }
      payload.pizza.push(orderPizza);
    }
    return payload;
  };

  const convertToXml = (orders) => {
    // convert tags to xml for easier parsing.
    orders = orders.replace(/{/g, "<").replace(/\\/g, "/").replace(/}/g, ">");

    const parser = new DOMParser();
    return parser.parseFromString(orders, "text/xml");
  };

  const orderInputHandler = (event) => {
    setOrder(event.target.value);
  };

  const countToppings = (pizza) => {
    let eachToppings = {};
    let allToppings = 0;
    for (const pizz of pizza) {
        let toppingAreas = pizz.topping_areas;
        for (const tpa in toppingAreas) {
            for (const tp of toppingAreas[tpa]) {
                if (eachToppings[tp]) {
                    eachToppings[tp] += eachToppings[tp];
                    allToppings += eachToppings[tp];
                } else {
                    eachToppings[tp] = 1;
                    allToppings += 1;
                }
            }
        }
    }
    return { eachToppings, allToppings }
  }

  const submitOrder = async (event) => {
    try {
      event.preventDefault();
      let payload = order;
      const validation = validate(payload);
      if (validation === "valid") {
        payload = parseOrder(payload);
      } else {
        alert(validation);
        return;
      }
      const { eachToppings, allToppings} = countToppings(payload.pizza);
      //count each toppings
      payload.number_of_each_toppings = eachToppings;
      //count all toppings
      payload.number_of_toppings = allToppings;
     
      const req = await request("POST", `${SERVER}/order`, {}, payload);
      if (req) {
        alert("Order is now being processed. Thank you!");
      }
    } catch (error) {
      //handling error from request
      alert(error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>PML Order</Form.Label>
          <Form.Control
            as="textarea"
            rows={15}
            onChange={orderInputHandler}
            value={order}
          />
        </Form.Group>
        <Button variant="primary" type="button" onClick={submitOrder}>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default Client;
