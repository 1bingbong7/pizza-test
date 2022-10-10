import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BreakDownPizza from "../components/BreakDownOrders";
import request from "../interface/request";
import { SERVER } from "../constants/constant";

const Employee = () => {
  const [orders, setOrders] = useState([]);
  const [size, setSize] = useState("");
  const [crust, setCrust] = useState("");
  const [type, setType] = useState("");
  const [noOfToppings, setNoOfToppings] = useState("");

  const getOrders = async () => {
    try {
      const req = await request("GET", `${SERVER}/order`, {}, {}, { size, crust, type, noOfToppings });
      if (req?.data) {
        setOrders(req.data["data"]);
      }
    } catch (error) {
      //handling error from request
      alert(error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    getOrders();
  }, [size, crust, type, noOfToppings]);


const sizeInputHandler = (event) => {
    setSize(event.target.value);
  };
  const crustInputHandler = (event) => {
    setCrust(event.target.value);
  };
  const typeInputHandler = (event) => {
    setType(event.target.value);
  };
  const noOfToppingsInputHandler = (event) => {
    setNoOfToppings(event.target.value);
  };

  const Filter = () => {
    return (
      <>
        <Row>
          <Col xs={1}>
            <label>Filter:</label>
          </Col>
          <Col>
            <Form.Select onChange={sizeInputHandler} value={size}>
              <option value="">Size</option>
              <option value="small">small</option>
              <option value="medium">medium</option>
              <option value="large">large</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Select onChange={crustInputHandler} value={crust}>
              <option value="">Crust</option>
              <option value="thin">thin</option>
              <option value="thick">thick</option>
              <option value="hand-tossed">hand-tossed</option>
              <option value="deep dish">deep dish</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Select onChange={typeInputHandler} value={type}>
              <option value="">Type</option>
              <option value="Hawaiian">Hawaiian</option>
              <option value="Chicken Fajita">Chicken Fajita</option>
              <option value="custom">custom</option>
            </Form.Select>
          </Col>
          <Col>
            <Form.Control type="number" placeholder="Number of Toppings" onChange={noOfToppingsInputHandler} value={noOfToppings}/>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <>
      <Table bordered hover>
        <thead>
          <tr>
            <th colSpan={2}>
              <Filter />
            </th>
          </tr>
          <tr>
            <th>Order #</th>
            <th>Order Details</th>
          </tr>
        </thead>
        <tbody>
          <BreakDownPizza orders={orders} />
        </tbody>
      </Table>
    </>
  );
};

export default Employee;
