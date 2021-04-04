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
      var lat = data.coord.lat;
      var lon = data.coord.lon;
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
      renderWeatherData(data, cityName);
      createButton(cityName);

    })
}

searchFormEl.on('submit', function(event) {
  event.preventDefault();
  var cityInput = cityInputEl.val();
  getCoords(cityInput);
  
  
})

function renderWeatherData(retrievedData, city){
  // Current Weather //////////////////////////////////////
  var date = moment().format("M[/]D[/]YYYY");
  console.log(retrievedData);
  var iconCode = retrievedData.current.weather[0].icon;
  var iconEl = $('#icon-0');
  iconEl.attr('src', `http://openweathermap.org/img/wn/${iconCode}.png`)
  
  $('.cityName').text(city + ' (' + date + ') ');

  var tempEl = $('#temp-0');
  var temp = retrievedData.current.temp;
  tempEl.text(temp + ' °F');

  var windEl = $('#wind-0');
  var wind = retrievedData.current.wind_speed;
  windEl.text(wind + ' MPH');

  var humidityEl = $('#humidity-0');
  var humidity = retrievedData.current.humidity;
  humidityEl.text(humidity + ' %');

  var uvEl = $('#uv');
  var uvIndex = retrievedData.current.uvi;
  uvEl.text(uvIndex);

  // 5-Day Forecast ///////////////////////////////////////
  for(var i = 1; i < 6; i++){
    var day = moment().add(i, 'd').format("M[/]D[/]YYYY");
    var dateEl = $('#date-'+i);
    dateEl.text(day);

    iconCode = retrievedData.daily[i].weather[0].icon;
    console.log(iconCode);
    iconEl = $('#icon-'+i);
    console.log(iconEl);
    iconEl.attr('src', `http://openweathermap.org/img/wn/${iconCode}.png`);

    tempEl = $('#temp-'+i);
    temp = retrievedData.daily[i].temp.day;
    tempEl.text(temp + ' °F');

    windEl = $('#wind-'+i);
    wind = retrievedData.daily[i].wind_speed;
    windEl.text(wind + ' MPH');

    humidityEl = $('#humidity-'+i);
    humidity = retrievedData.daily[i].humidity;
    humidityEl.text(humidity + ' %');

  }
}

function createButton(buttonText) {
  var recentsListEl = $('#recentsList');
  var newButton = document.createElement('button');
  $(newButton).addClass('btn-block btn-secondary');
  $(recentsListEl).append(newButton);
  $(newButton).text(buttonText);
}