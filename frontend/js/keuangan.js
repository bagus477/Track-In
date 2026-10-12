const API_URL = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("trackin_token");
const user = JSON.parse(localStorage.getItem("trackin_user") || "null");

if (!token) {
    window.location.href = "index.html";
}

let expenses = [];
let incomes = [];
let currentFilter = "all";
let ascending = false;

/* =========================================
   API
========================================= */

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
        const message =
            data?.message ||
            Object.values(data?.errors || {}).flat().join("\n") ||
            `Request gagal (${response.status})`;

        throw new Error(message);
    }

    return data;
}

/* =========================================
   FORMAT
========================================= */

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(Number(number) || 0);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function formatDateIndonesian(dateString) {
    if (!dateString) return "-";

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function currentMonth() {
    const now = new Date();

    return `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}`;
}

function showMessage(message) {
    alert(message);
}

/* =========================================
   LOAD DATA
========================================= */

async function loadFinance() {
    try {
        const [expenseResult, incomeResult] = await Promise.all([
            api("/expenses"),
            api("/incomes")
        ]);

        expenses = Array.isArray(expenseResult)
            ? expenseResult
            : expenseResult?.data || [];

        incomes = Array.isArray(incomeResult)
            ? incomeResult
            : incomeResult?.data || [];

        renderExpenses();
        calculateTotal();
        renderIncomeSummary();

    } catch (error) {
        console.error("Finance error:", error);

        showMessage(
            error.message ||
            "Gagal memuat data keuangan."
        );
    }
}

/* =========================================
   PEMASUKAN
========================================= */

function getTotalIncome() {
    return incomes.reduce(
        (sum, item) =>
            sum + Number(item.amount || 0),
        0
    );
}

function getMonthlyIncome(month = currentMonth()) {
    return incomes.reduce((sum, item) => {

        const itemMonth = String(
            item.income_month ||
            item.income_date ||
            ""
        ).slice(0, 7);

        if (itemMonth !== month) {
            return sum;
        }

        return sum + Number(item.amount || 0);

    }, 0);
}

function getMonthlyExpense(month = currentMonth()) {
    return expenses.reduce((sum, item) => {

        const itemMonth = String(
            item.expense_date || ""
        ).slice(0, 7);

        if (itemMonth !== month) {
            return sum;
        }

        return sum + Number(item.amount || 0);

    }, 0);
}

function renderIncomeSummary() {

    let summary =
        document.getElementById("financeSummary");

    if (!summary) {

        summary = document.createElement("section");

        summary.id = "financeSummary";

        summary.style.cssText = `
            display:grid;
            grid-template-columns:repeat(3,minmax(0,1fr));
            gap:14px;
            margin:0 0 24px;
        `;

        const list =
            document.getElementById("expenseList");

        if (list?.parentElement) {

            list.parentElement.insertBefore(
                summary,
                list
            );

        } else {

            document.body.prepend(summary);
        }
    }

    const income = getMonthlyIncome();
    const expense = getMonthlyExpense();
    const balance = income - expense;

    summary.innerHTML = `

        <article style="
            padding:18px;
            border:1px solid #e7e7e7;
            border-radius:16px;
            background:#fff;
        ">

            <small style="
                display:block;
                color:#777;
                margin-bottom:6px;
            ">
                Pemasukan Bulan Ini
            </small>

            <strong style="font-size:20px;">
                ${formatRupiah(income)}
            </strong>

        </article>


        <article style="
            padding:18px;
            border:1px solid #e7e7e7;
            border-radius:16px;
            background:#fff;
        ">

            <small style="
                display:block;
                color:#777;
                margin-bottom:6px;
            ">
                Pengeluaran Bulan Ini
            </small>

            <strong style="font-size:20px;">
                ${formatRupiah(expense)}
            </strong>

        </article>


        <article style="
            padding:18px;
            border:1px solid #e7e7e7;
            border-radius:16px;
            background:#fff;
        ">

            <small style="
                display:block;
                color:#777;
                margin-bottom:6px;
            ">
                Saldo Bulan Ini
            </small>

            <strong style="font-size:20px;">
                ${formatRupiah(balance)}
            </strong>

        </article>
    `;
}

/* =========================================
   FILTER KATEGORI
========================================= */

const filterButtons =
    document.querySelectorAll(".filter");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter =
            button.dataset.filter;

        renderExpenses();
    });

});

