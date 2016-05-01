<?php

if (isset($_POST['text'])) {
	file_put_contents("data/cosc-events.txt", $_POST['text']);
}

header("Cache-Control: no-cache");
header("Pragma: no-cache");
header("Location: editor.html");
exit;
?>