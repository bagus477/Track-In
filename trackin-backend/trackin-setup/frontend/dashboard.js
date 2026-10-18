// DASHBOARD.JS
// Versi lokal — tanpa backend/API

document.addEventListener("DOMContentLoaded", () => {
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // =========================
    // DATA LOKAL
    // =========================

    const API_URL = "http://127.0.0.1:8000/api";
    const token = localStorage.getItem("trackin_token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    async function api(endpoint) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem("trackin_token");
            localStorage.removeItem("trackin_user");
            window.location.href = "index.html";
            return [];
        }

        if (!response.ok) {
            throw new Error(`Request gagal (${response.status})`);
        }

        return response.json();
    }

    let inventoryData = [];
    let expenseData = [];
    let billData = [];
    let noteData = [];

    async function loadAll() {
        try {
            const [inventory, expenses, bills, notes] = await Promise.all([
                api("/inventory"),
                api("/expenses"),
                api("/bills"),
                api("/notes")
            ]);

            inventoryData = inventory.map(i => ({
                id: i.id,
                name: i.name,
                category: i.category,
                price: i.price,
                owner: i.purchased_by,
                purchaseDate: i.purchase_date
            }));

            expenseData = expenses.map(e => ({
                id: e.id,
                description: e.description,
                category: e.category,
                amount: e.amount,
                date: e.expense_date
            }));

            billData = bills
                .filter(b => b.status !== "paid")
                .map(b => ({
                    id: b.id,
                    name: b.name,
                    total: b.total_amount,
                    dueDate: b.due_date,
                    status: b.status
                }));

            noteData = notes.map(n => ({
                id: n.id,
                title: n.title,
                body: n.body,
                category: n.category,
                date: n.timestamp,
                timestamp: n.timestamp,
                isPinned: n.isPinned
            }));
        } catch (error) {
            console.error("Dashboard error:", error);
        }
    }

    // =========================
    // HELPER
    // =========================

    function formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(Number(value) || 0);
    }

    function formatDate(dateString) {
        if (!dateString) return "-";

        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    function getElement(id) {
        return document.getElementById(id);
    }

    // =========================
    // TOTAL PENGELUARAN
    // =========================

    function getTotalExpense() {
        return expenseData.reduce((total, expense) => {
            return total + Number(expense.amount || 0);
        }, 0);
    }

    // =========================
    // DASHBOARD SUMMARY
    // =========================

    function renderExpenseSummary() {
        const totalExpense = getTotalExpense();

        const expenseElements = [
            "monthlyExpense",
            "totalExpense",
            "expenseTotal"
        ];

        expenseElements.forEach(id => {
            const element = getElement(id);

            if (element) {
                element.textContent = formatRupiah(totalExpense);
            }
        });
    }

    // =========================
    // KATEGORI PENGELUARAN
    // =========================

    function renderExpenseCategories() {
        const categoryContainer =
            getElement("expenseCategories") ||
            getElement("categoryList");

        if (!categoryContainer) return;

        const categories = {};

        expenseData.forEach(expense => {
            const category = expense.category || "Lainnya";

            if (!categories[category]) {
                categories[category] = 0;
            }

            categories[category] += Number(expense.amount || 0);
        });

        categoryContainer.innerHTML = "";

        Object.entries(categories).forEach(([category, amount]) => {
            const item = document.createElement("div");

            item.className = "category-item";

            item.innerHTML = `
                <div class="category-name">
                    <span>${category}</span>
                </div>

                <div class="category-amount">
                    ${formatRupiah(amount)}
                </div>
            `;

            categoryContainer.appendChild(item);
        });
    }

    // =========================
    // INVENTARIS
    // =========================

    function renderInventory() {
        const container =
            getElement("inventoryList") ||
            getElement("inventoryContainer");

        if (!container) return;

        container.innerHTML = "";

        inventoryData.forEach(item => {
            const element = document.createElement("div");

            element.className = "inventory-item";

            element.innerHTML = `
                <div>
                    <h4>${item.name}</h4>
                    <p>${item.category || "-"}</p>
                    <small>
                        Dibeli oleh: ${item.owner || "-"}
                    </small>
                </div>

                <strong>
                    ${formatRupiah(item.price)}
                </strong>
            `;

            container.appendChild(element);
        });
    }

    // =========================
    // CATATAN
    // =========================

    function renderNotes() {
        const container =
            getElement("notesList") ||
            getElement("notesContainer");

        if (!container) return;

        container.innerHTML = "";

        noteData.forEach(note => {
            const element = document.createElement("div");

            element.className = "note-item";

            element.innerHTML = `
                <div>
                    <h4>${note.title}</h4>
                    <p>${note.body}</p>

                    <small>
                        ${note.category || "Tanpa kategori"}
                    </small>
                </div>
            `;

            container.appendChild(element);
        });
    }

    // =========================
    // TAGIHAN TERDEKAT
    // =========================

    function renderNearestBill() {
        const nameElement =
            getElement("nearestBillName") ||
            getElement("sidebarBillName");

        const dateElement =
            getElement("nearestBillDate") ||
            getElement("sidebarBillDueDate");

        const totalElement =
            getElement("nearestBillTotal") ||
            getElement("sidebarBillTotal");

        if (!billData.length) {
            if (nameElement) nameElement.textContent = "Belum ada tagihan";
            if (dateElement) dateElement.textContent = "-";
            if (totalElement) totalElement.textContent = formatRupiah(0);

            return;
        }

        const sortedBills = [...billData].sort((a, b) => {
            return new Date(a.dueDate) - new Date(b.dueDate);
        });

        const bill = sortedBills[0];

        if (nameElement) {
            nameElement.textContent = bill.name;
        }

        if (dateElement) {
            dateElement.textContent =
                `Jatuh tempo: ${formatDate(bill.dueDate)}`;
        }

        if (totalElement) {
            totalElement.textContent =
                formatRupiah(bill.total);
        }
    }

    // =========================
    // AKTIVITAS TERBARU
    // =========================

    function renderActivity() {
        const container =
            getElement("activityList") ||
            getElement("recentActivity");

        if (!container) return;

        container.innerHTML = "";

        const activities = [
            ...expenseData.map(item => ({
                title: item.description,
                type: "Pengeluaran",
                date: item.date,
                amount: item.amount
            })),

            ...inventoryData.map(item => ({
                title: item.name,
                type: "Inventaris",
                date: item.purchaseDate,
                amount: item.price
            })),

            ...noteData.map(item => ({
                title: item.title,
                type: "Catatan",
                date: item.timestamp,
                amount: null
            }))
        ];

        activities
            .sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            })
            .slice(0, 5)
            .forEach(activity => {
                const element = document.createElement("div");

                element.className = "activity-item";

                element.innerHTML = `
                    <div class="activity-info">
                        <strong>${activity.title}</strong>

                        <small>
                            ${activity.type} ·
                            ${formatDate(activity.date)}
                        </small>
                    </div>

                    ${
                        activity.amount !== null
                            ? `<span>${formatRupiah(activity.amount)}</span>`
                            : ""
                    }
                `;

                container.appendChild(element);
            });
    }

    // =========================
    // PENCARIAN
    // =========================

    const searchInput = getElement("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const keyword = this.value.toLowerCase().trim();

            const filteredInventory = inventoryData.filter(item => {
                return (
                    item.name.toLowerCase().includes(keyword) ||
                    (item.category || "")
                        .toLowerCase()
                        .includes(keyword) ||
                    (item.owner || "")
                        .toLowerCase()
                        .includes(keyword)
                );
            });

            const filteredExpenses = expenseData.filter(item => {
                return (
                    item.description
                        .toLowerCase()
                        .includes(keyword) ||
                    (item.category || "")
                        .toLowerCase()
                        .includes(keyword)
                );
            });

            console.log("Hasil pencarian inventaris:", filteredInventory);
            console.log("Hasil pencarian pengeluaran:", filteredExpenses);
        });
    }

    // =========================
    // TOMBOL TAMBAH
    // =========================

    const addButtons = document.querySelectorAll(
        "[data-action='add'], .add-button, .btn-add"
    );

    addButtons.forEach(button => {
        button.addEventListener("click", () => {
            console.log("Tombol tambah diklik");
        });
    });

    // =========================
    // NAVIGASI PERIODE
    // =========================

    const prevButton =
        getElement("prevMonth") ||
        getElement("previousMonth");

    const nextButton =
        getElement("nextMonth");

    const periodElement =
        getElement("currentPeriod") ||
        getElement("monthPeriod");

    let currentDate = new Date();

    function updatePeriod() {
        if (!periodElement) return;

        periodElement.textContent =
            currentDate.toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric"
            });
    }

    if (prevButton) {
        prevButton.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updatePeriod();
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updatePeriod();
        });
    }

    // =========================
    // INITIAL RENDER
    // =========================

    updatePeriod();

    loadAll().then(() => {
        renderExpenseSummary();
        renderExpenseCategories();
        renderInventory();
        renderNotes();
        renderNearestBill();
        renderActivity();
    });

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
});