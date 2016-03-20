/*
 * Javascript file for the independent COSC events HTML page
 */
$(document).ready(function() {
	// Append the COSC events to its panel
	appendCoscEvents();
});

/*
 * Add the data from the cosc-events text file to the HTML page
 */
function appendCoscEvents() {
	$.get('data/cosc-events.txt', function(data) {
		var str = '';
		var rows = data.split("\n");
		rows.forEach(function getvalues(thisRow) {
			str += '<p>' + thisRow + '</p>';
		});
		$('#cosc-events-body').append(str);
	});
}