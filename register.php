<?php
header('Content-Type: application/json');
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$username = trim($data['username']);
$password = trim($data['password']);
$nama     = trim($data['nama']);
$hp       = trim($data['hp']);
$email    = trim($data['email']);
$alamat   = trim($data['alamat']);

if (!$username || !$password || !$nama || !$hp || !$email || !$alamat) {
    echo json_encode(['success'=>false, 'msg'=>'Semua field wajib diisi!']); exit;
}

$stmt = $conn->prepare("SELECT id FROM users WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['success'=>false, 'msg'=>'Username sudah dipakai!']); exit;
}
$stmt->close();

$role = 'user';
$stmt = $conn->prepare("INSERT INTO users (username, password, nama, hp, email, alamat, role) VALUES (?, MD5(?), ?, ?)");
$stmt->bind_param("ssss", $username, $password, $nama, $hp, $email, $alamat $role);
if ($stmt->execute()) {
    echo json_encode(['success'=>true, 'msg'=>'Berhasil daftar, silakan login!']);
} else {
    echo json_encode(['success'=>false, 'msg'=>'Gagal simpan user!']);
}
$stmt->close();
$conn->close();
?>
