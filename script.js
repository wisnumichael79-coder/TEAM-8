// ==========================================
// KONFIGURASI KREDENSIAL & FIREBASE
// ==========================================
const ADMIN_UID = "admin";
const ADMIN_PASSWORD = "Password123@"; 
const STAFF_UID = "staff";
const STAFF_PASSWORD = "Aa131313";
const SECURITY_PIN = "1234";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbylIb8B24pLxOKkuihiigUtnA6Yj_nQFTl58SkoyiO2sfTOrNqhGM--80CjIEm87XiF/exec";

const firebaseConfig = {
  apiKey: "AIzaSyCGHA916aRAHTcBJwtk-6-nFUpzJ08BpQQ",
  authDomain: "team8-absensi.firebaseapp.com",
  databaseURL: "https://team-8-internal-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "team8-absensi",
  storageBucket: "team8-absensi.appspot.com",
  messagingSenderId: "456282987112",
  appId: "1:456282987112:web:ba8fce55db59985acb39dd"
};

// Inisialisasi Firebase (Hanya sekali)
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("Sistem Dimuat...");
    checkLoginSession();
    startClock();
    if (window.lucide) lucide.createIcons();
});

// ==========================================
// AUTHENTIKASI
// ==========================================
function checkLoginSession() {
    const isLogedIn = sessionStorage.getItem("team8_login_status");
    const loginScreen = document.getElementById("login-screen");
    const mainApp = document.getElementById("main-app");

    if (isLogedIn === "true") {
        if (loginScreen) loginScreen.classList.add("hidden");
        if (mainApp) mainApp.classList.remove("hidden");
        loadPage('dashboard');
    } else {
        if (loginScreen) loginScreen.classList.remove("hidden");
        if (mainApp) mainApp.classList.add("hidden");
    }
}

function handleLogin() {
    const uid = document.getElementById("login-uid").value.trim();
    const pass = document.getElementById("login-password").value;

    if (uid === ADMIN_UID && pass === ADMIN_PASSWORD) {
        sessionStorage.setItem("team8_login_status", "true");
        sessionStorage.setItem("team8_user_role", "admin");
        checkLoginSession();
    } else if (uid === STAFF_UID && pass === STAFF_PASSWORD) {
        sessionStorage.setItem("team8_login_status", "true");
        sessionStorage.setItem("team8_user_role", "staff");
        checkLoginSession();
    } else {
        alert("Login Gagal!");
    }
}

function handleLogout() {
    sessionStorage.removeItem("team8_login_status");
    sessionStorage.removeItem("team8_user_role");
    window.location.reload();
}

// ==========================================
// ROUTING & UI
// ==========================================
function loadPage(pageName) {
    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');
    
    fetch(`${pageName}.html`)
        .then(res => res.text())
        .then(html => {
            mainContent.innerHTML = html;
            if(pageTitle) pageTitle.innerText = pageName.toUpperCase();
            updateSidebarStyle(pageName);
            
            // Inisialisasi Halaman
            if (pageName === 'absensi') renderAbsensiTable();
            if (pageName === 'dashboard') initDashboardFilters();
            if (window.lucide) lucide.createIcons();
        });
}

function updateSidebarStyle(activePage) {
    ['dashboard', 'inout', 'manajemen', 'absensi'].forEach(menu => {
        const btn = document.getElementById(`btn-${menu}`);
        if(btn) {
            btn.className = menu === activePage
                ? "flex items-center space-x-3 w-full p-3 rounded-lg bg-blue-600 text-white font-medium transition"
                : "flex items-center space-x-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition";
        }
    });
}

// ==========================================
// FUNGSI ABSENSI (DIPERBAIKI)
// ==========================================
function renderAbsensiTable() {
    const tbody = document.getElementById('absensi-table-body');
    if (!tbody) return;

    // Pastikan path Firebase sesuai dengan data Anda
    database.ref(`jadwal_absensi/2026-07/01`).once('value', (snapshot) => {
        tbody.innerHTML = "";
        snapshot.forEach((child) => {
            const data = child.val();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-3 border">${child.key.split('_')[1]}</td>
                <td class="p-3 border text-center font-bold text-slate-700">${data.status}</td>
            `;
            tbody.appendChild(row);
        });
    });
}

function startClock() {
    setInterval(() => {
        const c = document.getElementById('live-clock');
        if (c) c.innerText = new Date().toLocaleTimeString('id-ID');
    }, 1000);
}