// a Simple Weather library for OpenWeatherMap

function $(e) { return document.getElementById(e); }

var simpleWeather = {

  weather: function(options) {
    options = ({
      appkey: "",
      location: "",
      woeid: "",
      unit: "f",
      success: function(weather){/*takes function passed from main*/},
      error: function(message){/*takes function passed from main*/}
    }, options);

    let searchLink = "https://api.openweathermap.org/data/2.5/weather?q=" + options.location + "&appid=" + options.appkey;
    httpRequestAsync(searchLink, function (response) {
      let jsonObject = JSON.parse(response);
      weather.city = jsonObject.name;
      weather.temp = parseInt(jsonObject.main.temp - 273);// + "°";
      weather.humidity = jsonObject.main.humidity + "%";
      weather.wind = jsonObject.wind.speed;

      let id = jsonObject.weather[0].id;
      let unixTime = Math.floor((new Date()).getTime() / 1000);
      if (jsonObject.sys.sunrise <= unixTime && unixTime <= jsonObject.sys.sunset) {
        weather.icon = "wi-owm-day-" + id;
      } else {
        weather.icon = "wi-owm-night-" + id;
      }

      //options.success(weather);
    });
    searchLink = "https://api.openweathermap.org/data/2.5/forecast?q=" + options.location + "&appid=" + options.appkey;
    httpRequestAsync(searchLink, function (response) {
      let jsonObject = JSON.parse(response);
      weather.forecast = [];
      let forecast = {};
      forecast.icon = "wi-owm-day-" + jsonObject.list[0].weather[0].id;
      weather.forecast.push(forecast);

      options.success(weather);
    });
  }
}

let city = document.getElementById("city");
let icon = document.getElementById("icon");
let temperature = document.getElementById("temp");
let humidity = document.getElementById("humid");

function getWeather(query, appKey) {
  let searchLink = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appKey;
  httpRequestAsync(searchLink, theResponse);
}

function theResponse(response) {
  let jsonObject = JSON.parse(response);
  city.innerHTML = jsonObject.name;
  //icon.src = "http://openweathermap.org/img/w/" + jsonObject.weather[0].icon + ".png";
  temperature.innerHTML = parseInt(jsonObject.main.temp - 273) + "°";
  humidity.innerHTML = jsonObject.main.humidity + "%";

  let id = jsonObject.weather[0].id;
  let unixTime = Math.floor((new Date()).getTime() / 1000);
  if (jsonObject.sys.sunrise <= unixTime && unixTime <= jsonObject.sys.sunset) {
    icon.classList.add("wi-owm-day-" + id);
  } else {
    icon.classList.add("wi-owm-night-" + id);
  }
}

function httpRequestAsync(url, callback)
{
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => { 
    if (httpRequest.readyState == 4 && httpRequest.status == 200)
      callback(httpRequest.responseText);
  }
  httpRequest.open("GET", url, true); // true for asynchronous 
  httpRequest.send();
}