/* =========================================
   RENDER PENGELUARAN
========================================= */

function renderExpenses() {

    const list =
        document.getElementById("expenseList");

    const searchInput =
        document.getElementById("searchInput");

    const paymentFilter =
        document.getElementById("paymentFilter");

    if (!list) return;

    const search =
        (searchInput?.value || "")
            .toLowerCase();

    const person =
        paymentFilter?.value || "all";

    list.innerHTML = "";

    const filtered =
        expenses.filter(item => {

            const name =
                item.description ||
                item.name ||
                "";

            const category =
                item.category ||
                "Lainnya";

            const paidBy =
                item.paid_by ||
                item.person ||
                "-";

            const matchCategory =
                currentFilter === "all" ||
                category === currentFilter;

            const matchSearch =
                name.toLowerCase().includes(search) ||
                category.toLowerCase().includes(search) ||
                paidBy.toLowerCase().includes(search);

            const matchPerson =
                person === "all" ||
                person === "Dibayar oleh" ||
                paidBy === person;

            return (
                matchCategory &&
                matchSearch &&
                matchPerson
            );
        });


    filtered.forEach(item => {

        const name =
            item.description ||
            item.name ||
            "Pengeluaran";

        const category =
            item.category ||
            "Lainnya";

        const person =
            item.paid_by ||
            item.person ||
            "-";

        const price =
            Number(
                item.amount ??
                item.price ??
                0
            );

        const date =
            item.expense_date
                ? formatDateIndonesian(
                    item.expense_date
                )
                : item.date || "-";


        const card =
            document.createElement("article");

        card.className =
            "expense-card";


        card.innerHTML = `

            <div class="expense-head">

                <div class="expense-title">

                    <div class="expense-icon">
                        ▣
                    </div>

                    <div>

                        <span class="category">
                            ${escapeHTML(category)}
                        </span>

                        <h3>
                            ${escapeHTML(name)}
                        </h3>

                    </div>

                </div>


                <button
                    class="card-menu"
                    type="button"
                    onclick="deleteExpense(${Number(item.id)})"
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
                        ${formatRupiah(price)}
                    </strong>

                </div>


                <div class="expense-bottom">

                    <span>
                        ♙ Oleh:
                        <strong>
                            ${escapeHTML(person)}
                        </strong>
                    </span>

                    <span>
                        ▣ ${escapeHTML(date)}
                    </span>

                </div>

            </div>
        `;

        list.appendChild(card);
    });


    updateCount(filtered.length);


    const empty =
        document.getElementById("emptyState");

    if (empty) {

        empty.style.display =
            filtered.length === 0
                ? "block"
                : "none";
    }


    renderIncomeSummary();
}

function updateCount(count) {

    const element =
        document.getElementById("expenseCount");

    if (element) {

        element.textContent =
            `${count} transaksi ditemukan`;
    }
}

function searchExpense() {
    renderExpenses();
}

function filterPayment() {
    renderExpenses();
}

function sortExpenses() {

    ascending = !ascending;

    expenses.sort((a, b) => {

        const amountA =
            Number(
                a.amount ||
                a.price ||
                0
            );

        const amountB =
            Number(
                b.amount ||
                b.price ||
                0
            );

        return ascending
            ? amountA - amountB
            : amountB - amountA;
    });

    renderExpenses();
}

/* =========================================
   DELETE PENGELUARAN
========================================= */

