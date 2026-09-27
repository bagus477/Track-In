/* ============================================================
   TRACK IN — DASHBOARD.JS
   Pengaturan Card Dashboard + Modal Tambah Card
============================================================ */


/* ============================================================
   DATA DUMMY
============================================================ */

const inventoryData = [
    {
        name: "Rice Cooker",
        user: "Yusuf",
        date: "12 Agustus",
        price: "Rp450.000"
    },
    {
        name: "Kipas Angin",
        user: "Bagus",
        date: "15 Agustus",
        price: "Rp300.000"
    },
    {
        name: "Galon",
        user: "Andi",
        date: "18 Agustus",
        price: "Rp20.000"
    }
];

const activityData = [
    {
        name: "Yusuf",
        initial: "Y",
        text: "menambahkan 'Galon'",
        amount: "Rp20.000",
        time: "Hari ini"
    },
    {
        name: "Bagus",
        initial: "B",
        text: "menambahkan 'Kipas Angin'",
        amount: "Rp300.000",
        time: "Kemarin"
    },
    {
        name: "Andi",
        initial: "A",
        text: "membayar 'WiFi'",
        amount: "Rp100.000",
        time: "2 hari lalu"
    }
];


/* ============================================================
   STORAGE
============================================================ */

const CARD_STORAGE_KEY = "trackin_dashboard_cards_v4";


/*
 * Card yang bisa diatur dari modal
 */
const DEFAULT_CARD_SETTINGS = {
    bill: true,
    inventory: true,
    activity: true,
    expense: true,
    category: true
};


/* ============================================================
   DOM ELEMENT
============================================================ */

const inventoryList = document.getElementById("inventoryList");
const activityList = document.getElementById("activityList");
const toast = document.getElementById("toast");


/* ============================================================
   MODAL TAMBAH CARD
============================================================ */

const addCardModal = document.getElementById("addCardModal");
const addCardBtn = document.getElementById("addCardBtn");
const addWidgetButton = document.getElementById("addWidgetButton");

const closeAddCardModal =
    document.getElementById("closeAddCardModal");

const cancelAddCard =
    document.getElementById("cancelAddCard");

const saveAddCard =
    document.getElementById("saveAddCard");

const widgetOptions =
    document.querySelectorAll(".widget-option");


/* ============================================================
   DATE NAVIGATION
============================================================ */

const dateText =
    document.getElementById("dateText");

const previousDateBtn =
    document.getElementById("previousDate");

const nextDateBtn =
    document.getElementById("nextDate");

const datePickerInput =
    document.getElementById("datePickerInput");


/* ============================================================
   RENDER INVENTORY
============================================================ */

