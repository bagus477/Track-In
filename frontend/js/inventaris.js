const API_URL = "http://127.0.0.1:8000/api";

let items = [];
let activeFilter = "Semua";

const $ = selector => document.querySelector(selector);

const token = localStorage.getItem("trackin_token");
const user = JSON.parse(
    localStorage.getItem("trackin_user") || "null"
);

if (!token) {
    window.location.href = "index.html";
}

/* ================= API ================= */

async function api(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
            ...(options.headers || {})
        }
    });

    if (response.status === 401) {
        localStorage.removeItem("trackin_token");
        localStorage.removeItem("trackin_user");
        window.location.href = "index.html";
        return;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message || "Terjadi kesalahan pada server."
        );
    }

    return data;
}

/* ================= FORMAT ================= */

function rupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number || 0);
}

function formatDate(date) {
    if (!date) return "-";

    return new Date(date + "T00:00:00").toLocaleDateString(
        "id-ID",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
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

/* ================= LOAD DATA ================= */

async function loadItems() {
    try {
        const data = await api("/inventory");

        items = Array.isArray(data) ? data : [];

        render();

    } catch (error) {
        console.error("Inventory error:", error);

        showToast(
            error.message ||
            "Gagal mengambil data inventaris."
        );
    }
}

/* ================= RENDER ================= */

function render() {
    const searchInput = $("#searchInput");
    const sortSelect = $("#sortSelect");
    const inventoryGrid = $("#inventoryGrid");
    const emptyState = $("#emptyState");

    if (!inventoryGrid) return;

    const search = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    let shown = items.filter(item => {

        const filterMatch =
            activeFilter === "Semua" ||
            item.category === activeFilter;

        const searchMatch = [
            item.name,
            item.category,
            item.purchased_by,
            item.description
        ]
            .join(" ")
            .toLowerCase()
            .includes(search);

        return filterMatch && searchMatch;
    });

    const sort = sortSelect?.value;

    if (sort === "priceHigh") {
        shown.sort(
            (a, b) =>
                Number(b.price || 0) -
                Number(a.price || 0)
        );
    }

    if (sort === "priceLow") {
        shown.sort(
            (a, b) =>
                Number(a.price || 0) -
                Number(b.price || 0)
        );
    }

    if (sort === "name") {
        shown.sort(
            (a, b) =>
                String(a.name || "")
                    .localeCompare(
                        String(b.name || "")
                    )
        );
    }

    if (sort === "newest") {
        shown.sort(
            (a, b) =>
                new Date(b.purchase_date || 0) -
                new Date(a.purchase_date || 0)
        );
    }

    inventoryGrid.innerHTML =
        shown.map(createCard).join("");

    if (emptyState) {
        emptyState.hidden =
            shown.length !== 0;
    }

    updateStats();
}

/* ================= CARD ================= */

function createCard(item) {

    let badgeClass = "";

    if (item.category === "Barang Pribadi") {
        badgeClass = "private";
    }

    if (item.category === "Patungan") {
        badgeClass = "group";
    }

    return `
        <article class="item-card">

            <div class="item-top">

                <div class="item-icon">
                    ▣
                </div>

                <div class="item-meta">

                    <span class="badge ${badgeClass}">
                        ${escapeHtml(
                            item.category || "Barang"
                        )}
                    </span>

                    <h3>
                        ${escapeHtml(item.name)}
                    </h3>

                </div>

            </div>

            <div class="item-body">

                <p class="description">
                    ${escapeHtml(
                        item.description ||
                        "Tidak ada deskripsi."
                    )}
                </p>

                <div class="price-row">

                    <span>
                        Harga
                    </span>

                    <strong class="price">
                        ${rupiah(item.price)}
                    </strong>

                </div>

                <div class="item-footer">

                    <span>
                        ♙ Dibeli Oleh:
                        ${escapeHtml(
                            item.purchased_by || "-"
                        )}
                    </span>

                    <span>
                        ▣
                        ${formatDate(
                            item.purchase_date
                        )}
                    </span>

                    <div class="actions">

                        <button
                            class="icon-btn"
                            onclick="editItem(${item.id})"
                            title="Edit"
                        >
                            ✎
                        </button>

                        <button
                            class="icon-btn delete"
                            onclick="deleteItem(${item.id})"
                            title="Hapus"
                        >
                            ♜
                        </button>

                    </div>

                </div>

            </div>

        </article>
    `;
}

/* ================= STATISTICS ================= */

function updateStats() {

    const shared =
        items.filter(
            item =>
                item.category ===
                "Barang Bersama"
        ).length;

    const privateItems =
        items.filter(
            item =>
                item.category ===
                "Barang Pribadi"
        ).length;

    const group =
        items.filter(
            item =>
                item.category ===
                "Patungan"
        ).length;

    if ($("#totalItems")) {
        $("#totalItems").textContent =
            `${items.length} Barang`;
    }

    if ($("#sharedItems")) {
        $("#sharedItems").textContent =
            `${shared} Barang`;
    }

    if ($("#privateItems")) {
        $("#privateItems").textContent =
            `${privateItems} Barang`;
    }

    if ($("#groupItems")) {
        $("#groupItems").textContent =
            `${group} Barang`;
    }
}

/* ================= MODAL ================= */

function showModal(item = null) {

    $("#modal")?.classList.add("show");

    if ($("#modalTitle")) {
        $("#modalTitle").textContent =
            item
                ? "Edit Barang"
                : "Tambah Barang";
    }

    if ($("#itemId")) {
        $("#itemId").value =
            item?.id || "";
    }

    if ($("#name")) {
        $("#name").value =
            item?.name || "";
    }

    if ($("#price")) {
        $("#price").value =
            item?.price || "";
    }

    if ($("#owner")) {
        $("#owner").value =
            item?.purchased_by || "";
    }

    if ($("#date")) {
        $("#date").value =
            item?.purchase_date ||
            new Date()
                .toISOString()
                .slice(0, 10);
    }

    if ($("#icon")) {
        $("#icon").value =
            item?.icon || "▣";
    }

    if ($("#description")) {
        $("#description").value =
            item?.description || "";
    }

    if ($("#itemCategory")) {
        $("#itemCategory").value =
            item?.itemCategory ||
            "Kebutuhan Kost";
    }

    if ($("#ownership")) {
        $("#ownership").value =
            item?.category ||
            "Barang Bersama";
    }
}

function closeModal() {
    $("#modal")?.classList.remove("show");
}

/* ================= EDIT ================= */

function editItem(id) {

    const item =
        items.find(
            item =>
                Number(item.id) ===
                Number(id)
        );

    if (!item) return;

    showModal(item);
}

/* ================= DELETE ================= */

async function deleteItem(id) {

    const item =
        items.find(
            item =>
                Number(item.id) ===
                Number(id)
        );

    if (!item) return;

    const confirmation =
        confirm(
            `Hapus "${item.name}" dari inventaris?`
        );

    if (!confirmation) return;

    try {

        await api(
            `/inventory/${id}`,
            {
                method: "DELETE"
            }
        );

        items =
            items.filter(
                item =>
                    Number(item.id) !==
                    Number(id)
            );

        render();

        showToast(
            "Barang berhasil dihapus"
        );

    } catch (error) {

        console.error(error);

        showToast(
            error.message ||
            "Gagal menghapus barang."
        );
    }
}

/* ================= TOAST ================= */

function showToast(message) {

    const toast = $("#toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

/* ================= BUTTON ================= */

$("#openAdd")?.addEventListener(
    "click",
    () => {
        showModal();
    }
);

$("#closeModal")?.addEventListener(
    "click",
    closeModal
);

$("#cancelModal")?.addEventListener(
    "click",
    closeModal
);

$("#modal")?.addEventListener(
    "click",
    event => {

        if (
            event.target.id ===
            "modal"
        ) {
            closeModal();
        }

    }
);

/* ================= SEARCH ================= */

$("#searchInput")?.addEventListener(
    "input",
    render
);

/* ================= SORT ================= */

$("#sortSelect")?.addEventListener(
    "change",
    render
);

/* ================= FILTER ================= */

$("#filters")?.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".filter"
            );

        if (!button) return;

        activeFilter =
            button.dataset.filter;

        document
            .querySelectorAll(".filter")
            .forEach(element => {
                element.classList.remove(
                    "active"
                );
            });

        button.classList.add("active");

        render();
    }
);

/* ================= FORM ================= */

$("#itemForm")?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const idValue =
            $("#itemId").value.trim();

        const data = {

            name:
                $("#name")
                    .value
                    .trim(),

            purchased_by:
                $("#owner")
                    .value
                    .trim(),

            category:
                $("#ownership")
                    .value,

            price:
                Number(
                    $("#price").value
                ) || 0,

            purchase_date:
                $("#date").value,

            description:
                $("#description")
                    .value
                    .trim()
        };

        /* VALIDASI */

        if (!data.name) {
            alert(
                "Nama barang wajib diisi."
            );

            $("#name").focus();

            return;
        }

        if (!data.purchased_by) {
            alert(
                "Nama pembeli wajib diisi."
            );

            $("#owner").focus();

            return;
        }

        if (!data.price) {
            alert(
                "Harga barang wajib diisi."
            );

            $("#price").focus();

            return;
        }

        if (!data.purchase_date) {
            alert(
                "Tanggal beli wajib diisi."
            );

            $("#date").focus();

            return;
        }

        try {

            /* EDIT */

            if (idValue) {

                const result =
                    await api(
                        `/inventory/${idValue}`,
                        {
                            method: "PUT",
                            body:
                                JSON.stringify(
                                    data
                                )
                        }
                    );

                const updated =
                    result.data;

                const index =
                    items.findIndex(
                        item =>
                            Number(item.id) ===
                            Number(idValue)
                    );

                if (index !== -1) {
                    items[index] =
                        updated;
                }

                showToast(
                    "Barang berhasil diperbarui"
                );

            }

            /* TAMBAH */

            else {

                const result =
                    await api(
                        "/inventory",
                        {
                            method: "POST",
                            body:
                                JSON.stringify(
                                    data
                                )
                        }
                    );

                items.unshift(
                    result.data
                );

                showToast(
                    "Barang berhasil ditambahkan"
                );
            }

            render();

            closeModal();

        } catch (error) {

            console.error(error);

            showToast(
                error.message ||
                "Gagal menyimpan barang."
            );
        }
    }
);

/* ================= START ================= */

loadItems();
