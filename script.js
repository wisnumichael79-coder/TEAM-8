const SECURITY_PIN = "1234";

document.addEventListener("DOMContentLoaded", () => {
    loadPage('dashboard');
    startClock();
});

function loadPage(pageName) {
    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');
    
    fetch(`${pageName}.html`)
        .then(response => {
            if (!response.ok) throw new Error("Halaman tidak ditemukan");
            return response.text();
        })
        .then(html => {
            mainContent.innerHTML = html;
            
            if(pageName === 'dashboard') pageTitle.innerText = 'Dashboard';
            else if(pageName === 'inout') pageTitle.innerText = 'Menu IN/OUT';
            else if(pageName === 'manajemen') pageTitle.innerText = 'Manajemen Staff';

            updateSidebarStyle(pageName);
            
            if (pageName === 'inout') {
                renderStaffDropdown();
                renderBreakLogs(); // MEMUAT ULANG RIWAYAT ABSEN SAAT MENU DIBUKA
            } else if (pageName === 'manajemen') {
                renderStaffTable();
            }

            if (window.lucide) lucide.createIcons();
        })
        .catch(err => {
            mainContent.innerHTML = `<p class="text-red-500 text-center py-10">Gagal memuat halaman: ${err.message}</p>`;
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
    tableBody.innerHTML = "";

    if (staffList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-gray-400">Belum ada staff terdaftar. Silakan tambah di form sebelah kiri.</td></tr>`;
        return;
    }

    staffList.forEach((staff, index) => {
        const row = document.createElement('tr');
        row.className = "hover:bg-slate-50 transition";
        
        const shiftBadgeClass = staff.shift === 'Pagi'
            ? 'bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-medium'
            : 'bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium';

        row.innerHTML = `
            <td class="p-4 font-medium text-gray-900">${staff.name}</td>
            <td class="p-4 text-gray-500">${staff.role}</td>
            <td class="p-4"><span class="${shiftBadgeClass}">${staff.shift === 'Pagi' ? '🌅 Pagi' : '🌙 Malam'}</span></td>
            <td class="p-4 text-center">
                <button onclick="deleteStaff(${index})" class="text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs font-medium transition">
                    Hapus
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function addStaff() {
    const nameInput = document.getElementById('new-staff-name');
    const roleInput = document.getElementById('new-staff-role');
    const shiftSelect = document.getElementById('new-staff-shift');
    
    const name = nameInput.value.trim();
    const role = roleInput.value.trim();
    const shift = shiftSelect.value;

    if (name === "" || role === "") {
        alert("Semua kolom nama dan jabatan wajib diisi!");
        return;
    }

    const staffList = getStaffFromStorage();
    const isExist = staffList.some(s => s.name.toLowerCase() === name.toLowerCase());
    if(isExist) {
        alert("Nama staff tersebut sudah terdaftar!");
        return;
    }

    staffList.push({ name: name, role: role, shift: shift });
    localStorage.setItem('team8_staff', JSON.stringify(staffList));

    nameInput.value = "";
    roleInput.value = "";
    shiftSelect.value = "Pagi";
    
    alert(`Sukses menambahkan ${name} dengan Shift ${shift}.`);
    renderStaffTable();
    if (window.lucide) lucide.createIcons();
}

function deleteStaff(index) {
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

// Fungsi menampilkan data riwayat dari LocalStorage ke Tabel
function renderBreakLogs() {
    const tableBody = document.getElementById('log-table-body');
    if (!tableBody) return;

    const breakList = getBreaksFromStorage();
    tableBody.innerHTML = "";

    if (breakList.length === 0) {
        tableBody.innerHTML = `<tr id="empty-row"><td colspan="7" class="p-8 text-center text-gray-400">Belum ada aktivitas istirahat tercatat.</td></tr>`;
        return;
    }

    // Tampilkan dari data terbaru (paling atas)
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

        // Cek jika statusnya sudah selesai (Done) atau masih menggantung tombol IN
        if (item.isDone) {
            timeInClass = "p-4 text-emerald-600 font-mono font-semibold";
            durationClass = "p-4 text-blue-600 font-bold";
            actionColumnHtml = `<span class="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-semibold inline-flex items-center gap-1">Done</span>`;
        } else {
            actionColumnHtml = `
                <button onclick="endBreak('${item.id}', ${item.startTimestamp}, '${item.name}')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition">
                    MASUK BREAK (IN)
                </button>
            `;
        }

        row.innerHTML = `
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

// 1. Fungsi saat Staff Klik "MULAI ISTIRAHAT"
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

    // Simpan objek data baru ke LocalStorage
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
    renderBreakLogs(); // Render ulang tabel dari database lokal
}

// 2. Fungsi saat Tombol "MASUK BREAK (IN)" Diklik
function endBreak(rowId, startTimeTimestamp, staffName) {
    const now = new Date();
    const timeInText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const timeDiff = now.getTime() - startTimeTimestamp;
    const totalSeconds = Math.floor(timeDiff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const durationText = `${hours}j ${minutes}m ${seconds}d`;

    // Perbarui datanya di dalam database LocalStorage
    const breakList = getBreaksFromStorage();
    const recordIndex = breakList.findIndex(item => item.id === rowId);
    
    if (recordIndex !== -1) {
        breakList[recordIndex].timeIn = timeInText;
        breakList[recordIndex].duration = durationText;
        breakList[recordIndex].isDone = true;
        localStorage.setItem('team8_breaks', JSON.stringify(breakList));
    }

    alert(`${staffName} telah kembali dari istirahat. Total durasi break: ${durationText}`);
    renderBreakLogs(); // Render ulang tampilan tabel agar datanya sinkron berkala
}

function clearLogs() {
    if(confirm("Apakah Anda yakin ingin menghapus semua riwayat absen dari sistem secara permanen?")) {
        localStorage.removeItem('team8_breaks');
        renderBreakLogs();
    }
}