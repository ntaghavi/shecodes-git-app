let wdays = [
  "Sunday",
  "Monday",
  "TuesDay",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let fwdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
let urlKey = "97bed167ec49bff56e6c1b63daef9c86";
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
let dayIndex = now.getDay();
let wday = wdays[dayIndex];
let clock = ` ${formatClk(now.getHours())}:${formatClk(now.getMinutes())}`;
let searchedCity = "";
let celt = 0;
getInstantTemp("Tehran");
let currentTemp = document.querySelector("#city-current-temp");
var dayElement = document.getElementById("city-current-wday");
dayElement.innerHTML = wday;
var clk = document.getElementById("city-current-clock");
clk.innerHTML = clock;
var searchForm = document.getElementById("search-form");
function handleAxiosResponse(response) {
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
  celt = Math.round(response.data.main.temp);
  hum.innerHTML = Math.round(response.data.main.humidity);
  wind.innerHTML = Math.round(response.data.wind.speed);
}
function getInstantTemp(city) {
  let urlApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${urlKey}&&units=metric`;
  axios.get(urlApi).then(handleAxiosResponse);
  getCityCoords(city);
}

function handleForecast(response) {
  let forecasts = response.data.daily;
  console.log(forecasts);
  let forecastSection = document.getElementById("forecast-section");
  forecastSection.innerHTML = "";
  let fi = dayIndex;
  for (let index = 0; index < 5; index++) {
    let twdIndex = fi + 1;
    if (twdIndex < 7) {
      fi = twdIndex;
    } else {
      fi = 0;
    }

    let iconSrc = `http://openweathermap.org/img/w/${forecasts[index].weather[0].icon}.png`;
    let updateHtml = `<div class="col-2 card forecast-day">
                <p class="card-title day">${fwdays[fi]}</p>
                <img src="${iconSrc}" class="emoji" id="w-em"/>
                <span class="card-subtitle">${Math.round(
                  forecasts[index].temp.min
                )}&deg; / <span class="max-t">${Math.round(
      forecasts[index].temp.max
    )}&deg;</span></span> 
            </div>`;
    forecastSection.innerHTML += updateHtml;
  }
}
function handleForecastUrl(response) {
  let coords = [
    response.data[0].lat.toFixed(2),
    response.data[0].lon.toFixed(2),
  ];
  console.log(coords);
  let forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords[0]}&lon=${coords[1]}&cnt=5&appid=${urlKey}&&units=metric`;

  axios.get(forecastUrl).then(handleForecast);
}
function getCityCoords(cityName) {
  let cityApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${urlKey}`;

  axios.get(cityApiUrl).then(handleForecastUrl);
}

function formEvent(event) {
  event.preventDefault();
  let searchText = document.querySelector("#search-text-input");

  searchedCity = searchText.value;
  let urlApiWeather = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${urlKey}&&units=metric`;
  getCityCoords(searchedCity);

  axios.get(urlApiWeather).then(handleAxiosResponse);
}
searchForm.addEventListener("submit", formEvent);

let cel = document.getElementById("celcius");
let far = document.getElementById("farenheit");
var celTemp = currentTemp.innerHTML;
function celToFar(cel) {
  return cel * 1.8 + 32;
}
function celEvent() {
  currentTemp.innerHTML = celt;
}
function farEvent() {
  currentTemp.innerHTML = celToFar(celt);
}
cel.addEventListener("click", celEvent);

far.addEventListener("click", farEvent);

let loc = document.getElementById("gps");
loc.addEventListener("click", handleGps);
function handlePosition(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  console.log(`lat: ${lat} lon: ${lon}`);
  let forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&cnt=5&appid=${urlKey}&&units=metric`;
  let coordApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${urlKey}&&units=metric`;
  axios.get(coordApi).then(handleAxiosResponse);
  axios.get(forecastUrl).then(handleForecast);
}
function handleGps() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}
