var datetime = null,
        date = null;
		day = null;

var update = function () {
    date = moment(new Date())
    datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));

	day.html(date.format('dddd'));
};

$(document).ready(function(){
    datetime = $('#datetime');
	day = $('#day');
    update();
    setInterval(update, 1000);
	
	getWeather();
	setInterval(getWeather, 180000); //Update every 3 min
	
});

function getWeather() {
	$.simpleWeather({
    location: 'Indiana, PA',
    woeid: '',
    unit: 'f',
    success: function(weather) {
      html = weather.city+ ' '+weather.temp+'&deg;'+weather.units.temp;
  
      $("#weather").html(html);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
}

