// ==========================================
// KONFIGURASI KREDENSIAL KEAMANAN & AKUN
// ==========================================
const ADMIN_UID = "admin";
const ADMIN_PASSWORD = "Password123@";

const STAFF_UID = "staff";
const STAFF_PASSWORD = "Aa131313";

const SECURITY_PIN = "1234";

document.addEventListener("DOMContentLoaded", () => {
    // Pastikan struktur dasar aplikasi ada sebelum memproses session
    repairMainDOMStructure();
    injectLoginScreenHTML();
    checkLoginSession();
    startClock();
});

// ==========================================
// PENGAMAN: PERBAIKI STRUKTUR DOM JIKA HILANG (ANTI LAYAR PUTIH)
// ==========================================
function repairMainDOMStructure() {
    if (!document.getElementById("main-content")) {
        console.warn("Sistem mendeteksi id='main-content' hilang di index.html. Memperbaiki otomatis...");
        
        let mainApp = document.getElementById("main-app");
        if (!mainApp) {
            mainApp = document.createElement("div");
            mainApp.id = "main-app";
            mainApp.className = "min-h-screen bg-slate-100 flex";
            document.body.appendChild(mainApp);
        }

        mainApp.innerHTML = `
            <aside class="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between hidden md:flex">
                <div>
                    <div class="flex items-center space-x-3 mb-8">
                        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">8</div>
                        <span class="text-xl font-bold tracking-wider">TEAM 8 INTERNAL</span>
                    </div>
                    <nav class="space-y-2">
                        <button id="btn-dashboard" onclick="loadPage('dashboard')" class="flex items-center space-x-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition font-medium cursor-pointer">📂 Dashboard</button>
                        <button id="btn-inout" onclick="loadPage('inout')" class="flex items-center space-x-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition font-medium cursor-pointer">☕ Menu IN/OUT</button>
                        <button id="btn-manajemen" onclick="loadPage('manajemen')" class="flex items-center space-x-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition font-medium cursor-pointer">👥 Manajemen Staff</button>
                    </nav>
                </div>
            </aside>

            <div class="flex-1 flex flex-col min-w-0">
                <header class="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm">
                    <h1 id="page-title" class="text-xl font-bold text-slate-800">Dashboard</h1>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">Loading...</span>
                    </div>
                </header>
                <main id="main-content" class="p-6 flex-1 overflow-y-auto">
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
                <h2 class="text-2xl font-bold text-slate-800">TEAM 8 INTERNAL</h2>
                <p class="text-sm text-slate-400 mt-1">Silakan masuk menggunakan akun Anda</p>
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
                else if(pageName === 'inout') pageTitle.innerText = 'Menu IN/OUT';
                else if(pageName === 'manajemen') pageTitle.innerText = 'Manajemen Staff';
            }

            updateSidebarStyle(pageName);
            
            const userRole = sessionStorage.getItem("team8_user_role");

            if (pageName === 'dashboard') {
                initDashboardFilters();
                renderDashboard();
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
            }

            if (window.lucide) lucide.createIcons();
        })
        .catch(err => {
            mainContent.innerHTML = `<p class="text-red-500 text-center py-10">Gagal memuat sub-halaman: ${err.message}. Pastikan file '${pageName}.html' berada di folder yang sama.</p>`;
        });
}

function updateSidebarStyle(activePage) {
    const menus = ['dashboard', 'inout', 'manajemen'];
    menus.forEach(menu => {
        const btn = document.getElementById(`btn-${menu}`);
        if(btn) {
            if(menu === activePage) {
                btn.className = "flex items-center space-x-3 w-full p-3 rounded-lg bg-blue-600 text-white font-medium transition";
            } else {
                btn.className = "flex items-center space-x-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition";
            }
        }
    });
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
// LOGIKA DATABASE STAFF (LOCALSTORAGE)
// ==========================================
function getStaffFromStorage() {
    const staff = localStorage.getItem('team8_staff');
    return staff ? JSON.parse(staff) : [];
}

function renderStaffDropdown() {
    const dropdown = document.getElementById('staff-name');
    if (!dropdown) return;

    const staffList = getStaffFromStorage();
    dropdown.innerHTML = '<option value="" disabled selected>-- Pilih Anggota Staff --</option>';
    
    staffList.forEach(staff => {
        const opt = document.createElement('option');
        opt.value = staff.name;
        opt.innerText = `${staff.name} (${staff.role}) - Shift ${staff.shift}`;
        dropdown.appendChild(opt);
    });
}

function renderStaffTable() {
    const tableBody = document.getElementById('staff-table-body');
    if (!tableBody) return;

    const staffList = getStaffFromStorage();
    const userRole = sessionStorage.getItem("team8_user_role");
    tableBody.innerHTML = "";

    if (staffList.length === 0) {
        const maxCol = userRole === "staff" ? 4 : 5;
        tableBody.innerHTML = `<tr><td colspan="${maxCol}" class="p-8 text-center text-gray-400">Belum ada staff terdaftar.</td></tr>`;
        return;
    }

    staffList.forEach((staff, index) => {
        const row = document.createElement('tr');
        row.className = "hover:bg-slate-50 transition";
        
        const shiftBadgeClass = staff.shift === 'Pagi'
            ? 'bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-medium'
            : 'bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium';

        let webDisplayHtml = `<span class="text-gray-400">-</span>`;
        if (staff.web && staff.web !== "") {
            webDisplayHtml = `<span class="text-slate-600 font-medium">${staff.web}</span>`;
        }

        let tdAksiHtml = "";
        if (userRole !== "staff") {
            tdAksiHtml = `
                <td class="p-4 text-center">
                    <button onclick="deleteStaff(${index})" class="text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer">
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
}

function addStaff() {
    const nameInput = document.getElementById('new-staff-name');
    const roleInput = document.getElementById('new-staff-role');
    const webInput = document.getElementById('new-staff-web');
    const shiftSelect = document.getElementById('new-staff-shift');
    
    const name = nameInput.value.trim();
    const role = roleInput.value.trim();
    const web = webInput ? webInput.value.trim() : "";
    const shift = shiftSelect.value;

    if (name === "" || role === "") {
        alert("Kolom nama dan jabatan wajib diisi!");
        return;
    }

    const staffList = getStaffFromStorage();
    const isExist = staffList.some(s => s.name.toLowerCase() === name.toLowerCase());
    if(isExist) {
        alert("Nama staff tersebut sudah terdaftar!");
        return;
    }

    staffList.push({ name: name, role: role, web: web, shift: shift });
    localStorage.setItem('team8_staff', JSON.stringify(staffList));

    nameInput.value = "";
    roleInput.value = "";
    if(webInput) webInput.value = "";
    shiftSelect.value = "Pagi";
    
    alert(`Sukses menambahkan ${name} dengan Shift ${shift}.`);
    renderStaffTable();
}

function deleteStaff(index) {
    if (sessionStorage.getItem("team8_user_role") === "staff") {
        alert("Akses Ditolak!");
        return;
    }

    const staffList = getStaffFromStorage();
    const targetStaff = staffList[index];

    if (confirm(`Apakah Anda yakin ingin menghapus ${targetStaff.name}?`)) {
        const userPin = prompt(`Masukkan PIN Keamanan untuk menghapus staff:`);
        if (userPin === null) return;

        if (userPin === SECURITY_PIN) {
            staffList.splice(index, 1);
            localStorage.setItem('team8_staff', JSON.stringify(staffList));
            alert("Staff berhasil dihapus dari sistem.");
            renderStaffTable();
        } else {
            alert("Gagal menghapus! PIN Keamanan yang Anda masukkan SALAH.");
        }
    }
}

// ==========================================
// DATABASE RIWAYAT BREAK (LOCALSTORAGE)
// ==========================================
function getBreaksFromStorage() {
    const breaks = localStorage.getItem('team8_breaks');
    return breaks ? JSON.parse(breaks) : [];
}

function renderBreakLogs() {
    const tableBody = document.getElementById('log-table-body');
    if (!tableBody) return;

    const breakList = getBreaksFromStorage();
    const userRole = sessionStorage.getItem("team8_user_role");
    tableBody.innerHTML = "";

    const checkAllBox = document.getElementById('check-all-logs');
    if (checkAllBox) checkAllBox.checked = false;

    if (breakList.length === 0) {
        const maxCol = userRole === "staff" ? 7 : 8;
        tableBody.innerHTML = `<tr id="empty-row"><td colspan="${maxCol}" class="p-8 text-center text-gray-400">Belum ada aktivitas istirahat tercatat.</td></tr>`;
        return;
    }

    breakList.slice().reverse().forEach((item) => {
        const row = document.createElement('tr');
        row.id = item.id;
        row.className = "hover:bg-slate-50 transition";

        const shiftBadgeClass = item.shift === 'Pagi'
            ? 'bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-medium'
            : 'bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium';

        let actionColumnHtml = "";
        let timeInClass = "p-4 text-gray-400 font-mono";
        let durationClass = "p-4 text-gray-400 font-medium";

        if (item.isDone) {
            timeInClass = "p-4 text-emerald-600 font-mono font-semibold";
            durationClass = "p-4 text-blue-600 font-bold";
            actionColumnHtml = `<span class="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-semibold inline-flex items-center gap-1">Done</span>`;
        } else {
            actionColumnHtml = `
                <button onclick="endBreak('${item.id}', ${item.startTimestamp}, '${item.name}')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition cursor-pointer">
                    MASUK BREAK (IN)
                </button>
            `;
        }

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
            <td class="p-4 text-amber-600 font-mono font-semibold">${item.timeOut}</td>
            <td class="${timeInClass}" id="time-in-${item.id}">${item.timeIn}</td>
            <td class="${durationClass}" id="duration-${item.id}">${item.duration}</td>
            <td class="p-4 text-center" id="action-${item.id}">${actionColumnHtml}</td>
        `;
        tableBody.appendChild(row);
    });
}

function toggleSelectAllLogs(masterCheckbox) {
    const checkboxes = document.querySelectorAll('input[name="log-select"]');
    checkboxes.forEach(cb => {
        cb.checked = masterCheckbox.checked;
    });
}

function startBreak() {
    const nameSelect = document.getElementById('staff-name');
    if(!nameSelect) return;
    
    const staffName = nameSelect.value;

    if (!staffName || staffName === "") {
        alert("Silakan pilih nama Staff terlebih dahulu!");
        return;
    }

    const staffList = getStaffFromStorage();
    const currentStaffData = staffList.find(s => s.name === staffName);
    const staffShift = currentStaffData ? currentStaffData.shift : "Pagi";

    const now = new Date();
    const currentDateText = now.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const currentTimeText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const rowId = "break_" + now.getTime();

    const breakList = getBreaksFromStorage();
    const newRecord = {
        id: rowId,
        date: currentDateText,
        name: staffName,
        shift: staffShift,
        timeOut: currentTimeText,
        timeIn: "-",
        duration: "-",
        startTimestamp: now.getTime(),
        isDone: false
    };
    
    breakList.push(newRecord);
    localStorage.setItem('team8_breaks', JSON.stringify(breakList));

    nameSelect.value = ""; 
    alert(`${staffName} mulai istirahat pada jam ${currentTimeText}`);
    renderBreakLogs();
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

    const breakList = getBreaksFromStorage();
    const recordIndex = breakList.findIndex(item => item.id === rowId);
    
    if (recordIndex !== -1) {
        breakList[recordIndex].timeIn = timeInText;
        breakList[recordIndex].duration = durationText;
        breakList[recordIndex].isDone = true;
        localStorage.setItem('team8_breaks', JSON.stringify(breakList));
    }

    alert(`${staffName} telah kembali dari istirahat. Total durasi break: ${durationText}`);
    renderBreakLogs();
}

function deleteSelectedLogs() {
    if (sessionStorage.getItem("team8_user_role") === "staff") {
        alert("Akses Ditolak!");
        return;
    }

    const checkboxes = document.querySelectorAll('input[name="log-select"]:checked');
    
    if (checkboxes.length === 0) {
        alert("Silakan centang minimal satu baris riwayat yang ingin dihapus!");
        return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus ${checkboxes.length} riwayat istirahat terpilih?`)) {
        const userPin = prompt("Masukkan PIN Keamanan untuk menghapus riwayat log:");
        if (userPin === null) return;

        if (userPin === SECURITY_PIN) {
            const idsToDelete = Array.from(checkboxes).map(cb => cb.value);
            let breakList = getBreaksFromStorage();
            
            breakList = breakList.filter(item => !idsToDelete.includes(item.id));
            localStorage.setItem('team8_breaks', JSON.stringify(breakList));
            
            alert("Data riwayat log terpilih berhasil dihapus.");
            renderBreakLogs();
        } else {
            alert("Gagal menghapus log! PIN Keamanan yang Anda masukkan SALAH.");
        }
    }
}

// ==========================================
// KONTROLLER CORE LOGIKA DASHBOARD (RANGE TANGGAL & EXCEL)
// ==========================================
let currentFilteredDataGlobal = []; // Menyimpan data terfilter untuk diunduh ke Excel

function initDashboardFilters() {
    const fromDateInput = document.getElementById('dash-filter-date-from');
    const toDateInput = document.getElementById('dash-filter-date-to');
    const staffSelect = document.getElementById('dash-filter-staff');
    const btnExcelContainer = document.getElementById('excel-download-container');
    const userRole = sessionStorage.getItem("team8_user_role");

    // Tampilkan tombol unduh Excel hanya untuk ADMIN
    if (btnExcelContainer) {
        if (userRole === "admin") {
            btnExcelContainer.classList.remove("hidden");
        } else {
            btnExcelContainer.classList.add("hidden");
        }
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    if (fromDateInput && !fromDateInput.value) fromDateInput.value = todayStr;
    if (toDateInput && !toDateInput.value) toDateInput.value = todayStr;

    if (staffSelect) {
        const staffList = getStaffFromStorage();
        staffSelect.innerHTML = '<option value="ALL">-- Tampilkan Semua Staff --</option>';
        staffList.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.name;
            opt.innerText = s.name;
            staffSelect.appendChild(opt);
        });
    }
}

