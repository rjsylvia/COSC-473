/* 
 * JavaScript file for the COSC Editor page
 * Authors: Daniel Konawalik, Ryan Sylvia, Brandon Rosales, Colton Delman
 * Copyright: @2016
 */

"use strict";
var sel;
var classes = [];
var beginTimes = [];
var endTimes = [];
var classNames = [];
var classDays = [];
var count = 0;

// Execute the following functions once the DOM is ready
$(document).ready(function(){
	getCurrentClasses();
	getCurrentEvents();
});

// Get all the current classes for a specific room
function getCurrentClasses() {
	var file = "";
	var build = "";
	
	sel = document.getElementById("class-item-list");
	sel.options.length = 0;
	count = 0;
	clearEditForm();
	
	if ($('#str331').is(':checked')) {
		file = "data/str331_data.csv";
		$('#classroom').html("STR331");
		$('#edit-classroom').val("STR331");
	} else if ($('#str320').is(':checked')){
		file = "data/str320_data.csv";
		$('#classroom').html("STR320");
		$('#edit-classroom').val("STR320");
	} else if ($('#str112a').is(':checked')){
		file = "data/str112a_data.csv";
		$('#classroom').html("STR112A");
		$('#edit-classroom').val("STR112A");
	} else {
		$('#classroom').html("ERROR");
	}
	
	if (file != "") {
		// Build the class schedule table
		$.get(file, function(data) {
			build = '<table id="class-table" cellpadding="3" cellspacing="2">\n';
			var rows = data.split("\n");
			rows.forEach(function getvalues(thisRow) {
				build += "<tr>\n";
				var columns = thisRow.split(",");
	    	
				fillEditClassBox(columns);
	    	
				for (var i = 0; i < columns.length; i++){
					if (i == 2) {
						build += "<td>" + columns[i] + ' - ' + columns[i + 1] + "</td>\n";
						i++;
					} else {
						build += "<td>" + columns[i] + "</td>\n";
					}
				}  
				
				// These are used to fill information for the other forms
				classes[count] = columns[0];
				classNames[count] = columns[1];
				beginTimes[count] = columns[2];
				endTimes[count] = columns[3];
				classDays[count] = columns[4];
				count++;
	    	
				build += "</tr>\n";
			})
			build += "</table>";
			$('#class-schedule').html(build);
			fillEditForm(classes, beginTimes, endTimes, classNames, classDays);
		});
	}	
}

// Get the current COSC events from the text file
function getCurrentEvents() {
	$.get("data/cosc-events.txt", function(data) {
	    $('#cosc-events-text').html(data);
	});
}

// Fill in the classes for the drop down box for the edit form
function fillEditClassBox(cols) {
	var option = document.createElement("option");
	option.text = cols[0];
	sel.add(option);
}

// Fill in the rest of the edit form depending what class was selected
function fillEditForm(classes, beginTimes, endTimes, classNames, classDays) {
	var index = sel.selectedIndex;
	$("#edit-begin-time").val(beginTimes[index].substring(0, 5));
	$("#edit-end-time").val(endTimes[index].substring(0, 5));
	$("#edit-class-name").val(classNames[index]);
	if (beginTimes[index].substring(5) === "AM") {
		document.getElementById("edit-timezone-begin").selectedIndex = 0;
	} else {
		document.getElementById("edit-timezone-begin").selectedIndex = 1;
	}
	if (endTimes[index].substring(5) === "AM") {
		document.getElementById("edit-timezone-end").selectedIndex = 1;
	} else {
		document.getElementById("edit-timezone-end").selectedIndex = 0;
	}
	var classSelected = $("#class-item-list option:selected").text();
	$("#edit-dept-code").val(classSelected.substring(0, 4));
	$("#edit-class-code").val(classSelected.substring(5, 8));
	$("#edit-section-code").val(classSelected.substring(9));
	// Check the appropriate checkboxes
	if (classDays[index].indexOf("M") > -1) {
		$("#monday-box").prop("checked", true);
	} else {
		$("#monday-box").prop("checked", false);
	}
	if (classDays[index].indexOf("T") > -1) {
		$("#tuesday-box").prop("checked", true);
	} else {
		$("#tuesday-box").prop("checked", false);
	}
	if (classDays[index].indexOf("W") > -1) {
		$("#wednesday-box").prop("checked", true);
	} else {
		$("#wednesday-box").prop("checked", false);
	}
	if (classDays[index].indexOf("R") > -1) {
		$("#thursday-box").prop("checked", true);
	} else {
		$("#thursday-box").prop("checked", false);
	}
	if (classDays[index].indexOf("F") > -1) {
		$("#friday-box").prop("checked", true);
	} else {
		$("#friday-box").prop("checked", false);
	}
	if (classDays[index].indexOf("Sa") > -1) {
		$("#saturday-box").prop("checked", true);
	} else {
		$("#saturday-box").prop("checked", false);
	}
}

// Clear the edit form
function clearEditForm() {
	$("#edit-begin-time").val("");
	$("#edit-end-time").val("");
	$("#edit-class-name").val("");
	$("#edit-dept-code").val("");
	$("#edit-class-code").val("");
	$("#edit-section-code").val("");
	$("#monday-box").prop("checked", false);
	$("#tuesday-box").prop("checked", false);
	$("#wednesday-box").prop("checked", false);
	$("#thursday-box").prop("checked", false);
	$("#friday-box").prop("checked", false);
	$("#saturday-box").prop("checked", false);
}

// Refresh the current COSC events text from an update from the PHP server
function reloadCurrentEvents() {
	setTimeout(function() {
		var text = "<?php echo $text ?>"; 
		$('#cosc-events-text').html(text);
	}, 3000);
}

// Refresh the current class schedule
function reloadClasses() {
	$.post("edit-class.php", function() {
		getCurrentClasses();
	});
}