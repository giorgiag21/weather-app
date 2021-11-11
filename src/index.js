function getCurrentDate() {
  let now = new Date();
  let currentDate = document.querySelector("#current-date");

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[now.getDay()];

  let date = now.getDate();

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
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

  currentDate.innerHTML = `${day}, ${date} ${month}, ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
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
  celsiusTemperature = response.data.main.temp;
  let currentTemperature = document.querySelector("#current-temp");
  currentTemperature.innerHTML = Math.round(`${celsiusTemperature}`);

  let maxTemperature = response.data.main.temp_max;
  let currentMaxTemperature = document.querySelector("#current-max-temp");
  currentMaxTemperature.innerHTML = Math.round(`${maxTemperature}`);

  let minTemperature = response.data.main.temp_min;
  let currentMinTemperature = document.querySelector("#current-min-temp");
  currentMinTemperature.innerHTML = Math.round(`${minTemperature}`);

  let weatherDescription = response.data.weather[0].description;
  let currentWeatherDescription = document.querySelector(
    "#weather-description"
  );
  currentWeatherDescription.innerHTML = `${weatherDescription}`;

  let humidity = response.data.main.humidity;
  let currentHumidity = document.querySelector("#current-humidity");
  currentHumidity.innerHTML = `${humidity}`;

  let windSpeed = response.data.wind.speed;
  let currentWindSpeed = document.querySelector("#wind-speed");
  currentWindSpeed.innerHTML = `${windSpeed}`;

  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "d81f820cfaf81e0086fca627dfb90697";
  let unit = "metric";
  let endPoint = `https://api.openweathermap.org/data/2.5/onecall?`;
  let apiUrl = `${endPoint}lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6 && index > 0) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col">
      <div class="day">
        <h6>${formatDay(forecastDay.dt)}</h6>
      </div>

      <div class="date">
        <h6>18/10</h6>
      </div>

      
        <img
          src="https://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
      
      
      <div class="max-min">
        <span class="max-temp">${Math.round(
          forecastDay.temp.max
        )}°</span> <span>${Math.round(forecastDay.temp.min)}°</span>
      </div>
    </div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
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
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let currentTemperature = document.querySelector("#current-temp");
  currentTemperature.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
}

function convertToCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let currentTemperature = document.querySelector("#current-temp");
  currentTemperature.innerHTML = Math.round(celsiusTemperature);
}

getCurrentDate();

getCity("Milan");

let celsiusTemperature = null;

let searchCityForm = document.querySelector(".search-city-form");
searchCityForm.addEventListener("submit", handleSubmit);

let currentPositionButton = document.querySelector("#current-position-button");
currentPositionButton.addEventListener("click", getCurrentPosition);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
let celsiusLink = document.querySelector("#celsius-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);
celsiusLink.addEventListener("click", convertToCelsius);

displayForecast();
