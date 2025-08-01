<?php
header('Content-Type: application/json');
include 'db.php';

$res = $conn->query("SELECT * FROM books");
$buku = [];
while($row = $res->fetch_assoc()) $buku[] = $row;
echo json_encode(['success'=>true, 'books'=>$buku]);
$conn->close();
?>
