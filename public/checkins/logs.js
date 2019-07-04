// Making a map and tiles
const mymap = L.map("checkinMap").setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreet';
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

getData();
async function getData() {
  const response = await fetch("/api");
  const data = await response.json();
  console.log(data);

  for (item of data) {
    const marker = L.marker([item.lat, item.lon]).addTo(mymap);
    txt = `The weather in ${item.city} at ${item.lat}&deg, ${
      item.lon
    }&deg; is ${item.weather.summary} with a temperature of ${
      item.weather.temperature
    }&deg degrees F.</br>`;

    if (item.air.value < 0) {
      txt += ` No air quality reading.`;
    } else {
      txt += `Air quality is ${item.air.value}${item.air.unit}.`;
    }
    marker.bindPopup(txt);
    console.log("Data from db ", data);
  }

  // for (item of data) {
  //   const root = document.createElement("div");
  //   const geoContainer = document.createElement("div");
  //   const geoLat = document.createElement("p");
  //   const geoLon = document.createElement("p");
  //   const dateContainer = document.createElement("div");
  //   const date = document.createElement("p");

  //   root.className = "card-container";
  //   geoContainer.className = "geo-container";
  //   dateContainer.className = "date-time-container";
  //   geoLat.textContent = `Lat: ${item.lat}`;
  //   geoLon.textContent = `Lon: ${item.lon}`;
  //   const dateString = new Date(item.time).toLocaleString();
  //   date.textContent = dateString;

  //   dateContainer.append(date);
  //   geoContainer.append(geoLat, geoLon);
  //   root.append(geoContainer, dateContainer);
  //   document.body.append(root);
  // }
}
