<?php
function debug_to_console( $data ) {

    if ( is_array( $data ) )
        $output = "<script>console.log( 'Debug Objects: " . implode( ',', $data) . "' );</script>";
    else
        $output = "<script>console.log( 'Debug Objects: " . $data . "' );</script>";

    echo $output;
}

$room = strtolower($_POST['add-classroom']);

$begin_time = trim($_POST['add-begin-time']);
$end_time = trim($_POST['add-end-time']);
$timezone_begin = $_POST['add-timezone-begin'];
$timezone_end = $_POST['add-timezone-end'];

debug_to_console(strtotime($begin_time . $timezone_begin));
debug_to_console(strtotime($end_time . $timezone_end));

$dept_code = $_POST['add-dept-code'];
$class_code = $_POST['add-class-code'];
$section_code = $_POST['add-section-code'];
	
$class_name = $_POST['add-class-name'];
$class_days = $_POST['add-class-days'];
$days = "";

for ($i = 0; $i < count($class_days); $i++) {
	$days = $days . $class_days[$i];
}

if (isset($room) && isset($begin_time) && isset($end_time) && isset($timezone_begin) && isset($timezone_end) && isset($dept_code)
			&& isset($class_code) && isset($section_code) && isset($class_name) && isset($class_days)) {
	$record = $dept_code . ' ' . $class_code . '-' . $section_code . ',' . $class_name . ',' . $begin_time . ' ' . $timezone_begin . ',' . $end_time . ' ' . $timezone_end . ',' . $days;
	$filename = "data/" . $room . "_data.csv";
	debug_to_console($record);
	file_put_contents($filename, PHP_EOL . $record, FILE_APPEND);
}

//sleep(5);
header("Cache-Control: no-cache");
header("Pragma: no-cache");
header("Location: editor.html");

?>