async function deleteExpense(id) {

    const item =
        expenses.find(
            expense =>
                Number(expense.id) ===
                Number(id)
        );

    if (!item) return;

    const name =
        item.description ||
        item.name ||
        "pengeluaran";


    if (!confirm(
        `Hapus pengeluaran "${name}"?`
    )) {
        return;
    }


    try {

        await api(`/expenses/${id}`, {
            method: "DELETE"
        });


        expenses =
            expenses.filter(
                expense =>
                    Number(expense.id) !==
                    Number(id)
            );


        calculateTotal();
        renderExpenses();
        renderIncomeSummary();

        showMessage(
            "Pengeluaran berhasil dihapus."
        );


    } catch (error) {

        console.error(error);

        showMessage(
            error.message ||
            "Pengeluaran gagal dihapus."
        );
    }
}

/* =========================================
   MODAL TAMBAH PENGELUARAN
========================================= */

const modal =
    document.getElementById("modal");


function openModal() {

    if (!modal) return;

    modal.classList.add("show");

    document.body.classList.add(
        "modal-open"
    );
}


function closeModal() {

    if (!modal) return;

    modal.classList.remove("show");

    document.body.classList.remove(
        "modal-open"
    );
}


if (modal) {

    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {
                closeModal();
            }

        }
    );
}


/* =========================================
   SUBMIT PENGELUARAN
========================================= */

const expenseForm =
    document.getElementById(
        "expenseForm"
    );


if (expenseForm) {

    expenseForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "expenseName"
                    )
                    ?.value
                    .trim();


            const category =
                document
                    .getElementById(
                        "expenseCategory"
                    )
                    ?.value;


            const price =
                Number(
                    document
                        .getElementById(
                            "expensePrice"
                        )
                        ?.value
                );


            const person =
                document
                    .getElementById(
                        "expensePerson"
                    )
                    ?.value
                    .trim();


            const rawDate =
                document
                    .getElementById(
                        "expenseDate"
                    )
                    ?.value;


            if (
                !name ||
                !price ||
                !rawDate
            ) {

                alert(
                    "Mohon lengkapi data."
                );

                return;
            }


            try {

                const result =
                    await api(
                        "/expenses",
                        {
                            method: "POST",

                            body:
                                JSON.stringify({
                                    description: name,
                                    category:
                                        category ||
                                        "Lainnya",
                                    amount: price,
                                    expense_date:
                                        rawDate,
                                    paid_by:
                                        person ||
                                        user?.name ||
                                        "-"
                                })
                        }
                    );


                expenses.unshift(
                    result?.data ||
                    result
                );


                calculateTotal();
                renderExpenses();
                renderIncomeSummary();


                expenseForm.reset();

                closeModal();


                showMessage(
                    "Pengeluaran berhasil ditambahkan!"
                );


            } catch (error) {

                console.error(error);

                showMessage(
                    error.message ||
                    "Pengeluaran gagal disimpan."
                );
            }
        }
    );
}


/* =========================================
   TOTAL PENGELUARAN
========================================= */

function calculateTotal() {

    const total =
        expenses.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.amount ??
                    item.price ??
                    0
                ),
            0
        );


    const totalExpense =
        document.getElementById(
            "totalExpense"
        );


    const monthlyExpense =
        document.getElementById(
            "monthlyExpense"
        );


    if (totalExpense) {

        totalExpense.textContent =
            formatRupiah(total);
    }


    if (monthlyExpense) {

        monthlyExpense.textContent =
            formatRupiah(
                getMonthlyExpense()
            );
    }
}


/* =========================================
   MODAL TAMBAH TAGIHAN
========================================= */

const billModal =
    document.getElementById(
        "billModal"
    );


function openBillModal() {

    if (!billModal) return;

    billModal.classList.add("show");

    document.body.classList.add(
        "modal-open"
    );

    calculateBillSplit();
}


function closeBillModal() {

    if (!billModal) return;

    billModal.classList.remove(
        "show"
    );

    document.body.classList.remove(
        "modal-open"
    );
}


if (billModal) {

    billModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === billModal
            ) {
                closeBillModal();
            }

        }
    );
}


/* =========================================
   PEMBAGIAN TAGIHAN
========================================= */

