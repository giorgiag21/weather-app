function getCurrentDate() {
  let now = new Date();
  let currentDate = document.querySelector("#current-date");

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[now.getDay()];
  let date = now.getDate();
  let months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  let month = months[now.getMonth()];
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let year = now.getFullYear();
  currentDate.innerHTML = `${day} ${date}/${month} ${hours}:${minutes}`;
}

function handleSubmit(event) {
  event.preventDefault();
  let searchedCity = document.querySelector("#searched-city");
  let currentCity = document.querySelector("#current-city");
  let city = searchedCity.value;
  currentCity.innerHTML = `${city}`;
  getCity(city);
}

function getCity(city) {
  let apiKey = "d81f820cfaf81e0086fca627dfb90697";
  let unit = "metric";
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?`;
  let apiUrl = `${apiEndpoint}q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayWeather);
}

function displayWeather(response) {
  let temperature = Math.round(response.data.main.temp);
  let currentTemperature = document.querySelector("#current-temp");
  currentTemperature.innerHTML = `${temperature}`;

  let maxTemperature = Math.round(response.data.main.temp_max);
  let currentMaxTemperature = document.querySelector("#current-max-temp");
  currentMaxTemperature.innerHTML = `${maxTemperature}`;

  let minTemperature = Math.round(response.data.main.temp_min);
  let currentMinTemperature = document.querySelector("#current-min-temp");
  currentMinTemperature.innerHTML = `${minTemperature}`;

  let weatherDescription = response.data.weather[0].description;
  let currentWeatherDescription = document.querySelector(
    "#weather-description"
  );
  currentWeatherDescription.innerHTML = `${weatherDescription}`;

  let windSpeed = response.data.wind.speed;
  let currentWindSpeed = document.querySelector("#wind-speed");
  currentWindSpeed.innerHTML = `${windSpeed}`;
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(inputCurrentPosition);
}

function inputCurrentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "d81f820cfaf81e0086fca627dfb90697";
  let unit = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndpoint}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(getCurrentLocationName);
}

function getCurrentLocationName(response) {
  let currentLocationName = response.data.name;
  let currentCity = document.querySelector("#current-city");
  let city = currentLocationName;
  currentCity.innerHTML = `${city}`;
  getCity(city);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temp");
  let temperature = currentTemperature.innerHTML;
  temperature = Number(temperature);
  currentTemperature.innerHTML = Math.round((temperature * 9) / 5 + 32);
}

function convertToCelsius() {
  let currentTemperature = document.querySelector("#current-temp");
  let temperature = currentTemperature.innerHTML;
  currentTemperature.innerHTML = Math.round(((temperature - 32) * 5) / 9);
}

getCurrentDate();

let searchCityForm = document.querySelector(".search-city-form");
searchCityForm.addEventListener("submit", handleSubmit);

let currentPositionButton = document.querySelector("#current-position-button");
currentPositionButton.addEventListener("click", getCurrentPosition);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
let celsiusLink = document.querySelector("#celsius-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);
celsiusLink.addEventListener("click", convertToCelsius);
