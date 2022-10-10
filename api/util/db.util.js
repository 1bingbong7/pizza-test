const mongoose = require("mongoose");
const mongoDbUrl = process.env.ATLAS_URI;

const connectToDB = () => {
  let db = mongoose.connection;
  db.on("error", () => {
    console.error.bind(console, "connection error:");
  });
  db.once("open", (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Connected to MongoDB at", mongoDbUrl);
    }
  });
  db.on("close", () => {
    console.log("Connection closed");
  });
  db.on("reconnect", () => {
    console.log("Reconnected");
  });

  mongoose.connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = {
  connectToDB,
};
