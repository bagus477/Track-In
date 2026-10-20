// CASH-INCOME.JS
// 1) Kartu "Tunai" -> pemasukan bulanan (tersimpan di backend: /api/incomes)
// 2) Tombol "Tambah Card" / "+" widget -> pilih widget yang ditampilkan

(function () {
    "use strict";

    const API_URL = "http://127.0.0.1:8000/api";
    const token = localStorage.getItem("trackin_token");

    const $ = id => document.getElementById(id);

    /* ================= HELPER ================= */

    function formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(Number(value) || 0);
    }

    function currentMonth() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    }

    let toastTimer;
    function showToast(message) {
        const toast = $("toast");
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
    }

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
                Object.values(data?.errors || {}).flat().join(" ") ||
                data?.message ||
                `Request gagal (${response.status})`
            );
        }

        return data;
    }

    function openOverlay(element) {
        if (!element) return;
        element.classList.add("show");
        element.setAttribute("aria-hidden", "false");
    }

    function closeOverlay(element) {
        if (!element) return;
        element.classList.remove("show");
        element.setAttribute("aria-hidden", "true");
    }

    /* =========================================================
       PEMASUKAN BULANAN (KARTU TUNAI)
    ========================================================= */

    const cashCard = $("cashCard");
    const cashValue = $("cashValue");
    const cashModal = $("cashModal");
    const cashForm = $("cashForm");
    const cashMonth = $("cashMonth");
    const cashInput = $("cashInput");

    let incomes = [];

    function incomeForMonth(month) {
        const found = incomes.find(item => item.income_month === month);
        return found ? Number(found.amount) : 0;
    }

    function renderCash() {
        if (cashValue) {
            cashValue.textContent = formatRupiah(incomeForMonth(currentMonth()));
        }
    }

    async function loadIncomes() {
        if (!token) return;

        try {
            const data = await api("/incomes");
            incomes = Array.isArray(data) ? data : data?.data || [];
            renderCash();
        } catch (error) {
            console.error("Gagal memuat pemasukan:", error);
        }
    }

    function openCashModal() {
        if (!cashModal) return;

        const month = currentMonth();
        if (cashMonth) cashMonth.value = month;
        if (cashInput) cashInput.value = incomeForMonth(month) || "";

        openOverlay(cashModal);
        cashInput?.focus();
    }

    function closeCashModal() {
        closeOverlay(cashModal);
    }

    // Saat bulan diganti, tampilkan nominal bulan itu
    cashMonth?.addEventListener("change", () => {
        if (cashInput) cashInput.value = incomeForMonth(cashMonth.value) || "";
    });

    cashCard?.addEventListener("click", openCashModal);
    $("closeCashModal")?.addEventListener("click", closeCashModal);
    $("cancelCash")?.addEventListener("click", closeCashModal);

    cashModal?.addEventListener("click", event => {
        if (event.target === cashModal) closeCashModal();
    });

    cashForm?.addEventListener("submit", async event => {
        event.preventDefault();

        const month = cashMonth?.value;
        const amount = Number(cashInput?.value);

        if (!month || Number.isNaN(amount) || amount < 0) {
            showToast("Isi bulan dan jumlah pemasukan dengan benar.");
            return;
        }

        const saveButton = $("saveCash");
        if (saveButton) saveButton.disabled = true;

        try {
            const saved = await api("/incomes", {
                method: "POST",
                body: JSON.stringify({
                    income_month: month,
                    amount: Math.round(amount)
                })
            });

            const index = incomes.findIndex(item => item.income_month === month);
            if (index === -1) incomes.push(saved);
            else incomes[index] = saved;

            renderCash();
            closeCashModal();
            showToast("Pemasukan bulanan berhasil disimpan.");
        } catch (error) {
            showToast(error.message || "Gagal menyimpan pemasukan.");
        } finally {
            if (saveButton) saveButton.disabled = false;
        }
    });

    /* =========================================================
       TAMBAH CARD / WIDGET
       Centang = widget ditampilkan. Pilihan disimpan di browser.
    ========================================================= */

    const STORAGE_KEY = "trackin_visible_widgets";
    const ALL_WIDGETS = ["bill", "inventory", "activity", "expense", "category"];

    const addCardModal = $("addCardModal");

    function loadVisibleWidgets() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (Array.isArray(saved)) {
                return saved.filter(name => ALL_WIDGETS.includes(name));
            }
        } catch (error) {
            /* abaikan, pakai default */
        }
        return [...ALL_WIDGETS];
    }

    function applyWidgetVisibility(visible) {
        ALL_WIDGETS.forEach(name => {
            document
                .querySelectorAll(`[data-widget="${name}"]`)
                .forEach(card => {
                    card.style.display = visible.includes(name) ? "" : "none";
                });
        });
    }

    function syncModalChecks(visible) {
        ALL_WIDGETS.forEach(name => {
            const checkbox = $(`chk-${name}`);
            if (!checkbox) return;

            checkbox.checked = visible.includes(name);

            checkbox
                .closest(".widget-option")
                ?.classList.toggle("active", checkbox.checked);
        });
    }

    function openAddCardModal() {
        syncModalChecks(loadVisibleWidgets());
        openOverlay(addCardModal);
    }

    function closeAddCardModal() {
        closeOverlay(addCardModal);
    }

    $("addCardBtn")?.addEventListener("click", openAddCardModal);
    $("addWidgetButton")?.addEventListener("click", openAddCardModal);
    $("closeAddCardModal")?.addEventListener("click", closeAddCardModal);
    $("cancelAddCard")?.addEventListener("click", closeAddCardModal);

    addCardModal?.addEventListener("click", event => {
        if (event.target === addCardModal) closeAddCardModal();
    });

    // Klik pada pilihan -> update tampilan centang
    ALL_WIDGETS.forEach(name => {
        $(`chk-${name}`)?.addEventListener("change", event => {
            event.target
                .closest(".widget-option")
                ?.classList.toggle("active", event.target.checked);
        });
    });

    $("saveAddCard")?.addEventListener("click", () => {
        const visible = ALL_WIDGETS.filter(name => $(`chk-${name}`)?.checked);

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(visible));
        } catch (error) {
            console.warn("Pilihan widget tidak bisa disimpan:", error);
        }

        applyWidgetVisibility(visible);
        closeAddCardModal();
        showToast("Tampilan widget diperbarui.");
    });

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;
        closeCashModal();
        closeAddCardModal();
    });

    /* ================= START ================= */

    applyWidgetVisibility(loadVisibleWidgets());
    renderCash();
    loadIncomes();
})();
