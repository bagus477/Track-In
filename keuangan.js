/* =========================================
   DATA PENGELUARAN
========================================= */

let expenses = [
    {
        name: "WiFi",
        category: "Wifi",
        price: 300000,
        person: "Yusuf",
        date: "5 September 2026"
    },
    {
        name: "Listrik",
        category: "Listrik",
        price: 150000,
        person: "Bagus",
        date: "3 September 2026"
    },
    {
        name: "Gas",
        category: "Lainnya",
        price: 40000,
        person: "Andi",
        date: "1 September 2026"
    }
];

let currentFilter = "all";
let ascending = false;

/* =========================================
   FORMAT RUPIAH
========================================= */

function formatRupiah(number) {
    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(number);
}

/* =========================================
   FILTER KATEGORI
========================================= */

const filterButtons = document.querySelectorAll(".filter");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        currentFilter = button.dataset.filter;
        renderExpenses();
    });
});

/* =========================================
   RENDER DATA
========================================= */

function renderExpenses() {
    const list = document.getElementById("expenseList");
    const search = document.getElementById("searchInput").value.toLowerCase();
    const person = document.getElementById("paymentFilter").value;

    list.innerHTML = "";

    const filtered = expenses.filter(item => {
        const matchCategory = currentFilter === "all" || item.category === currentFilter;
        const matchSearch = item.name.toLowerCase().includes(search) ||
                            item.category.toLowerCase().includes(search) ||
                            item.person.toLowerCase().includes(search);
        const matchPerson = person === "all" || person === "Dibayar oleh" || item.person === person;

        return matchCategory && matchSearch && matchPerson;
    });

    filtered.forEach(item => {
        const card = document.createElement("article");
        card.className = "expense-card";
        card.innerHTML = `
            <div class="expense-head">
                <div class="expense-title">
                    <div class="expense-icon">▣</div>
                    <div>
                        <span class="category">${item.category}</span>
                        <h3>${item.name}</h3>
                    </div>
                </div>
                <button class="card-menu" onclick="deleteExpense('${item.name}')">•••</button>
            </div>
            <div class="expense-body">
                <div class="expense-meta">
                    <span>Harga</span>
                    <strong>${formatRupiah(item.price)}</strong>
                </div>
                <div class="expense-bottom">
                    <span>♙ Oleh: <strong>${item.person}</strong></span>
                    <span>▣ ${item.date}</span>
                </div>
            </div>
        `;
        list.appendChild(card);
    });

    updateCount(filtered.length);

    const empty = document.getElementById("emptyState");
    empty.style.display = filtered.length === 0 ? "block" : "none";
}

function updateCount(count) {
    document.getElementById("expenseCount").textContent = `${count} transaksi ditemukan`;
}

function searchExpense() { renderExpenses(); }
function filterPayment() { renderExpenses(); }

function sortExpenses() {
    ascending = !ascending;
    expenses.sort((a, b) => ascending ? a.price - b.price : b.price - a.price);
    renderExpenses();
}

function deleteExpense(name) {
    if (!confirm(`Hapus pengeluaran "${name}"?`)) return;
    expenses = expenses.filter(item => item.name !== name);
    calculateTotal();
    renderExpenses();
}

/* =========================================
   MODAL TAMBAH PENGELUARAN
========================================= */

const modal = document.getElementById("modal");

function openModal() { modal.classList.add("show"); }
function closeModal() { modal.classList.remove("show"); }

if (modal) {
    modal.addEventListener("click", function(event) {
        if (event.target === modal) closeModal();
    });
}

document.getElementById("expenseForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("expenseName").value;
    const category = document.getElementById("expenseCategory").value;
    const price = Number(document.getElementById("expensePrice").value);
    const person = document.getElementById("expensePerson").value;
    const rawDate = document.getElementById("expenseDate").value;

    if (!name || !price || !rawDate) {
        alert("Mohon lengkapi data.");
        return;
    }

    const date = new Date(rawDate);
    const formattedDate = date.toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric"
    });

    expenses.push({ name, category, price, person, date: formattedDate });

    calculateTotal();
    renderExpenses();

    document.getElementById("expenseForm").reset();
    closeModal();
    alert("Pengeluaran berhasil ditambahkan!");
});

function calculateTotal() {
    const total = expenses.reduce((sum, item) => sum + item.price, 0);
    document.getElementById("totalExpense").textContent = formatRupiah(total);
    document.getElementById("monthlyExpense").textContent = formatRupiah(total);
}

/* =========================================
   MODAL TAMBAH TAGIHAN (LOGIKA BARU)
========================================= */

