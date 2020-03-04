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

app.controller("controller", ['$scope','$http',function($scope, $http) {
  $scope.city;
  $scope.main_temp;
  $scope.main_img;
  $scope.wind;
  $scope.hum;
  $scope.press;
  $scope.curr_act;
  $scope.five = [];
  $scope.row = [];
  $scope.getWeather = function() {
    try { 
      var get_value = window.location.href.match(/(?<=search=)(.*?)[^&]+/)[0];
      var call = "https://api.openweathermap.org/data/2.5/weather?zip="+get_value+"&units=imperial&appid="+realkey;
      var five_day = "https://api.openweathermap.org/data/2.5/forecast?zip="+get_value+"&units=imperial&appid="+realkey;
    } catch{
      var call = "https://api.openweathermap.org/data/2.5/weather?q="+get_value+"&units=imperial&appid="+realkey;
      var five_day = "https://api.openweathermap.org/data/2.5/forecast?q="+get_value+"&units=imperial&appid="+realkey;
    }
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
          alert("Error");
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
        alert("Error");
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
      var five_day = "https://api.openweathermap.org/data/2.5/forecast?q="+get_value+"&units=imperial&appid="+realkey;
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
