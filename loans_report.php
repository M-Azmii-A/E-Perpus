<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
include 'db.php';

$sql = "SELECT 
            l.hp AS kontak,
            l.user_id,
            u.nama AS borrower_name,
            l.book_id,
            l.lama AS loan_duration_days,
            l.tgl_pinjam AS loan_date,
            l.deadline AS return_deadline
        FROM 
            loans l
        JOIN 
            users u ON l.user_id = u.id
        ORDER BY 
            l.tgl_pinjam DESC";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        'success' => false,
        'msg' => 'Query error: ' . $conn->error
    ]);
    $conn->close();
    exit;
}

$loans = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $loans[] = $row;
    }
}

echo json_encode(['success' => true, 'loans' => $loans]);

$conn->close();
?>
