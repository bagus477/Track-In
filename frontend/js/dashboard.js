const API_URL = "http://127.0.0.1:8000/api";

const token = localStorage.getItem("trackin_token");
const user = JSON.parse(localStorage.getItem("trackin_user") || "null");

if (!token) {
    window.location.href = "index.html";
}

let inventoryData = [];
let expenseData = [];
let billData = [];
let noteData = [];
let selectedDate = new Date();

const $ = selector => document.querySelector(selector);

/* ================= API ================= */

async function api(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...(options.headers || {})
        }
    });

    if (response.status === 401) {
        localStorage.removeItem("trackin_token");
        localStorage.removeItem("trackin_user");
        window.location.href = "index.html";
        return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message || "Gagal mengambil data."
        );
    }

    return data;
}

/* ================= FORMAT ================= */

function rupiah(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(Number(value) || 0);
}

function formatDate(date) {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
        "id-ID",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}

function formatShortDate(date) {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
        "id-ID",
        {
            day: "numeric",
            month: "short"
        }
    );
}

function escapeHtml(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]
    );
}

/* ================= TOAST ================= */

function showToast(message) {
    const toast = $("#toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.__trackinToastTimer);

    window.__trackinToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

/* ================= USER ================= */

function renderUser() {
    const username =
        document.querySelector(".username");

    if (username) {
        username.textContent =
            user?.name || "Pengguna";
    }

    const avatar =
        document.querySelector(".user-avatar img");

    if (avatar) {
        const name =
            user?.name || "Pengguna";

        avatar.removeAttribute("src");
        avatar.alt =
            `Foto profil ${name}`;

        avatar.parentElement.textContent =
            name.charAt(0).toUpperCase();
    }
}

/* ================= LOAD DASHBOARD ================= */

async function loadDashboard() {
    try {

        const [
            inventory,
            expenses,
            bills,
            notes
        ] = await Promise.all([
            api("/inventory"),
            api("/expenses"),
            api("/bills"),
            api("/notes")
        ]);

        inventoryData =
            Array.isArray(inventory)
                ? inventory
                : [];

        expenseData =
            Array.isArray(expenses)
                ? expenses
                : [];

        billData =
            Array.isArray(bills)
                ? bills
                : [];

        noteData =
            Array.isArray(notes)
                ? notes
                : [];

        renderDashboard();

    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        showToast(
            error.message ||
            "Gagal memuat dashboard."
        );
    }
}

function renderDashboard() {

    renderUser();

    renderCashAndSummary();

    renderInventory();

    renderActivity();

    renderNearestBill();

    renderCashAndSummary();

    renderMonthlyExpense();

    renderCategories();

    renderStructureExpense();

    renderTrend();

    updateDateText();
}

/* ================= SUMMARY ================= */

/* ================= CASH / PEMASUKAN ================= */

function getCashUser() {
    return JSON.parse(
        localStorage.getItem("trackin_user") || "null"
    );
}

function getCashMonth(date = selectedDate) {
    const year = date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    return `${year}-${month}`;
}

function getCashStorageKey(month) {
    const currentUser =
        getCashUser();

    if (currentUser?.id) {
        return `cash_income_${currentUser.id}_${month}`;
    }

    return `cash_income_${month}`;
}

function getMonthlyIncome(month) {

    const saved =
        localStorage.getItem(
            getCashStorageKey(month)
        );

    if (!saved) {
        return 0;
    }

    try {

        const data =
            JSON.parse(saved);

        return Number(
            data.amount || 0
        );

    } catch (error) {

        console.error(
            "Gagal membaca pemasukan:",
            error
        );

        return 0;
    }
}

function getMonthlyExpense(month) {

    return expenseData.reduce(
        (total, item) => {

            if (!item.expense_date) {
                return total;
            }

            if (
                String(
                    item.expense_date
                ).slice(0, 7) !== month
            ) {
                return total;
            }

            return (
                total +
                Number(
                    item.amount || 0
                )
            );
        },
        0
    );
}

function renderCashAndSummary() {

    const month =
        getCashMonth(selectedDate);

    const income =
        getMonthlyIncome(month);

    const totalExpense =
        getMonthlyExpense(month);

    const cash =
        income - totalExpense;

    if ($("#cashValue")) {
        $("#cashValue").textContent =
            rupiah(cash);
    }

    if ($("#saldoValue")) {
        $("#saldoValue").textContent =
            rupiah(cash);
    }

    if ($("#arusKasValue")) {
        $("#arusKasValue").textContent =
            rupiah(cash);
    }

    if ($("#pengeluaranValue")) {
        $("#pengeluaranValue").textContent =
            rupiah(totalExpense);
    }

    if ($("#summarySaldo")) {
        $("#summarySaldo").textContent =
            rupiah(cash);
    }

    if ($("#summaryBudget")) {
        $("#summaryBudget").textContent =
            rupiah(income);
    }

    if ($("#summaryProject")) {
        $("#summaryProject").textContent =
            rupiah(totalExpense);
    }
}

/* ================= INVENTORY ================= */

function renderInventory() {

    const list =
        $("#inventoryList");

    if (!list) return;

    const latest =
        [...inventoryData]
            .sort(
                (a, b) =>
                    new Date(
                        b.created_at ||
                        b.purchase_date ||
                        0
                    ) -
                    new Date(
                        a.created_at ||
                        a.purchase_date ||
                        0
                    )
            )
            .slice(0, 3);

    if (!latest.length) {

        list.innerHTML = `
            <div class="empty-widget">
                Belum ada inventaris.
            </div>
        `;

        return;
    }

    list.innerHTML =
        latest
            .map(item => `
                <div class="inventory-item">

                    <div>

                        <strong class="inventory-name">
                            ${escapeHtml(item.name)}
                        </strong>

                        <small class="inventory-meta">
                            ${escapeHtml(
                                item.purchased_by || "-"
                            )}
                            &bull;
                            ${escapeHtml(
                                formatShortDate(
                                    item.purchase_date
                                )
                            )}
                        </small>

                    </div>

                    <strong class="inventory-price">
                        ${rupiah(item.price)}
                    </strong>

                </div>
            `)
            .join("");
}

/* ================= ACTIVITY ================= */

function renderActivity() {

    const list =
        $("#activityList");

    if (!list) return;

    const activities = [

        ...inventoryData.map(item => ({
            date:
                item.created_at ||
                item.purchase_date,

            name:
                item.purchased_by ||
                user?.name ||
                "Pengguna",

            text:
                `menambahkan '${item.name}'`,

            amount:
                rupiah(item.price),

            initial:
                (
                    item.purchased_by ||
                    user?.name ||
                    "P"
                )
                    .charAt(0)
                    .toUpperCase()
        })),

        ...expenseData.map(item => ({
            date:
                item.created_at ||
                item.expense_date,

            name:
                user?.name ||
                "Pengguna",

            text:
                `mencatat '${item.description}'`,

            amount:
                rupiah(item.amount),

            initial:
                (
                    user?.name ||
                    "P"
                )
                    .charAt(0)
                    .toUpperCase()
        })),

        ...noteData.map(item => ({
            date:
                item.created_at,

            name:
                user?.name ||
                "Pengguna",

            text:
                `menambahkan catatan '${item.title}'`,

            amount:
                "",

            initial:
                (
                    user?.name ||
                    "P"
                )
                    .charAt(0)
                    .toUpperCase()
        })),

        ...billData.map(item => ({
            date:
                item.created_at ||
                item.due_date,

            name:
                user?.name ||
                "Pengguna",

            text:
                `membuat tagihan '${item.name}'`,

            amount:
                rupiah(item.total_amount),

            initial:
                (
                    user?.name ||
                    "P"
                )
                    .charAt(0)
                    .toUpperCase()
        }))

    ]
        .filter(item => item.date)
        .sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        )
        .slice(0, 4);

    if (!activities.length) {

        list.innerHTML = `
            <div class="empty-widget">
                Belum ada aktivitas.
            </div>
        `;

        return;
    }

    list.innerHTML =
        activities
            .map(item => `
                <div class="activity-item">

                    <div class="act-avatar">
                        ${escapeHtml(
                            item.initial
                        )}
                    </div>

                    <div class="act-text">

                        <div>

                            <strong>
                                ${escapeHtml(
                                    item.name
                                )}
                            </strong>

                            ${escapeHtml(
                                item.text
                            )}

                            ${
                                item.amount
                                    ? `
                                        <b>
                                            ${escapeHtml(
                                                item.amount
                                            )}
                                        </b>
                                    `
                                    : ""
                            }

                        </div>

                        <small>
                            ${escapeHtml(
                                formatActivityTime(
                                    item.date
                                )
                            )}
                        </small>

                    </div>

                </div>
            `)
            .join("");
}

function formatActivityTime(date) {

    const d =
        new Date(date);

    if (Number.isNaN(d.getTime())) {
        return "-";
    }

    const now =
        new Date();

    const diffDays =
        Math.floor(
            (now - d) /
            86400000
        );

    if (diffDays <= 0) {
        return "Hari ini";
    }

    if (diffDays === 1) {
        return "Kemarin";
    }

    if (diffDays < 7) {
        return `${diffDays} hari lalu`;
    }

    return d.toLocaleDateString(
        "id-ID",
        {
            day: "numeric",
            month: "short"
        }
    );
}

/* ================= BILLS ================= */

function renderNearestBill() {

    const card =
        $(".bill-card");

    if (!card) return;

    const dueBadge =
        card.querySelector(
            ".due-badge"
        );

    const name =
        card.querySelector(
            ".bill-content strong"
        );

    const due =
        card.querySelector(
            ".bill-content small"
        );

    const amount =
        card.querySelector(
            ".bill-amount"
        );

    const unpaid =
        billData
            .filter(
                item =>
                    String(
                        item.status ||
                        "unpaid"
                    ).toLowerCase() !==
                    "paid"
            )
            .filter(
                item =>
                    item.due_date
            )
            .sort(
                (a, b) =>
                    new Date(
                        a.due_date
                    ) -
                    new Date(
                        b.due_date
                    )
            );

    const bill =
        unpaid[0];

    if (!bill) {

        if (dueBadge) {
            dueBadge.textContent =
                "Belum ada";
        }

        if (name) {
            name.textContent =
                "Belum ada tagihan";
        }

        if (due) {
            due.textContent =
                "Tidak ada tagihan yang tercatat.";
        }

        if (amount) {
            amount.textContent =
                rupiah(0);
        }

        return;
    }

    const days =
        Math.ceil(
            (
                new Date(
                    `${bill.due_date}T00:00:00`
                ) -
                new Date()
            ) /
            86400000
        );

    if (dueBadge) {

        dueBadge.textContent =
            days < 0
                ? `Lewat ${Math.abs(days)} hari`
                : days === 0
                    ? "Hari ini"
                    : `${days} hari lagi`;
    }

    if (name) {
        name.textContent =
            bill.name;
    }

    if (due) {
        due.textContent =
            `Jatuh tempo: ${formatDate(
                bill.due_date
            )}`;
    }

    if (amount) {
        amount.textContent =
            rupiah(
                bill.total_amount
            );
    }
}

/* ================= MONTHLY EXPENSE ================= */

function renderMonthlyExpense() {

    const amount =
        $(".monthly-expense-card .monthly-amount");

    const period =
        $(".monthly-expense-card .period-text");

    const year =
        selectedDate.getFullYear();

    const month =
        selectedDate.getMonth();

    const total =
        expenseData
            .filter(item => {

                if (!item.expense_date) {
                    return false;
                }

                const d =
                    new Date(
                        `${item.expense_date}T00:00:00`
                    );

                return (
                    d.getFullYear() === year &&
                    d.getMonth() === month
                );
            })
            .reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.amount || 0
                    ),
                0
            );

    if (amount) {
        amount.textContent =
            rupiah(total);
    }

    if (period) {

        period.textContent =
            selectedDate.toLocaleDateString(
                "id-ID",
                {
                    month: "long",
                    year: "numeric"
                }
            );
    }
}

