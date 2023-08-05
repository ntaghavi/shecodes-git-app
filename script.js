import axios from "axios";
let wdays = [
  "Sunday",
  "Monday",
  "TuesDay",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let urlKey = "bf54175800a55e59e6c4d6461deeef12";

function isInArray(array, city) {
  for (let index = 0; index < array.length; index++) {
    if (array[index] === city) {
      return true;
    }
  }
  return false;
}

function formatClk(num) {
  if (num < 10) {
    return `0${num}`;
  } else {
    return num;
  }
}
let now = new Date();
let wday = wdays[now.getDay()];
let clock = ` ${formatClk(now.getHours())}:${formatClk(now.getMinutes())}`;
let searchedCity = "";
let currentTemp = document.querySelector("#city-current-temp");
var dayElement = document.getElementById("city-current-wday");
dayElement.innerHTML = wday;
var clk = document.getElementById("city-current-clock");
clk.innerHTML = clock;
var searchForm = document.getElementById("search-form");
function handleAxiosResponse(response) {
  alert("Working");
  let city = document.getElementById("city-name");
  let hum = document.getElementById("city-current-humidity");
  let wind = document.getElementById("city-current-wind");
  let weatherD = document.getElementById("weather-d");
  let emo = document.getElementById("w-em");
  var iconcode = response.data.weather[0].icon;
  var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
  emo.src = iconurl;
  city.innerHTML = response.data.name;
  weatherD.innerHTML = response.data.weather[0].main;
  currentTemp.innerHTML = Math.round(response.data.main.temp);
  hum.innerHTML = Math.round(response.data.main.humidity);
  wind.innerHTML = Math.round(response.data.wind.speed);
}
function getCityCoords(cityName) {
  let cityApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${urlKey}`;
  axios.get(cityApiUrl).then((response) => {
    let coords = {
      lat: response.data[0].lat,
      lon: response.data[0].lon,
    };
    alert(coords);
    return coords;
  });
}

function handleForecast(response) {}
function formEvent(event) {
  event.preventDefault();
  let searchText = document.querySelector("#search-text-input");

  searchedCity = searchText.value;
  let urlApiWeather = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${urlKey}&&units=metric`;
  let forecastUrl = `api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt=5&appid=${urlKey}&&units=metric`;
  axios.get(urlApiWeather).then(handleAxiosResponse);
}
searchForm.addEventListener("submit", formEvent);

let cel = document.getElementById("celcius");
let far = document.getElementById("farenheit");
var celTemp = currentTemp.innerHTML;
function celToFar(cel) {
  return cel * 1.8 + 32;
}
cel.addEventListener("click", () => {
  currentTemp.innerHTML = celTemp;
});

far.addEventListener("click", () => {
  currentTemp.innerHTML = celToFar(celTemp);
});

let loc = document.getElementById("gps");
loc.addEventListener("click", handleGps);
function handlePosition(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  alert(`lat: ${lat} lon: ${lon}`);
  let coordApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${urlKey}&&units=metric`;
  axios.get(coordApi).then(handleAxiosResponse);
}
function handleGps() {
  alert("gps handle");
  navigator.geolocation.getCurrentPosition(handlePosition);
}
