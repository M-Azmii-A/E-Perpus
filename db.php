<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'eperpus1';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(['success'=>false, 'msg'=>'Database error']));
}
?>