function parseDateTime(dateStr, timeStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    // Mengakomodasi format jam dengan tanda titik (.) atau titik dua (:)
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

    // Set batas awal: Tanggal 'From' jam 06:30 pagi
    const [fYear, fMonth, fDay] = fromDateVal.split('-').map(Number);
    const shiftStartLimit = new Date(fYear, fMonth - 1, fDay, 6, 30, 0);
    
    // Set batas akhir: Tanggal 'To' + 1 hari jam 06:30 pagi
    const [tYear, tMonth, tDay] = toDateVal.split('-').map(Number);
    const shiftEndLimit = new Date(tYear, tMonth - 1, tDay, 6, 30, 0);
    shiftEndLimit.setDate(shiftEndLimit.getDate() + 1);

    if (periodBadge) {
        periodBadge.innerText = `Rentang Shift: ${shiftStartLimit.toLocaleDateString('id-ID')} (06:30) s/d ${shiftEndLimit.toLocaleDateString('id-ID')} (06:30)`;
    }

    const breakList = getBreaksFromStorage();
    tableBody.innerHTML = "";
    
    currentFilteredDataGlobal = [];
    let totalSecondsAccumulated = 0;

    breakList.forEach(item => {
        if (filterStaffVal !== "ALL" && item.name !== filterStaffVal) return;

        const itemActualDate = parseDateTime(item.date, item.timeOut);

        if (itemActualDate >= shiftStartLimit && itemActualDate < shiftEndLimit) {
            currentFilteredDataGlobal.push(item);
            
            if (item.isDone && item.duration !== "-") {
                const matchHours = item.duration.match(/(\d+)j/);
                const matchMinutes = item.duration.match(/(\d+)m/);
                const matchSeconds = item.duration.match(/(\d+)d/);
                
                const h = matchHours ? parseInt(matchHours[1]) : 0;
                const m = matchMinutes ? parseInt(matchMinutes[1]) : 0;
                const s = matchSeconds ? parseInt(matchSeconds[1]) : 0;
                
                totalSecondsAccumulated += (h * 3600) + (m * 60) + s;
            }
        }
    });

    if (currentFilteredDataGlobal.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-gray-400">Tidak ada riwayat istirahat staff pada rentang tanggal filter ini.</td></tr>`;
    } else {
        // Tampilkan data urutan terbaru di atas
        currentFilteredDataGlobal.slice().reverse().forEach(item => {
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
}

// ==========================================
// FUNGSIONALITAS DOWNLOAD EXCEL (CSV FORMAT)
// ==========================================
function downloadDashboardExcel() {
    if (sessionStorage.getItem("team8_user_role") !== "admin") {
        alert("Akses Ditolak! Hanya Administrator yang dapat mendownload laporan excel.");
        return;
    }

    if (currentFilteredDataGlobal.length === 0) {
        alert("Tidak ada data terfilter untuk diunduh!");
        return;
    }

    // Header Kolom Excel
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Tanggal,Nama Staff,Shift,Jam Keluar (OUT),Jam Masuk (IN),Durasi Istirahat\n";

    // Isi Baris Data
    currentFilteredDataGlobal.forEach(item => {
        const rowData = [
            item.date,
            `"${item.name}"`,
            item.shift,
            item.timeOut,
            item.timeIn,
            item.duration
        ];
        csvContent += rowData.join(",") + "\n";
    });

    // Proses Download File oleh Browser Berformat .csv (Dapat dibuka langsung via Microsoft Excel)
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    
    const fromDate = document.getElementById('dash-filter-date-from').value;
    const toDate = document.getElementById('dash-filter-date-to').value;
    
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Break_TEAM8_${fromDate}_to_${toDate}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
}