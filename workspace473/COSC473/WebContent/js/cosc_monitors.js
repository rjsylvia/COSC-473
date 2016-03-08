/* 
 * Main JavaScript file for the COSC Hall Monitors
 */

$(document).ready(function(){
    datetime = $('#datetime');			// Assign the scrolling date to the html id
	day = $('#day');					// Assign the day to the html day id used in Class Schedule header
	getDayAbbrev();						// Get the current day abbreviation
    updateDate();						// Continuously update the datetime shown to keep in sync with time on machine
    setInterval(updateDate, 1000); 			// Update every second to project real time
	
	getWeather();              			// Gets the initial weather on load of page
	setInterval(getWeather, 180000); 	// Update every 3 min
	 
	getClasses();						// Get the class schedule from the appropriate CSV file
	setInterval(getClasses, 10800000); 	// Update every 3 hours to stay updated for next day
	
	setInterval(reloadNewsLiveFeed, 10800000); // Reload every 3 hours to refresh the live feed
	
	// Cycles transition between headers/info every 29 seconds (additional 1 second for transition)
	// totaling 30 seconds total. This applies to all of the cycle function calls below.
	$('.social_media').cycle({
	    speed: 1000,
	    timeout: 29000
	});
	
	$('#media_headers').cycle({
	    speed: 1000,
	    timeout: 29000
	});
	
	$('.comp_sci_info').cycle({
	    speed: 1000,
	    timeout: 29000
	});
	
	$('#cosc_headers').cycle({
	    speed: 1000,
	    timeout: 29000
	});
	
	$('#iup_headers').cycle({
	    speed: 1000,
	    timeout: 29000
	});
});

// Declare some variables to be used in functions
var datetime = null,
        date = null;
		day = null;
		schedule = null;
		abbrev = null;

/*
 * Gets the current day abbreviation
 */
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
		
/*
 * Update the datetime to keep in sync with time on machine
 */
var updateDate = function () {
    date = moment(new Date())
    datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));

	day.html(date.format('dddd'));
};

/*
 * Get the class schedule for the appropriate room reading the appropriate CSV file
 * to display the information
 */
function getClasses() {
	// This will need changing to dynamically pick what file to read depending on monitor
	
	$.get('data/str112A_data.csv', function(data) {
		var build = '<table cellpadding="2" cellspacing="2">\n';
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

/*
 * Get the weather information to display in the top right
 */
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

/*
 * Reload the live news feed to make sure it is consistently running
 */
function reloadNewsLiveFeed() {
	$("#livefeed").contentWindow.location.reload();
}
