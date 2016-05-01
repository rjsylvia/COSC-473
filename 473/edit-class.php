<?php

$room = strtolower($_POST['edit-classroom']);
$class = $_POST['classname'];


if (isset($_POST['update'])) {
	$filename = "data/" . $room . "_data.csv";
	$file = file_get_contents($filename);
	$file_contents = explode(PHP_EOL, $file);

	$class_days = $_POST['class-days'];
	$days = "";
	for ($i = 0; $i < count($class_days); $i++) {
		$days = $days . $class_days[$i];
	}
		
	if (isset($_POST['edit-begin-time']) && isset($_POST['edit-end-time']) && isset($_POST['edit-timezone-begin']) && isset($_POST['edit-timezone-end']) && isset($_POST['edit-dept-code'])
			&& isset($_POST['edit-class-code']) && isset($_POST['edit-section-code']) && isset($_POST['edit-class-name']) && isset($_POST['class-days'])) {
		$record = $_POST['edit-dept-code'] . ' ' . $_POST['edit-class-code'] . '-' . $_POST['edit-section-code'] . ',' . $_POST['edit-class-name'] . ',' . trim($_POST['edit-begin-time']) . ' ' . $_POST['edit-timezone-begin'] . ',' . trim($_POST['edit-end-time']) . ' ' . $_POST['edit-timezone-end'] . ',' . $days;
		for ($i = 0; $i < count($file_contents); $i++) {
			if (stripos($file_contents[$i], $class) !== FALSE) {
				$file = str_replace($file_contents[$i], $record, $file);			
				break;
			}
		}
		file_put_contents($filename, $file);
		sort_classes($filename);
	}

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
	sort_classes($filename);
}
header("Cache-Control: no-cache");
header("Pragma: no-cache");
header("Location: editor.html");

// ************************* Defined functions to help with main code ******************************

function debug_to_console( $data ) {

    if ( is_array( $data ) )
        $output = "<script>console.log( 'Debug Objects: " . implode( ',', $data) . "' );</script>";
    else
        $output = "<script>console.log( 'Debug Objects: " . $data . "' );</script>";

    echo $output;
}

function sort_classes($filename) {
	$index = 0;
	$classes = [];
	$class_names = [];
	$begin_times = [];
	$end_times = [];
	$days = [];
	$file = fopen($filename, "r+");
	while (($line = fgetcsv($file)) !== FALSE) {
		$classes[$index] = $line[0];
		$class_names[$index] = $line[1];
		$begin_times[$index] = strtotime($line[2]);
		$end_times[$index] = $line[3];
		$days[$index] = $line[4];
		$index++;
	}
	fclose($file);
	$data = sort_times($begin_times, $end_times, $classes, $class_names, $days);
	file_put_contents($filename, "");
	for ($i = 0; $i < count($classes); $i++) {
		$line = $data[0][$i] . ',' . $data[1][$i] . ',' . $data[2][$i] . ',' . $data[3][$i] . ',' . $data[4][$i];
		if ($i != count($classes) - 1) {
			$line = $line . PHP_EOL;
		}
		file_put_contents($filename, $line, FILE_APPEND);
	}
}

function sort_times($bt, $et, $cl, $cln, $d) {
	$len = count($bt);
	for ($i = 0; $i < $len; $i++) {
		for ($j = 0; $j < $len - 1 - $i; $j++) {
			if ($bt[$j + 1] < $bt[$j]) {
				swap($bt, $j, $j+1);
				swap($et, $j, $j+1);
				swap($cl, $j, $j+1);
				swap($cln, $j, $j+1);
				swap($d, $j, $j+1);
			}
		}
	}
	for ($i = 0; $i < count($bt); $i++) {
		$bt[$i] = date("g:i A", $bt[$i]);
	}
	$data = [];
	array_push($data, $cl, $cln, $bt, $et, $d);
	return $data;
}

function swap(&$arr, $a, $b) {
    $tmp = $arr[$a];
    $arr[$a] = $arr[$b];
    $arr[$b] = $tmp;
}
?>