function calculateBillSplit() {

    const input =
        document.getElementById(
            "newBillTotal"
        );


    const rawTotal =
        input?.value || "";


    const numericTotal =
        parseInt(
            rawTotal.replace(
                /[^0-9]/g,
                ""
            )
        ) || 0;


    const checkboxes =
        document.querySelectorAll(
            'input[name="billMembers"]:checked'
        );


    const selectedMembers =
        Array.from(
            checkboxes
        ).map(
            cb => cb.value
        );


    const detailsContainer =
        document.getElementById(
            "billSplitDetails"
        );


    if (!detailsContainer) {
        return;
    }


    detailsContainer.innerHTML =
        "";


    if (
        selectedMembers.length === 0
    ) {

        detailsContainer.innerHTML = `
            <span style="
                font-size:10px;
                color:#e53935;
            ">
                Pilih minimal 1 anggota
            </span>
        `;

        return;
    }


    const splitMode =
        document.querySelector(
            'input[name="splitMode"]:checked'
        );


    const isManual =
        splitMode?.value ===
        "manual";


    const perPerson =
        Math.floor(
            numericTotal /
            selectedMembers.length
        );


    selectedMembers.forEach(
        member => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "split-row";


            if (isManual) {

                row.innerHTML = `

                    <span>
                        ${escapeHTML(member)}
                    </span>

                    <input
                        type="text"
                        class="manual-split-input"
                        value="${formatRupiah(perPerson)}"
                    >

                `;

            } else {

                row.innerHTML = `

                    <span>
                        ${escapeHTML(member)}
                    </span>

                    <strong>
                        ${formatRupiah(perPerson)}
                    </strong>

                `;
            }


            detailsContainer.appendChild(
                row
            );
        }
    );
}


function toggleSplitMode() {
    calculateBillSplit();
}


/* =========================================
   FORMAT INPUT TOTAL TAGIHAN
========================================= */

const billTotalInput =
    document.getElementById(
        "newBillTotal"
    );


if (billTotalInput) {

    billTotalInput.addEventListener(
        "input",
        function(e) {

            let val =
                e.target.value.replace(
                    /[^0-9]/g,
                    ""
                );


            e.target.value =
                val
                    ? formatRupiah(
                        parseInt(val)
                    )
                    : "";


            calculateBillSplit();
        }
    );
}


/* =========================================
   TAMBAH TAGIHAN KE DATABASE
========================================= */

const addBillForm =
    document.getElementById(
        "addBillForm"
    );


async function createBill() {

    const name =
        document
            .getElementById(
                "newBillName"
            )
            ?.value
            .trim() || "";


    const totalText =
        document
            .getElementById(
                "newBillTotal"
            )
            ?.value || "";


    const dueDate =
        document
            .getElementById(
                "newBillDueDate"
            )
            ?.value || "";


    const totalAmount =
        Number(
            String(totalText).replace(
                /[^0-9]/g,
                ""
            )
        );


    if (
        !name ||
        totalAmount <= 0 ||
        !dueDate
    ) {

        alert(
            "Mohon lengkapi nama tagihan, total tagihan, dan tanggal jatuh tempo."
        );

        return null;
    }


    const selectedMembers =
        Array.from(
            document.querySelectorAll(
                'input[name="billMembers"]:checked'
            )
        ).map(
            cb => cb.value
        );


    const result =
        await api(
            "/bills",
            {
                method: "POST",

                body:
                    JSON.stringify({
                        name:
                            name,

                        total_amount:
                            totalAmount,

                        due_date:
                            dueDate,

                        status:
                            "unpaid"
                    })
            }
        );


    const bill =
        result?.data ||
        result;


    /*
       Simpan pembagian anggota
       jika endpoint tersedia.
    */

    if (
        bill?.id &&
        selectedMembers.length
    ) {

        const splitMode =
            document.querySelector(
                'input[name="splitMode"]:checked'
            )?.value ||
            "equal";


        const perPerson =
            Math.floor(
                totalAmount /
                selectedMembers.length
            );


        for (
            const member
            of selectedMembers
        ) {

            try {

                await api(
                    "/bill-members",
                    {
                        method: "POST",

                        body:
                            JSON.stringify({
                                bill_id:
                                    bill.id,

                                member_name:
                                    member,

                                amount:
                                    perPerson,

                                status:
                                    "unpaid",

                                split_mode:
                                    splitMode
                            })
                    }
                );

            } catch (
                memberError
            ) {

                console.warn(
                    "Pembagian anggota belum tersimpan:",
                    memberError.message
                );
            }
        }
    }


    return bill;
}


