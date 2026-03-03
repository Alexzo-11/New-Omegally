const express = require("express");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

app.get("/products", (req, res) => {
  res.json([{ id: 1, name: "Sample Product", price: 100 }]);
});

module.exports.handler = serverless(app);