const notesGrid = document.getElementById("notesGrid");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

// Element Modal
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

let notes = [
    { id: 1, title: "Bayar Kost", body: "jangan lupa bayar kost setiap tanggal 1", category: "Penting", date: "25 Agustus 2026", timestamp: "2026-08-25", isPinned: false },
    { id: 2, title: "Bayar Kost", body: "jangan lupa bayar kost setiap tanggal 1", category: "Penting", date: "25 Agustus 2026", timestamp: "2026-08-25", isPinned: false },
    { id: 3, title: "Bayar Kost", body: "jangan lupa bayar kost setiap tanggal 1", category: "Penting", date: "25 Agustus 2026", timestamp: "2026-08-25", isPinned: false },
    { id: 4, title: "Bayar Kost", body: "jangan lupa bayar kost setiap tanggal 1", category: "Penting", date: "25 Agustus 2026", timestamp: "2026-08-25", isPinned: false },
    { id: 5, title: "Bayar Kost", body: "jangan lupa bayar kost setiap tanggal 1", category: "Penting", date: "25 Agustus 2026", timestamp: "2026-08-25", isPinned: false },
    { id: 6, title: "Bayar Kost", body: "jangan lupa bayar kost setiap tanggal 1", category: "Penting", date: "25 Agustus 2026", timestamp: "2026-08-25", isPinned: false }
];

let selectedCategory = "Semua Kategori";
let selectedSort = "newest";

/* =========================
   FORMAT TANGGAL
========================= */
function formatDateIndonesian(dateString) {
    if (!dateString) return "";
    const options = { day: 'numeric', month: 'Long', year: 'numeric' };
    const dateObj = new Date(dateString);
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    
    return `${day} ${month} ${year}`;
}

