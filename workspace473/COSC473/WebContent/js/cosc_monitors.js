/* 
 * Main JavaScript file for the COSC Hall Monitors
 */

var datetime = null,
        date = null;
		day = null;
		schedule = null;
		abbrev = null;

var getDayAbbrev = function () {
	switch (new Date().getDay()) {
    case 0:
    	abbrev = "Su";
        break;
    case 1:
    	abbrev = "M";
        break;
    case 2:
    	abbrev = "T";
        break;
    case 3:
    	abbrev = "W";
        break;
    case 4:
    	abbrev = "R";
        break;
    case 5:
    	abbrev = "F";
        break;
    case 6:
    	abbrev = "Sa";
        break;
	}
}
		
var update = function () {
    date = moment(new Date())
    datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));

	day.html(date.format('dddd'));
};

$(document).ready(function(){
    datetime = $('#datetime');
	day = $('#day');
	getDayAbbrev();
    update();
    setInterval(update, 1000); 			// Update every second to project real time
	
	getWeather();              			// Gets the initial weather on load of page
	setInterval(getWeather, 180000); 	// Update every 3 min
	 
	getClasses();
	setInterval(getClasses, 10800000); 	// Update every 3 hours to stay updated for next day
	
	setInterval(reloadNewsLiveFeed, 10800000); // Reload every 3 hours to refresh the live feed
});

function getClasses() {
	// This will need changing to dynamically pick what file to read depending on monitor
	
	$.get('str112A_data.csv', function(data) {
		var build = '<table cellpadding="2" cellspacing="2" style="border-collapse: collapse" width="100%">\n';
		var rows = data.split("\n");
		rows.forEach( function getvalues(thisRow) {
			build += "<tr>\n";
			var columns = thisRow.split(",");
			if (columns[3].indexOf(abbrev) > -1) {	
				for (var i=0;i<columns.length-1;i++){ 
					build += "<td>" + columns[i] + "</td>\n";
				}   			
				build += "</tr>\n";
			}
		})
		build += "</table>";
		$('#schedule').append(build);
		
		if (abbrev === "Sa" || abbrev === "Su") {
			var str = "No classes";
			$('#schedule').append("<p>" + str + "</p>");
		}
	});
}

function getWeather() {
	$.simpleWeather({
    location: 'Indiana, PA',
    woeid: '',
    unit: 'f',
    success: function(weather) {
      html =  '<i class="icon-'+ weather.code +'"></i> '+ weather.temp + '&deg;' + weather.units.temp;
  
      $("#weather").html(html);
    },
    error: function(error) {
      $("#weather").html('<p>'+ error +'</p>');
    }
  });
}

function reloadNewsLiveFeed() {
	$("#livefeed").contentWindow.location.reload();
}