/* ================= CATEGORY ================= */

function renderCategories() {

    const container =
        $("[data-widget='kategori']");

    if (!container) return;

    const year =
        selectedDate.getFullYear();

    const month =
        selectedDate.getMonth();

    const categoryTotals = {};

    expenseData.forEach(item => {

        if (!item.expense_date) {
            return;
        }

        const d =
            new Date(
                `${item.expense_date}T00:00:00`
            );

        if (
            d.getFullYear() !== year ||
            d.getMonth() !== month
        ) {
            return;
        }

        const category =
            item.category ||
            "Lainnya";

        categoryTotals[category] =
            (
                categoryTotals[category] ||
                0
            ) +
            Number(
                item.amount || 0
            );
    });

    const rows =
        Object.entries(
            categoryTotals
        )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );

    const total =
        rows.reduce(
            (sum, item) =>
                sum + item[1],
            0
        );

    const target =
        container.querySelector(
            ".category-content"
        ) ||
        container.querySelector(
            ".widget-content"
        );

    if (!target) return;

    if (!rows.length) {

        target.innerHTML = `
            <div class="empty-widget">
                Belum ada data pengeluaran.
            </div>
        `;

        return;
    }

    target.innerHTML =
        rows
            .slice(0, 5)
            .map(
                ([category, value]) => {

                    const percentage =
                        total
                            ? Math.round(
                                (
                                    value /
                                    total
                                ) *
                                100
                            )
                            : 0;

                    return `
                        <div
                            style="
                                display:flex;
                                justify-content:space-between;
                                gap:12px;
                                padding:8px 0;
                                border-bottom:1px solid #eee;
                            "
                        >

                            <span>
                                ${escapeHtml(
                                    category
                                )}
                            </span>

                            <strong>
                                ${rupiah(
                                    value
                                )}
                                (${percentage}%)
                            </strong>

                        </div>
                    `;
                }
            )
            .join("");
}

