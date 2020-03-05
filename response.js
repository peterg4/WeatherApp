var realkey = "ab69bc0fff88d44073dd8600db31c845";
var days =['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function dayOfWeek(dt) {
  var day_of_week = dt - 18000;
  day_of_week = (Math.floor(day_of_week/86400)+4)%7;
  return days[day_of_week];
}
var app = angular.module("app", []);

document.head || (document.head = document.getElementsByTagName('head')[0]);

function changeFavicon(src) {
 var link = document.createElement('link'),
     oldLink = document.getElementById('dynamic-favicon');
 link.id = 'dynamic-favicon';
 link.rel = 'shortcut icon';
 link.href = src;
 if (oldLink) {
  document.head.removeChild(oldLink);
 }
 document.head.appendChild(link);
}
var five_day;
var call;
app.controller("controller", ['$scope','$http',function($scope, $http) {
  $scope.city;
  $scope.main_temp = 0;
  $scope.main_img;
  $scope.wind = 0;
  $scope.hum = 0;
  $scope.press = 0;
  $scope.curr_act;
  $scope.five = [];
  $scope.row = [];
  $scope.position;
  $scope.lon = 0;
  $scope.lat = 0;
  $scope.getWeather = function() {
    try { 
      var get_value = window.location.href.match(/(?<=search=)(.*?)[^&]+/)[0];
      console.log(get_value);
      if(parseInt(get_value)) {
        var call = "https://api.openweathermap.org/data/2.5/weather?zip="+get_value+"&units=imperial&appid="+realkey;
        var five_day = "https://api.openweathermap.org/data/2.5/forecast?zip="+get_value+"&units=imperial&appid="+realkey;
      } else {
        var call = "https://api.openweathermap.org/data/2.5/weather?q="+get_value+"&units=imperial&appid="+realkey;
        var five_day = "https://api.openweathermap.org/data/2.5/forecast?q="+get_value+"&units=imperial&appid="+realkey;
      }
      $scope.makeCall(call, five_day);
    } catch{
      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        }
      }
      function showPosition(position) {
        $scope.lat = position.coords.latitude;
        $scope.lon = position.coords.longitude;
        call = "https://api.openweathermap.org/data/2.5/weather?lat="+$scope.lat+"&lon="+$scope.lon+"&units=imperial&appid="+realkey;
        five_day = "https://api.openweathermap.org/data/2.5/forecast?lat="+$scope.lat+"&lon="+$scope.lon+"&units=imperial&appid="+realkey;
        $scope.makeCall(call, five_day);
      }
      getLocation()
    }
  }
    $scope.makeCall = function(call, five_day) {
      $http({method : 'GET',url : call})
      .success(function(data, status) {
          $scope.city = data.name+', '+data.sys.country;
          $scope.main_temp = data.main.temp;
          $scope.main_img = "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png";
          changeFavicon($scope.main_img);
          $scope.wind = data.wind.speed;
          $scope.hum = data.main.humidity;
          $scope.press = data.weather[0].description;
          console.log(data);
          $scope.five.push([$scope.main_img,$scope.main_temp,dayOfWeek(data.dt)]) ;  
          $scope.curr_act = $scope.five[0];  
      })
      .error(function(data, status) {
          $scope.city = "Unknown Entry";
      });
      $http({method : 'GET',url : five_day})
      .success(function(data, status) {
        console.log(data);
        for(var i=0; i < 40; i+=8) {
          $scope.row.push("http://openweathermap.org/img/wn/"+data.list[i].weather[0].icon+"@2x.png");
          $scope.row.push(data.list[i].main.temp);
          $scope.row.push(dayOfWeek(data.list[i].dt));
          $scope.five.push($scope.row);
          $scope.row = [];
        }           
      })
      .error(function(data, status) {
          call = "https://api.openweathermap.org/data/2.5/weather?lat="+$scope.lat+"&lon="+$scope.lon+"&units=imperial&appid="+realkey;
          five_day = "https://api.openweathermap.org/data/2.5/forecast?lat="+$scope.lat+"&lon="+$scope.lon+"&units=imperial&appid="+realkey;
          $scope.makeCall(call, five_day);
      });
    }
    $scope.newMain = function(i) {
      if(i == 0){
        $scope.five = [];
        $scope.getWeather();
        return;
      }
      try { 
        var get_value = window.location.href.match(/(?<=search=)(.*?)[^&]+/)[0];
        var five_day = "https://api.openweathermap.org/data/2.5/forecast?zip="+get_value+"&units=imperial&appid="+realkey;
      } catch{
        var five_day = "https://api.openweathermap.org/data/2.5/forecast?q=12180&units=imperial&appid="+realkey;
      }
      $http({method : 'GET',url : five_day})
      .success(function(data, status) {
        $scope.main_temp = data.list[(i-1)*8].main.temp;
        $scope.main_img = "http://openweathermap.org/img/wn/"+data.list[(i-1)*8].weather[0].icon+"@2x.png";
        $scope.wind = data.list[(i-1)*8].wind.speed;
        $scope.hum = data.list[(i-1)*8].main.humidity;
        $scope.press = data.list[(i-1)*8].weather[0].description;
        $scope.curr_act = $scope.five[i];
        changeFavicon($scope.main_img);
      })
    }
}]);
