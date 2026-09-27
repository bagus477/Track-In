const initialItems = [

    {
        id: 1,
        name: "Rice Cooker",
        category: "Barang Bersama",
        price: 450000,
        owner: "Yusuf",
        date: "2026-08-12",
        icon: "▣",
        description:
            "Dipakai masak nasi harian di dapur utama."
    },

    {
        id: 2,
        name: "Kipas Angin",
        category: "Barang Bersama",
        price: 300000,
        owner: "Bagus",
        date: "2026-08-15",
        icon: "",
        description:
            "Kipas ruang tengah, harap matikan jika keluar."
    },

    {
        id: 3,
        name: "Galon",
        category: "Barang Bersama",
        price: 20000,
        owner: "Andi",
        date: "2026-08-18",
        icon: "⊗",
        description:
            "Isi ulang galon minggu ke-3."
    },

    {
        id: 4,
        name: "Headset",
        category: "Barang Pribadi",
        price: 300000,
        owner: "Yusuf",
        date: "2026-08-20",
        icon: "♧",
        description:
            "Barang pribadi di kamar Yusuf, izin sebelum pakai."
    },

    {
        id: 5,
        name: "Lampu",
        category: "Barang Bersama",
        price: 35000,
        owner: "Bagus",
        date: "2026-08-22",
        icon: "♧",
        description:
            "Lampu cadangan untuk lorong depan."
    },

    {
        id: 6,
        name: "Meja Lipat",
        category: "Patungan",
        price: 275000,
        owner: "Andi",
        date: "2026-08-24",
        icon: "▤",
        description:
            "Digunakan bersama saat belajar atau rapat."
    },

    {
        id: 7,
        name: "Dispenser",
        category: "Barang Bersama",
        price: 520000,
        owner: "Yusuf",
        date: "2026-08-26",
        icon: "▥",
        description:
            "Dispenser air untuk area dapur."
    },

    {
        id: 8,
        name: "Kabel HDMI",
        category: "Barang Pribadi",
        price: 85000,
        owner: "Bagus",
        date: "2026-08-28",
        icon: "⌁",
        description:
            "Kabel pribadi untuk kebutuhan presentasi."
    },

    {
        id: 9,
        name: "Karpet",
        category: "Patungan",
        price: 420000,
        owner: "Yusuf",
        date: "2026-08-30",
        icon: "▦",
        description:
            "Karpet ruang tengah hasil patungan."
    }

];


let items =
    JSON.parse(
        localStorage.getItem(
            "trackin_items"
        )
    ) || initialItems;


let activeFilter = "Semua";


const $ = selector =>
    document.querySelector(selector);


/* ================= FORMAT RUPIAH ================= */

function rupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(number);

}


/* ================= FORMAT DATE ================= */