/* ================= STRUCTURE ================= */

function renderStructureExpense() {

    const card =
        $(
            "[data-widget='strukturPengeluaran']"
        );

    if (!card) return;

    const content =
        card.querySelector(
            ".structure-content"
        );

    if (!content) return;

    const year =
        selectedDate.getFullYear();

    const month =
        selectedDate.getMonth();

    const total =
        expenseData
            .filter(item => {

                if (!item.expense_date) {
                    return false;
                }

                const d =
                    new Date(
                        `${item.expense_date}T00:00:00`
                    );

                return (
                    d.getFullYear() === year &&
                    d.getMonth() === month
                );
            })
            .reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.amount || 0
                    ),
                0
            );

    if (!total) {

        content.innerHTML = `
            <div class="structure-illustration">
                <i class="bi bi-receipt"></i>
            </div>

            <p>
                Tidak ada data pada rentang waktu yang dipilih.
            </p>

            <button
                type="button"
                class="structure-button"
                onclick="window.location.href='keuangan.html'"
            >
                <i class="bi bi-plus-lg"></i>
                Tambah Data Pertama Anda
            </button>
        `;

        return;
    }

    const categoryTotals = {};

    expenseData.forEach(item => {

        if (!item.expense_date) {
            return;
        }

        const d =
            new Date(
                `${item.expense_date}T00:00:00`
            );

        if (
            d.getFullYear() !== year ||
            d.getMonth() !== month
        ) {
            return;
        }

        const category =
            item.category ||
            "Lainnya";

        categoryTotals[category] =
            (
                categoryTotals[category] ||
                0
            ) +
            Number(
                item.amount || 0
            );
    });

    const rows =
        Object.entries(
            categoryTotals
        )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )
            .slice(0, 5)
            .map(
                ([category, value]) => `
                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            padding:7px 0;
                            border-bottom:1px solid #eee
                        "
                    >

                        <span>
                            ${escapeHtml(
                                category
                            )}
                        </span>

                        <strong>
                            ${rupiah(
                                value
                            )}
                        </strong>

                    </div>
                `
            )
            .join("");

    content.innerHTML = `
        <div style="width:100%">

            <p style="margin-bottom:10px">
                Total pengeluaran periode ini:
                <strong>
                    ${rupiah(total)}
                </strong>
            </p>

            ${rows}

        </div>
    `;
}

