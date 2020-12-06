// server.js

const express = require("express");
const app = express();
const helmet = require('helmet')

const port = 3000

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// read .env file on production
require("dotenv").config();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// setup MongoDB connection
var MongoClient = require("mongodb").MongoClient;
const connectionString = process.env.MONGO_URI;

// server side routes
MongoClient.connect(connectionString, {
  useUnifiedTopology: true
})
  .then(client => {
    // console.log("Connected to Database");
    const db = client.db("kgnu");

    app.get("/one", (req, res) => {
      db.collection("stream_listeners")
        .findOne()
        .then(results => {
          // console.log(results);
          res.json(results);
        })
        .catch(error => console.error(error));
    });

    app.get("/week", (req, res) => {
      const col = db.collection("stream_listeners");
      // 1 week = 7*24*4 = 678 entries
      col
        .find()
        .limit(678)
        .sort({ date: -1 })
        .toArray()
        .then(results => {
          res.json(results);
        })
        .catch(error => console.error(error));
    });
  })
  .catch(error => console.error(error));

// client side routes
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/streams", function(request, response) {
  response.sendFile(__dirname + "/views/stream-total.html");
});

app.get("/all", function(request, response) {
  response.sendFile(__dirname + "/views/plotly.html");
});

app.use(function (req, res, next) {
  res.status(404).send("Sorry, couldn't find that!")
})

// listen for requests :)
var listener = app.listen(process.env.PORT || port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
