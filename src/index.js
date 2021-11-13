function getCurrentDate() {
  let now = new Date();
  let currentDate = document.querySelector("#current-date");

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];

  let date = now.getDate();

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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

  celsiusMaxTemperature = response.data.main.temp_max;
  let currentMaxTemperature = document.querySelector("#current-max-temp");
  currentMaxTemperature.innerHTML = Math.round(`${celsiusMaxTemperature}`);

  celsiusMinTemperature = response.data.main.temp_min;
  let currentMinTemperature = document.querySelector("#current-min-temp");
  currentMinTemperature.innerHTML = Math.round(`${celsiusMinTemperature}`);

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
  currentWindSpeed.innerHTML = Math.round(`${windSpeed}`);

  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function getForecast(coordinates) {
  let apiKey = "d81f820cfaf81e0086fca627dfb90697";
  let unit = "metric";
  let endPoint = `https://api.openweathermap.org/data/2.5/onecall?`;
  let apiUrl = `${endPoint}lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  forecast = response.data.daily;
  console.log(forecast);

  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6 && index > 0) {
      celsiusForecast[index] = {
        max: forecastDay.temp.max,
        min: forecastDay.temp.min,
      };
      forecastHTML =
        forecastHTML +
        `
    <div class="col">
      <div>
        <h6 id="day">${formatDay(forecastDay.dt)}</h6>
      </div>

      <div class="weather-icon">
        <img
          src="https://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
      </div>
      
      <div class="max-min">
        <span class="max-temp" id="max-temp-${index}">${Math.round(
          forecastDay.temp.max
        )}</span>° <span id="min-temp-${index}">${Math.round(
          forecastDay.temp.min
        )}</span>°
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
  let currentMaxTemperature = document.querySelector("#current-max-temp");
  currentMaxTemperature.innerHTML = Math.round(
    (celsiusMaxTemperature * 9) / 5 + 32
  );
  let currentMinTemperature = document.querySelector("#current-min-temp");
  currentMinTemperature.innerHTML = Math.round(
    (celsiusMinTemperature * 9) / 5 + 32
  );

  [1, 2, 3, 4, 5].forEach(function (index) {
    let dayMax = document.querySelector(`#max-temp-${index}`);
    let dayMin = document.querySelector(`#min-temp-${index}`);
    dayMax.innerHTML = Math.round((celsiusForecast[index].max * 9) / 5 + 32);
    dayMin.innerHTML = Math.round((celsiusForecast[index].min * 9) / 5 + 32);
  });
}

function convertToCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let currentTemperature = document.querySelector("#current-temp");
  currentTemperature.innerHTML = Math.round(celsiusTemperature);
  let currentMaxTemperature = document.querySelector("#current-max-temp");
  currentMaxTemperature.innerHTML = Math.round(celsiusMaxTemperature);
  let currentMinTemperature = document.querySelector("#current-min-temp");
  currentMinTemperature.innerHTML = Math.round(celsiusMinTemperature);
  [1, 2, 3, 4, 5].forEach(function (index) {
    let dayMax = document.querySelector(`#max-temp-${index}`);
    let dayMin = document.querySelector(`#min-temp-${index}`);
    dayMax.innerHTML = Math.round(celsiusForecast[index].max);
    dayMin.innerHTML = Math.round(celsiusForecast[index].min);
  });
}

getCurrentDate();

let celsiusTemperature = null;
let celsiusMaxTemperature = null;
let celsiusMinTemperature = null;
let forecast = null;
let celsiusForecast = [
  { max: 0, min: 0 },
  { max: 0, min: 0 },
  { max: 0, min: 0 },
  { max: 0, min: 0 },
  { max: 0, min: 0 },
];

getCity("Milan");

let searchCityForm = document.querySelector(".search-city-form");
searchCityForm.addEventListener("submit", handleSubmit);

let currentPositionButton = document.querySelector("#current-position-button");
currentPositionButton.addEventListener("click", getCurrentPosition);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
let celsiusLink = document.querySelector("#celsius-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);
celsiusLink.addEventListener("click", convertToCelsius);

displayForecast();
