// server.js
// where your node app starts

const express = require("express");

// needed for /stats route, remove for production, not needed there.
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();

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
          console.log(results);
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
  response.sendFile(__dirname + "/views/plotly.html");
});

app.get("/old", (req, res) => {
  res.sendFile(__dirname + "/views/index-old.html");
});

app.get("/plot", (req, res) => {
  res.sendFile(__dirname + "/views/plotly.html");
});

app.get("/total", (req, res) => {
  res.sendFile(__dirname + "/views/stream-total.html");
});

// parse stats prototype
app.get("/stats", (req, res) => {
  console.log("hello stats");
  let url = "http://peridot.streamguys.com:5400/8.xsl";
  axios(url)
    // .then(response => console.log(response))
    .then(data => {
      const $ = cheerio.load(data.data);
      let stats = $("body")
        .html()
        .split("<br>");
      let kgnu = stats[0].split(",").slice(0, 2);
      let afm = stats[1].split(",").slice(0, 2);
      let dt = new Date();
      let currentStats = { datetime: dt, kgnu: kgnu[1], afterFM: afm[1] };

      console.log(currentStats);
      res.json(currentStats);
    })
    .catch(error => {
      console.log(error);
      res.send(error);
    });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