/* =========================
   RENDER
========================= */
function renderNotes() {
    const keyword = searchInput.value.trim().toLowerCase();

    let result = notes.filter(note => {
        const text = `${note.title} ${note.body} ${note.category}`.toLowerCase();
        const matchSearch = text.includes(keyword);
        const matchCategory = selectedCategory === "Semua Kategori" || note.category === selectedCategory;

        return matchSearch && matchCategory;
    });

    /* SORT */
    if (selectedSort === "newest") {
        result.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (selectedSort === "oldest") {
        result.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else if (selectedSort === "az") {
        result.sort((a,b) => a.title.localeCompare(b.title));
    }

    // Sort berdasarkan status pinned terlebih dahulu
    result.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    notesGrid.innerHTML = "";

    result.forEach(note => {
        const card = document.createElement("article");
        card.className = `note-card ${note.isPinned ? 'pinned' : ''}`;
        card.dataset.id = note.id;

        card.innerHTML = `
            <div class="note-top">
                <div class="card-calendar-icon">
                    <div class="cal-head"></div>
                    <div class="cal-grid">
                        <span></span><span></span><span></span>
                        <span></span><span></span><span></span>
                    </div>
                </div>

                <div class="note-info">
                    <span class="badge">${escapeHTML(note.category)}</span>
                    <h3 class="note-title">${escapeHTML(note.title)}</h3>
                    <p class="note-body">${escapeHTML(note.body)}</p>
                </div>

                <button class="pin-btn" title="Pin catatan">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 17v5M9 2h6l1 7 3 2v2H5v-2l3-2 1-7z"/>
                    </svg>
                </button>
            </div>

            <div class="note-bottom">
                <div class="note-date">
                    <svg viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>${escapeHTML(note.date)}</span>
                </div>

                <div class="note-actions">
                    <button class="icon-btn edit-btn" title="Edit">
                        <svg viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>

                    <button class="icon-btn delete-btn" title="Hapus">
                        <svg viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        notesGrid.appendChild(card);
    });

    if (result.length === 0) {
        notesGrid.style.display = "none";
        emptyState.style.display = "block";
    } else {
        notesGrid.style.display = "grid";
        emptyState.style.display = "none";
    }
}

/* =========================
   SEARCH
========================= */
searchInput.addEventListener("input", renderNotes);

/* =========================
   CATEGORY DROPDOWN
========================= */
const categoryButton = document.getElementById("categoryButton");
const categoryMenu = document.getElementById("categoryMenu");

categoryButton.addEventListener("click", function(event) {
    event.stopPropagation();
    categoryMenu.classList.toggle("show");
    sortMenu.classList.remove("show");
});

document.querySelectorAll("#categoryMenu button").forEach(button => {
    button.addEventListener("click", function() {
        selectedCategory = this.dataset.category;
        document.getElementById("categoryText").textContent = selectedCategory;
        categoryMenu.classList.remove("show");
        renderNotes();
    });
});

/* =========================
   SORT DROPDOWN
========================= */
const sortButton = document.getElementById("sortButton");
const sortMenu = document.getElementById("sortMenu");

sortButton.addEventListener("click", function(event) {
    event.stopPropagation();
    sortMenu.classList.toggle("show");
    categoryMenu.classList.remove("show");
});

document.querySelectorAll("#sortMenu button").forEach(button => {
    button.addEventListener("click", function() {
        selectedSort = this.dataset.sort;
        document.getElementById("sortText").textContent = this.textContent;
        sortMenu.classList.remove("show");
        renderNotes();
    });
});

document.addEventListener("click", function() {
    categoryMenu.classList.remove("show");
    sortMenu.classList.remove("show");
});

/* =========================
   CARD ACTIONS (Pin, Edit, Delete)
========================= */
notesGrid.addEventListener("click", function(event) {
    const card = event.target.closest(".note-card");
    if (!card) return;

    const id = Number(card.dataset.id);
    const note = notes.find(n => n.id === id);

    // HAPUS
    if (event.target.closest(".delete-btn")) {
        if (confirm("Hapus catatan ini?")) {
            notes = notes.filter(n => n.id !== id);
            renderNotes();
        }
        return;
    }

    // PIN
    if (event.target.closest(".pin-btn")) {
        if (note) {
            note.isPinned = !note.isPinned;
            renderNotes();
        }
        return;
    }

    // EDIT
    if (event.target.closest(".edit-btn")) {
        if (note) {
            openModal(note);
        }
    }
});

/* =========================
   MODAL FUNCTIONALITY
========================= */
function openModal(noteToEdit = null) {
    noteForm.reset();
    
    if (noteToEdit) {
        modalHeaderTitle.textContent = "Edit Catatan";
        noteIdInput.value = noteToEdit.id;
        noteTitleInput.value = noteToEdit.title;
        noteCategoryInput.value = noteToEdit.category;
        noteDateInput.value = noteToEdit.timestamp;
        noteBodyInput.value = noteToEdit.body;
    } else {
        modalHeaderTitle.textContent = "Tambah Catatan";
        noteIdInput.value = "";
        // Default tanggal hari ini (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];
        noteDateInput.value = today;
    }

    noteModal.classList.add("show");
}

function closeModal() {
    noteModal.classList.remove("show");
}

openModalBtn.addEventListener("click", () => openModal());
closeModalBtn.addEventListener("click", closeModal);
btnCancel.addEventListener("click", closeModal);

noteModal.addEventListener("click", (e) => {
    if (e.target === noteModal) closeModal();
});

noteForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const id = noteIdInput.value;
    const title = noteTitleInput.value.trim();
    const category = noteCategoryInput.value;
    const rawDate = noteDateInput.value;
    const body = noteBodyInput.value.trim();

    const formattedDate = formatDateIndonesian(rawDate);

    if (id) {
        // Edit Catatan
        const note = notes.find(n => n.id === Number(id));
        if (note) {
            note.title = title;
            note.category = category;
            note.timestamp = rawDate;
            note.date = formattedDate;
            note.body = body;
        }
    } else {
        // Tambah Catatan Baru
        const newNote = {
            id: Date.now(),
            title: title,
            body: body,
            category: category,
            date: formattedDate,
            timestamp: rawDate,
            isPinned: false
        };
        notes.unshift(newNote);
    }

    renderNotes();
    closeModal();
});

/* =========================
   ESCAPE HTML
========================= */
function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, char => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };
        return entities[char];
    });
}

/* INITIAL RENDER */
renderNotes();