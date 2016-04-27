<?php
$text = $_POST['text'];
//var_dump($text);
file_put_contents("data/cosc-events.txt", $text);
//sleep(5);
header("Cache-Control: no-cache");
header("Pragma: no-cache");
header("Location: editor.html");
exit;
?>