<?php
function debug_to_console( $data ) {

    if ( is_array( $data ) )
        $output = "<script>console.log( 'Debug Objects: " . implode( ',', $data) . "' );</script>";
    else
        $output = "<script>console.log( 'Debug Objects: " . $data . "' );</script>";

    echo $output;
}

$room = strtolower($_POST['edit-classroom']);
$class = $_POST['classname'];


if (isset($_POST['update'])) {
	$filename = "data/" . $room . "_data.csv";
	$file = file_get_contents($filename);
	$file_contents = explode(PHP_EOL, $file);

	$begin_time = trim($_POST['edit-begin-time']);
	$end_time = trim($_POST['edit-end-time']);
	$timezone_begin = $_POST['edit-timezone-begin'];
	$timezone_end = $_POST['edit-timezone-end'];
	
	$dept_code = $_POST['edit-dept-code'];
	$class_code = $_POST['edit-class-code'];
	$section_code = $_POST['edit-section-code'];
	
	$class_name = $_POST['edit-class-name'];
	$class_days = $_POST['class-days'];
	$days = "";
	for ($i = 0; $i < count($class_days); $i++) {
		$days = $days . $class_days[$i];
	}
	$record = $dept_code . ' ' . $class_code . '-' . $section_code . ',' . $class_name . ',' . $begin_time . ' ' . $timezone_begin . ',' . $end_time . ' ' . $timezone_end . ',' . $days;
	
	for ($i = 0; $i < count($file_contents); $i++) {
		if (stripos($file_contents[$i], $class) !== FALSE) {
			$file = str_replace($file_contents[$i], $record, $file);			
			break;
		}
	}
	file_put_contents($filename, $file);
	
} elseif (isset($_POST['delete'])) {
	$filename = "data/" . $room . "_data.csv";
	$file = file_get_contents($filename);
	$file_contents = explode(PHP_EOL, $file);
	
	for ($i = 0; $i < count($file_contents); $i++) {
		if (stripos($file_contents[$i], $class) !== FALSE) {
			if ($i == count($file_contents) - 1) {
				$file = str_replace(PHP_EOL . $file_contents[$i], '', $file);
			} else {
				$file = str_replace($file_contents[$i] . PHP_EOL, '', $file);
			}			
			break;
		}
	}
	file_put_contents($filename, $file);
}
//sleep(5);
header("Cache-Control: no-cache");
header("Pragma: no-cache");
header("Location: editor.html");
?>