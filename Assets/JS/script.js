var searchButton = $("#search-button");
var cityInput = $("#city-input");
var currentCity;

var requestUrl;
//   "https://api.openweathermap.org/data/2.5/weather?q=los+angeles&appid=255055a794435e93d10c1986c06d9c9b";
// "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=255055a794435e93d10c1986c06d9c9b"

var fcstRequestURL = "";

var cityName = $("#city-name");
var localTemperature = $("#temp");
var localWind = $("#wind");
var localHumidity = $("#humidity");
var cityLat;
var cityLon;

function getCurrentWeatherAPI() {
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.cod == "404") {
        cityName.text("City Not Found");
        return;
      }
      cityName.text(data.name);
      console.log(data);

      if (data.cod == "404") {
      }

      localTemperature.text(data.main.temp);
      localWind.text(data.wind.speed);
      localHumidity.text(data.main.humidity);
      cityLat = data.coord.lat;
      cityLon = data.coord.lon;
      console.log(cityLat);
      console.log(cityLon);
    });
}

//set URL for forecast and UV data

// var rootString = "https://api.openweathermap.org/data/2.5/onecall?";
// var remainder =
//   "lat=" +
//   cityLat +
//   "&lon=" +
//   cityLon +
//   "&appid=255055a794435e93d10c1986c06d9c9b";
// var fcstURL = rootString + remainder;
// console.log(fcstURL);

// function getFcstAPI() {
//   fetch(fcstRequestURL)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//     });
// }

//on click append button to list and pull weather for input city
searchButton.on("click", function (event) {
  event.preventDefault();

  //get city in input field. If it is two words, replace the " " with a "+" as required by the API"
  currentCity = cityInput.val().replace(" ", "+").trim();
  requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    currentCity +
    "&units=imperial&appid=255055a794435e93d10c1986c06d9c9b";
  getCurrentWeatherAPI();
});
