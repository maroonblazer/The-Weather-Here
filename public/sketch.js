// Geo Locate
function getCoords() {
  let lat, lon, weather, air, city;
  if ("geolocation" in navigator) {
    console.log("geolocation available");
    navigator.geolocation.getCurrentPosition(async position => {
      let lat, lon, weather, air, city, air_value, air_value_unit;
      try {
        lat = position.coords.latitude;
        lon = position.coords.longitude;

        document.getElementById("latitude").textContent = lat.toFixed(2);
        document.getElementById("longitude").textContent = lon.toFixed(2);
        const api_url = `/weather/${lat},${lon}`;
        const response = await fetch(api_url);
        const json = await response.json();
        console.log(json);
        weather = json.weather.currently;
        city = json.city;
        if (json.air_quality.results[0]) {
          console.log("We have air data for", city);
          air = json.air_quality.results[0].measurements[0];
          air_value = air.value;
          air_value_unit = air.unit;
          document.getElementById("air-value").textContent = air_value;
          document.getElementById(
            "air-value-units"
          ).textContent = air_value_unit;
        } else {
          console.log("Boooo...no air data for", city);
          document.getElementById("air-value").textContent = "NO READING";
          air = { value: -1 };
        }
        document.getElementById("summary").textContent = weather.summary;
        document.getElementById("temperature").textContent =
          weather.temperature;
        document.getElementById("city").textContent = city;
      } catch (error) {
        // console.error(error);
        air = { value: -1 };
        console.log("Something went wrong...");
        document.getElementById("air-value").textContent = "NO READING";
      }

      const data = { lat, lon, weather, city, air };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      };
      const db_response = await fetch("/api", options);
      const db_json = await db_response.json();
      console.log(db_json);
    });
  } else {
    console.log("geolocation not available");
  }
}
getCoords();
