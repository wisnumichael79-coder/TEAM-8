// ==========================================
// KONFIGURASI KREDENSIAL KEAMANAN & FIREBASE
// ==========================================
const ADMIN_UID = "admin";
const ADMIN_PASSWORD = "Password123@"; 

const STAFF_UID = "staff";
const STAFF_PASSWORD = "Aa131313";

const SECURITY_PIN = "1234";

// JEMBATAN OTOMATIS KE GOOGLE SPREADSHEET ANDA
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbylIb8B24pLxOKkuihiigUtnA6Yj_nQFTl58SkoyiO2sfTOrNqhGM--80CjIEm87XiF/exec";

// SALIN KONFIGURASI DI BAWAH INI DARI FIREBASE CONSOLE ANDA
const firebaseConfig = {
  apiKey: "AIzaSyCGHA916aRAHTcBJwtk-6-nFUpzJ08BpQQ",
  authDomain: "team8-absensi.firebaseapp.com",
  databaseURL: "https://team-8-internal-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "team8-absensi",
  storageBucket: "team8-absensi.appspot.com",
  messagingSenderId: "456282987112",
  appId: "1:456282987112:web:ba8fce55db59985acb39dd"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener("DOMContentLoaded", () => {
    repairMainDOMStructure();
    injectLoginScreenHTML();
    checkLoginSession();
    startClock();
});

// ==========================================
// PENGAMAN: PERBAIKI STRUKTUR DOM JIKA HILANG
// ==========================================
function repairMainDOMStructure() {
    if (!document.getElementById("main-content")) {
        console.warn("Sistem mendeteksi id='main-content' hilang. Memperbaiki otomatis...");
        
        let mainApp = document.getElementById("main-app");
        if (!mainApp) {
            mainApp = document.createElement("div");
            mainApp.id = "main-app";
            mainApp.className = "min-h-screen bg-slate-100 flex";
            document.body.appendChild(mainApp);
        }

        mainApp.innerHTML = `
            <!-- Sidebar -->
            <aside class="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between hidden md:flex">
                <div class="space-y-6">
                    <div class="flex items-center space-x-3 px-2 py-3 border-b border-slate-800">
                        <div class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">T8</div>
                        <div>
                            <h1 class="font-bold text-white text-sm tracking-wide">TEAM 8 INTERNAL</h1>
                            <p class="text-xs text-emerald-400 font-medium flex items-center gap-1">Online</p>
                        </div>
                    </div>
                    
                    <nav class="space-y-1">
                        <button id="btn-dashboard" onclick="loadPage('dashboard')" class="flex items-center space-x-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
                            <i data-lucide="layout-dashboard"></i>
                            <span>Dashboard</span>
                        </button>
                        <button id="btn-inout" onclick="loadPage('inout')" class="flex items-center space-x-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
                            <i data-lucide="coffee"></i>
                            <span>IN/OUT</span>
                        </button>
                        <button id="btn-manajemen" onclick="loadPage('manajemen')" class="flex items-center space-x-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
                            <i data-lucide="users"></i>
                            <span>Manajemen Staff</span>
                        </button>
                    </nav>
                </div>
            </aside>

            <!-- Konten Utama -->
            <div class="flex-1 flex flex-col min-w-0">
                <!-- Topbar Header -->
                <header class="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm">
                    <h1 id="page-title" class="text-xl font-bold text-slate-800">Dashboard</h1>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">Loading...</span>
                    </div>
                </header>
                <!-- Area Inject Halaman -->
                <main id="main-content" class="p-6 flex-1 overflow-y-auto">
                    <!-- HTML luar di-load di sini -->
                </main>
            </div>
        `;
    }
}

// ==========================================
// INJEKSI ELEMEN LOGIN OTOMATIS
// ==========================================
function injectLoginScreenHTML() {
    if (document.getElementById("login-screen")) return;

    const loginDiv = document.createElement("div");
    loginDiv.id = "login-screen";
    loginDiv.className = "fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900 px-4";
    loginDiv.innerHTML = `
        <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200 font-sans text-center">
            <div class="mb-6">
                <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h2 class="text-2xl font-bold text-slate-800">TEAM 8</h2>
                <p class="text-sm text-slate-400 mt-1">SILAHKAN MASUK</p>
            </div>
            
            <div class="space-y-4 text-left mb-6">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">User ID</label>
                    <input type="text" id="login-uid" placeholder="Masukkan User ID" class="w-full p-3 border border-slate-300 rounded-lg text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input type="password" id="login-password" placeholder="••••••••" class="w-full p-3 border border-slate-300 rounded-lg text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <button onclick="handleLogin()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition shadow-md cursor-pointer block text-center">
                    Masuk Aplikasi
                </button>
            </div>

            <div class="pt-4 border-t border-slate-100 space-y-2">
                <p class="text-xs text-slate-400 font-medium mb-2">Tombol Masuk Cepat (Bypass):</p>
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="bypassLogin('admin')" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold py-2.5 px-4 rounded-lg transition cursor-pointer">
                        🔑 Masuk (Admin)
                    </button>
                    <button onclick="bypassLogin('staff')" class="bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold py-2.5 px-4 rounded-lg transition cursor-pointer">
                        👤 Masuk (Staff)
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(loginDiv);
    setTimeout(() => { injectLogoutButton(); }, 500);
}

function injectLogoutButton() {
    const sidebar = document.querySelector("aside nav");
    if (sidebar && !document.getElementById("btn-logout-js")) {
        const logoutWrapper = document.createElement("div");
        logoutWrapper.id = "btn-logout-js";
        logoutWrapper.className = "pt-4 mt-4 border-t border-slate-800";
        logoutWrapper.innerHTML = `
            <button onclick="handleLogout()" class="flex items-center space-x-3 w-full p-3 rounded-lg text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition font-medium cursor-pointer">
                <span>Keluar Sistem (Logout)</span>
            </button>
        `;
        sidebar.appendChild(logoutWrapper);
    }
}

// ==========================================
// LOGIKA PROSES AUTENTIKASI (LOGIN / LOGOUT)
// ==========================================
function checkLoginSession() {
    const isLogedIn = sessionStorage.getItem("team8_login_status");
    const loginScreen = document.getElementById("login-screen");
    const userBadge = document.querySelector("header span");
    const mainApp = document.getElementById("main-app");

    if (isLogedIn === "true") {
        if (loginScreen) loginScreen.classList.add("hidden");
        if (mainApp) mainApp.classList.remove("hidden");
        
        if (userBadge) {
            const currentRole = sessionStorage.getItem("team8_user_role");
            userBadge.innerText = currentRole === "admin" ? "Administrator" : "Staff Karyawan";
        }
        loadPage('dashboard');
    } else {
        if (loginScreen) loginScreen.classList.remove("hidden");
        if (mainApp) mainApp.classList.add("hidden");
        if (window.lucide) lucide.createIcons();
    }
}

function handleLogin() {
    const uidElement = document.getElementById("login-uid");
    const passwordElement = document.getElementById("login-password");

    if (!uidElement || !passwordElement) return;

    const uidInput = uidElement.value.trim();
    const passwordInput = passwordElement.value;

    if (uidInput === "" || passwordInput === "") {
        alert("User ID dan Password tidak boleh kosong!");
        return;
    }

    if (uidInput === ADMIN_UID && passwordInput === ADMIN_PASSWORD) {
        sessionStorage.setItem("team8_login_status", "true");
        sessionStorage.setItem("team8_user_role", "admin");
        alert("Login Berhasil! Selamat Datang Admin.");
        clearLoginForm();
        checkLoginSession();
    } else if (uidInput === STAFF_UID && passwordInput === STAFF_PASSWORD) {
        sessionStorage.setItem("team8_login_status", "true");
        sessionStorage.setItem("team8_user_role", "staff");
        alert("Login Berhasil! Selamat Datang Staff.");
        clearLoginForm();
        checkLoginSession();
    } else {
        alert("Login Gagal! User ID atau Password salah.");
    }
}

function bypassLogin(role) {
    sessionStorage.setItem("team8_login_status", "true");
    sessionStorage.setItem("team8_user_role", role);
    checkLoginSession();
}

function clearLoginForm() {
    const uid = document.getElementById("login-uid");
    const pass = document.getElementById("login-password");
    if(uid) uid.value = "";
    if(pass) pass.value = "";
}

function handleLogout() {
    if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
        sessionStorage.removeItem("team8_login_status");
        sessionStorage.removeItem("team8_user_role");
        checkLoginSession();
    }
}

function startClock() {
    setInterval(() => {
        const clockContainer = document.getElementById('live-clock');
        if (clockContainer) {
            const now = new Date();
            clockContainer.innerText = now.toLocaleTimeString('id-ID');
        }
    }, 1000);
}

// ==========================================
// KONTROLLER ROUTING SISTEM HALAMAN
// ==========================================
function loadPage(pageName) {
    if (sessionStorage.getItem("team8_login_status") !== "true") return;

    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');
    
    if (!mainContent) return;

    fetch(`${pageName}.html`)
        .then(response => {
            if (!response.ok) throw new Error("Halaman tidak ditemukan");
            return response.text();
        })
        .then(html => {
            mainContent.innerHTML = html;
            
            if(pageTitle) {
                if(pageName === 'dashboard') pageTitle.innerText = 'Dashboard';
                else if(pageName === 'inout') pageTitle.innerText = 'IN/OUT';
                else if(pageName === 'manajemen') pageTitle.innerText = 'Manajemen Staff';
                else if(pageName === 'absensi') pageTitle.innerText = 'Jadwal & Absensi';
            }

            updateSidebarStyle(pageName);
            const userRole = sessionStorage.getItem("team8_user_role");

            if (pageName === 'dashboard') {
                initDashboardFilters();
            } else if (pageName === 'inout') {
                renderStaffDropdown();
                renderBreakLogs(); 
                
                if (userRole === "staff") {
                    const deleteLogBtn = document.getElementById("btn-delete-log-container");
                    const thCheckLog = document.getElementById("th-check-log");
                    if (deleteLogBtn) deleteLogBtn.classList.add("hidden");
                    if (thCheckLog) thCheckLog.classList.add("hidden");
                }
            } else if (pageName === 'manajemen') {
                const labelWeb = document.getElementById('label-staff-web');
                const inputWeb = document.getElementById('new-staff-web');
                if (labelWeb) labelWeb.innerText = "WEB";
                if (inputWeb) inputWeb.placeholder = "Contoh: WISNU123";

                if (userRole === "staff") {
                    const formTambah = document.getElementById("form-tambah-staff");
                    const tableContainer = document.getElementById("tabel-staff-container");
                    const thAksiStaff = document.getElementById("th-aksi-staff");

                    if (formTambah) formTambah.classList.add("hidden");
                    if (thAksiStaff) thAksiStaff.classList.add("hidden");
                    if (tableContainer) {
                        tableContainer.className = "w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-3";
                    }
                }
                renderStaffTable();
            } else if (pageName === 'absensi') {
                // Memberi sedikit jeda agar elemen DOM siap dan library terdeteksi
                setTimeout(() => {
                    if (typeof flatpickr !== 'undefined') {
                        flatpickr("#filter-jadwal-bulan", {
                            plugins: [
                                new monthSelectPlugin({
                                    shorthand: true,
                                    dateFormat: "Y-m",
                                    altFormat: "F Y"
                                })
                            ]
                        });
                    } else {
                        console.error("Flatpickr belum terload!");
                    }
                }, 100); // Jeda 100 milidetik
            }

            if (window.lucide) lucide.createIcons();
        })
        .catch(err => {
            mainContent.innerHTML = `<p class="text-red-500 text-center py-10">Gagal memuat sub-halaman: ${err.message}.</p>`;
        });
}

function updateSidebarStyle(activePage) {
    const menus = ['dashboard', 'inout', 'manajemen'];
    menus.forEach(menu => {
        const btn = document.getElementById(`btn-${menu}`);
        if(btn) {
            btn.className = menu === activePage
                ? "flex items-center space-x-3 w-full p-3 rounded-lg bg-blue-600 text-white font-medium transition"
                : "flex items-center space-x-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition";
        }
    });
}

// ==========================================
// ONLINE ENGINE: MANAJEMEN STAFF (FIREBASE)
// ==========================================
function renderStaffDropdown() {
    const dropdown = document.getElementById('staff-name');
    if (!dropdown) return;

    dropdown.innerHTML = '<option value="" disabled selected>-- Memuat Staff... --</option>';
    
    database.ref('staff').once('value', (snapshot) => {
        dropdown.innerHTML = '<option value="" disabled selected>-- Pilih Anggota Staff --</option>';
        
        if (!snapshot.exists()) return;

        snapshot.forEach((child) => {
            const staff = child.val();
            const opt = document.createElement('option');
            opt.value = staff.name;
            opt.innerText = `${staff.name} (${staff.role}) - Shift ${staff.shift}`;
            dropdown.appendChild(opt);
        });
    });
}

function renderStaffTable() {
    const tableBody = document.getElementById('staff-table-body');
    if (!tableBody) return;

    const userRole = sessionStorage.getItem("team8_user_role");
    tableBody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-gray-400">Sinkronisasi Cloud Firebase...</td></tr>`;

    database.ref('staff').once('value', (snapshot) => {
        tableBody.innerHTML = "";
        const thWebHeader = document.getElementById('th-staff-web-header');
        if (thWebHeader) thWebHeader.innerText = "WEB";

        if (!snapshot.exists()) {
            const maxCol = userRole === "staff" ? 4 : 5;
            tableBody.innerHTML = `<tr><td colspan="${maxCol}" class="p-8 text-center text-gray-400">Belum ada staff terdaftar.</td></tr>`;
            return;
        }

        snapshot.forEach((childSnapshot) => {
            const staffId = childSnapshot.key;
            const staff = childSnapshot.val();
            
            const row = document.createElement('tr');
            row.className = "hover:bg-slate-50 transition";
            
            const shiftBadgeClass = staff.shift === 'Pagi'
                ? 'bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-medium'
                : 'bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium';

            let webDisplayHtml = staff.web ? `<span class="text-slate-600 font-medium">${staff.web}</span>` : `<span class="text-gray-400">-</span>`;

            let tdAksiHtml = "";
            if (userRole !== "staff") {
                tdAksiHtml = `
                    <td class="p-4 text-center">
                        <button onclick="deleteStaffOnline('${staffId}', '${staff.name}')" class="text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer">
                            Hapus
                        </button>
                    </td>
                `;
            }

            row.innerHTML = `
                <td class="p-4 font-medium text-gray-900">${staff.name}</td>
                <td class="p-4 text-gray-500">${staff.role}</td>
                <td class="p-4"><span class="${shiftBadgeClass}">${staff.shift === 'Pagi' ? '🌅 Pagi' : '🌙 Malam'}</span></td>
                <td class="p-4">${webDisplayHtml}</td>
                ${tdAksiHtml}
            `;
            tableBody.appendChild(row);
        });
    });
}

function addStaff() {
    const name = document.getElementById('new-staff-name').value.trim();
    const role = document.getElementById('new-staff-role').value.trim();
    const web = document.getElementById('new-staff-web').value.trim();
    const shift = document.getElementById('new-staff-shift').value;

    if (name === "" || role === "") {
        alert("Kolom nama dan jabatan wajib diisi!");
        return;
    }

    database.ref('staff').once('value', (snapshot) => {
        let isExist = false;
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                if (child.val().name.toLowerCase() === name.toLowerCase()) isExist = true;
            });
        }

        if (isExist) {
            alert("Nama staff tersebut sudah terdaftar di sistem!");
            return;
        }

        database.ref('staff').push({ name, role, web, shift }).then(() => {
            document.getElementById('new-staff-name').value = "";
            document.getElementById('new-staff-role').value = "";
            document.getElementById('new-staff-web').value = "";
            alert(`Sukses menambahkan ${name} ke database online.`);
            renderStaffTable();
        });
    });
}

