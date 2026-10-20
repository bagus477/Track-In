// I18N.JS — Terjemahan Indonesia (id) <-> Inggris (en) untuk semua halaman Track IN.
//
// Cara kerja: teks Indonesia di HTML/JS dicocokkan dengan kamus di bawah, lalu diganti
// ke bahasa Inggris saat bahasa "en" dipilih (halaman Akun > Bahasa). Teks yang dibuat
// JavaScript belakangan (toast, alert, kartu data) ikut diterjemahkan lewat observer.
// Bahasa lain yang belum punya kamus otomatis tampil dalam bahasa Indonesia.
//
// Menambah bahasa baru: buat kamus baru seperti DICT.en, lalu daftarkan di DICTS.

(function () {
    "use strict";

    const STORAGE_KEY = "trackin_language";
    const ATTRS = ["placeholder", "title", "aria-label", "alt"];

    /* =========================================================
       KAMUS INGGRIS — kecocokan persis (teks Indonesia -> Inggris)
    ========================================================= */
    const EN = {
        // ---- Navigasi & umum ----
        "Dasbor": "Dashboard",
        "Akun": "Account",
        "Catatan": "Notes",
        "Inventaris": "Inventory",
        "Keuangan": "Finance",
        "KEUANGAN": "FINANCE",
        "Buka akun": "Open account",
        "Foto profil Yusuf": "Yusuf's profile photo",
        "Batal": "Cancel",
        "Simpan": "Save",
        "Hapus": "Delete",
        "Tutup": "Close",
        "Semua": "All",
        "Semua Kategori": "All Categories",
        "Terbaru": "Newest",
        "Terlama": "Oldest",
        "↕ Urutkan": "↕ Sort",
        "Lihat Semua": "View All",
        "Lihat Detail": "View Details",
        "Lainnya": "Others",
        "Tanggal": "Date",
        "Bulan": "Month",
        "Kategori": "Category",
        "Pilih tanggal": "Select date",
        "Tanggal sebelumnya": "Previous date",
        "Tanggal berikutnya": "Next date",
        "Tambah widget": "Add widget",

        // ---- Judul halaman ----
        "Track IN - Catatan": "Track IN - Notes",
        "Track IN - Inventaris": "Track IN - Inventory",
        "Track IN - Pengaturan Akun": "Track IN - Account Settings",
        "Keuangan - Track IN": "Finance - Track IN",

        // ---- Login ----
        "Selamat datang di log in Track IN": "Welcome to Track IN login",
        "masuk ke akun Track IN kamu Untuk Melanjutkan": "sign in to your Track IN account to continue",
        "Lupa kata sandi?": "Forgot password?",
        "Belum punya akun?": "Don't have an account?",
        "Daftar sekarang": "Sign up now",
        "lanjutkan dengan": "continue with",
        "Masukkan email yang valid.": "Enter a valid email.",
        "Password minimal 6 karakter.": "Password must be at least 6 characters.",
        "Tampilkan password": "Show password",
        "selamat datang": "welcome",
        "tulis nama": "enter name",
        "membayar": "paid",
        "menambahkan": "added",
        "menambahkan pengeluaran": "added an expense",
        "Login berhasil! Selamat datang.": "Login successful! Welcome.",
        "Silakan periksa email dan password.": "Please check your email and password.",
        "Gagal terhubung ke server.": "Failed to connect to the server.",
        "Email atau password salah.": "Incorrect email or password.",
        "Halaman reset password akan dibuka.": "The password reset page will open.",
        "Halaman pendaftaran akan dibuka.": "The registration page will open.",

        // ---- Dasbor ----
        "Tunai": "Cash",
        "Atur pemasukan bulanan": "Set monthly income",
        "Tambah Card": "Add Card",
        "Simpan Card": "Save Card",
        "Widget Tambahan": "Additional Widgets",
        "Status Ringkasan Saldo": "Balance Summary Status",
        "Sesuai Rencana": "On Track",
        "SALDO": "BALANCE",
        "ARUS KAS": "CASH FLOW",
        "PENGELUARAN": "EXPENSES",
        "Saldo:": "Balance:",
        "Saldo (Rp)": "Balance (Rp)",
        "Anggaran Kos:": "Rent Budget:",
        "Proyek Lainnya:": "Other Projects:",
        "Ringkasan Bulan Ini": "This Month's Summary",
        "Tren Saldo & Kebutuhan": "Balance & Needs Trend",
        "Grafik tren saldo": "Balance trend chart",
        "Struktur Pengeluaran": "Expense Structure",
        "Visualisasi pembagian kategori pembiayaan kost": "Visualization of rent cost category breakdown",
        "Per Kategori": "By Category",
        "Pengeluaran per Kategori": "Expenses by Category",
        "Tidak ada data pada rentang waktu yang dipilih.": "No data in the selected time range.",
        "Aktivitas Terbaru": "Recent Activity",
        "Riwayat log perubahan dan kontribusi para penghuni kost": "Change log and contributions of boarding house residents",
        "Riwayat perubahan keuangan": "Financial change history",
        "Inventaris Terbaru": "Latest Inventory",
        "Daftar item bersama atau pribadi yang baru ditambahkan": "Recently added shared or personal items",
        "Lihat Inventaris": "View Inventory",
        "Tagihan Terdekat": "Nearest Bill",
        "TAGIHAN TERDEKAT": "NEAREST BILL",
        "Pantau pembayaran kost dan iuran sebelum jatuh tempo": "Monitor rent and dues payments before they are due",
        "Segera lakukan pembayaran": "Make the payment soon",
        "Belum ada tagihan": "No bills yet",
        "Tanpa kategori": "No category",
        "Pengeluaran Bulan Ini": "This Month's Expenses",
        "Total akumulasi anggaran belanja bulan berjalan": "Total accumulated shopping budget for the current month",
        "Akumulasi seluruh pengeluaran": "Total of all expenses",
        "Semua barang terdaftar": "All registered items",
        "Tambah Data Pertama Anda": "Add Your First Data",
        "Pemasukan Bulanan": "Monthly Income",
        "Masukkan pemasukan untuk bulan yang dipilih.": "Enter income for the selected month.",
        "Jumlah Pemasukan": "Income Amount",
        "Contoh: 5000000": "Example: 5000000",
        "Nominal ini akan digunakan sebagai pemasukan pada dashboard untuk bulan yang dipilih.":
            "This amount will be used as income on the dashboard for the selected month.",
        "Simpan Pemasukan": "Save Income",
        "Isi bulan dan jumlah pemasukan dengan benar.": "Fill in the month and income amount correctly.",
        "Pemasukan bulanan berhasil disimpan.": "Monthly income saved successfully.",
        "Gagal menyimpan pemasukan.": "Failed to save income.",
        "Tampilan widget diperbarui.": "Widget display updated.",
        "Tidak ada card baru yang dipilih.": "No new cards selected.",
        "Card ini sudah ditambahkan": "This card has already been added",
        "Kost jatuh tempo 3 hari lagi": "Rent is due in 3 days",
        "Pembayaran kost bulan September sebesar Rp500.000 akan jatuh tempo pada 5 September 2026.":
            "Rent payment for September of Rp500.000 is due on 5 September 2026.",
        "Pembayaran berhasil diverifikasi": "Payment successfully verified",
        "Terverifikasi": "Verified",
        "Galon Rp20.000": "Gallon Rp20.000",
        "Gas Rp40.000": "Gas Rp40.000",
        "WiFi Rp100.000": "WiFi Rp100.000",
        "Kost September": "September Rent",
        "Tinggi": "High",
        "Sedang": "Medium",
        "Rendah": "Low",

        // ---- Keuangan ----
        "Kelola pengeluaran dan pembayaran bersama.": "Manage shared expenses and payments.",
        "Daftar Pengeluaran": "Expense List",
        "Cari pengeluaran...": "Search expenses...",
        "Dibayar oleh": "Paid by",
        "Dibayar Oleh": "Paid By",
        "Harga Terendah": "Lowest Price",
        "Harga Tertinggi": "Highest Price",
        "Nama A-Z": "Name A-Z",
        "Tambah Pengeluaran": "Add Expense",
        "Tambah Tagihan": "Add Bill",
        "+ + Tagihan": "+ + Bill",
        "Tagihan": "Bills",
        "Tagihan Belum Dibayar": "Unpaid Bills",
        "Total Tagihan": "Total Bills",
        "Total Pengeluaran": "Total Expenses",
        "Pengeluaran": "Expenses",
        "Pengeluaran tidak ditemukan": "No expenses found",
        "Coba ubah kata pencarian atau filter.": "Try changing your search term or filter.",
        "Nama Pengeluaran": "Expense Name",
        "Contoh: Bayar Listrik": "Example: Pay Electricity",
        "Nominal": "Amount",
        "Nominal Total": "Total Amount",
        "Simpan Pengeluaran": "Save Expense",
        "Nama Tagihan": "Bill Name",
        "Masukan nama tagihan": "Enter bill name",
        "Jatuh Tempo": "Due Date",
        "Ulangi Setiap Bulan": "Repeat Every Month",
        "Pembagian": "Split",
        "Pembagian Pembayaran": "Payment Split",
        "Dibagi Rata": "Split Equally",
        "Tentukan Manual": "Set Manually",
        "Bagi hasil biaya": "Split costs",
        "Anggota yang Membayar": "Members Paying",
        "Detail Pembayaran": "Payment Details",
        "Status pembayaran": "Payment status",
        "Belum Bayar": "Unpaid",
        "Sudah Dibayar": "Paid",
        "✓ Lunas": "✓ Paid",
        "Pilih minimal 1 anggota": "Select at least 1 member",
        "Pemasukan Bulan Ini": "This Month's Income",
        "Saldo Bulan Ini": "This Month's Balance",
        "♙ Oleh:": "♙ By:",
        "Wifi": "WiFi",
        "Listrik": "Electricity",
        "Air": "Water",
        "Kost": "Rent",
        "Kebutuhan Kost": "Boarding House Needs",
        "Makanan": "Food",
        "Transportasi": "Transport",
        "Gagal memuat data keuangan.": "Failed to load financial data.",
        "Mohon lengkapi data.": "Please complete the data.",
        "Pengeluaran berhasil dihapus.": "Expense deleted successfully.",
        "Pengeluaran gagal dihapus.": "Failed to delete expense.",
        "Pengeluaran berhasil ditambahkan!": "Expense added successfully!",
        "Pengeluaran gagal disimpan.": "Failed to save expense.",
        "Mohon lengkapi nama tagihan, total tagihan, dan tanggal jatuh tempo.":
            "Please complete the bill name, total bill, and due date.",
        "Tagihan berhasil disimpan ke database!": "Bill saved to the database successfully!",
        "Gagal menyimpan tagihan.": "Failed to save bill.",
        "Menyimpan...": "Saving...",

        // ---- Inventaris ----
        "Catat barang yang dibeli dan digunakan bersama": "Record items bought and used together",
        "Tambah Barang": "Add Item",
        "＋ Tambah Barang": "＋ Add Item",
        "Edit Barang": "Edit Item",
        "Simpan Barang": "Save Item",
        "Total Barang": "Total Items",
        "Barang": "Item",
        "Barang Bersama": "Shared Items",
        "Barang Pribadi": "Personal Items",
        "Patungan": "Cost Sharing",
        "Digunakan bersama": "Used together",
        "Milik perorangan": "Individually owned",
        "Cari barang...": "Search items...",
        "Barang tidak ditemukan": "No items found",
        "Coba gunakan kata pencarian atau kategori lain.": "Try a different search term or category.",
        "Nama Barang": "Item Name",
        "Contoh: Sapu ijuk, Sabun Cuci": "Example: Broom, Laundry Soap",
        "Status Kepemilikan": "Ownership Status",
        "Dibeli Oleh": "Purchased By",
        "Tanggal Pembelian": "Purchase Date",
        "Harga": "Price",
        "Keterangan (Opsional)": "Description (Optional)",
        "Tulis detail atau keterangan tambahan mengenai barang ini...": "Write additional details about this item...",
        "Elektronik": "Electronics",
        "Peralatan": "Equipment",
        "Kebersihan": "Cleaning",
        "Tidak ada deskripsi.": "No description.",
        "Terjadi kesalahan pada server.": "A server error occurred.",
        "Sesi login sudah berakhir.": "Your login session has expired.",
        "Gagal mengambil data inventaris.": "Failed to load inventory data.",
        "Barang berhasil dihapus": "Item deleted successfully",
        "Gagal menghapus barang.": "Failed to delete item.",
        "Nama barang wajib diisi.": "Item name is required.",
        "Nama pembeli wajib diisi.": "Buyer name is required.",
        "Harga barang wajib diisi.": "Item price is required.",
        "Tanggal beli wajib diisi.": "Purchase date is required.",
        "Barang berhasil diperbarui": "Item updated successfully",
        "Barang berhasil ditambahkan": "Item added successfully",
        "Gagal menyimpan barang.": "Failed to save item.",

        // ---- Catatan ----
        "Simpan catatan penting keuanganmu": "Save your important financial notes",
        "Tambah catatan": "Add note",
        "Tambah Catatan": "Add Note",
        "Edit Catatan": "Edit Note",
        "Simpan Catatan": "Save Note",
        "Cari catatan...": "Search notes...",
        "Penting": "Important",
        "Pribadi": "Personal",
        "Judul Catatan": "Note Title",
        "Contoh: Bayar Kost": "Example: Pay Rent",
        "Catatan (Opsional)": "Notes (Optional)",
        "Isi Catatan (Opsional)": "Note Content (Optional)",
        "Tulis catatan penting keuanganmu di sini...": "Write your important financial notes here...",
        "Tulis keterangan tambahan di sini...": "Write additional notes here...",
        "Catatan tidak ditemukan": "No notes found",
        "Coba ubah kata pencarian atau kategori.": "Try changing your search term or category.",
        "Pin catatan": "Pin note",
        "Unpin catatan": "Unpin note",
        "Hapus catatan ini?": "Delete this note?",
        "Judul, tanggal, dan isi catatan wajib diisi.": "Title, date, and note content are required.",
        "Gagal memuat catatan.": "Failed to load notes.",
        "Gagal menyimpan catatan.": "Failed to save note.",
        "Terjadi kesalahan.": "An error occurred.",

        // ---- Akun ----
        "Pengaturan Akun": "Account Settings",
        "Kelola preferensi dan informasi anda": "Manage your preferences and information",
        "Informasi Akun": "Account Information",
        "Kelola Informasi Akun": "Manage Account Information",
        "Pastikan Informasi Akun selalu diperbarui dan aman.": "Make sure your account information is always up to date and secure.",
        "Nama Lengkap": "Full Name",
        "Nama Lengkap Kamu": "Your Full Name",
        "Nama pengguna kamu": "Your username",
        "Alamat Email Aktif": "Active Email Address",
        "Email yang digunakan untuk akun": "Email used for the account",
        "Nomor Telepon": "Phone Number",
        "Nomor Telepon Yang Terdaftar": "Registered Phone Number",
        "Edit email": "Edit email",
        "Edit nama": "Edit name",
        "Edit nomor telepon": "Edit phone number",
        "Edit username": "Edit username",
        "Simpan Perubahan": "Save Changes",
        "Perubahan berhasil disimpan.": "Changes saved successfully.",
        "Ganti Akun": "Switch Account",
        "Berpindah ke Akun Yang Lain": "Switch to Another Account",
        "Pilih akun yang ingin digunakan.": "Select the account you want to use.",
        "Tambah Akun": "Add Account",
        "Keamanan": "Security",
        "Kata Sandi untuk Masuk ke Akun": "Password to Sign In to Your Account",
        "Ubah Password": "Change Password",
        "Password Saat Ini": "Current Password",
        "Password Baru": "New Password",
        "Konfirmasi Password": "Confirm Password",
        "Simpan Password": "Save Password",
        "Gunakan password yang kuat dan mudah kamu ingat.": "Use a strong password that is easy for you to remember.",
        "Verifikasi Email": "Email Verification",
        "Login Terakhir": "Last Login",
        "Waktu Terakhir Kamu Login": "Last Time You Logged In",
        "Keluar": "Log Out",
        "Keluar dari akun ini": "Log out of this account",
        "Hapus Akun": "Delete Account",
        "Hapus Akun?": "Delete Account?",
        "Hapus Akun Secara Permanen": "Permanently Delete Account",
        "Pastikan kamu benar-benar ingin menghapus akun ini.": "Make sure you really want to delete this account.",
        "Tindakan ini akan menghapus akun dan data terkait secara permanen. Tindakan ini tidak dapat dibatalkan.":
            "This action will permanently delete the account and related data. This action cannot be undone.",
        "Notifikasi": "Notifications",
        "Notifikasi Aktivitas": "Activity Notifications",
        "Dapatkan pemberitahuan mengenai aktivitas akun.": "Get notifications about account activity.",
        "Pengingat Inventaris": "Inventory Reminder",
        "Tampilkan pengingat ketika terdapat perubahan inventaris.": "Show a reminder when the inventory changes.",
        "Bahasa": "Language",
        "Bahasa Sistem": "System Language",
        "Tampilan": "Appearance",
        "Perubahan akun berhasil disimpan.": "Account changes saved successfully.",
        "Perubahan akun tersimpan di server.": "Account changes saved on the server.",
        "Tidak ada perubahan yang perlu disimpan.": "There are no changes to save.",
        "Fitur tambah akun siap dihubungkan ke sistem login.": "The add account feature is ready to be connected to the login system.",
        "Masukkan password saat ini.": "Enter your current password.",
        "Password baru minimal 8 karakter.": "New password must be at least 8 characters.",
        "Konfirmasi password tidak cocok.": "Password confirmation does not match.",
        "Password berhasil diperbarui.": "Password updated successfully.",
        "Password saat ini salah.": "Current password is incorrect.",
        "Permintaan penghapusan akun diproses.": "Account deletion request is being processed.",
        "Akun berhasil dihapus.": "Account deleted successfully.",
        "Apakah kamu yakin ingin keluar dari akun?": "Are you sure you want to log out?",
        "Kamu berhasil keluar dari akun.": "You have been logged out.",
        "Profil Yusuf sedang aktif.": "Yusuf's profile is active.",
        "Gagal memuat profil.": "Failed to load profile.",
        "Gagal menyimpan profil.": "Failed to save profile.",
        "Gagal mengganti password.": "Failed to change password.",
        "Gagal menghapus akun.": "Failed to delete account.",
        "Hari ini": "Today",
        "Kemarin": "Yesterday"
    };

    const DICTS = { en: EN };

    /* =========================================================
       POLA DINAMIS (teks yang mengandung angka / nama)
    ========================================================= */

    const MONTHS = {
        Januari: "January", Februari: "February", Maret: "March", April: "April",
        Mei: "May", Juni: "June", Juli: "July", Agustus: "August",
        September: "September", Oktober: "October", November: "November", Desember: "December"
    };

    // Nama bulan hanya diganti bila berada dalam format tanggal (angka / "Periode" di depannya)
    const MONTH_RE = new RegExp(
        "(?<=\\d |Periode:? |Period:? )(" + Object.keys(MONTHS).join("|") + ")\\b",
        "g"
    );

    const FIELD_NAMES = { Username: "Username", Nama: "Name", Email: "Email", Telepon: "Phone" };
    const TYPE_NAMES = { Pengeluaran: "Expense", Inventaris: "Inventory", Catatan: "Note" };

    const EN_RULES = [
        [/^(\d+) transaksi ditemukan$/, (m, n) => `${n} transaction${n === "1" ? "" : "s"} found`],
        [/^(\d+) Barang$/, (m, n) => `${n} Item${n === "1" ? "" : "s"}`],
        [/^(\d+) dari (\d+) orang sudah membayar$/, (m, a, b) => `${a} of ${b} people have paid`],
        [/^(\d+) hari lagi$/, (m, n) => `${n} day${n === "1" ? "" : "s"} left`],
        [/^(\d+) card berhasil ditambahkan\.$/, (m, n) => `${n} card${n === "1" ? "" : "s"} added successfully.`],
        [/^Jatuh tempo: (.+)$/, (m, d) => `Due: ${d}`],
        [/^♙ Dibeli Oleh:\s*(.*)$/, (m, n) => `♙ Purchased by: ${n}`],
        [/^Dibeli oleh:\s*(.*)$/, (m, n) => `Purchased by: ${n}`],
        [/^Periode(:?) (.+)$/, (m, c, p) => `Period${c} ${p}`],
        [/^Hari ini · (.*)$/, (m, t) => `Today · ${t}`],
        [/^Kemarin · (.*)$/, (m, t) => `Yesterday · ${t}`],
        [/^(Pengeluaran|Inventaris|Catatan) · (.*)$/, (m, t, d) => `${TYPE_NAMES[t]} · ${d}`],
        [/^Hapus pengeluaran "(.*)"\?$/, (m, n) => `Delete expense "${n}"?`],
        [/^Hapus "(.*)" dari inventaris\?$/, (m, n) => `Delete "${n}" from inventory?`],
        [/^(Username|Nama|Email|Telepon) berhasil diperbarui\.$/, (m, f) => `${FIELD_NAMES[f]} updated successfully.`],
        [/^Beralih ke akun (.*)\.$/, (m, n) => `Switched to account ${n}.`],
        [/^Request gagal \((\d+)\)$/, (m, c) => `Request failed (${c})`],
        [/^Login dengan (.+) dipilih\.$/, (m, p) => `Login with ${p} selected.`]
    ];

    const RULES = { en: EN_RULES };

    /* =========================================================
       MESIN TERJEMAHAN
    ========================================================= */

    function savedLanguage() {
        const lang = localStorage.getItem(STORAGE_KEY) || "id";
        return DICTS[lang] ? lang : "id"; // bahasa tanpa kamus -> Indonesia
    }

    let lang = savedLanguage();
    let applying = false;

    const originalText = new WeakMap();   // text node -> teks asli
    const writtenText = new WeakMap();    // text node -> teks hasil terjemahan yang kita tulis
    const originalAttrs = new WeakMap();  // element -> { attr: nilai asli }

    function translate(str) {
        if (!str || lang === "id") return str;

        const core = str.trim();
        if (!core) return str;

        const dict = DICTS[lang];
        const key = core.replace(/\s+/g, " ");
        let out = null;

        if (Object.prototype.hasOwnProperty.call(dict, key)) {
            out = dict[key];
        } else {
            for (const [regex, fn] of RULES[lang]) {
                if (regex.test(key)) {
                    out = key.replace(regex, fn);
                    break;
                }
            }
        }

        if (out === null) out = key;
        out = out.replace(MONTH_RE, month => MONTHS[month]);

        if (out === key) return str; // tidak ada perubahan

        const lead = str.match(/^\s*/)[0];
        const trail = str.match(/\s*$/)[0];
        return lead + out + trail;
    }

    // Pesan multi-baris (mis. error validasi) diterjemahkan per baris
    function translateMessage(message) {
        return String(message).split("\n").map(line => translate(line)).join("\n");
    }

    function translateTextNode(node) {
        const parent = node.parentNode;
        if (!parent) return;

        const tag = parent.nodeName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA" || tag === "NOSCRIPT") return;

        if (lang === "id") return;

        const current = node.data;
        if (writtenText.get(node) === current) return; // sudah hasil terjemahan kita

        const out = translate(current);
        if (out === current) return;

        // <option> tanpa atribut value: kunci nilai aslinya agar data yang dikirim tidak berubah
        if (tag === "OPTION" && !parent.hasAttribute("value")) {
            parent.setAttribute("value", current.replace(/\s+/g, " ").trim());
        }

        originalText.set(node, current);
        writtenText.set(node, out);
        node.data = out;
    }

    function translateAttributes(el) {
        if (lang === "id" || el.nodeType !== 1) return;

        ATTRS.forEach(attr => {
            if (!el.hasAttribute(attr)) return;

            const current = el.getAttribute(attr);
            const saved = originalAttrs.get(el);

            // sudah hasil terjemahan kita
            if (saved && saved[attr] !== undefined && translate(saved[attr]) === current) return;

            const out = translate(current);
            if (out === current) return;

            const store = saved || {};
            store[attr] = current;
            originalAttrs.set(el, store);
            el.setAttribute(attr, out);
        });
    }

    function translateTree(root) {
        if (!root) return;

        if (root.nodeType === 3) {
            translateTextNode(root);
            return;
        }

        if (root.nodeType !== 1 && root.nodeType !== 9) return;

        if (root.nodeType === 1) translateAttributes(root);

        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
        );

        let node = walker.nextNode();
        while (node) {
            if (node.nodeType === 3) translateTextNode(node);
            else translateAttributes(node);
            node = walker.nextNode();
        }
    }

    function restoreTree() {
        const walker = document.createTreeWalker(
            document.documentElement,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
        );

        let node = walker.nextNode();
        while (node) {
            if (node.nodeType === 3) {
                if (originalText.has(node) && writtenText.get(node) === node.data) {
                    node.data = originalText.get(node);
                }
                originalText.delete(node);
                writtenText.delete(node);
            } else {
                const saved = originalAttrs.get(node);
                if (saved) {
                    Object.entries(saved).forEach(([attr, value]) => node.setAttribute(attr, value));
                    originalAttrs.delete(node);
                }
            }
            node = walker.nextNode();
        }
    }

    let originalTitle = null;

    function translateTitle() {
        if (originalTitle === null) originalTitle = document.title;
        document.title = lang === "id" ? originalTitle : translate(originalTitle);
    }

    function applyAll() {
        applying = true;
        try {
            if (lang === "id") restoreTree();
            else translateTree(document.documentElement);
            translateTitle();
            document.documentElement.lang = lang;
        } finally {
            observer.takeRecords();
            applying = false;
        }
    }

    /* =========================================================
       OBSERVER: terjemahkan teks yang dibuat JavaScript belakangan
    ========================================================= */

    const observer = new MutationObserver(records => {
        if (applying || lang === "id") return;

        applying = true;
        try {
            records.forEach(record => {
                if (record.type === "childList") {
                    record.addedNodes.forEach(node => translateTree(node));
                } else if (record.type === "characterData") {
                    translateTextNode(record.target);
                } else if (record.type === "attributes") {
                    translateAttributes(record.target);
                }
            });
        } finally {
            observer.takeRecords();
            applying = false;
        }
    });

    /* =========================================================
       alert() & confirm() juga ikut diterjemahkan
    ========================================================= */

    const nativeAlert = window.alert.bind(window);
    const nativeConfirm = window.confirm.bind(window);

    window.alert = message => nativeAlert(translateMessage(message));
    window.confirm = message => nativeConfirm(translateMessage(message));

    /* =========================================================
       GANTI BAHASA
    ========================================================= */

    function setLanguage(code) {
        try {
            localStorage.setItem(STORAGE_KEY, code);
        } catch (error) {
            /* abaikan */
        }

        lang = DICTS[code] ? code : "id";
        applyAll();
    }

    window.TrackInI18n = {
        setLanguage,
        getLanguage: () => lang,
        t: translateMessage
    };

    function bindLanguageSelect() {
        const select = document.getElementById("languageSelect");
        if (!select) return;

        select.addEventListener("change", () => setLanguage(select.value));
    }

    /* ================= START ================= */

    function start() {
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ATTRS
        });

        bindLanguageSelect();
        applyAll();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