const billModal = document.getElementById("billModal");

function openBillModal() {
    if (!billModal) return;
    billModal.classList.add("show");
    document.body.classList.add("modal-open");
    calculateBillSplit();
}

function closeBillModal() {
    if (!billModal) return;
    billModal.classList.remove("show");
    document.body.classList.remove("modal-open");
}

if (billModal) {
    billModal.addEventListener("click", function(event) {
        if (event.target === billModal) closeBillModal();
    });
}

function calculateBillSplit() {
    const rawTotal = document.getElementById("newBillTotal").value;
    const numericTotal = parseInt(rawTotal.replace(/[^0-9]/g, '')) || 0;
    
    const checkboxes = document.querySelectorAll('input[name="billMembers"]:checked');
    const selectedMembers = Array.from(checkboxes).map(cb => cb.value);
    
    const detailsContainer = document.getElementById("billSplitDetails");
    if (!detailsContainer) return;
    
    detailsContainer.innerHTML = "";
    
    if (selectedMembers.length === 0) {
        detailsContainer.innerHTML = `<span style="font-size:10px; color:#e53935;">Pilih minimal 1 anggota</span>`;
        return;
    }

    const isManual = document.querySelector('input[name="splitMode"]:checked').value === "manual";
    const perPerson = Math.floor(numericTotal / selectedMembers.length);

    selectedMembers.forEach(member => {
        const row = document.createElement("div");
        row.className = "split-row";
        
        if (isManual) {
            row.innerHTML = `
                <span>${member}</span>
                <input type="text" class="manual-split-input" value="${formatRupiah(perPerson)}">
            `;
        } else {
            row.innerHTML = `
                <span>${member}</span>
                <strong>${formatRupiah(perPerson)}</strong>
            `;
        }
        detailsContainer.appendChild(row);
    });
}

function toggleSplitMode() { calculateBillSplit(); }

const billTotalInput = document.getElementById("newBillTotal");
if (billTotalInput) {
    billTotalInput.addEventListener("input", function(e) {
        let val = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = val ? formatRupiah(parseInt(val)) : "";
        calculateBillSplit();
    });
}

const addBillForm = document.getElementById("addBillForm");
if (addBillForm) {
    addBillForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const name = document.getElementById("newBillName").value;
        const total = document.getElementById("newBillTotal").value;
        const dueDate = document.getElementById("newBillDueDate").value;

        const sidebarName = document.getElementById("sidebarBillName");
        const sidebarDueDate = document.getElementById("sidebarBillDueDate");
        const sidebarTotal = document.getElementById("sidebarBillTotal");

        if (sidebarName) sidebarName.textContent = name;
        if (sidebarDueDate) sidebarDueDate.textContent = `Jatuh tempo: ${dueDate}`;
        if (sidebarTotal) sidebarTotal.textContent = total;

        closeBillModal();
        alert("Tagihan baru berhasil dibuat dan disimpan!");
    });
}

/* =========================================
   DETAIL TRANSAKSI
========================================= */

const transactionDetailModal = document.getElementById("transactionDetailModal");
const detailTransactionBtn = document.getElementById("detailTransactionBtn");
const closeTransactionDetail = document.getElementById("closeTransactionDetail");
const closeTransactionDetailBottom = document.getElementById("closeTransactionDetailBottom");

function openTransactionDetail() {
    if (!transactionDetailModal) return;
    transactionDetailModal.classList.add("show");
    document.body.classList.add("modal-open");
}

function closeTransactionDetailModal() {
    if (!transactionDetailModal) return;
    transactionDetailModal.classList.remove("show");
    document.body.classList.remove("modal-open");
}

if (detailTransactionBtn) {
    detailTransactionBtn.addEventListener("click", openTransactionDetail);
}

if (closeTransactionDetail) {
    closeTransactionDetail.addEventListener("click", closeTransactionDetailModal);
}

if (closeTransactionDetailBottom) {
    closeTransactionDetailBottom.addEventListener("click", closeTransactionDetailModal);
}

if (transactionDetailModal) {
    transactionDetailModal.addEventListener("click", function(event) {
        if (event.target === transactionDetailModal) closeTransactionDetailModal();
    });
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        if (modal && modal.classList.contains("show")) closeModal();
        if (billModal && billModal.classList.contains("show")) closeBillModal();
        if (transactionDetailModal && transactionDetailModal.classList.contains("show")) closeTransactionDetailModal();
    }
});

/* INITIALIZE */
calculateTotal();
renderExpenses();
