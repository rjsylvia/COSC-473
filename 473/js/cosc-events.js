/* 
 * Javascript file for the independent COSC events HTML page
 * Authors: Daniel Konawalik, Ryan Sylvia, Brandon Rosales, Colton Delman
 * Copyright: @2016
 */
"use strict";

// Execute the following functions once the DOM is ready 
$(document).ready(function() {
	appendCoscEvents();
	setInterval(appendCoscEvents, 300000);	// Refresh the COSC events every 5 minutes
});

// Append the data from the cosc-events text file to the inner HTML page
function appendCoscEvents() {
	$.get('data/cosc-events.txt', function(data) {
		var str = '';
		var rows = data.split("\n");
		rows.forEach(function getvalues(thisRow) {
			str += '<p>' + thisRow + '</p>';
		});
		$('#cosc-events-body').html(str);
	});
}