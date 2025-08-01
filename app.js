let BOOKS = [];
let LOANS = [];
let currentPinjamBook = null;

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function logout() {
  localStorage.removeItem("eperpus_user");
  showPage('login-page');
}

// REGISTER
function showRegister() { document.getElementById('register-popup').style.display='flex'; }
function hideRegister() { document.getElementById('register-popup').style.display='none'; }
function registerUser() {
  const user = document.getElementById('reg-user').value.trim();
  const pass = document.getElementById('reg-pass').value.trim();
  const nama = document.getElementById('reg-nama').value.trim();
  const hp = document.getElementById('reg-hp').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const alamat = document.getElementById('reg-alamat').value.trim();
  // Validasi input
  if (!user || !pass || !nama || !hp || !email || !alamat) {
    document.getElementById('reg-msg').textContent = "Semua field harus diisi!";
    return;
  }
  fetch('api/register.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user, password: pass, nama: nama, hp: hp, email: email, alamat: alamat })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('reg-msg').textContent = data.msg;
      if (data.success) {
        setTimeout(() => {
          hideRegister();
          document.getElementById('login-user').value = user;
        }, 1000);
      }
    });
}

// LOGIN
function login() {
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value.trim();
  const role = document.getElementById('login-role').value;
  fetch('api/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user, password: pass, role: role })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("eperpus_user", JSON.stringify(data.user));
        if (data.user.role === 'admin') {
          showAdminDashboard();
          showPage('admin-dashboard');
        } else {
          showBooks();
          showPage('user-dashboard');
        }
      } else {
        document.getElementById('login-msg').textContent = data.msg;
      }
    });
}

// DASHBOARD USER
function showUserGreet() {
  let user = JSON.parse(localStorage.getItem("eperpus_user"));
  document.getElementById('user-greet').textContent = "👋 Selamat datang, " + user.nama;
}
function showBooks() {
  showUserGreet();
  fetch('api/books.php')
    .then(res => res.json())
    .then(data => {
      BOOKS = data.books;
      renderBookList(BOOKS);
    });
}
function renderBookList(bookList) {
  let html = `<div class="dashboard-card1">
    <h2 style="color:#17c5fc;font-size:2.2rem;letter-spacing:1.5px;margin-bottom:18px;">Daftar Buku Digital</h2>
    <div class="book-list">`;
  bookList.forEach(b => {
    html += `<div class="book-card">
      <div style="font-size:1.16em;font-weight:700;color:#1e40af;">${b.title}</div>
      <div>Penulis: <span style="color:#e879f9;">${b.author}</span></div>
      <div>Tahun: <span style="color:#facc15;">${b.year}</span></div>
      <button onclick="showSinopsis(${b.id})">Sinopsis</button>
      <button onclick="showPinjamForm(${b.id})">Pinjam</button>
    </div>`;
  });
  html += "</div></div>";
  document.getElementById('user-content').innerHTML = html;
}
function filterBooks() {
  const keyword = document.getElementById('search-input').value.toLowerCase();
  const filtered = BOOKS.filter(b => 
    b.title.toLowerCase().includes(keyword) ||
    b.author.toLowerCase().includes(keyword) ||
    b.year.toString().includes(keyword)
  );
  renderBookList(filtered);
}

// PINJAM BUKU
function showPinjamForm(bookId) {
  currentPinjamBook = bookId;
  document.getElementById('p-nama').value = '';
  document.getElementById('p-hp').value = '';
  document.getElementById('p-hari').value = '';
  document.getElementById('pinjam-msg').textContent = '';
  document.getElementById('pinjam-popup').style.display = 'flex';
}
function hidePinjam() {
  document.getElementById('pinjam-popup').style.display = 'none';
  currentPinjamBook = null;
}
document.getElementById('pinjam-btn').onclick = function () {
  const nama = document.getElementById('p-nama').value.trim();
  const hp = document.getElementById('p-hp').value.trim();
  const hari = parseInt(document.getElementById('p-hari').value.trim());
  if (!nama || !hp || !hari || hari < 1) {
    document.getElementById('pinjam-msg').textContent = "Isi semua field!";
    return;
  }
  let user = JSON.parse(localStorage.getItem("eperpus_user"));
  fetch('api/pinjam.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: user.id,
      nama: nama,
      hp: hp,
      book_id: currentPinjamBook,
      lama: hari
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('pinjam-msg').textContent = data.msg;
      if (data.success) {
        setTimeout(() => {
          hidePinjam();
          showBooks();
        }, 1200);
      }
    });
};

// SINOPSIS
function showSinopsis(bookId) {
  let b = BOOKS.find(x => x.id == bookId);
  document.getElementById('sinopsis-judul').textContent = b.title;
  document.getElementById('sinopsis-isi').textContent = b.sinopsis || 'Sinopsis belum tersedia';
  document.getElementById('sinopsis-popup').style.display = 'flex';
}
function hideSinopsis() {
  document.getElementById('sinopsis-popup').style.display = 'none';
}

