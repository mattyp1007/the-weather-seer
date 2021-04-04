var key = "12bc64a3e0930862a15da754f74d5af8";



function getCurrentWeather(city) {
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
  // console.log(url);
  fetch(url)
    .then(function (response)  {
      // console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}
// user enters/clicks city name:
//  * fetch current weather and display
//  * fetch 5-day forecast and display
//  * add the city to local storage
//  * append city to recents

getCurrentWeather("Houston");