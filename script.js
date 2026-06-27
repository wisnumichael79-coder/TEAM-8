// 1. Jalankan fungsi ini saat pertama kali web dibuka
document.addEventListener("DOMContentLoaded", () => {
    loadPage('dashboard'); // Muat dashboard pertama kali
    startClock();          // Aktifkan jam real-time global
});

// 2. Fungsi memuat halaman/menu secara dinamis (AJAX Fetch)
function loadPage(pageName) {
    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');
    
    // Ambil file HTML eksternal berdasarkan nama menu
    fetch(`${pageName}.html`)
        .then(response => {
            if (!response.ok) throw new Error("Halaman tidak ditemukan");
            return response.text();
        })
        .then(html => {
            mainContent.innerHTML = html; // Masukkan konten ke index.html
            
            // Perbarui judul halaman di Header
            pageTitle.innerText = pageName === 'dashboard' ? 'Dashboard' : 'Menu IN/OUT';
            
            // Perbarui gaya tombol aktif di Sidebar
            updateSidebarStyle(pageName);
            
            // Muat ulang ikon Lucide agar ikon di halaman baru ikut muncul
            if (window.lucide) lucide.createIcons();
        })
        .catch(err => {
            mainContent.innerHTML = `<p class="text-red-500 text-center py-10">Gagal memuat halaman: ${err.message}</p>`;
        });
}

// 3. Fungsi memperbarui style tombol aktif di Sidebar
function updateSidebarStyle(activePage) {
    const btnDashboard = document.getElementById('btn-dashboard');
    const btnInout = document.getElementById('btn-inout');
    
    if(!btnDashboard || !btnInout) return; // Lewati jika diakses via mobile header

    if (activePage === 'dashboard') {
        btnDashboard.className = "flex items-center space-x-3 w-full p-3 rounded-lg bg-blue-600 text-white font-medium transition";
        btnInout.className = "flex items-center space-x-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition";
    } else {
        btnInout.className = "flex items-center space-x-3 w-full p-3 rounded-lg bg-blue-600 text-white font-medium transition";
        btnDashboard.className = "flex items-center space-x-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition";
    }
}

// 4. Jam Live Real-time (Global)
function startClock() {
    setInterval(() => {
        const clockContainer = document.getElementById('live-clock');
        if (clockContainer) {
            const now = new Date();
            clockContainer.innerText = now.toLocaleTimeString('id-ID');
        }
    }, 1000);
}

// 5. Fungsi Eksekusi Absen IN / OUT
function doAbsen(status) {
    const nameInput = document.getElementById('staff-name');
    const staffName = nameInput.value.trim();

    if (staffName === "") {
        alert("Silakan masukkan nama Staff terlebih dahulu!");
        return;
    }

    const currentTime = new Date().toLocaleTimeString('id-ID');
    const tableBody = document.getElementById('log-table-body');
    const emptyRow = document.getElementById('empty-row');

    if (emptyRow) emptyRow.remove();

    const newRow = document.createElement('tr');
    newRow.className = "hover:bg-slate-50 transition";

    const badgeClass = status === 'IN' 
        ? 'bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-semibold' 
        : 'bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full text-xs font-semibold';

    newRow.innerHTML = `
        <td class="p-4 font-medium text-gray-900">${staffName}</td>
        <td class="p-4"><span class="${badgeClass}">${status === 'IN' ? 'MASUK (IN)' : 'KELUAR (OUT)'}</span></td>
        <td class="p-4 text-gray-500 font-mono">${currentTime}</td>
    `;

    tableBody.insertBefore(newRow, tableBody.firstChild);
    nameInput.value = "";
    alert(`Absen ${status} sukses untuk: ${staffName}`);
}

// 6. Fungsi Hapus Riwayat Absen
function clearLogs() {
    if(confirm("Apakah Anda yakin ingin menghapus semua riwayat absen hari ini?")) {
        const tableBody = document.getElementById('log-table-body');
        if(tableBody) {
            tableBody.innerHTML = `
                <tr id="empty-row">
                    <td colspan="3" class="p-8 text-center text-gray-400">Belum ada data absensi masuk atau keluar.</td>
                </tr>
            `;
        }
    }
}