// Javascript file for the independent COSC events HTML page
$(document).ready(function() {
	appendCoscEvents();
	setInterval(appendCoscEvents, 600000);     // Refresh the COSC events every 10 minutes
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