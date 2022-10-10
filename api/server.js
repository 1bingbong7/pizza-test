require("dotenv").config();
const express = require("express");
const parser = require("body-parser");
const cors = require("cors");
const { connectToDB } = require("./util/db.util");

const app = express();

// express body parser so we get JSON bodies always
app.use(cors());
app.use(parser.json({ limit: "1mb" }));
app.use(parser.urlencoded({ limit: "1mb", extended: true }));
app.use(function (error, req, res, next) {
  if (error.type === "entity.parse.failed") {
    res
      .status(error.statusCode)
      .send(`Failed to parse request payload: ${error.body}`);
  } else {
    next();
  }
});

const { router_order } = require("./routers/order.router")

const mounts_and_routers = {
    '/order': router_order
};

//mounting routes
for (const [mount, router] of Object.entries(mounts_and_routers)) {
    app.use(mount, router);
}

// 404 handler. Added after all routes are mounted as per express documentation.
app.use((req, res) => {
  res.status(404).json({ message: "Not found" }).end();
});

const port = process.env.PORT || 5000;
const start = `### SERVER @ PORT ${port} ###`;
const listener = () => console.info(start);

connectToDB();

app.listen(port, listener);


module.exports = app;