function deleteStaffOnline(staffId, staffName) {
    if (sessionStorage.getItem("team8_user_role") === "staff") return;

    if (confirm(`Apakah Anda yakin ingin menghapus ${staffName}?`)) {
        const userPin = prompt(`Masukkan PIN Keamanan untuk menghapus staff:`);
        if (userPin === SECURITY_PIN) {
            database.ref('staff/' + staffId).remove().then(() => {
                alert("Staff berhasil dihapus dari cloud database.");
                renderStaffTable();
            });
        } else {
            alert("PIN Keamanan SALAH.");
        }
    }
}

// ==========================================
// LOGIKA REASON DROPDOWN CONTROL
// ==========================================
function toggleCustomReasonInput() {
    const reasonSelect = document.getElementById('break-reason');
    const customContainer = document.getElementById('custom-reason-container');
    
    if (reasonSelect && customContainer) {
        if (reasonSelect.value === 'Lainnya') {
            customContainer.classList.remove('hidden');
        } else {
            customContainer.classList.add('hidden');
            const customInput = document.getElementById('custom-reason');
            if (customInput) customInput.value = "";
        }
    }
}

// ==========================================================
// ONLINE ENGINE: LOG AKTIVITAS BREAK (FIREBASE + GOOGLE SPREADSHEET)
// ==========================================================
function startBreak() {
    const nameSelect = document.getElementById('staff-name');
    const reasonSelect = document.getElementById('break-reason');
    const customInput = document.getElementById('custom-reason');
    
    if(!nameSelect) return;
    const staffName = nameSelect.value;

    if (!staffName) {
        alert("Silakan pilih nama Staff terlebih dahulu!");
        return;
    }

    let finalReason = reasonSelect ? reasonSelect.value : "Rokok";
    if (finalReason === 'Lainnya') {
        const customText = customInput ? customInput.value.trim() : "";
        if (customText === "") {
            alert("Harap ketik alasan keluar Anda karena memilih opsi 'Lainnya'!");
            return;
        }
        finalReason = customText;
    }

    database.ref('staff').once('value', (snapshot) => {
        let staffShift = "Pagi";
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                if (child.val().name === staffName) staffShift = child.val().shift;
            });
        }

        const now = new Date();
        const currentDateText = now.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const currentTimeText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const rowId = "break_" + now.getTime();

        const dataPayload = {
            id: rowId,
            date: currentDateText,
            name: staffName,
            shift: staffShift,
            reason: finalReason,
            timeOut: currentTimeText,
            timeIn: "-",
            duration: "-",
            startTimestamp: now.getTime(),
            isDone: false
        };

        // Simpan KE FIREBASE SAJA dulu agar status di web real-time terpantau aktif "Sedang Keluar"
        database.ref('breaks/' + rowId).set(dataPayload).then(() => {
            // Reset Form UI
            nameSelect.value = ""; 
            if (reasonSelect) reasonSelect.value = "Rokok";
            if (customInput) customInput.value = "";
            if (document.getElementById('custom-reason-container')) {
                document.getElementById('custom-reason-container').classList.add('hidden');
            }
            
            // Teks penjelas Firebase di belakang sudah dihapus
            alert(`${staffName} mulai istirahat dengan alasan [${finalReason}].`);
            renderBreakLogs();
        });
    });
}

