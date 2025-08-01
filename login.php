<?php
header('Content-Type: application/json');
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username']);
$password = trim($data['password']);
$role     = trim($data['role']);

$stmt = $conn->prepare("SELECT id, username, nama, role FROM users WHERE username=? AND password=MD5(?) AND role=?");
$stmt->bind_param("sss", $username, $password, $role);
$stmt->execute();
$result = $stmt->get_result();
if ($user = $result->fetch_assoc()) {
    echo json_encode(['success'=>true, 'user'=>$user]);
} else {
    echo json_encode(['success'=>false, 'msg'=>'Username/password salah!']);
}
$stmt->close();
$conn->close();
?>