function formatDate(date) {

    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString(
        "id-ID",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* ================= ESCAPE HTML ================= */

function escapeHtml(value) {

    return String(value)
        .replace(
            /[&<>"']/g,
            char => {

                const entities = {

                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#039;"

                };

                return entities[char];

            }
        );

}


/* ================= RENDER ================= */

function render() {

    const search =
        $("#searchInput")
            .value
            .toLowerCase()
            .trim();


    let shown =
        items.filter(item => {

            const filterMatch =
                activeFilter === "Semua" ||
                item.category === activeFilter;


            const searchMatch =
                [
                    item.name,
                    item.owner,
                    item.category,
                    item.description
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(search);


            return filterMatch &&
                searchMatch;

        });


    const sort =
        $("#sortSelect").value;


    if (sort === "priceHigh") {

        shown.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    if (sort === "priceLow") {

        shown.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (sort === "name") {

        shown.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    }


    if (sort === "newest") {

        shown.sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );

    }


    $("#inventoryGrid")
        .innerHTML =
        shown.map(createCard)
            .join("");


    $("#emptyState")
        .hidden =
        shown.length !== 0;


    updateStats();

}


/* ================= CREATE CARD ================= */

function createCard(item) {

    let badgeClass = "";


    if (
        item.category ===
        "Barang Pribadi"
    ) {

        badgeClass = "private";

    }


    if (
        item.category ===
        "Patungan"
    ) {

        badgeClass = "group";

    }


    return `

        <article class="item-card">


            <div class="item-top">


                <div class="item-icon">

                    ${escapeHtml(
                        item.icon || ""
                    )}

                </div>


                <div class="item-meta">


                    <span
                        class="badge ${badgeClass}"
                    >

                        ${escapeHtml(
                            item.category
                        )}

                    </span>


                    <h3>

                        ${escapeHtml(
                            item.name
                        )}

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

                        ${rupiah(
                            item.price
                        )}

                    </strong>

                </div>


                <div class="item-footer">


                    <span>

                        ♙ Oleh:
                        ${escapeHtml(
                            item.owner
                        )}

                    </span>


                    <span>

                        ▣
                        ${formatDate(
                            item.date
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


/* ================= UPDATE STATS ================= */

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


    $("#totalItems")
        .textContent =
        `${items.length} Barang`;


    $("#sharedItems")
        .textContent =
        `${shared} Barang`;


    $("#privateItems")
        .textContent =
        `${privateItems} Barang`;


    $("#groupItems")
        .textContent =
        `${group} Barang`;

}


/* ================= SAVE ================= */

function save() {

    localStorage.setItem(
        "trackin_items",
        JSON.stringify(items)
    );

    render();

}


/* ================= OPEN MODAL ================= */

function showModal(item = null) {

    $("#modal")
        .classList
        .add("show");


    $("#modalTitle")
        .textContent =
        item
            ? "Edit Barang"
            : "Tambah Barang";


    $("#itemId")
        .value =
        item?.id || "";


    $("#name")
        .value =
        item?.name || "";


    $("#price")
        .value =
        item?.price || "";


    $("#owner")
        .value =
        item?.owner || "Yusuf";


    $("#date")
        .value =
        item?.date ||
        new Date()
            .toISOString()
            .slice(0, 10);


    $("#icon")
        .value =
        item?.icon || "▣";


    $("#description")
        .value =
        item?.description || "";


    /*
       Kategori baru.
       Kalau data lama belum punya itemCategory,
       gunakan Kebutuhan Kost.
    */

    $("#itemCategory")
        .value =
        item?.itemCategory ||
        "Kebutuhan Kost";


    /*
       Status kepemilikan.
       Data lama menggunakan category
       sebagai status kepemilikan.
    */

    $("#ownership")
        .value =
        item?.ownership ||
        item?.category ||
        "Barang Bersama";

}


/* ================= CLOSE MODAL ================= */

function closeModal() {

    $("#modal")
        .classList
        .remove("show");

}


/* ================= EDIT ================= */

function editItem(id) {

    const item =
        items.find(
            item =>
                item.id === id
        );


    if (!item) return;


    showModal(item);

}


/* ================= DELETE ================= */

function deleteItem(id) {

    const item =
        items.find(
            item =>
                item.id === id
        );


    if (!item) return;


    const confirmation =
        confirm(
            `Hapus "${item.name}" dari inventaris?`
        );


    if (!confirmation) return;


    items =
        items.filter(
            item =>
                item.id !== id
        );


    save();


    showToast(
        "Barang berhasil dihapus"
    );

}


/* ================= TOAST ================= */

function showToast(message) {

    const toast =
        $("#toast");


    toast.textContent =
        message;


    toast.classList
        .add("show");


    setTimeout(
        () => {

            toast.classList
                .remove("show");

        },
        2200
    );

}


/* ================= ADD BUTTON ================= */

$("#openAdd")
    .onclick = () => {

        showModal();

    };


/* ================= CLOSE BUTTON ================= */

$("#closeModal")
    .onclick = closeModal;


$("#cancelModal")
    .onclick = closeModal;


/* ================= CLICK OUTSIDE MODAL ================= */

$("#modal")
    .onclick = event => {

        if (
            event.target.id ===
            "modal"
        ) {

            closeModal();

        }

    };


/* ================= SEARCH ================= */

$("#searchInput")
    .oninput = render;


/* ================= SORT ================= */

$("#sortSelect")
    .onchange = render;


/* ================= FILTER ================= */

$("#filters")
    .addEventListener(
        "click",
        event => {

            const button =
                event.target
                    .closest(
                        ".filter"
                    );


            if (!button) return;


            activeFilter =
                button.dataset.filter;


            document
                .querySelectorAll(
                    ".filter"
                )
                .forEach(
                    element => {

                        element.classList
                            .remove(
                                "active"
                            );

                    }
                );


            button.classList
                .add("active");


            render();

        }
    );


/* ================= FORM ================= */

$("#itemForm").onsubmit = event => {

    event.preventDefault();

    const idValue =
        $("#itemId").value.trim();

const data = {

    id:
        idValue
            ? Number(idValue)
            : Date.now(),

    name:
        $("#name")
            .value
            .trim(),

    /*
       Status lama tetap disimpan
       sebagai category agar filter
       dan statistik yang sudah ada
       tetap berjalan.
    */

    category:
        $("#ownership")
            .value,

    /*
       Kategori barang baru.
    */

    itemCategory:
        $("#itemCategory")
            .value,

    /*
       Status kepemilikan eksplisit.
    */

    ownership:
        $("#ownership")
            .value,

    price:
        Number(
            $("#price")
                .value
        ) || 0,

    owner:
        $("#owner")
            .value
            .trim(),

    date:
        $("#date")
            .value,


    description:
        $("#description")
            .value
            .trim()

};


    /* ================= VALIDASI ================= */

    if (!data.name) {

        alert(
            "Nama barang wajib diisi."
        );

        $("#name").focus();

        return;
    }


    if (!data.price) {

        alert(
            "Harga barang wajib diisi."
        );

        $("#price").focus();

        return;
    }


    if (!data.owner) {

        alert(
            "Pemilik wajib diisi."
        );

        $("#owner").focus();

        return;
    }


    if (!data.date) {

        alert(
            "Tanggal beli wajib diisi."
        );

        $("#date").focus();

        return;
    }


    /* ================= CEK EDIT ================= */

    const existingIndex =
        items.findIndex(
            item =>
                Number(item.id) ===
                Number(data.id)
        );


    /* ================= EDIT ================= */

    if (existingIndex !== -1) {

        items[existingIndex] =
            data;

        showToast(
            "Barang berhasil diperbarui"
        );

    }

    /* ================= TAMBAH CARD BARU ================= */

    else {

        items.push(data);

        showToast(
            "Barang berhasil ditambahkan"
        );

    }


    /* ================= SIMPAN ================= */

    localStorage.setItem(
        "trackin_items",
        JSON.stringify(items)
    );


    /* ================= RENDER CARD ================= */

    render();


    /* ================= TUTUP MODAL ================= */

    closeModal();

};

/* ================= INITIAL ================= */

render();