/* ================= TREND ================= */

function renderTrend() {

    const svg =
        $(".balance-chart");

    if (!svg) return;

    const year =
        selectedDate.getFullYear();

    const month =
        selectedDate.getMonth();

    const days =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    const points = [];

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const day =
            Math.min(
                1 +
                Math.round(
                    (
                        (days - 1) *
                        i
                    ) /
                    4
                ),
                days
            );

        const total =
            expenseData
                .filter(item => {

                    if (!item.expense_date) {
                        return false;
                    }

                    const d =
                        new Date(
                            `${item.expense_date}T00:00:00`
                        );

                    return (
                        d.getFullYear() === year &&
                        d.getMonth() === month &&
                        d.getDate() <= day
                    );
                })
                .reduce(
                    (sum, item) =>
                        sum +
                        Number(
                            item.amount || 0
                        ),
                    0
                );

        const y =
            Math.max(
                15,
                Math.min(
                    105,
                    75 +
                    (
                        total /
                        100000
                    ) *
                    30
                )
            );

        points.push({
            day,
            y
        });
    }

    const x = [
        0,
        125,
        250,
        375,
        500
    ];

    const path =
        points
            .map(
                (point, index) =>
                    `${
                        index === 0
                            ? "M"
                            : "L"
                    }${x[index]} ${point.y}`
            )
            .join(" ");

    const pathEl =
        svg.querySelector(
            ".chart-line"
        );

    if (pathEl) {
        pathEl.setAttribute(
            "d",
            path
        );
    }

    svg.querySelectorAll(
        ".chart-point"
    ).forEach(
        (point, index) => {

            if (!points[index]) {
                return;
            }

            point.setAttribute(
                "cy",
                points[index].y
            );

            point.setAttribute(
                "cx",
                x[index]
            );
        }
    );

    const labels =
        document.querySelectorAll(
            ".chart-x-axis span"
        );

    labels.forEach(
        (label, index) => {

            if (!points[index]) {
                return;
            }

            label.textContent =
                `${
                    points[index].day
                } ${
                    selectedDate.toLocaleDateString(
                        "id-ID",
                        {
                            month: "short"
                        }
                    )
                }`;
        }
    );
}

