<?php
header('Content-Type: application/json');
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$user_id = intval($data['user_id']);
$nama = trim($data['nama']);
$hp = trim($data['hp']);
$book_id = intval($data['book_id']);
$lama = intval($data['lama']);
$tgl_pinjam = date('Y-m-d');
$deadline = date('Y-m-d', strtotime("+$lama days"));

if (!$user_id || !$nama || !$hp || !$book_id || !$lama) {
    echo json_encode(['success'=>false, 'msg'=>'Semua field wajib diisi!']); exit;
}

$stmt = $conn->prepare("INSERT INTO loans (user_id, nama, hp, book_id, lama, tgl_pinjam, deadline) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("issiiss", $user_id, $nama, $hp, $book_id, $lama, $tgl_pinjam, $deadline);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'msg' => 'Berhasil meminjam buku']);
} else {
    echo json_encode(['success' => false, 'msg' => 'Gagal meminjam buku: ' . $stmt->error]);
}
    // ... (kode yang sudah ada)

    $tgl_pinjam = date('Y-m-d');
    $deadline = date('Y-m-d', strtotime("+$lama days"));
    $status = 'dipinjam'; // Set status awal menjadi 'dipinjam'

    if (!$user_id || !$nama || !$hp || !$book_id || !$lama) {
        echo json_encode(['success'=>false, 'msg'=>'Semua field wajib diisi!']); exit;
    }

    // Modifikasi query INSERT untuk menyertakan kolom status
    $stmt = $conn->prepare("INSERT INTO loans (user_id, nama, hp, book_id, lama, tgl_pinjam, deadline, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issiiss", $user_id, $nama, $hp, $book_id, $lama, $tgl_pinjam, $deadline, $status);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'msg' => 'Berhasil meminjam buku']);
    } else {
        echo json_encode(['success' => false, 'msg' => 'Gagal meminjam buku: ' . $stmt->error]);
    }
    $stmt->close();
    $conn->close();
    ?>
    
