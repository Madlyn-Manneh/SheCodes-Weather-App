function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${Math.round(response.data.wind.speed)}km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "deb734a4a90t54bo80eaa3af0c4619aa";
  let currentWeatherUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios.all([axios.get(currentWeatherUrl), axios.get(forecastUrl)]).then(
    axios.spread(function (currentWeatherResponse, forecastResponse) {
      refreshWeather(currentWeatherResponse);

      displayWeatherData(forecastResponse.data);
    })
  );
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");

  searchCity(searchInput.value);
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Paris");

function displayWeatherData(data) {
  let dailyForecast = data.daily;

  dailyForecast.forEach((day, index) => {
    let emogiElement = document.getElementById(`forecast-emogi-${index}`);
    emogiElement.innerHTML = `
      <img src="${day.condition.icon_url}" alt="${day.condition.icon}">
      <p class="forecast-details">
        <span id="max-${index}">${Math.round(
      day.temperature.maximum
    )}°</span> &nbsp
        <span id="min-${index}">${Math.round(day.temperature.minimum)}°</span>
      </p>`;
  });
}