function endBreak(rowId, startTimeTimestamp, staffName) {
    const now = new Date();
    const timeInText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const timeDiff = now.getTime() - startTimeTimestamp;
    const totalSeconds = Math.floor(timeDiff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const durationText = `${hours}j ${minutes}m ${seconds}d`;

    // Ambil data lama dari Firebase untuk menyelaraskan parameter Tanggal dan Shift asal
    database.ref('breaks/' + rowId).once('value').then((snapshot) => {
        if (!snapshot.exists()) return;
        
        const oldData = snapshot.val();
        
        const completedPayload = {
            id: rowId,
            date: oldData.date,
            name: staffName,
            shift: oldData.shift,
            timeOut: oldData.timeOut,
            timeIn: timeInText,
            duration: durationText,
            isDone: true
        };

        // 1. Perbarui data selesai di Firebase agar statusnya berubah jadi 'Done'
        database.ref('breaks/' + rowId).update({
            timeIn: timeInText,
            duration: durationText,
            isDone: true
        }).then(() => {
            
            // 2. KIRIM DATA KE GOOGLE SPREADSHEET (Hanya ditembakkan SEKARANG saat data sudah lengkap)
            fetch(GOOGLE_SHEET_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(completedPayload)
            });

            // Teks penjelas Google Spreadsheet di belakang sudah dihapus
            alert(`${staffName} telah kembali.`);
            renderBreakLogs();
        });
    });
}

