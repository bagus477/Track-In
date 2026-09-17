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

const filterButtons =
    document.querySelectorAll(".filter");


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter =
            button.dataset.filter;

        renderExpenses();

    });

});


/* =========================================
   RENDER DATA
========================================= */

function renderExpenses() {

    const list =
        document.getElementById("expenseList");

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();

    const person =
        document
            .getElementById("paymentFilter")
            .value;


    list.innerHTML = "";


    const filtered =
        expenses.filter(item => {

            const matchCategory =
                currentFilter === "all" ||
                item.category === currentFilter;

            const matchSearch =
                item.name
                    .toLowerCase()
                    .includes(search) ||

                item.category
                    .toLowerCase()
                    .includes(search) ||

                item.person
                    .toLowerCase()
                    .includes(search);


            const matchPerson =
                person === "all" ||
                person === "Dibayar oleh" ||
                item.person === person;


            return (
                matchCategory &&
                matchSearch &&
                matchPerson
            );

        });


    filtered.forEach(item => {

        const card =
            document.createElement("article");

        card.className = "expense-card";


        card.innerHTML = `

            <div class="expense-head">

                <div class="expense-title">

                    <div class="expense-icon">
                        ▣
                    </div>

                    <div>

                        <span class="category">
                            ${item.category}
                        </span>

                        <h3>
                            ${item.name}
                        </h3>

                    </div>

                </div>

                <button
                    class="card-menu"
                    onclick="deleteExpense('${item.name}')"
                >
                    •••
                </button>

            </div>


            <div class="expense-body">

                <div class="expense-meta">

                    <span>
                        Harga
                    </span>

                    <strong>
                        ${formatRupiah(item.price)}
                    </strong>

                </div>


                <div class="expense-bottom">

                    <span>
                        ♙ Oleh:
                        <strong>
                            ${item.person}
                        </strong>
                    </span>

                    <span>
                        ▣ ${item.date}
                    </span>

                </div>

            </div>

        `;


        list.appendChild(card);

    });


    updateCount(filtered.length);


    const empty =
        document.getElementById("emptyState");


    if (filtered.length === 0) {

        empty.style.display = "block";

    } else {

        empty.style.display = "none";

    }

}


/* =========================================
   JUMLAH TRANSAKSI
========================================= */

function updateCount(count) {

    document.getElementById(
        "expenseCount"
    ).textContent =
        `${count} transaksi ditemukan`;

}


/* =========================================
   SEARCH
========================================= */

function searchExpense() {

    renderExpenses();

}


/* =========================================
   FILTER PEMBAYAR
========================================= */

function filterPayment() {

    renderExpenses();

}


/* =========================================
   SORTING
========================================= */

function sortExpenses() {

    ascending = !ascending;


    expenses.sort((a, b) => {

        if (ascending) {

            return a.price - b.price;

        } else {

            return b.price - a.price;

        }

    });


    renderExpenses();

}


/* =========================================
   DELETE
========================================= */

function deleteExpense(name) {

    const confirmDelete =
        confirm(
            `Hapus pengeluaran "${name}"?`
        );


    if (!confirmDelete) return;


    expenses =
        expenses.filter(
            item => item.name !== name
        );


    calculateTotal();

    renderExpenses();

}


/* =========================================
   MODAL
========================================= */

const modal =
    document.getElementById("modal");


function openModal() {

    modal.classList.add("show");

}


function closeModal() {

    modal.classList.remove("show");

}


/* Klik area luar modal */

modal.addEventListener(
    "click",
    function(event) {

        if (event.target === modal) {

            closeModal();

        }

    }
);


/* =========================================
   TAMBAH PENGELUARAN
========================================= */

document
    .getElementById("expenseForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("expenseName")
                    .value;


            const category =
                document
                    .getElementById("expenseCategory")
                    .value;


            const price =
                Number(
                    document
                        .getElementById("expensePrice")
                        .value
                );


            const person =
                document
                    .getElementById("expensePerson")
                    .value;


            const rawDate =
                document
                    .getElementById("expenseDate")
                    .value;


            if (!name || !price || !rawDate) {

                alert(
                    "Mohon lengkapi data."
                );

                return;

            }


            const date =
                new Date(rawDate);


            const formattedDate =
                date.toLocaleDateString(
                    "id-ID",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );


            expenses.push({

                name,

                category,

                price,

                person,

                date: formattedDate

            });


            calculateTotal();

            renderExpenses();


            document
                .getElementById("expenseForm")
                .reset();


            closeModal();


            alert(
                "Pengeluaran berhasil ditambahkan!"
            );

        }
    );


/* =========================================
   HITUNG TOTAL
========================================= */

function calculateTotal() {

    const total =
        expenses.reduce(
            (sum, item) =>
                sum + item.price,
            0
        );


    document
        .getElementById("totalExpense")
        .textContent =
        formatRupiah(total);


    document
        .getElementById("monthlyExpense")
        .textContent =
        formatRupiah(total);

}


/* =========================================
   ESC CLOSE MODAL
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("show")
        ) {

            closeModal();

        }

    }
);


/* =========================================
   INITIALIZE
========================================= */

calculateTotal();

renderExpenses();
