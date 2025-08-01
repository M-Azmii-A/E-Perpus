-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 30, 2025 at 08:06 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eperpus1`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `sinopsis` text DEFAULT NULL,
  `file` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `year`, `sinopsis`, `file`) VALUES
(1, 'Atomic Habits', 'James Clear', 2018, 'Buku tentang membentuk kebiasaan kecil yang berdampak besar.', 'buku/atomic-habits.pdf'),
(2, 'Laskar Pelangi', 'Andrea Hirata', 2005, 'Petualangan anak-anak di Belitung dengan semangat pendidikan.', 'buku/laskar-pelangi.pdf'),
(3, 'Filosofi Teras', 'Henry Manampiring', 2019, 'Filsafat Stoa untuk kehidupan modern.', 'buku/filosofi-teras.pdf'),
(4, 'Bumi Manusia', 'Pramoedya Ananta Toer', 1980, 'Kisah cinta dan perjuangan di masa kolonial.', 'buku/bumi-manusia.pdf'),
(5, 'Rich Dad Poor Dad', 'Robert T. Kiyosaki', 1997, 'Cara berpikir tentang uang dan investasi.', 'buku/rich-dad.pdf'),
(6, 'Sejarah Dunia Yang Disembunyikan', 'Jonathan Black', 2007, 'Banyak orang mengatakan bahwa sejarah ditulis oleh para pemenang. Hal ini sama sekali tak mengejutkan alias wajar belaka. Tetapi, bagaimana jika sejarah atau apa yang kita ketahui sebagai sejarah ditulis oleh orang yang salah?', 'buku/Buku - Sejarah Dunia yang Disembunyikan (Jonathan Black).pdf');

-- --------------------------------------------------------

--
-- Table structure for table `loans`
--

CREATE TABLE `loans` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `hp` varchar(30) DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL,
  `lama` int(11) DEFAULT NULL,
  `tgl_pinjam` date DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `dikembalikan` tinyint(1) DEFAULT 0,
  `tgl_kembali` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loans`
--

INSERT INTO `loans` (`id`, `user_id`, `nama`, `hp`, `book_id`, `lama`, `tgl_pinjam`, `deadline`, `dikembalikan`, `tgl_kembali`) VALUES
(19, 9, 'peminjam', '0812', 1, 2, '2025-07-12', '2025-07-14', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `nama`, `role`) VALUES
(1, 'admin', '21232f297a57a5a743894a0e4a801fc3', 'Admin', 'admin'),
(6, 'Shavira', '202cb962ac59075b964b07152d234b70', 'Shavira', 'user'),
(7, 'Vira', '202cb962ac59075b964b07152d234b70', 'Shavira Agutian Nurrahman', 'user'),
(8, 'user', '202cb962ac59075b964b07152d234b70', 'user', 'user'),
(9, 'peminjam', '202cb962ac59075b964b07152d234b70', 'peminjam', 'user'),
(10, 'user_2', 'ee11cbb19052e40b07aac0ca060c23ee', 'user_eperpus', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `loans`
--
ALTER TABLE `loans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