function renderBreakLogs() {
    const tableBody = document.getElementById('log-table-body');
    if (!tableBody) return;

    const userRole = sessionStorage.getItem("team8_user_role");
    const maxCol = userRole === "staff" ? 8 : 9;
    tableBody.innerHTML = `<tr><td colspan="${maxCol}" class="p-8 text-center text-gray-400">Sinkronisasi riwayat cloud...</td></tr>`;

    database.ref('breaks').once('value', (snapshot) => {
        tableBody.innerHTML = "";
        
        if (!snapshot.exists()) {
            tableBody.innerHTML = `<tr id="empty-row"><td colspan="${maxCol}" class="p-8 text-center text-gray-400">Belum ada aktivitas istirahat tercatat.</td></tr>`;
            return;
        }

        let logsArray = [];
        snapshot.forEach(child => {
            logsArray.push(child.val());
        });

        logsArray.reverse().forEach((item) => {
            const row = document.createElement('tr');
            row.id = item.id;
            row.className = "hover:bg-slate-50 transition";

            const shiftBadgeClass = item.shift === 'Pagi'
                ? 'bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-medium'
                : 'bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium';

            let actionColumnHtml = item.isDone
                ? `<span class="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-semibold inline-flex items-center gap-1">Done</span>`
                : `<button onclick="endBreak('${item.id}', ${item.startTimestamp}, '${item.name}')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition cursor-pointer">MASUK BREAK (IN)</button>`;

            let tdCheckboxHtml = "";
            if (userRole !== "staff") {
                tdCheckboxHtml = `
                    <td class="p-4 text-center">
                        <input type="checkbox" name="log-select" value="${item.id}" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    </td>
                `;
            }

            row.innerHTML = `
                ${tdCheckboxHtml}
                <td class="p-4 text-gray-500 font-mono">${item.date}</td>
                <td class="p-4 font-medium text-gray-900">${item.name}</td>
                <td class="p-4"><span class="${shiftBadgeClass}">${item.shift === 'Pagi' ? '🌅 Pagi' : '🌙 Malam'}</span></td>
                <td class="p-4 text-slate-700 font-medium">${item.reason || 'Rokok'}</td>
                <td class="p-4 text-amber-600 font-mono font-semibold">${item.timeOut}</td>
                <td class="p-4 ${item.isDone ? 'text-emerald-600' : 'text-gray-400'} font-mono">${item.timeIn}</td>
                <td class="p-4 ${item.isDone ? 'text-blue-600 font-bold' : 'text-gray-400'}">${item.duration}</td>
                <td class="p-4 text-center">${actionColumnHtml}</td>
            `;
            tableBody.appendChild(row);
        });
    });
}

