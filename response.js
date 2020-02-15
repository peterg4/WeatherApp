var realkey = "ab69bc0fff88d44073dd8600db31c845";

$(document).ready(function(){
  var days =['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  try { 
    var get_value = window.location.href.match(/(?<=search=)(.*?)[^&]+/)[0];
  } catch{
    var get_value = undefined
  }
  if(get_value === undefined) {
  var x = document.getElementById("demo");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
    var lat;
    var lon;
    function showPosition(position) {
      lat=position.coords.latitude;
      lon=position.coords.longitude;
      var call = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=imperial&appid="+realkey;
      var five_day = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&units=imperial&appid="+realkey;
      $.getJSON( call, function( data ) {;
        $("#city").html(data.name + ", " + data.sys.country);
        $("#min").html("Minimum: &nbsp;"+data.main.temp_min +"&#176;<br>" );
        $("#temp").html(" &nbsp;" + data.main.temp + "&#176;<br>");
        $("#max").html("Maximum: &nbsp;"+data.main.temp_max +"&#176;" );
        $("#wind").html("Wind: "+data.wind.speed +"mph<br>" );
        $("#hum").html("Humidity: " + data.main.humidity + "%<br>");
        $("#press").html(data.weather[0].description);
        $("#icon").html("<img src=\""+"http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png\" />");
        var day_of_week = data.dt - 18000;
        day_of_week = (Math.floor(day_of_week/86400)+4)%7;
        $("#start").html(days[day_of_week-1] +"<br><img src=\"http://openweathermap.org/img/wn/"+
        data.weather[0].icon+"@2x.png\"/><br>"+ data.main.temp+"&#176;");

      });
      $.getJSON( five_day, function( data ) {;
        for(var i=0;i<40;i+=8){
          var day_of_week = data.list[i].dt - 18000;
          day_of_week = (Math.floor(day_of_week/86400)+4)%7;
          $("#day"+i/8).html(days[day_of_week] +"<br><img src=\"http://openweathermap.org/img/wn/"+
          data.list[i].weather[0].icon+"@2x.png\"/><br>"+ data.list[i].main.temp+"&#176;");
        }
      });
    }
  } else {
    var call="";
    var five_day="";
    if(parseInt(get_value)) {
      call = "https://api.openweathermap.org/data/2.5/weather?zip="+get_value+"&units=imperial&appid="+realkey;
      five_day = "https://api.openweathermap.org/data/2.5/forecast?zip="+get_value+"&units=imperial&appid="+realkey;
    } else { 
      call = "https://api.openweathermap.org/data/2.5/weather?q="+get_value+"&units=imperial&appid="+realkey;
      five_day = "https://api.openweathermap.org/data/2.5/forecast?q="+get_value+"&units=imperial&appid="+realkey;
    }
    $.getJSON( call, function( data ) {;
      $("#city").html(data.name + ", " + data.sys.country);
      $("#min").html("Minimum: &nbsp;"+data.main.temp_min +"&#176;<br>" );
      $("#temp").html("" + data.main.temp + "&#176;<br>");
      $("#max").html("Maximum: &nbsp;"+data.main.temp_max +"&#176;" );
      $("#wind").html("Wind: "+data.wind.speed +"mph<br>" );
      $("#hum").html("Humidity: " + data.main.humidity + "%<br>");
      $("#press").html(data.weather[0].description);
      $("#icon").html("<img src=\""+"http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png\" />");
      var day_of_week = data.dt - 18000;
      day_of_week = (Math.floor(day_of_week/86400)+4)%7;
      $("#start").html(days[day_of_week-1] +"<br><img src=\"http://openweathermap.org/img/wn/"+
      data.weather[0].icon+"@2x.png\"/><br>"+ data.main.temp+"&#176;");

    });
    $.getJSON( five_day, function( data ) {;
      for(var i=0;i<40;i+=8){
        var day_of_week = data.list[i].dt - 18000;
        day_of_week = (Math.floor(day_of_week/86400)+4)%7;
        $("#day"+i/8).html(days[day_of_week] +"<br><img src=\"http://openweathermap.org/img/wn/"+
        data.list[i].weather[0].icon+"@2x.png\"/><br>"+ data.list[i].main.temp+"&#176;");
      }
    });
  }
  $( ".target" ).click(function() {
    $(".target").removeClass("active");
    $( this ).toggleClass( "active" );
  });

});

//https://api.unsplash.com/photos/random/?client_id=cb74d8278199920f87f738071a4b5957f92c83d2704aa72f0ea8f0fd04564f65