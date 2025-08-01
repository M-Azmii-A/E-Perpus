    <?php
    header('Content-Type: application/json');
    include 'db.php';

    $user_id = intval($_GET['user_id']);
    $list = [];

    // Anda bisa menambahkan parameter GET lain untuk filter status, misalnya ?status=dikembalikan
    $filter_status = isset($_GET['status']) ? $_GET['status'] : 'dipinjam'; // Default hanya tampilkan yang 'dipinjam'

    $sql = "SELECT loans.*, books.id AS book_id, books.title, books.author, books.year, books.file
            FROM loans
            JOIN books ON loans.book_id = books.id
            WHERE user_id = ? ";

    // Tambahkan kondisi WHERE untuk status jika filter_status bukan 'all'
    if ($filter_status != 'all') {
        $sql .= " AND loans.status = ?";
    }

    $sql .= " ORDER BY loans.id DESC";

    $stmt = $conn->prepare($sql);

    if ($filter_status != 'all') {
        $stmt->bind_param("is", $user_id, $filter_status);
    } else {
        $stmt->bind_param("i", $user_id);
    }

    $stmt->execute();
    $res = $stmt->get_result();

    while($row = $res->fetch_assoc()) {
        $list[] = $row;
    }
    echo json_encode(['success'=>true, 'loans'=>$list]);
    $stmt->close();
    $conn->close();
    ?>
    