/* ================= DATE ================= */

function updateDateText() {

    if ($("#dateText")) {

        $("#dateText").textContent =
            selectedDate.toLocaleDateString(
                "id-ID",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );
    }

    renderCashAndSummary();

    renderMonthlyExpense();

    renderCategories();

    renderStructureExpense();

    renderTrend();
}

$("#previousDate")?.addEventListener(
    "click",
    () => {

        selectedDate.setDate(
            selectedDate.getDate() - 1
        );

        updateDateText();
    }
);

$("#nextDate")?.addEventListener(
    "click",
    () => {

        selectedDate.setDate(
            selectedDate.getDate() + 1
        );

        updateDateText();
    }
);

$("#datePickerInput")?.addEventListener(
    "change",
    event => {

        if (!event.target.value) {
            return;
        }

        selectedDate =
            new Date(
                `${event.target.value}T00:00:00`
            );

        updateDateText();
    }
);

$("#dateText")?.addEventListener(
    "click",
    () => {

        $("#datePickerInput")
            ?.showPicker?.();
    }
);

/* =========================================================
   MULTIPLE DASHBOARD CARDS
   ========================================================= */

const CARD_STORAGE_KEY =
    "trackin_dashboard_cards_v5";

const addCardModal =
    $("#addCardModal");

const widgetOptions =
    document.querySelectorAll(
        ".widget-option"
    );

/* ================= CARD STATE ================= */

function getCardState() {

    try {

        const saved =
            localStorage.getItem(
                CARD_STORAGE_KEY
            );

        if (saved) {
            return JSON.parse(saved);
        }

    } catch (error) {

        console.warn(
            "Gagal membaca card dashboard:",
            error
        );
    }

    const state = {};

    document
        .querySelectorAll(
            "[data-widget]"
        )
        .forEach(card => {

            const key =
                card.dataset.widget;

            if (key) {
                state[key] = 1;
            }
        });

    return state;
}

function saveCardState(state) {

    localStorage.setItem(
        CARD_STORAGE_KEY,
        JSON.stringify(state)
    );
}

/* ================= FIND TEMPLATE ================= */

function getWidgetTemplate(key) {

    const cards =
        document.querySelectorAll(
            `[data-widget="${key}"]`
        );

    return cards[0] || null;
}

function getWidgetContainer(key) {

    const template =
        getWidgetTemplate(key);

    if (!template) {
        return null;
    }

    return (
        template.closest(
            ".bottom-widgets"
        ) ||
        template.closest(
            ".widgets-grid"
        ) ||
        template.parentElement
    );
}

