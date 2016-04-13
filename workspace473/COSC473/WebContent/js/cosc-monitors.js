/* 
 * Main JavaScript file for the COSC Hall Monitors
 * https://github.com/rjsylvia/COSC-473
 * Authors: Daniel Konawalik, Ryan Sylvia, Brandon Rosales, Colton Delman
 * Copyright: @2016
 */
"use strict";
// Execute the following functions once the DOM is ready
$(document).ready(function(){
    loadComponents();			// Load the components of the web page
	setCycles();				// Set the transition cycles for components in the web page
	setAutoMouseHide();			// Sets up to hide the mouse pointer after no movement for 3 seconds
	sizeFrame(document.getElementById('national-news-feed'));
});

// Load up all the components that make up the web page
function loadComponents() {
	updateDate();								// Continuously update the datetime shown to keep in sync with time on machine
    setInterval(updateDate, 1000); 				// Update every second to project real time
		 
	getClasses();								// Get the class schedule from the appropriate CSV file
	setInterval(reloadClassSchedule, 3600000); 	// Update every 1 hour to stay updated for next day
	
	setInterval(reloadNewsLiveFeed, 10800000); 	// Reload news live feed every 3 hours
	setInterval(reloadSocialMedia, 600000);		// Reload social media every 10 minutes
	
	getWeather();              					// Gets the initial weather on load of page
	setInterval(getWeather, 1800000); 			// Update every 30 min
	
	loadRSSfeeds();								// Gets the initial RSS feeds for the top right panels
	setInterval(loadRSSfeeds, 3600000);			// Update the feeds every 1 hour
}

// Gets the current day abbreviation
function getDayAbbrev () {
	var abbrev = "";
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
	return abbrev;
}		

// Update the datetime to keep in sync with time on machine
function updateDate() {
    var date = moment(new Date());
    $('#datetime').html(date.format('dddd, MMMM Do YYYY, h:mm a'));
};

// Get the class schedule for the appropriate room and display the information
function getClasses() {
	var file = "";
	
	// TV monitor IP addresses
	var STR331_ip =  '144.80.64.251';
	var STR320_ip =  '144.80.64.252';
	var STR112A_ip = '144.80.64.253';
	
	// Gets IP address, needed for changing file to be read for monitors
	$.getJSON("http://jsonip.com/?callback=?", function (data) {      
		//alert(data.ip);
        
		if (data.ip == STR331_ip) {
        	file = 'data/str331_data.csv';
			$('#room').html('STR331');
        } else if (data.ip == STR320_ip) {
        	file = 'data/str320_data.csv';
			$('#room').html('STR320');
        } else if (data.ip == STR112A_ip){
        	file = 'data/str112A_data.csv';
			$('#room').html('STR112A');
        } else { // Temporary for error condition testing beta purposes only
			file = 'data/str112A_data.csv';
			$('#room').html('STR112A - Error');
			console.log("Error occured, did not find a valid IP address.");
		}

		var ab = getDayAbbrev();
		var build = "";
		
		// Build the class schedule table
		if (ab === "Sa" || ab === "Su") {
			build = "No classes";
			$('#schedule').html("<h2>" + build + "</h2>");
		} else {
			$.get(file, function(data) {
	    		var build = '<table cellpadding="3" cellspacing="2">\n';
	    		var rows = data.split("\n");
	    		rows.forEach(function getvalues(thisRow) {
	    			build += "<tr>\n";
	    			var columns = thisRow.split(",");
	    			if (columns[3].indexOf(ab) > -1) {	
	    				for (var i = 0; i < columns.length - 1; i++){ 
	    					build += "<td>" + columns[i] + "</td>\n";
	    				}   			
	    				build += "</tr>\n";
	    			}
	    		})
	    		build += "</table>";
	    		$('#schedule').html(build);
	    	});
		}
    });
}

// Refresh the class schedule
function reloadClassSchedule() {
	$('#schedule').html('');
	getClasses();
}

// Get the weather information to display in the top right
function getWeather() {
	var date = moment(new Date()).format('dddd, MMMM Do YYYY, h:mm:ss a');
	$.simpleWeather({
		location: 'Indiana, PA',
		woeid: '',
		unit: 'f',
		success: function(weather) {
			var html =  '<i id="weather-icon" class="icon-'+ weather.code +'"></i> <span id="weather-info">'+ weather.temp + '&deg;' + weather.units.temp + '</span>';
			$("#weather").html(html);
			var date = moment(new Date()).format('dddd, MMMM Do YYYY, h:mm a');
			console.log('Successfully acquired at [' + date + ']!');
		},
		error: function(error) {
			$("#weather").html('');
			console.log(error +  ' Happened at [' + date + ']');
			setTimeout(getWeather, 5000);
		}
	});
}

// Reload the live news feed to make sure it is consistently running 
function reloadNewsLiveFeed() {
	document.getElementById('national-news-feed').src = document.getElementById('national-news-feed').src;
}

// Reload the social media widgets
function reloadSocialMedia() {
	twttr.widgets.load();
	FB.XFBML.parse();
}

// Resize the news feed frame when entering/exiting full-screen
function sizeFrame(frame) {
	var height = document.getElementById('live-feed-div').scrollHeight - document.getElementById('frame-header').scrollHeight;
	
	// Pre-custom set resolutions that are 16:9
	if (height < 288) {					
		frame.width = "432";
		frame.height = "243";
	} else if (height >= 288 && height < 360) {					
		frame.width = "512";
		frame.height = "288";
	} else if (height >= 360 && height < 432) {
		frame.width = "640";
		frame.height = "360";
	} else {
		frame.width = "768";
		frame.height = "432";
	}
}

// Set the cycles for all needed panels and headers
function setCycles() {
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
	
	$('#iup_events').cycle({
	    speed: 1000,
	    timeout: 29000
	});
	
	$('#frame_headers').cycle({
	    speed: 1000,
	    timeout: 6500
	});
}

// Load up the RSS feeds from http://www.iup.edu/rss.aspx?pageid=199292 and http://iupathletics.com/rss.aspx
function loadRSSfeeds() {
	$('#iup_campus_events').FeedEk({
		FeedUrl: 'http://www.iup.edu/rss.aspx?pageid=199292',
		MaxCount: 2,
		DateFormat:'MM/DD/YYYY'
	});
	
	$('#iup_sport_events').FeedEk({
		FeedUrl: 'http://iupathletics.com/rss.aspx',
		MaxCount: 2,
		DateFormat:'MM/DD/YYYY'
	});
}

// Set the mouse to auto hide after 3 seconds on screen
function setAutoMouseHide() {
	var timer;
	var fadeInBuffer = false;
	$(document).mousemove(function() {
		if (!fadeInBuffer) {
			if (timer) {
				clearTimeout(timer);
				timer = 0;
			}
			$('html').css({
				cursor : ''
			});
		} else {
			fadeInBuffer = false;
		}
		timer = setTimeout(function() {
			$('html').css({
				cursor : 'none'
			});
			fadeInBuffer = true;
		}, 3000)
	});
}