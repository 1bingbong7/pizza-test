import parse from "html-react-parser";

const BreakDownPizza = (props) => {
  if(!props.orders || props.orders.length === 0 ) {
    return <tr><td colSpan={2}>No Order Available</td></tr>
  }
  let breakDown = "";
  for (const order of props.orders) {
    breakDown += `<tr><td>${order.order_number}</td><td>`;
    breakDown += `<ul class="order">
          <li>Order ${order.order_number}:`;
    if (order.pizza.length) {
      breakDown += `<ul class="pizzas">`;
      for (const [pizIndex, piz] of order.pizza.entries()) {
        breakDown += `<li>Pizza ${pizIndex} - ${piz.size}, ${piz.crust}, ${piz.type}`;
        if (piz.type.toLowerCase() === "custom") {
          const toppingArea = piz.topping_areas;
          breakDown += `<ul class="topping-areas">`;
          for (const toppA in toppingArea) {
            const area =
              toppA === "whole"
                ? "Whole"
                : toppA === "first_half"
                ? "First-Half"
                : toppA === "second_half"
                ? "Second-Half"
                : "";
            breakDown += `<li>Toppings ${area}:`;

            const toppings = toppingArea[toppA];
            if (toppings.length) {
              breakDown += `<ul class="toppings">`;
              for (const topp of toppings) {
                breakDown += `<li>${topp}</li>`;
              }
              breakDown += `</ul>`;
            }

            breakDown += `</li>`;
          }
          breakDown += `</ul>`;
        }

        breakDown += `</li>`;
      }
      breakDown += `</ul>`;
    }

    breakDown += `</li>
          </ul>`;
    breakDown += "</td></tr>";
  }
  return parse(breakDown);
};

export default BreakDownPizza;
