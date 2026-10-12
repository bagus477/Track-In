const notesGrid = document.getElementById("notesGrid");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

// =========================
// MODAL
// =========================
const noteModal = document.getElementById("noteModal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const btnCancel = document.getElementById("btnCancel");
const noteForm = document.getElementById("noteForm");

const noteIdInput = document.getElementById("noteId");
const noteTitleInput = document.getElementById("noteTitle");
const noteCategoryInput = document.getElementById("noteCategory");
const noteDateInput = document.getElementById("noteDate");
const noteBodyInput = document.getElementById("noteBody");
const modalHeaderTitle = document.getElementById("modalHeaderTitle");

// =========================
// BACKEND
// =========================
const API_URL = "http://127.0.0.1:8000/api";

// Ambil token login
function getToken() {
    return (
        localStorage.getItem("trackin_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token") ||
        ""
    );
}

// Header request
function getHeaders() {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token
            ? {
                  "Authorization": `Bearer ${token}`
              }
            : {})
    };
}

// Request helper
async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...getHeaders(),
            ...(options.headers || {})
        }
    });

    let data = null;

    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }

    if (!response.ok) {
        console.error("API Error:", response.status, data);

        if (response.status === 401) {
            alert("Session login sudah tidak valid. Silakan login lagi.");
        }

        throw new Error(
            data?.message ||
            `Request gagal (${response.status})`
        );
    }

    return data;
}

// =========================
// DATA
// =========================
let notes = [];

let selectedCategory = "Semua Kategori";
let selectedSort = "newest";

