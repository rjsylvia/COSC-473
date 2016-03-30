/* 
 * Main JavaScript file for the COSC Hall Monitors
 * https://github.com/rjsylvia/COSC-473
 */
"use strict";
$(document).ready(function(){
    datetime = $('#datetime');					// Assign the scrolling date to the html id
	day = $('#day');							// Assign the day to the html day id used in Class Schedule header
	getDayAbbrev();								// Get the current day abbreviation
    updateDate();								// Continuously update the datetime shown to keep in sync with time on machine
    setInterval(updateDate, 1000); 				// Update every second to project real time
	
	getWeather();              					// Gets the initial weather on load of page
	setInterval(getWeather, 180000); 			// Update every 3 min
	 
	getClasses();								// Get the class schedule from the appropriate CSV file
	setInterval(reloadClassSchedule, 3600000); 	// Update every 1 hour to stay updated for next day
	
	setInterval(reloadNewsLiveFeed, 10800000); 	// Reload news live feed every 3 hours
	setInterval(reloadSocialMedia, 600000);		// Reload social media every 10 minutes
	
	// Cycles transition between headers/info every 29 seconds and an additional 1 second for transition
	// totaling 30 seconds total. This applies to all of the cycle function calls below (besides header for
	// news, which is at 6.5 seconds with additional 1 second for transition totaling 7.5 seconds total).
	setCycles();
	
	// Sets up to hide the mouse pointer after no movement for 3 seconds
	$(function () {
	    var timer;
	    var fadeInBuffer = false;
	    $(document).mousemove(function () {
	        if (!fadeInBuffer) {
	            if (timer) {
	                clearTimeout(timer);
	                timer = 0;
	            }
	            $('html').css({
	                cursor: ''
	            });
	        } else {
	            fadeInBuffer = false;
	        }


	        timer = setTimeout(function () {
	            $('html').css({
	                cursor: 'none'
	            });
	            fadeInBuffer = true;
	        }, 3000)
	    });
	});
	
});

// On resize of the window, execute the function to resize the news live feed
window.onresize = function() {
	sizeFrame(document.getElementById('national-news-feed'));
}

// Declare some variables to be used in functions
var datetime = null;
var date = null;
var day = null;
var schedule = null;
var abbrev = null;

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
	return abbrev;
}
		
/*
 * Update the datetime to keep in sync with time on machine
 */
var updateDate = function () {
    date = moment(new Date());
    datetime.html(date.format('dddd, MMMM Do YYYY, h:mm a'));

	//day.html(date.format('dddd'));
};

/*
 * Get the class schedule for the appropriate room reading the appropriate CSV file
 * to display the information
 */
function getClasses() {
	var file = '';
	
	// TV monitor IP addresses
	var STR331_ip =  '144.80.64.251';
	var STR320_ip =  '144.80.64.252';
	var STR112A_ip = '144.80.64.253';
	
	// Gets IP address, needed for changing file to be read for monitors
	$.getJSON("http://jsonip.com/?callback=?", function (data) {
        
//        alert(data.ip);
        
//        Tested IP addresses from local dorm network
//        Machine IP addresses given in email are as follows:
//        STR320 -  144.80.64.252
//        STR331 -  144.80.64.251
//        STR112A - 144.80.64.253
        
//        if (data.ip == STR331_ip) {
//        	file = 'data/str331_data.csv';
//			$('#room').html('STR331');
//        } else if (data.ip == STR320_ip) {
//        	file = 'data/str320_data.csv';
//			$('#room').html('STR320');
//        } else if (data.ip == STR112A_ip){
//        	file = 'data/str112A_data.csv';
//			$('#room').html('STR112A');
//        }
       		
		file = 'data/str112A_data.csv';
		$('#room').html('STR112A');
		var  ab = getDayAbbrev();
		
        $.get(file, function(data) {
    		var build = '<table cellpadding="5" cellspacing="2">\n';
    		var rows = data.split("\n");
    		rows.forEach( function getvalues(thisRow) {
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
    		
    		if (ab === "Sa" || ab === "Su") {
    			var str = "No classes";
    			$('#schedule').html("<h2>" + str + "</h2>");
    		}
    	});
    });

}

/*
 * Refresh the class schedule
 */
function reloadClassSchedule() {
	$('#schedule').html('');
	getClasses();
}

/*
 * Get the weather information to display in the top right
 */
function getWeather() {
//	var woeid = '2427026';
//	var weatherURL = 'http://weather.yahooapis.com/forecastrss?w=' + woeid;
//	$.ajax({
//	    url: "http://query.yahooapis.com/v1/public/yql",
//	    async: true,
//	    data: {
//	        q: "select * from xml where url='" + weatherURL + "'",
//	        format: "json"
//	    },
//	    success: function (data) {
//	        var weather = data.query.results.rss.channel.item;
//	        var html = '<i class="icon-' + weather.condition.code + '"></i>' + '&nbsp' + weather.condition.temp + '&deg;F';
//	        $('#weather').html(html);
//
//	    },
//	    error: function () {
//	        $('#weather').html('Not available');
//	    }
//	});

	$.simpleWeather({
    location: 'Indiana, PA',
    woeid: '',
    unit: 'f',
    success: function(weather) {
    	var html =  '<i id="weather-icon" class="icon-'+ weather.code +'"></i> <span id="weather-info">'+ weather.temp + '&deg;' + weather.units.temp + '</span>';
  
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
	document.getElementById('national-news-feed').src = document.getElementById('national-news-feed').src;
}

function reloadSocialMedia() {
	twttr.widgets.load();
	FB.XFBML.parse();
}

/*
 * Resize the news feed frame when entering/exiting full-screen
 */
function sizeFrame(frame) {
	var isFullScreen = $(window).data('fullscreen-state');  // Checks if browser is in fullscreen, uses jquery.fullscreen.js (pulled from GitHub)
	if (isFullScreen == false) {							// If not in fullscreen, do a reset to resize the frame
		frame.width = "0";
		frame.height = "0";
	}
	var height = document.getElementById('live-feed-div').scrollHeight - document.getElementById('frame-header').scrollHeight;
	if (height >= 288 && height < 360) {					// Pre-custom set resolutions that are 16:9, will add more
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
/*
 * Set the cycles for all needed panels and headers
 */
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
	
	$('#frame_headers').cycle({
	    speed: 1000,
	    timeout: 6500
	});
}
