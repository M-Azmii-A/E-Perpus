    <?php
    header('Content-Type: application/json');

    // 1. Koneksi ke database
    $conn = new mysqli("localhost", "root", "", "eperpus1"); // Ganti sesuai konfigurasi Anda

    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'msg' => 'Gagal koneksi ke database']);
        exit;
    }

    // 2. Ambil data JSON dari request
    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
    $book_id = isset($data['book_id']) ? intval($data['book_id']) : 0;
    $tgl_kembali = date('Y-m-d'); // Tanggal pengembalian saat ini

    if (!$user_id || !$book_id) {
        echo json_encode(['success' => false, 'msg' => 'Data tidak lengkap']);
        exit;
    }

    // 3. Query untuk memperbarui status peminjaman
    // Pastikan hanya memperbarui buku yang statusnya masih 'dipinjam'
    $stmt = $conn->prepare("UPDATE loans SET status = 'dikembalikan', tgl_kembali = ? WHERE user_id = ? AND book_id = ? AND status = 'dipinjam'");
    $stmt->bind_param("sii", $tgl_kembali, $user_id, $book_id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'msg' => 'Buku berhasil dikembalikan']);
        } else {
            echo json_encode(['success' => false, 'msg' => 'Tidak ditemukan data peminjaman aktif untuk buku ini atau buku sudah dikembalikan']);
        }
    } else {
        echo json_encode(['success' => false, 'msg' => 'Gagal memperbarui data: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
    ?>
    