function toggleSelectAllLogs(masterCheckbox) {
    document.querySelectorAll('input[name="log-select"]').forEach(cb => {
        cb.checked = masterCheckbox.checked;
    });
}

function deleteSelectedLogs() {
    if (sessionStorage.getItem("team8_user_role") === "staff") return;

    const checkboxes = document.querySelectorAll('input[name="log-select"]:checked');
    if (checkboxes.length === 0) {
        alert("Silakan centang minimal satu baris riwayat!");
        return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus ${checkboxes.length} log terpilih secara permanen di Firebase?`)) {
        const userPin = prompt("Masukkan PIN Keamanan:");
        if (userPin === SECURITY_PIN) {
            const promises = Array.from(checkboxes).map(cb => database.ref('breaks/' + cb.value).remove());
            
            Promise.all(promises).then(() => {
                alert("Data riwayat log terpilih berhasil dihapus dari cloud.");
                renderBreakLogs();
            });
        } else {
            alert("PIN Keamanan SALAH.");
        }
    }
}

// ==========================================
// KONTROLLER LOGIKA DASHBOARD (FIREBASE RANGE MAP)
// ==========================================
let currentFilteredDataGlobal = [];

function initDashboardFilters() {
    const fromDateInput = document.getElementById('dash-filter-date-from');
    const toDateInput = document.getElementById('dash-filter-date-to');
    const staffSelect = document.getElementById('dash-filter-staff');
    const btnExcelContainer = document.getElementById('excel-download-container');
    const userRole = sessionStorage.getItem("team8_user_role");

    if (btnExcelContainer) {
        userRole === "admin" ? btnExcelContainer.classList.remove("hidden") : btnExcelContainer.classList.add("hidden");
    }

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (fromDateInput && !fromDateInput.value) fromDateInput.value = todayStr;
    if (toDateInput && !toDateInput.value) toDateInput.value = todayStr;

    if (staffSelect) {
        staffSelect.innerHTML = '<option value="ALL">-- Tampilkan Semua Staff --</option>';
        database.ref('staff').once('value', (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(child => {
                    const opt = document.createElement('option');
                    opt.value = child.val().name;
                    opt.innerText = child.val().name;
                    staffSelect.appendChild(opt);
                });
            }
        });
    }
    renderDashboard();
}

function parseDateTime(dateStr, timeStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    const standardizedTime = timeStr.replace(/\./g, ':');
    const [hours, minutes, seconds] = standardizedTime.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds || 0);
}

function renderDashboard() {
    const tableBody = document.getElementById('dash-table-body');
    const totalDurationContainer = document.getElementById('dash-total-duration');
    const periodBadge = document.getElementById('dash-period-badge');
    
    const fromDateVal = document.getElementById('dash-filter-date-from').value;
    const toDateVal = document.getElementById('dash-filter-date-to').value;
    const filterStaffVal = document.getElementById('dash-filter-staff').value;

    if (!tableBody || !fromDateVal || !toDateVal) return;

    const [fYear, fMonth, fDay] = fromDateVal.split('-').map(Number);
    const shiftStartLimit = new Date(fYear, fMonth - 1, fDay, 6, 30, 0);
    
    const [tYear, tMonth, tDay] = toDateVal.split('-').map(Number);
    const shiftEndLimit = new Date(tYear, tMonth - 1, tDay, 6, 30, 0);
    shiftEndLimit.setDate(shiftEndLimit.getDate() + 1);

    if (periodBadge) {
        periodBadge.innerText = `Rentang Shift: ${shiftStartLimit.toLocaleDateString('id-ID')} (06:30) s/d ${shiftEndLimit.toLocaleDateString('id-ID')} (06:30)`;
    }

    tableBody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-gray-400">Menghitung data online...</td></tr>`;

    database.ref('breaks').once('value', (snapshot) => {
        tableBody.innerHTML = "";
        currentFilteredDataGlobal = [];
        let totalSecondsAccumulated = 0;

        if (snapshot.exists()) {
            snapshot.forEach(child => {
                const item = child.val();
                if (filterStaffVal !== "ALL" && item.name !== filterStaffVal) return;

                const itemActualDate = parseDateTime(item.date, item.timeOut);

                if (itemActualDate >= shiftStartLimit && itemActualDate < shiftEndLimit) {
                    currentFilteredDataGlobal.push(item);
                    
                    if (item.isDone && item.duration !== "-") {
                        const h = item.duration.match(/(\d+)j/) ? parseInt(item.duration.match(/(\d+)j/)[1]) : 0;
                        const m = item.duration.match(/(\d+)m/) ? parseInt(item.duration.match(/(\d+)m/)[1]) : 0;
                        const s = item.duration.match(/(\d+)d/) ? parseInt(item.duration.match(/(\d+)d/)[1]) : 0;
                        totalSecondsAccumulated += (h * 3600) + (m * 60) + s;
                    }
                }
            });
        }

        if (currentFilteredDataGlobal.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-gray-400">Tidak ada riwayat istirahat staff pada rentang ini.</td></tr>`;
        } else {
            currentFilteredDataGlobal.reverse().forEach(item => {
                const row = document.createElement('tr');
                row.className = "hover:bg-slate-50 transition";
                
                const shiftBadgeClass = item.shift === 'Pagi'
                    ? 'bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-medium'
                    : 'bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium';

                row.innerHTML = `
                    <td class="p-4 text-gray-500 font-mono">${item.date}</td>
                    <td class="p-4 font-medium text-gray-900">${item.name}</td>
                    <td class="p-4"><span class="${shiftBadgeClass}">${item.shift === 'Pagi' ? '🌅 Pagi' : '🌙 Malam'}</span></td>
                    <td class="p-4 text-amber-600 font-mono font-semibold">${item.timeOut}</td>
                    <td class="p-4 ${item.isDone ? 'text-emerald-600' : 'text-gray-400'} font-mono font-semibold">${item.timeIn}</td>
                    <td class="p-4 ${item.isDone ? 'text-blue-600 font-bold' : 'text-gray-400'}">${item.duration}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        if (totalDurationContainer) {
            const h = Math.floor(totalSecondsAccumulated / 3600);
            const m = Math.floor((totalSecondsAccumulated % 3600) / 60);
            const s = totalSecondsAccumulated % 60;
            totalDurationContainer.innerText = `${h}j ${m}m ${s}d`;
        }
    });
}

function downloadDashboardExcel() {
    if (sessionStorage.getItem("team8_user_role") !== "admin" || currentFilteredDataGlobal.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,Tanggal,Nama Staff,Shift,Alasan,Jam Keluar (OUT),Jam Masuk (IN),Durasi Istirahat\n";
    currentFilteredDataGlobal.forEach(item => {
        csvContent += `${item.date},"${item.name}",${item.shift},"${item.reason || 'Rokok'}",${item.timeOut},${item.timeIn},${item.duration}\n`;
    });

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Laporan_Firebase_TEAM8.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==========================================
// KONTROLLER JADWAL & ROSTER (OTOMATIS)
// ==========================================

async function loadJadwal() {
    const bulan = document.getElementById('filter-jadwal-bulan').value;
    if (!bulan) return alert("Pilih bulan terlebih dahulu!");

    const container = document.getElementById('jadwal-container');
    const [year, month] = bulan.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const isAdmin = sessionStorage.getItem("team8_user_role") === "admin";

    const staffSnapshot = await database.ref('staff').once('value');
    const jadwalSnapshot = await database.ref(`jadwal/${bulan}`).once('value');
    const jadwalData = jadwalSnapshot.val() || {};

    container.innerHTML = ""; 

    const staffByWeb = {};
    staffSnapshot.forEach(child => {
        const staff = child.val();
        const web = staff.web || "Tanpa Website";
        if (!staffByWeb[web]) staffByWeb[web] = [];
        staffByWeb[web].push(staff);
    });

    for (const [webName, staffs] of Object.entries(staffByWeb)) {
        const wrapper = document.createElement('div');
        wrapper.className = "mb-8 w-full";
        wrapper.innerHTML = `
            <div class="web-header">${webName}</div>
            <div class="table-responsive-wrapper">
                <table class="text-sm border border-slate-300">
                    </table>
            </div>
        `;
        container.appendChild(wrapper);
        
        let table = `<table class="min-w-max w-full text-sm border-collapse border border-slate-300">
            <thead class="bg-slate-100">
                <tr>
                    <th class="w-40 p-2 border">NAMA</th>
                    <th class="w-24 p-2 border">STATUS</th>
                    <th class="w-20 p-2 border">SHIFT</th>
                    ${Array.from({length: daysInMonth}, (_, i) => `<th class="w-10 p-1 border">${i+1}</th>`).join('')}
                    ${isAdmin ? '<th class="w-16 p-1 border">AKSI</th>' : ''}
                </tr>
            </thead>
            <tbody></tbody>
        </table>`;
        
        wrapper.innerHTML += table;
        container.appendChild(wrapper);

        const tbody = wrapper.querySelector('tbody');
        staffs.forEach(staff => {
            const row = document.createElement('tr');
            
            // Header Nama
            let rowHtml = `
                <td class="p-2 border font-bold">${staff.name}</td>
                <td class="p-2 border text-center">${staff.role || '-'}</td>
                <td class="p-2 border text-center font-semibold text-blue-600">${staff.shift || '-'}</td>
            `;
            
            // Kolom Tanggal
            rowHtml += Array.from({length: daysInMonth}, (_, i) => {
                const tglKey = `tgl_${i+1}`;
                const val = jadwalData[staff.name]?.[tglKey] || "18:30";
                
                // 1. Logika Warna (tambahkan juga untuk HALF & 06:30 jika mau)
                let colorClass = "";
                if (val === 'RD') colorClass = "bg-orange-500 text-white";
                else if (val === 'SL' || val === 'SLWOP' || val === 'VLWOP') colorClass = "bg-red-600 text-white";
                else if (val === 'VL') colorClass = "bg-purple-600 text-white";
                else if (val === '18:30') colorClass = "bg-green-600 text-white";
                else if (val === 'HALF') colorClass = "bg-yellow-500 text-black";
                else if (val === '06:30') colorClass = "bg-blue-500 text-white";

                // 2. Definisikan opsi di sini
                const options = ['18:30', '06:30', 'HALF', 'RD', 'SL', 'SLWOP', 'VL', 'VLWOP'];

                return `
                <td class="p-0 border text-center relative h-10 w-12">
                    <div class="jadwal-text w-full h-full flex items-center justify-center font-bold ${colorClass}"
                    id="text-${staff.name}-tgl_${i+1}">
                        ${val}
                    </div>
                    
                    ${isAdmin ? `
                        <select class="jadwal-edit hidden w-full h-full text-center" 
                            id="select-${staff.name}-tgl_${i+1}" 
                            onchange="saveAndUpdate('${staff.name}', '${tglKey}', this)">
                            ${['18:30', '06:30', 'HALF', 'RD', 'SL', 'SLWOP', 'VL', 'VLWOP'].map(opt => 
                                `<option value="${opt}" ${val === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                        </select>
                    ` : ''}
                </td>`;
            }).join('');

            // Kolom Aksi
            if (isAdmin) {
                rowHtml += `<td class="p-2 border text-center">
                    <button onclick="enableEditMode('${staff.name}', this)" class="text-xl">✏️</button>
                </td>`;
            }
            
            row.innerHTML = rowHtml;
            tbody.appendChild(row);
        });
    }
}

// Fungsi pendukung edit
function enableEditMode(staffName, btn) {
    const row = btn.closest('tr');
    
    // Sembunyikan teks
    row.querySelectorAll('.jadwal-text').forEach(div => div.classList.add('hidden'));
    
    // Tampilkan dropdown
    row.querySelectorAll('.jadwal-edit').forEach(sel => sel.classList.remove('hidden'));
    
    // Ubah ikon ke centang/simpan
    btn.innerHTML = '✅';
    
    // Ubah fungsi tombol agar memanggil disableEditMode
    btn.setAttribute('onclick', `disableEditMode('${staffName}', this)`);
}

function toggleEdit(idKey) {
    const select = document.getElementById(`select-${idKey}`);
    const text = document.getElementById(`text-${idKey}`);
    text.innerText = select.value;
    select.classList.add('hidden');
    text.classList.remove('hidden');
}

// Fungsi simpan
function updateJadwal(nama, tglKey, value) {
    const bulan = document.getElementById('filter-jadwal-bulan').value;
    database.ref(`jadwal/${bulan}/${nama}/${tglKey}`).set(value);
}

function updateCellColor(selectElement, idKey) {
    const val = selectElement.value;
    const textSpan = document.getElementById(`text-${idKey}`);
    
    // Reset kelas warna
    textSpan.className = "jadwal-text font-bold p-1 rounded block";
    
    // Logika Warna
    if (val === 'RD') {
        textSpan.classList.add('bg-orange-500', 'text-white');
    } else if (val === 'SLWOP' || val === 'VLWOP') {
        textSpan.classList.add('bg-red-600', 'text-white');
    } else {
        // Warna default (untuk 18:30, SL, VL)
        textSpan.classList.add('text-slate-900');
    }
}

function saveAndUpdate(nama, tglKey, selectElement) {
    const bulan = document.getElementById('filter-jadwal-bulan').value;
    const val = selectElement.value;
    
    // Simpan ke Firebase
    database.ref(`jadwal/${bulan}/${nama}/${tglKey}`).set(val);

    // Cari elemen berdasarkan ID
    const textDiv = document.getElementById(`text-${nama}-${tglKey}`);
    
    // Tambahkan pengecekan if (textDiv) agar tidak error jika elemen tidak ditemukan
    if (textDiv) {
        textDiv.innerText = val;
        
        // Reset class
        textDiv.className = "jadwal-text w-full h-full flex items-center justify-center font-bold";
        
        // Atur warna
        if (val === 'RD') {
            textDiv.classList.add('bg-orange-500', 'text-white');
        } else if (val === 'SL' || val === 'SLWOP' || val === 'VLWOP') {
            textDiv.classList.add('bg-red-600', 'text-white'); // Merah untuk SL, SLWOP, VLWOP
        } else if (val === 'VL') {
            textDiv.classList.add('bg-purple-600', 'text-white'); // Ungu untuk VL
        } else if (val === '18:30') {
            textDiv.classList.add('bg-green-600', 'text-white'); // Hijau untuk 18:30
        } else if (val === 'HALF') {
            textDiv.classList.add('bg-yellow-500', 'text-black');
        } else if (val === '06:30') {
            textDiv.classList.add('bg-blue-500', 'text-white');
        }
    } else {
        console.warn(`Elemen text-${nama}-${tglKey} tidak ditemukan!`);
    }
}

function disableEditMode(staffName, btn) {
    console.log("Memulai proses simpan...");
    try {
        const row = btn.closest('tr');
        
        // 1. Simpan semua data
        const selects = row.querySelectorAll('.jadwal-edit');
        selects.forEach(select => {
            if (!select.classList.contains('hidden')) {
                const idParts = select.id.split('-');
                const tglKey = idParts[2]; // Pastikan index ini benar sesuai ID Anda
                saveAndUpdate(staffName, tglKey, select);
            }
        });

        // 2. Sembunyikan dropdown & Tampilkan teks
        row.querySelectorAll('.jadwal-edit').forEach(sel => sel.classList.add('hidden'));
        row.querySelectorAll('.jadwal-text').forEach(div => div.classList.remove('hidden'));
        
        // 3. Ubah Ikon
        btn.innerHTML = '✏️';
        btn.setAttribute('onclick', `enableEditMode('${staffName}', this)`);
        
        console.log("Proses selesai dan ikon berhasil diubah.");
    } catch (error) {
        console.error("Terjadi error saat simpan:", error);
    }
}