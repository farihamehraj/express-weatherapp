/*
  A weather app created using node.js and express, which displays weather data on a webpage with the use of the OpenWeatherMap API. 
  The data is fetched from the API with the use of Axios.
  The user must enter the name of a city and that city's weather data will be displayed.
  The server is running on the defined port - in this case port 3000.
*/

import express from "express"; // imports express
import bodyParser from "body-parser"; // middleware
import axios from "axios"; // HTTP

const app = express(); // express app
const port = 3000; //localhost3000

const apiKey = "32e727c7767d7e70711658af037ca6fc"; // openweather api key

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

/*

*/
app.get("/", async (req, res) => {
  res.render("index", { weather: null, error: null });
});

app.post("/", async (req, res) => {
  let city = req.body.city; // user defined city
  // fetch weather data from openweathermap api
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  /*
    Using axios, fetch the weather data from openweathermap api and display the data on the web.
  */
  try {
    const response = await axios.get(url);
    const weather = response.data;
    const weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
    const icon = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    const weatherData = {
      /* 
        The weather data being fetched consists of:
          Temperature
          What it feels like
          Humidity
          Pressure
          Wind Speed
          Weather Description
      */
      temperature: weather.main.temp,
      feelsLike: weather.main.feels_like,
      humidity: weather.main.humidity,
      pressure: weather.main.pressure,
      windSpeed: weather.wind.speed,
      weatherDescription: weather.weather[0].description,
    };
    res.render("index", {
      weather: weatherText,
      error: null,
      icon: icon,
      cityName: weather.name,
      weatherData: weatherData,
    });
  } catch (error) {
    console.error("Error:", error);
    res.render("index", {
      weather: null,
      error: "Error, please try again",
      icon: null,
      cityName: null,
      weatherData: null,
    });
  }
});

/*
  The server is running on the defined port - in this case port 3000.
*/
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
