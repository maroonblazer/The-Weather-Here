/* eslint-disable no-undef */
/* eslint-disable no-console */
const express = require("express");
const Datastore = require("nedb");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
// app.listen(port, listening);
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

// browser-sync
// const browserSync = require("browser-sync");
// function listening() {
//   console.log(`Demo server available on http://localhost:${port}`);
//   browserSync({
//     files: ["public/*.{html,js,css}", "public/checkins/*.{html,js,css}"],
//     online: false,
//     open: false,
//     port: port + 1,
//     proxy: "localhost:" + port,
//     ui: false
//   });
// }

const db = new Datastore("database.db");
db.loadDatabase();

app.post("/api", receiveCoords);

app.get("/api", (req, res) => {
  db.find({}, (err, data) => {
    if (err) {
      res.end();
      return;
    }
    res.json(data);
  });
});

function receiveCoords(req, res) {
  const data = req.body;
  const time = Date.now();
  data.time = time;
  db.insert(data);
  res.json(data);
}

app.get("/weather/:latlon", async (request, response) => {
  const latlon = request.params.latlon.split(",");
  const lat = latlon[0];
  const lon = latlon[1];

  // Call Google API to get city
  const geo_api_key = process.env.GOOGLE_API_KEY;
  const geoLocURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&sensor=true&key=${geo_api_key}`;
  const geoResponse = await fetch(geoLocURL);
  const geo_data = await geoResponse.json();
  const city = geo_data.results[1].address_components[3].long_name;
  console.log(`From Google: ${city}`);

  const weather_api_key = process.env.WEATHER_API_KEY;
  const weather_url = `https://api.darksky.net/forecast/${weather_api_key}/${lat},${lon}`;
  const weather_response = await fetch(weather_url);
  const weather_data = await weather_response.json();

  const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
  const aq_response = await fetch(aq_url);
  const aq_data = await aq_response.json();

  const data = {
    city: city,
    weather: weather_data,
    air_quality: aq_data
  };
  response.json(data);
});
