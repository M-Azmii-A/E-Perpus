<?php
header('Content-Type: application/json');
include 'db.php';

$title = trim($_POST['title'] ?? '');
$author = trim($_POST['author'] ?? '');
$year = intval($_POST['year'] ?? 0);
$sinopsis = trim($_POST['sinopsis'] ?? '');

if(!$title || !$author || !$year || !$sinopsis || !isset($_FILES['file'])) {
    echo json_encode(['success'=>false, 'msg'=>'Semua field wajib diisi!']); exit;
}

$targetDir = "../buku/";
$fileName = basename($_FILES['file']['name']);
$filePath = $targetDir . $fileName;
$fileDbPath = "buku/" . $fileName;

if(move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
    $stmt = $conn->prepare("INSERT INTO books (title, author, year, sinopsis, file) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssiss", $title, $author, $year, $sinopsis, $fileDbPath);
    if($stmt->execute()) {
        echo json_encode(['success'=>true, 'msg'=>'Buku berhasil ditambahkan!']);
    } else {
        echo json_encode(['success'=>false, 'msg'=>'Gagal tambah buku!']);
    }
    $stmt->close();
} else {
    echo json_encode(['success'=>false, 'msg'=>'Upload file gagal!']);
}
$conn->close();
?>