// RAK SAYA
function showMyShelf() {
  showUserGreet();
  let user = JSON.parse(localStorage.getItem("eperpus_user"));
  fetch('api/shelf.php?user_id=' + user.id)
    .then(res => res.json())
    .then(data => {
      let html = `<div class="dashboard-card1">
        <h2 style="color:#17c5fc;font-size:2.2rem;letter-spacing:1.5px;margin-bottom:18px;">Rak Buku Saya</h2>`;
      if (!data.loans.length) {
        html += `<p style="color:#f472b6;">Belum ada buku dipinjam.</p>`;
      } else {
        html += '<div class="book-list">';
        data.loans.forEach(l => {
          html += `<div class="book-card">
            <div style="font-size:1.13em;font-weight:700;color:#1e40af;">${l.title}</div>
            <div>Penulis: <span style="color:#f472b6">${l.author}</span></div>
            <div>Tahun: <span style="color:#facc15">${l.year}</span></div>
            <div>Batas Pengembalian: <b>${l.deadline}</b></div>
            <a href="${l.file}" target="_blank" class="tab-btn" style="margin-top:10px;">Download</a>
            <button class="danger" style="margin-top:10px;" onclick="kembalikanBuku(${l.book_id})">Kembalikan</button>
          </div>`;
        });
        html += '</div>';
      }
      html += "</div>";
      document.getElementById('user-content').innerHTML = html;
    });
}
function kembalikanBuku(bookId) {
  let user = JSON.parse(localStorage.getItem("eperpus_user"));
  fetch('api/kembalikan.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: user.id, book_id: bookId })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.msg);
      if (data.success) {
        showMyShelf();
      }
    });
}

// DASHBOARD ADMIN
function showAdminDashboard() {
  let user = JSON.parse(localStorage.getItem("eperpus_user"));
  fetch('api/books.php')
    .then(res => res.json())
    .then(data => {
      let html = `
      <div class="dashboard-card1">
        <h2 style="color:#1e40af;">Dashboard Admin</h2>
        <h3>Daftar Buku Digital</h3>
        <div class="book-list">`;
      data.books.forEach(b => {
        html += `<div class="book-card">
          <div style="font-size:1.1em;font-weight:700;color:#1e40af;">${b.title}</div>
          <div>Penulis: <span style="color:#e879f9;">${b.author}</span></div>
          <div>Tahun: <span style="color:#facc15;">${b.year}</span></div>
        </div>`;
      });
      html += `</div>
      <hr style="margin:28px 0 14px 0;">
      <h3>Tambah Buku Baru</h3>
      <form id="form-tambah-buku" enctype="multipart/form-data" style="display:flex;flex-direction:column;gap:10px;">
        <input type="text" name="title" placeholder="Judul Buku" required>
        <input type="text" name="author" placeholder="Penulis" required>
        <input type="number" name="year" placeholder="Tahun" required>
        <textarea name="sinopsis" placeholder="Sinopsis" rows="2" required></textarea>
        <input type="file" name="file" accept=".pdf" required>
        <button type="submit">Tambah Buku</button>
        <div id="tambah-msg"></div>
      </form>
      <hr style="margin:28px 0 14px 0;">
      <h3>Laporan Peminjaman Buku</h3>
      <div id="loans-report-container"></div>
      </div>
      `;
      document.getElementById('admin-greet').textContent = "👤 Admin: " + user.nama;
      document.getElementById('admin-content').innerHTML = html;

      document.getElementById('form-tambah-buku').onsubmit = function (e) {
        e.preventDefault();
        let form = document.getElementById('form-tambah-buku');
        let formData = new FormData(form);
        fetch('api/add_book.php', {
          method: 'POST',
          body: formData
        })
          .then(res => res.json())
          .then(data => {
            document.getElementById('tambah-msg').textContent = data.msg;
            if (data.success) {
              form.reset();
              showAdminDashboard(); // Refresh dashboard to show new book
            }
          });
      };

      // Panggil fungsi untuk menampilkan laporan peminjaman
      showLoansReport();
    });
}

function showLoansReport() {
  fetch('api/loans_report.php')
    .then(res => res.json())
    .then(data => {
      let loansReportHtml = '';
      if (data.success && data.loans.length > 0) {
        loansReportHtml += `<table class="loans-table">
  <thead>
    <tr>
      <th>Nomor Hp Peminjam</th>
      <th>Nama Peminjam</th>
      <th>ID Buku</th>
      <th>Durasi (hari)</th>
      <th>Tanggal Pinjam</th>
      <th>Batas Pengembalian</th>
    </tr>
  </thead>
  <tbody>`;
data.loans.forEach(loan => {
  loansReportHtml += `<tr>
    <td>${loan.kontak}</td>
    <td>${loan.borrower_name}</td>
    <td>${loan.book_id}</td>
    <td>${loan.loan_duration_days}</td>
    <td>${loan.loan_date}</td>
    <td>${loan.return_deadline}</td>
  </tr>`;
});
loansReportHtml += `</tbody></table>`;
      } else {
        loansReportHtml = `<p style="color:#f472b6;">Belum ada data peminjaman.</p>`;
      }
      document.getElementById('loans-report-container').innerHTML = loansReportHtml;
    })
    .catch(error => {
      console.error('Error fetching loans report:', error);
      document.getElementById('loans-report-container').innerHTML = `<p style="color:red;">Gagal memuat laporan peminjaman.</p>`;
    });
}

// RIPPLE DAN PAGE LOAD
document.querySelectorAll('.popup-overlay').forEach(pop => {
  pop.addEventListener('click', function (e) {
    if (e.target === this) this.style.display = 'none';
  });
});
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('button, .tab-btn, .register-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      let circle = document.createElement('span');
      circle.className = 'ripple';
      this.appendChild(circle);
      let d = Math.max(this.clientWidth, this.clientHeight);
      circle.style.width = circle.style.height = d + 'px';
      circle.style.left = e.offsetX - d / 2 + 'px';
      circle.style.top = e.offsetY - d / 2 + 'px';
      setTimeout(() => circle.remove(), 500);
    });
  });
});

// REDIRECT LOGIN
window.onload = () => {
  let user = localStorage.getItem("eperpus_user");
  if (user) {
    let data = JSON.parse(user);
    if (data.role === 'admin') {
      showAdminDashboard();
      showPage('admin-dashboard');
    } else {
      showBooks();
      showPage('user-dashboard');
    }
  } else {
    showPage('login-page');
  }
}
