// user enters/clicks city name:
//  * fetch current weather and display
//  * fetch 5-day forecast and display
//  * add the city to local storage
//  * append city to recents

var key = "12bc64a3e0930862a15da754f74d5af8";

var forecastEl = $('.forecast');
var searchFormEl = $('#searchForm')
var cityInputEl = $('#cityInput');

// get city coordinates with a call to the Current Weather API
function getCoords(city) {
  // console.log(url);
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;

  fetch(url)
    .then(function (response)  {
      // console.log(response);
      if(response.status === 404){
        console.log('404');
        return;
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      console.log(lat + ' , ' + lon);
      getWeather(lat, lon, city);
    });
}

// get weather data with a call to the One Call API
function getWeather(x, y, cityName) {
  var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${x}&lon=${y}&exclude=minutely,hourly,alerts&appid=${key}&units=imperial`
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      renderCurrentWeather(data, cityName);

    })
}

searchFormEl.on('submit', function(event) {
  event.preventDefault();
  var cityInput = cityInputEl.val();
  getCoords(cityInput);
  
})

function renderCurrentWeather(retrievedData, city){
  var date = moment().format("M[/]D[/]YYYY");
  var iconCode = retrievedData.current.weather.icon;
  var iconEl = $('#icon-0');
  iconEl.attr('src', `http://openweathermap.org/img/wn/${iconCode}.png`)
  
  $('.cityName').text(city + ' (' + date + ') ');

  var tempEl = $('#temp-0');
  var temp = retrievedData.current.temp;
  tempEl.text(temp + '°F');

  var windEl = $('#wind-0');
  var wind = retrievedData.current.wind_speed;
  windEl.text(wind + ' MPH');

  var humidityEl = $('#humidity-0');
  var humidity = retrievedData.current.humidity;
  humidityEl.text(humidity + ' %');

  var uvEl = $('#uv');
  var uvIndex = retrievedData.current.uvi;
  uvEl.text(uvIndex);
}
