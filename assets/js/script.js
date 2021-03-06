// don't look at the line below
var key = "12bc64a3e0930862a15da754f74d5af8";
// true if the search is not on the list
var newSearch = false;
// element selectors
var forecastEl = $('.forecast');
var searchFormEl = $('#searchForm')
var cityInputEl = $('#cityInput');
var cityListItems = $('#recentsList').children();
var searchAlertEl = $('#searchAlert');

// get the saved searches
var cities = JSON.parse(localStorage.getItem('cities'));
if(!cities) { 
  cities = []; 
}
// render the recent searches buttons
for(var i = 0; i < cities.length; i++){
  createButton(cities[i]);
}

function createButton(buttonText) {
  // create a button and add it to the list
  var recentsListEl = $('#recentsList');
  var newButton = document.createElement('button');
  $(newButton).attr('type', 'button');
  $(newButton).addClass('list-group-item list-group-item-action list-group-item-dark rounded text-center mt-3 py-1 cityButton');
  $(recentsListEl).append(newButton);
  $(newButton).text(buttonText);
  
  // add listener of clicks on the button
  $(newButton).click( function(event) {
    newSearch = false;
    getCoords($(newButton).text());
  })
}

// renders all the weather data
function renderWeatherData(retrievedData, city){
  // Current Weather //////////////////////////////////////

  var date = moment().format("M[/]D[/]YYYY");
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
  // render the data for a forecast card, loop 5 times
  for(var i = 1; i < 6; i++){
    var day = moment().add(i, 'd').format("M[/]D[/]YYYY");
    var dateEl = $('#date-'+i);
    dateEl.text(day);

    iconCode = retrievedData.daily[i].weather[0].icon;
    iconEl = $('#icon-'+i);
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
  // make the content visible
  $(forecastEl).removeClass('invisible');
}

// get weather data with a call to the OneCall API
function getWeather(x, y, cityName) {
  var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${x}&lon=${y}&exclude=minutely,hourly,alerts&appid=${key}&units=imperial`
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      renderWeatherData(data, cityName);
      if(newSearch){
        createButton(cityName);
        newSearch = false;
      }
    })
}

// get city coordinates with a call to the Current Weather API
function getCoords(city) {
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
  fetch(url)
    .then(function (response)  {
      return response.json();      
    })
    .then(function (data) {
      try{
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        getWeather(lat, lon, city); // call OneCall with retrieved coordinates
        $(searchAlertEl).addClass('d-none'); // good input, so hide alert
      }
      // if error, remove the city from the array and display alert & hide forecast
      catch{
        cities.pop();
        localStorage.setItem('cities', JSON.stringify(cities));
        $(forecastEl).addClass('invisible');
        $(searchAlertEl).removeClass('d-none');
      }     
    });
}

searchFormEl.on('submit', function(event) {
  event.preventDefault();
  var cityInput = cityInputEl.val().trim();
  // check if this search has been done before
  if(!(cities.includes(cityInput))){
    newSearch = true;
    cities.push(cityInput);
    localStorage.setItem('cities', JSON.stringify(cities));
  }
  getCoords(cityInput); // get the coords, then get weather data
})