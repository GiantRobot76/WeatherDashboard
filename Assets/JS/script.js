$(document).ready(function () {
  var searchButton = $("#search-button");
  var cityInput = $("#city-input");
  var cityList = $("#city-list");
  var currentCity;
  var appendedItems = 0;
  var requestUrl;
  var fcstRequestURL = "";
  var cityName = $("#city-name");
  var localTemperature = $("#temp");
  var localWind = $("#wind");
  var localHumidity = $("#humidity");
  var localUV = $("#UV");
  var cityLat;
  var cityLon;

  //array used to manage and render local storage. Initialized to Empty or to Contain saved key:value pairs
  var savedCities = JSON.parse(localStorage.getItem("weathercities")) || [];

  function renderSavedItems() {
    for (var i = 0; i < savedCities.length; i++) {
      currentCity = savedCities[i].cityname;
      var appendLi = $("<button>")
        .addClass("list-item")
        .attr("id", currentCity)
        .text(currentCity)
        .on("click", function () {
          currentCity = $(this).text();
          requestUrl =
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            currentCity +
            "&units=imperial&appid=255055a794435e93d10c1986c06d9c9b";

          getWeatherAPI();
        });
      cityList.append(appendLi);
    }
  }

  function getWeatherAPI() {
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
        //   console.log(data);

        localTemperature.text(data.main.temp);
        localWind.text(data.wind.speed);
        localHumidity.text(data.main.humidity);
        cityLat = data.coord.lat;
        cityLon = data.coord.lon;
        // console.log(cityLat);
        // console.log(cityLon);

        var newReqUrl =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          cityLat +
          "&lon=" +
          cityLon +
          "&exclude=minutely,hourly&units=imperial&appid=255055a794435e93d10c1986c06d9c9b";

        fetch(newReqUrl)
          .then(function (response) {
            return response.json();
          })
          .then(function (data2) {
            localUV.text(data2.current.uvi);
          });
      });

    //reconfigure request URL for OpenWeatherMap "One Call API Query Required Here"

    // fetch(newReqUrl).then(function (response) {
    //   return response.json();
    //   console.log("ok");
    // });
  }

  //https://api.openweathermap.org/data/2.5/onecall?lat=35.6895&lon=139.6917&exclude=minutely,hourly&units=imperial&appid=255055a794435e93d10c1986c06d9c9b

  //on click append button to list and pull weather for input city
  searchButton.on("click", function (event) {
    event.preventDefault();

    //get city in input field. If it is two words, replace the " " with a "+" as required by the API"
    currentCity = cityInput.val().replace(" ", "+").trim();

    //keep original format for 2 name cities for display on appended li
    var formatCity = currentCity.replace("+", " ");

    //build request URL using base API string and input city name
    requestUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      currentCity +
      "&units=imperial&appid=255055a794435e93d10c1986c06d9c9b";
    getWeatherAPI();

    //append new item to list with properties and click event functionality
    var appendLi = $("<button>")
      .addClass("list-item")
      .attr("id", currentCity)
      .text(formatCity)
      .on("click", function () {
        currentCity = $(this).text();
        requestUrl =
          "https://api.openweathermap.org/data/2.5/weather?q=" +
          currentCity +
          "&units=imperial&appid=255055a794435e93d10c1986c06d9c9b";

        getWeatherAPI();
      });

    cityList.append(appendLi);
    cityInput.val("");

    //store appended city in local storage
    appendedItems++;
    savedCities.push({ citynum: appendedItems, cityname: currentCity });
    localStorage.setItem("weathercities", JSON.stringify(savedCities));
  });
  renderSavedItems();
});