/* ================= CLONE CARD ================= */

function prepareCardClone(
    card,
    key,
    number
) {

    const clone =
        card.cloneNode(true);

    clone.dataset.widget =
        key;

    clone.dataset.dynamicCard =
        "true";

    clone.dataset.cardNumber =
        String(number);

    /*
     * Hapus ID dari clone.
     * Supaya tidak ada ID HTML yang kembar.
     */

    clone
        .querySelectorAll("[id]")
        .forEach(element => {
            element.removeAttribute("id");
        });

    return clone;
}

/* ================= RENDER MULTIPLE CARDS ================= */

function renderMultipleCards() {

    const state =
        getCardState();

    /*
     * Hapus clone lama.
     * Template asli tidak dihapus.
     */

    document
        .querySelectorAll(
            "[data-dynamic-card='true']"
        )
        .forEach(card => {
            card.remove();
        });

    /*
     * Buat ulang semua card
     * berdasarkan jumlah yang tersimpan.
     */

    Object.entries(state)
        .forEach(
            ([key, count]) => {

                const total =
                    Math.max(
                        0,
                        Number(count) || 0
                    );

                const template =
                    getWidgetTemplate(
                        key
                    );

                const container =
                    getWidgetContainer(
                        key
                    );

                if (
                    !template ||
                    !container ||
                    total <= 1
                ) {
                    return;
                }

                /*
                 * Kalau count = 3,
                 * template asli = card 1
                 * clone = card 2
                 * clone = card 3
                 */

                for (
                    let number = 2;
                    number <= total;
                    number++
                ) {

                    const clone =
                        prepareCardClone(
                            template,
                            key,
                            number
                        );

                    container.appendChild(
                        clone
                    );
                }
            }
        );
}

/* ================= MODAL ================= */

function syncWidgetOptions() {

    const state =
        getCardState();

    widgetOptions.forEach(
        option => {

            const key =
                option.dataset.card;

            const checkbox =
                option.querySelector(
                    "input[type='checkbox']"
                );

            const customCheckbox =
                option.querySelector(
                    ".custom-checkbox"
                );

            const checked = false;

            if (checkbox) {
                checkbox.checked =
                    checked;
            }

            option.classList.toggle(
                "active",
                checked
            );

            customCheckbox?.classList.toggle(
                "checked",
                checked
            );

            if (customCheckbox) {
                customCheckbox.innerHTML =
                    checked
                        ? "✓"
                        : "";
            }

            if (
                key &&
                state[key] == null
            ) {

                state[key] =
                    document.querySelector(
                        `[data-widget="${key}"]`
                    )
                        ? 1
                        : 0;
            }
        }
    );

    saveCardState(state);
}

/* ================= OPEN MODAL ================= */

function openModal() {

    syncWidgetOptions();

    addCardModal?.classList.add(
        "show"
    );

    document.body.classList.add(
        "modal-open"
    );
}

/* ================= CLOSE MODAL ================= */

function closeModal() {

    addCardModal?.classList.remove(
        "show"
    );

    document.body.classList.remove(
        "modal-open"
    );
}

/* ================= BUTTON EVENTS ================= */

$("#addCardBtn")?.addEventListener(
    "click",
    openModal
);

$("#addWidgetButton")?.addEventListener(
    "click",
    openModal
);

$("#closeAddCardModal")?.addEventListener(
    "click",
    closeModal
);

$("#cancelAddCard")?.addEventListener(
    "click",
    closeModal
);

addCardModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            addCardModal
        ) {
            closeModal();
        }
    }
);

/* ================= ESC ================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            addCardModal?.classList.contains(
                "show"
            )
        ) {
            closeModal();
        }
    }
);

/* ================= CHECKBOX ================= */

widgetOptions.forEach(
    option => {

        const checkbox =
            option.querySelector(
                "input[type='checkbox']"
            );

        const customCheckbox =
            option.querySelector(
                ".custom-checkbox"
            );

        checkbox?.addEventListener(
            "change",
            function () {

                option.classList.toggle(
                    "active",
                    this.checked
                );

                customCheckbox?.classList.toggle(
                    "checked",
                    this.checked
                );

                if (customCheckbox) {

                    customCheckbox.innerHTML =
                        this.checked
                            ? "✓"
                            : "";
                }
            }
        );
    }
);