function renderInventory() {

    if (!inventoryList) return;

    inventoryList.innerHTML = "";

    inventoryData.forEach(item => {

        const div = document.createElement("div");

        div.className = "inventory-item";

        div.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <small>
                    ${item.user} &bull; ${item.date}
                </small>
            </div>

            <strong>${item.price}</strong>
        `;

        inventoryList.appendChild(div);
    });
}


/* ============================================================
   RENDER ACTIVITY
============================================================ */

function renderActivity() {

    if (!activityList) return;

    activityList.innerHTML = "";

    activityData.forEach(item => {

        const div = document.createElement("div");

        div.className = "activity-item";

        div.innerHTML = `
            <div class="act-avatar ${item.initial}">
                ${item.initial}
            </div>

            <div class="act-text">

                <div>
                    <strong>${item.name}</strong>
                    ${item.text}
                    <b>${item.amount}</b>
                </div>

                <small>${item.time}</small>

            </div>
        `;

        activityList.appendChild(div);
    });
}


/* ============================================================
   TOAST
============================================================ */

let toastTimer;

function showToast(message) {

    if (!toast) return;

    clearTimeout(toastTimer);

    toast.textContent = message;

    toast.classList.add("show");

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);
}


/* ============================================================
   CARD SETTINGS
============================================================ */

/*
 * Mengambil pengaturan card dari localStorage.
 *
 * Jika belum pernah disimpan:
 * semua card tambahan ditampilkan.
 *
 * Jika data lama tidak lengkap:
 * otomatis digabung dengan DEFAULT_CARD_SETTINGS.
 */

function getCardSettings() {

    try {

        const saved =
            localStorage.getItem(CARD_STORAGE_KEY);

        if (!saved) {

            return {
                ...DEFAULT_CARD_SETTINGS
            };
        }

        const parsed = JSON.parse(saved);

        return {
            ...DEFAULT_CARD_SETTINGS,
            ...parsed
        };

    } catch (error) {

        console.warn(
            "Pengaturan card tidak dapat dibaca.",
            error
        );

        return {
            ...DEFAULT_CARD_SETTINGS
        };
    }
}


/*
 * Menyimpan pengaturan card.
 */

function saveCardSettings(settings) {

    try {

        localStorage.setItem(
            CARD_STORAGE_KEY,
            JSON.stringify(settings)
        );

    } catch (error) {

        console.warn(
            "Pengaturan card gagal disimpan.",
            error
        );
    }
}


/* ============================================================
   APPLY CARD SETTINGS
============================================================ */

/*
 * Fungsi utama fitur:
 *
 * true  -> card muncul
 * false -> card hilang
 */

function applyCardSettings(settings) {

    widgetOptions.forEach(option => {

        const key = option.dataset.card;

        const checkbox = option.querySelector(
            "input[type='checkbox']"
        );

        const customCheckbox = option.querySelector(
            ".custom-checkbox"
        );

        const widgetCard = document.querySelector(
            `[data-widget="${key}"]`
        );

        const isActive = settings[key] === true;


        /* =========================================
           CHECKBOX INPUT
        ========================================= */

        if (checkbox) {
            checkbox.checked = isActive;
        }


        /* =========================================
           CUSTOM CHECKBOX
        ========================================= */

        if (customCheckbox) {

            customCheckbox.classList.toggle(
                "checked",
                isActive
            );

            customCheckbox.innerHTML = isActive
                ? "✓"
                : "";
        }


        /* =========================================
           STATUS OPTION MODAL
        ========================================= */

        option.classList.toggle(
            "active",
            isActive
        );


        /* =========================================
           CARD DASHBOARD
        ========================================= */

        if (widgetCard) {

            widgetCard.style.display =
                isActive ? "" : "none";
        }

    });
}



/* ============================================================
   OPEN MODAL
============================================================ */

function openModal() {

    if (!addCardModal) return;

    /*
     * Saat modal dibuka,
     * checkbox mengikuti card yang sedang aktif.
     */
    const settings = getCardSettings();

    applyCardSettings(settings);

    addCardModal.classList.add("show");

    /*
     * Mencegah halaman belakang ikut scroll.
     */
    document.body.classList.add("modal-open");
}


/* ============================================================
   CLOSE MODAL
============================================================ */

function closeModal() {

    if (!addCardModal) return;

    addCardModal.classList.remove("show");

    document.body.classList.remove("modal-open");

    /*
     * Saat Cancel,
     * kembalikan checkbox ke kondisi terakhir yang tersimpan.
     *
     * Jadi perubahan yang belum disimpan tidak diterapkan.
     */
    applyCardSettings(getCardSettings());
}


/* ============================================================
   BUTTON MODAL
============================================================ */

if (addCardBtn) {

    addCardBtn.addEventListener(
        "click",
        openModal
    );
}


if (addWidgetButton) {

    addWidgetButton.addEventListener(
        "click",
        openModal
    );
}


if (closeAddCardModal) {

    closeAddCardModal.addEventListener(
        "click",
        closeModal
    );
}


if (cancelAddCard) {

    cancelAddCard.addEventListener(
        "click",
        closeModal
    );
}


/* ============================================================
   KLIK AREA LUAR MODAL
============================================================ */

if (addCardModal) {

    addCardModal.addEventListener(
        "click",
        function (event) {

            if (event.target === addCardModal) {

                closeModal();
            }

        }
    );
}


/* ============================================================
   ESCAPE UNTUK MENUTUP MODAL
============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            addCardModal &&
            addCardModal.classList.contains("show")
        ) {

            closeModal();
        }

    }
);


widgetOptions.forEach(option => {

    const checkbox = option.querySelector(
        "input[type='checkbox']"
    );

    const customCheckbox = option.querySelector(
        ".custom-checkbox"
    );

    if (!checkbox) return;


    checkbox.addEventListener(
        "change",
        function () {

            const checked = this.checked;

            option.classList.toggle(
                "active",
                checked
            );

            if (customCheckbox) {

                customCheckbox.classList.toggle(
                    "checked",
                    checked
                );

                customCheckbox.innerHTML =
                    checked ? "✓" : "";
            }

        }
    );

});


/* ============================================================
   SIMPAN CARD
============================================================ */

if (saveAddCard) {

    saveAddCard.addEventListener(
        "click",
        function () {

            const newSettings = {
                ...DEFAULT_CARD_SETTINGS
            };

            /*
             * Ambil kondisi setiap checkbox
             */
            widgetOptions.forEach(option => {

                const key =
                    option.dataset.card;

                const checkbox =
                    option.querySelector(
                        "input[type='checkbox']"
                    );

                if (key) {

                    newSettings[key] =
                        checkbox
                            ? checkbox.checked
                            : false;
                }

            });


            /*
             * Simpan ke localStorage
             */
            saveCardSettings(
                newSettings
            );


            /*
             * Terapkan ke dashboard.
             *
             * Dicentang  = muncul
             * Tidak centang = hilang
             */
            applyCardSettings(
                newSettings
            );


            /*
             * Tutup modal
             */
            addCardModal.classList.remove(
                "show"
            );

            document.body.classList.remove(
                "modal-open"
            );


            /*
             * Notifikasi
             */
            showToast(
                "Card dashboard berhasil diperbarui"
            );

        }
    );
}


/* ============================================================
   DATE
============================================================ */

/*
 * Tanggal awal mengikuti desain.
 */
let currentDate =
    new Date(2026, 7, 17);


const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
];


/* ============================================================
   UPDATE DATE DISPLAY
============================================================ */

function updateDateDisplay() {

    if (!dateText) return;

    const day =
        currentDate.getDate();

    const month =
        monthNames[
            currentDate.getMonth()
        ];

    const year =
        currentDate.getFullYear();


    /*
     * Tampilkan tanggal
     */
    dateText.textContent =
        `${day} ${month} ${year}`;


    /*
     * Sinkronisasi input date
     */
    if (datePickerInput) {

        const yyyy =
            currentDate.getFullYear();

        const mm =
            String(
                currentDate.getMonth() + 1
            ).padStart(2, "0");

        const dd =
            String(
                currentDate.getDate()
            ).padStart(2, "0");


        datePickerInput.value =
            `${yyyy}-${mm}-${dd}`;
    }


    /*
     * Refresh data
     */
    renderInventory();
    renderActivity();
}


/* ============================================================
   TANGGAL SEBELUMNYA
============================================================ */

if (previousDateBtn) {

    previousDateBtn.addEventListener(
        "click",
        function () {

            currentDate.setDate(
                currentDate.getDate() - 1
            );

            updateDateDisplay();

            showToast(
                `Tanggal diubah ke ${dateText.textContent}`
            );

        }
    );
}


/* ============================================================
   TANGGAL BERIKUTNYA
============================================================ */

if (nextDateBtn) {

    nextDateBtn.addEventListener(
        "click",
        function () {

            currentDate.setDate(
                currentDate.getDate() + 1
            );

            updateDateDisplay();

            showToast(
                `Tanggal diubah ke ${dateText.textContent}`
            );

        }
    );
}


/* ============================================================
   DATE PICKER
============================================================ */

if (datePickerInput) {

    datePickerInput.addEventListener(
        "change",
        function (event) {

            if (!event.target.value) return;

            const [
                year,
                month,
                day
            ] =
                event.target.value
                    .split("-")
                    .map(Number);


            currentDate =
                new Date(
                    year,
                    month - 1,
                    day
                );


            updateDateDisplay();

            showToast(
                `Tanggal dipilih: ${dateText.textContent}`
            );

        }
    );
}


/* ============================================================
   INITIALIZATION
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Render isi card
         */
        renderInventory();
        renderActivity();


        /*
         * Tampilkan tanggal
         */
        updateDateDisplay();


        /*
         * Terapkan pengaturan card
         */
        applyCardSettings(
            getCardSettings()
        );

    }
);
