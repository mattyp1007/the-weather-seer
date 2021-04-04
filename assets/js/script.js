// user enters/clicks city name:
//  * fetch current weather and display
//  * fetch 5-day forecast and display
//  * add the city to local storage
//  * append city to recents

var key = "12bc64a3e0930862a15da754f74d5af8";

var forecastEl = $('.forecast');
var searchFormEl = $('#searchForm')
var cityInputEl = $('#cityInput');

function getCurrentWeather(city) {
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
  // console.log(url);
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
      renderCurrentWeather(data);
    });
}

searchFormEl.on('submit', function(event) {
  event.preventDefault();
  var cityInput = cityInputEl.val();
  getCurrentWeather(cityInput);
})

function renderCurrentWeather(retrievedData){
  var date = moment().format("M[/]D[/]YYYY");
  var iconCode = retrievedData.weather[0].icon;
  var iconEl = $('#icon-0');
  iconEl.attr('src', `http://openweathermap.org/img/wn/${iconCode}.png`)
  
  $('.cityName').text(retrievedData.name + ' ' + date + ' ');
}