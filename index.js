const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/v1");
const app = express();

//var dbUrl = "mongodb://127.0.0.1:27017/charts";
var dbUrl =
  "mongodb+srv://task-1:task-1@charts.s7wyp.mongodb.net/the-charts?retryWrites=true&w=majority";

//connecting DB
mongoose.connect(dbUrl, {
  useNewUrlParser: "true",
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
  console.log("err", err);
});

mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected");
});

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());

// v1 api routes
app.use("/v1", routes);

app.get("/", (req, res, next) => {
  res.send("Its running.");
});

app.listen(9000, () => {
  console.log("Server running on port 9000");
});