// =========================
// FORMAT TANGGAL
// =========================
function formatDateIndonesian(dateString) {
    if (!dateString) return "";

    const dateObj = new Date(dateString);

    if (isNaN(dateObj.getTime())) {
        return "";
    }

    const months = [
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

    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    return `${day} ${month} ${year}`;
}

// =========================
// NORMALIZE DATA BACKEND
// =========================
function normalizeNote(note) {
    return {
        id: note.id,

        title: note.title || "",

        // Backend pakai "content"
        // Frontend pakai "body"
        body: note.content || note.body || "",

        category: note.category || "Umum",

        // Backend pakai is_pinned
        isPinned:
            Boolean(note.is_pinned) ||
            Boolean(note.isPinned),

        // Pakai created_at kalau tidak ada tanggal khusus
        timestamp:
            note.updated_at ||
            note.created_at ||
            note.date ||
            new Date().toISOString(),

        date:
            note.date
                ? formatDateIndonesian(note.date)
                : formatDateIndonesian(
                      note.updated_at ||
                      note.created_at
                  )
    };
}

// =========================
// LOAD NOTES
// =========================
async function loadNotes() {
    try {
        notesGrid.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px;
            ">
                Memuat catatan...
            </div>
        `;

        const data = await apiRequest(`${API_URL}/notes`, {
            method: "GET"
        });

        /*
         * Laravel bisa mengembalikan:
         *
         * [
         *   {...},
         *   {...}
         * ]
         *
         * atau:
         *
         * {
         *   data: [...]
         * }
         */

        const noteData = Array.isArray(data)
            ? data
            : data?.data || [];

        notes = noteData.map(normalizeNote);

        renderNotes();

    } catch (error) {
        console.error("Gagal mengambil catatan:", error);

        notes = [];

        notesGrid.innerHTML = "";

        emptyState.style.display = "block";

        alert(
            "Gagal mengambil catatan dari server.\n\n" +
            "Pastikan Laravel sedang berjalan."
        );
    }
}

// =========================
// RENDER
// =========================
function renderNotes() {
    const keyword = searchInput.value.trim().toLowerCase();

    let result = notes.filter(note => {
        const text = `
            ${note.title}
            ${note.body}
            ${note.category}
        `.toLowerCase();

        const matchSearch = text.includes(keyword);

        const matchCategory =
            selectedCategory === "Semua Kategori" ||
            note.category === selectedCategory;

        return matchSearch && matchCategory;
    });

    // =========================
    // SORT
    // =========================
    if (selectedSort === "newest") {
        result.sort(
            (a, b) =>
                new Date(b.timestamp) -
                new Date(a.timestamp)
        );
    } else if (selectedSort === "oldest") {
        result.sort(
            (a, b) =>
                new Date(a.timestamp) -
                new Date(b.timestamp)
        );
    } else if (selectedSort === "az") {
        result.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }

    // PINNED SELALU DI ATAS
    result.sort(
        (a, b) =>
            (b.isPinned ? 1 : 0) -
            (a.isPinned ? 1 : 0)
    );

    notesGrid.innerHTML = "";

    result.forEach(note => {
        const card = document.createElement("article");

        card.className =
            `note-card ${note.isPinned ? "pinned" : ""}`;

        card.dataset.id = note.id;

        card.innerHTML = `
            <div class="note-top">

                <div class="card-calendar-icon">
                    <div class="cal-head"></div>

                    <div class="cal-grid">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <div class="note-info">

                    <span class="badge">
                        ${escapeHTML(note.category)}
                    </span>

                    <h3 class="note-title">
                        ${escapeHTML(note.title)}
                    </h3>

                    <p class="note-body">
                        ${escapeHTML(note.body)}
                    </p>

                </div>

                <button
                    class="pin-btn"
                    title="${note.isPinned ? "Unpin catatan" : "Pin catatan"}"
                >
                    <svg viewBox="0 0 24 24">
                        <path
                            d="M12 17v5M9 2h6l1 7 3 2v2H5v-2l3-2 1-7z"
                        />
                    </svg>
                </button>

            </div>

            <div class="note-bottom">

                <div class="note-date">

                    <svg viewBox="0 0 24 24">
                        <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                        ></rect>

                        <line
                            x1="16"
                            y1="2"
                            x2="16"
                            y2="6"
                        ></line>

                        <line
                            x1="8"
                            y1="2"
                            x2="8"
                            y2="6"
                        ></line>

                        <line
                            x1="3"
                            y1="10"
                            x2="21"
                            y2="10"
                        ></line>
                    </svg>

                    <span>
                        ${escapeHTML(note.date)}
                    </span>

                </div>

                <div class="note-actions">

                    <button
                        class="icon-btn edit-btn"
                        title="Edit"
                    >
                        <svg viewBox="0 0 24 24">
                            <path
                                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                            ></path>

                            <path
                                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                            ></path>
                        </svg>
                    </button>

                    <button
                        class="icon-btn delete-btn"
                        title="Hapus"
                    >
                        <svg viewBox="0 0 24 24">
                            <polyline
                                points="3 6 5 6 21 6"
                            ></polyline>

                            <path
                                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                            ></path>
                        </svg>
                    </button>

                </div>

            </div>
        `;

        notesGrid.appendChild(card);
    });

    // EMPTY STATE
    if (result.length === 0) {
        notesGrid.style.display = "none";
        emptyState.style.display = "block";
    } else {
        notesGrid.style.display = "grid";
        emptyState.style.display = "none";
    }
}

// =========================
// SEARCH
// =========================
searchInput.addEventListener(
    "input",
    renderNotes
);

// =========================
// CATEGORY DROPDOWN
// =========================
const categoryButton =
    document.getElementById("categoryButton");

const categoryMenu =
    document.getElementById("categoryMenu");

const sortButton =
    document.getElementById("sortButton");

const sortMenu =
    document.getElementById("sortMenu");

categoryButton.addEventListener(
    "click",
    function(event) {
        event.stopPropagation();

        categoryMenu.classList.toggle("show");

        sortMenu.classList.remove("show");
    }
);

document
    .querySelectorAll("#categoryMenu button")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                selectedCategory =
                    this.dataset.category;

                document.getElementById(
                    "categoryText"
                ).textContent = selectedCategory;

                categoryMenu.classList.remove(
                    "show"
                );

                renderNotes();
            }
        );
    });

// =========================
// SORT DROPDOWN
// =========================
sortButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        sortMenu.classList.toggle("show");

        categoryMenu.classList.remove("show");
    }
);

document
    .querySelectorAll("#sortMenu button")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                selectedSort =
                    this.dataset.sort;

                document.getElementById(
                    "sortText"
                ).textContent = this.textContent;

                sortMenu.classList.remove(
                    "show"
                );

                renderNotes();
            }
        );
    });

// =========================
// CLOSE DROPDOWN
// =========================
document.addEventListener(
    "click",
    function() {

        categoryMenu.classList.remove("show");

        sortMenu.classList.remove("show");
    }
);

// =========================
// CARD ACTIONS
// =========================
notesGrid.addEventListener(
    "click",
    async function(event) {

        const card =
            event.target.closest(".note-card");

        if (!card) return;

        const id =
            Number(card.dataset.id);

        const note =
            notes.find(n => n.id === id);

        if (!note) return;

        // =========================
        // DELETE
        // =========================
        if (
            event.target.closest(".delete-btn")
        ) {

            if (
                !confirm(
                    "Hapus catatan ini?"
                )
            ) {
                return;
            }

            try {

                await apiRequest(
                    `${API_URL}/notes/${id}`,
                    {
                        method: "DELETE"
                    }
                );

                notes =
                    notes.filter(
                        n => n.id !== id
                    );

                renderNotes();

            } catch (error) {

                console.error(
                    "Gagal menghapus:",
                    error
                );

                alert(
                    "Catatan gagal dihapus."
                );
            }

            return;
        }

        // =========================
        // PIN
        // =========================
        if (
            event.target.closest(".pin-btn")
        ) {

            try {

                const updated =
                    await apiRequest(
                        `${API_URL}/notes/${id}`,
                        {
                            method: "PUT",

                            body: JSON.stringify({
                                is_pinned:
                                    !note.isPinned
                            })
                        }
                    );

                const updatedData =
                    updated?.data ||
                    updated;

                const index =
                    notes.findIndex(
                        n => n.id === id
                    );

                if (index !== -1) {

                    notes[index] =
                        normalizeNote({
                            ...notes[index],
                            ...updatedData,
                            is_pinned:
                                updatedData?.is_pinned ??
                                !note.isPinned
                        });
                }

                renderNotes();

            } catch (error) {

                console.error(
                    "Gagal pin:",
                    error
                );

                alert(
                    "Status pin gagal diperbarui."
                );
            }

            return;
        }

        // =========================
        // EDIT
        // =========================
        if (
            event.target.closest(".edit-btn")
        ) {

            openModal(note);

            return;
        }
    }
);

// =========================
// MODAL
// =========================
function openModal(noteToEdit = null) {

    noteForm.reset();

    if (noteToEdit) {

        modalHeaderTitle.textContent =
            "Edit Catatan";

        noteIdInput.value =
            noteToEdit.id;

        noteTitleInput.value =
            noteToEdit.title;

        noteCategoryInput.value =
            noteToEdit.category;

        // Kalau timestamp dari Laravel
        // format menjadi YYYY-MM-DD
        if (noteToEdit.timestamp) {

            const date =
                new Date(noteToEdit.timestamp);

            if (!isNaN(date.getTime())) {

                const year =
                    date.getFullYear();

                const month =
                    String(
                        date.getMonth() + 1
                    ).padStart(2, "0");

                const day =
                    String(
                        date.getDate()
                    ).padStart(2, "0");

                noteDateInput.value =
                    `${year}-${month}-${day}`;
            }
        }

        noteBodyInput.value =
            noteToEdit.body;

    } else {

        modalHeaderTitle.textContent =
            "Tambah Catatan";

        noteIdInput.value = "";

        // tanggal hari ini
        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        noteDateInput.value =
            `${year}-${month}-${day}`;
    }

    noteModal.classList.add("show");
}

// =========================
// CLOSE MODAL
// =========================
function closeModal() {

    noteModal.classList.remove("show");
}

openModalBtn.addEventListener(
    "click",
    () => openModal()
);

closeModalBtn.addEventListener(
    "click",
    closeModal
);

btnCancel.addEventListener(
    "click",
    closeModal
);

noteModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === noteModal
        ) {
            closeModal();
        }
    }
);

// =========================
// SUBMIT FORM
// =========================
noteForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const id =
            noteIdInput.value;

        const title =
            noteTitleInput.value.trim();

        const category =
            noteCategoryInput.value;

        const rawDate =
            noteDateInput.value;

        const body =
            noteBodyInput.value.trim();

        // =========================
        // VALIDASI
        // =========================
        if (!title) {

            alert(
                "Judul catatan wajib diisi."
            );

            return;
        }

        if (!body) {

            alert(
                "Isi catatan wajib diisi."
            );

            return;
        }

        if (!category) {

            alert(
                "Kategori wajib dipilih."
            );

            return;
        }

        try {

            // =========================
            // EDIT
            // =========================
            if (id) {

                const data =
                    await apiRequest(
                        `${API_URL}/notes/${id}`,
                        {
                            method: "PUT",

                            body: JSON.stringify({
                                title: title,

                                content: body,

                                category: category,

                                is_pinned:
                                    notes.find(
                                        n =>
                                            n.id ===
                                            Number(id)
                                    )?.isPinned ||
                                    false
                            })
                        }
                    );

                const updatedData =
                    data?.data ||
                    data;

                const index =
                    notes.findIndex(
                        n =>
                            n.id ===
                            Number(id)
                    );

                if (index !== -1) {

                    notes[index] =
                        normalizeNote({
                            ...notes[index],
                            ...updatedData,

                            title:
                                updatedData?.title ||
                                title,

                            content:
                                updatedData?.content ||
                                body,

                            category:
                                updatedData?.category ||
                                category
                        });
                }

            }

            // =========================
            // TAMBAH
            // =========================
            else {

                const data =
                    await apiRequest(
                        `${API_URL}/notes`,
                        {
                            method: "POST",

                            body: JSON.stringify({
                                title: title,

                                content: body,

                                category: category,

                                is_pinned: false
                            })
                        }
                    );

                const createdData =
                    data?.data ||
                    data;

                notes.unshift(
                    normalizeNote(
                        createdData
                    )
                );
            }

            renderNotes();

            closeModal();

        } catch (error) {

            console.error(
                "Gagal menyimpan catatan:",
                error
            );

            alert(
                "Catatan gagal disimpan.\n\n" +
                error.message
            );
        }
    }
);

// =========================
// ESCAPE HTML
// =========================
function escapeHTML(text) {

    return String(text).replace(
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

// =========================
// START
// =========================
loadNotes();
