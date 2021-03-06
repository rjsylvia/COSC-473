**Update 5/1**

cosc_monitors.css
- Fixed an issue where the table was slightly misaligned underneath the header in editor.html

editors.js
- Added function for check to only allow numbers and ":" for the time fields
- Added function for check to only allow numbers to be entered for the course numbers
	- This does not apply for section codes as a section code may have letters (e.g. W01)

PHP files
- Added more checks to make sure all fields are filled in when attempting to add/update a class/update COSC events
	- If all fields are not filled, it simply will not add/update the information
- Added sorting upon adding/editing a class to make sure the display is always correct when the monitors grab the information from the files

editor.html
- Added events to activate the checks for the functions that were added in editor.js

**Update 4/29**

cosc-monitors.js
- Fixed an issue where the class table for cosc-monitors.html was creating blank table rows.

**Update 4/28**

editors.js
- Fixed an issue where some classes were incorrectly being assigned PM for their beginning/end times when it should have been AM.

**Update 4/27**

cosc_monitors.css

- Changed paragraph tags to no longer center align
	- Added margin left, top, bottom of 5px in place
- Removed styling rules that were no longer used in the HTML documents
- Removed styling rules that only applied 1 rule, added into HTML instead to condense CSS file
- Added a static height value for the panel displaying the COSC events page
	- Previously it was only taking up half the panel and would not resize
- Added support for styling the editor.html file
	- Includes the form, inputs, selects, labels, and id/class specific items

Data files

- Renamed str112A_data.csv to str112a_data.csv, for easier obtaining of filenames for PHP
- Restructured the CSV files to separate begin and end times into their own CSV fields
	- Times no longer store a "0" in front if the hours is only 1 digit
	- AM/PM now has a space between itself and the time

cosc-monitors.js

- Removed some unnecessary commenting, as it was reducing the readability of the code
- Changed the video news feed to reload every 2 hours, down from 3
- Social media now refreshes every 15 min, up from 10
- Changed what happens on error condition of not finding valid monitor IP
	- Now displays no class schedule, along with just ERROR as room tag
- Added a check to see if the file had been assigned before trying to build the table
- Added a check to append the times together with a "-" to simulate the same feel as prior to the update
- Renamed some fields for cycling function to use all IDs for consistency

cosc-events.js

- Changed the COSC events to reload every 5 min, down from 10
	- This is to help with updating the file from the PHP script

editor.js

- Added specific functions/code for the editor.html file

cosc-monitors.html

- Changed some classes into IDs to help match consistency within the cycling function for cosc-monitors.js
- Removed unnecessary class/ID tags that weren't referenced for any programmatic/CSS reasons

editor.html

- Created an editor page for adding, editing, deleting a class as well as editing the COSC events

PHP files

- Created PHP scripts for each of the above tasks of editor.html