/* ================= SAVE ADD CARD ================= */

$("#saveAddCard")?.addEventListener(
    "click",
    () => {

        const state =
            getCardState();

        let added = 0;

        widgetOptions.forEach(
            option => {

                const key =
                    option.dataset.card;

                const checkbox =
                    option.querySelector(
                        "input[type='checkbox']"
                    );

                /*
                 * Hanya card yang dicentang
                 * yang ditambahkan.
                 */

                if (
                    !key ||
                    !checkbox?.checked
                ) {
                    return;
                }

                const current =
                    Number(
                        state[key] || 0
                    );

                state[key] =
                    current > 0
                        ? current + 1
                        : 1;

                added++;
            }
        );

        saveCardState(state);

        renderMultipleCards();

        closeModal();

        showToast(
            added
                ? `${added} card berhasil ditambahkan`
                : "Pilih card yang ingin ditambahkan"
        );
    }
);

/* =========================================================
   CASH INCOME MODAL
   ========================================================= */

const cashCard =
    document.getElementById(
        "cashCard"
    );

const cashModal =
    document.getElementById(
        "cashModal"
    );

const closeCashModal =
    document.getElementById(
        "closeCashModal"
    );

const cancelCash =
    document.getElementById(
        "cancelCash"
    );

const saveCash =
    document.getElementById(
        "saveCash"
    );

const cashMonth =
    document.getElementById(
        "cashMonth"
    );

const cashInput =
    document.getElementById(
        "cashInput"
    );

/* ================= OPEN CASH MODAL ================= */

function openCashModal() {

    if (!cashModal) {
        return;
    }

    const month =
        getCashMonth(selectedDate);

    if (cashMonth) {
        cashMonth.value =
            month;
    }

    const saved =
        localStorage.getItem(
            getCashStorageKey(month)
        );

    if (saved) {

        try {

            const data =
                JSON.parse(saved);

            if (cashInput) {
                cashInput.value =
                    data.amount || "";
            }

        } catch (error) {

            console.error(
                "Gagal membaca pemasukan:",
                error
            );

            if (cashInput) {
                cashInput.value =
                    "";
            }
        }

    } else {

        if (cashInput) {
            cashInput.value =
                "";
        }
    }

    cashModal.classList.add(
        "show"
    );
}

/* ================= CLOSE CASH MODAL ================= */

function closeCashIncomeModal() {

    cashModal?.classList.remove(
        "show"
    );
}

/* ================= SAVE CASH ================= */

function saveCashIncome() {

    if (
        !cashInput ||
        !cashMonth
    ) {
        return;
    }

    const amount =
        Number(
            cashInput.value
        );

    const month =
        cashMonth.value;

    if (!month) {

        alert(
            "Pilih bulan terlebih dahulu."
        );

        return;
    }

    if (
        Number.isNaN(amount) ||
        amount < 0
    ) {

        alert(
            "Masukkan jumlah pemasukan yang valid."
        );

        return;
    }

    localStorage.setItem(
        getCashStorageKey(month),
        JSON.stringify({
            amount,
            month
        })
    );

    closeCashIncomeModal();

    renderCashAndSummary();

    showToast(
        "Pemasukan berhasil disimpan"
    );
}

/* ================= CASH EVENTS ================= */

cashCard?.addEventListener(
    "click",
    openCashModal
);

closeCashModal?.addEventListener(
    "click",
    closeCashIncomeModal
);

cancelCash?.addEventListener(
    "click",
    closeCashIncomeModal
);

saveCash?.addEventListener(
    "click",
    saveCashIncome
);

/* ================= CLICK OUTSIDE ================= */

cashModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            cashModal
        ) {
            closeCashIncomeModal();
        }
    }
);

/* ================= ESC CASH MODAL ================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            cashModal?.classList.contains(
                "show"
            )
        ) {
            closeCashIncomeModal();
        }
    }
);

/* ================= INITIAL CARD RENDER ================= */

renderMultipleCards();

/* ================= START ================= */

renderUser();

loadDashboard();
