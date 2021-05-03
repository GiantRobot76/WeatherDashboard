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
  var bigIcon = $("#big-icon");
  var cityLat;
  var cityLon;
  var fcst1Date = $("#day-1-date");
  var fcst2Date = $("#day-2-date");
  var fcst3Date = $("#day-3-date");
  var fcst4Date = $("#day-4-date");
  var fcst5Date = $("#day-5-date");
  var fcst1Temp = $("#day-1-temp");
  var fcst2Temp = $("#day-2-temp");
  var fcst3Temp = $("#day-3-temp");
  var fcst4Temp = $("#day-4-temp");
  var fcst5Temp = $("#day-5-temp");

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

        var newReqUrl =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          cityLat +
          "&lon=" +
          cityLon +
          "&exclude=minutely,hourly&units=imperial&appid=255055a794435e93d10c1986c06d9c9b";

        console.log(newReqUrl);

        fetch(newReqUrl)
          .then(function (response) {
            return response.json();
          })
          .then(function (data2) {
            localUV.text(data2.current.uvi);

            //Current Day Icon
            var iconRef = data2.current.weather[0].icon;
            bigIcon.attr(
              "src",
              "https://openweathermap.org/img/wn/" + iconRef + "@2x.png"
            );

            // Set fcst dates
            var day1 = data2.daily[0].dt;
            var day2 = data2.daily[1].dt;
            var day3 = data2.daily[2].dt;
            var day4 = data2.daily[3].dt;
            var day5 = data2.daily[4].dt;

            fcst1Date.text(moment.unix(day1).format("MM/DD/YY"));
            fcst2Date.text(moment.unix(day2).format("MM/DD/YY"));
            fcst3Date.text(moment.unix(day3).format("MM/DD/YY"));
            fcst4Date.text(moment.unix(day4).format("MM/DD/YY"));
            fcst5Date.text(moment.unix(day5).format("MM/DD/YY"));

            // Set fcst temps
            var day1 = data2.daily[0].temp.day;
            var day2 = data2.daily[1].temp.day;
            var day3 = data2.daily[2].temp.day;
            var day4 = data2.daily[3].temp.day;
            var day5 = data2.daily[4].temp.day;

            fcst1Temp.text(day1);
            fcst2Temp.text(day2);
            fcst3Temp.text(day3);
            fcst4Temp.text(day4);
            fcst5Temp.text(day5);
          });
      });
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
