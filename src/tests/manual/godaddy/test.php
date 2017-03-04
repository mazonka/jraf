<?php

header('HTTP/1.0 200 OK');

$p = @file_get_contents('rand.txt');
$c = rand(100,999);

echo '<p>Prev: ' . $p . '</p>';
echo '<p>Curr: ' . $c . '</p>';

file_put_contents('rand.txt', $c, LOCK_EX);

?>