/* =========================================
   SUBMIT TAGIHAN
========================================= */

if (addBillForm) {

    addBillForm.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();


            const submitButton =
                addBillForm.querySelector(
                    'button[type="submit"]'
                );


            const originalText =
                submitButton?.textContent ||
                "Simpan";


            try {

                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Menyimpan...";
                }


                const bill =
                    await createBill();


                if (!bill) {
                    return;
                }


                const sidebarName =
                    document.getElementById(
                        "sidebarBillName"
                    );


                const sidebarDueDate =
                    document.getElementById(
                        "sidebarBillDueDate"
                    );


                const sidebarTotal =
                    document.getElementById(
                        "sidebarBillTotal"
                    );


                if (sidebarName) {

                    sidebarName.textContent =
                        bill.name ||
                        "Tagihan";
                }


                if (sidebarDueDate) {

                    sidebarDueDate.textContent =
                        `Jatuh tempo: ${
                            formatDateIndonesian(
                                bill.due_date
                            )
                        }`;
                }


                if (sidebarTotal) {

                    sidebarTotal.textContent =
                        formatRupiah(
                            Number(
                                bill.total_amount ||
                                0
                            )
                        );
                }


                closeBillModal();

                addBillForm.reset();

                calculateBillSplit();


                alert(
                    "Tagihan berhasil disimpan ke database!"
                );


            } catch (error) {

                console.error(
                    "Gagal menyimpan tagihan:",
                    error
                );


                alert(
                    error.message ||
                    "Gagal menyimpan tagihan."
                );


            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        originalText;
                }
            }
        }
    );
}


/* =========================================
   DETAIL TRANSAKSI
========================================= */

const transactionDetailModal =
    document.getElementById(
        "transactionDetailModal"
    );


const detailTransactionBtn =
    document.getElementById(
        "detailTransactionBtn"
    );


const closeTransactionDetail =
    document.getElementById(
        "closeTransactionDetail"
    );


const closeTransactionDetailBottom =
    document.getElementById(
        "closeTransactionDetailBottom"
    );


function openTransactionDetail() {

    if (!transactionDetailModal) {
        return;
    }


    transactionDetailModal.classList.add(
        "show"
    );


    document.body.classList.add(
        "modal-open"
    );
}


function closeTransactionDetailModal() {

    if (!transactionDetailModal) {
        return;
    }


    transactionDetailModal.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "modal-open"
    );
}


if (detailTransactionBtn) {

    detailTransactionBtn.addEventListener(
        "click",
        openTransactionDetail
    );
}


if (closeTransactionDetail) {

    closeTransactionDetail.addEventListener(
        "click",
        closeTransactionDetailModal
    );
}


if (closeTransactionDetailBottom) {

    closeTransactionDetailBottom.addEventListener(
        "click",
        closeTransactionDetailModal
    );
}


if (transactionDetailModal) {

    transactionDetailModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                transactionDetailModal
            ) {

                closeTransactionDetailModal();
            }

        }
    );
}


/* =========================================
   ESCAPE
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key !== "Escape") {
            return;
        }


        if (
            modal?.classList.contains(
                "show"
            )
        ) {
            closeModal();
        }


        if (
            billModal?.classList.contains(
                "show"
            )
        ) {
            closeBillModal();
        }


        if (
            transactionDetailModal?.classList.contains(
                "show"
            )
        ) {
            closeTransactionDetailModal();
        }

    }
);


/* =========================================
   INITIALIZE
========================================= */

loadFinance();
