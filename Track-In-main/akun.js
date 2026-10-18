document.addEventListener("DOMContentLoaded", () => {

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

});


/* =========================================================
   ELEMENTS
========================================================= */

const menuItems =
    document.querySelectorAll(".account-menu-item");

const settingsCards =
    document.querySelectorAll(".settings-card");

const editButtons =
    document.querySelectorAll(".edit-button");

const saveButton =
    document.getElementById("saveButton");

const switchAccountButton =
    document.getElementById("switchAccountButton");

const changePasswordButton =
    document.getElementById("changePasswordButton");

const deleteAccountButton =
    document.getElementById("deleteAccountButton");

const logoutButton =
    document.getElementById("logoutButton");

const passwordForm =
    document.getElementById("passwordForm");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================================
   SECTION NAVIGATION
========================================================= */

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        const section =
            item.dataset.section;


        /* Remove active */

        menuItems.forEach(menu => {
            menu.classList.remove("active");
        });

        item.classList.add("active");


        /* Sections */

        const informasi =
            document.getElementById(
                "informasiSection"
            );

        const keamanan =
            document.getElementById(
                "keamananSection"
            );

        const lainnya =
            document.getElementById(
                "lainnyaSection"
            );

        const notifikasi =
            document.getElementById(
                "notifikasiSection"
            );

        const bahasa =
            document.getElementById(
                "bahasaSection"
            );


        /*
         * INFORMASI AKUN
         *
         * Tetap tampil seperti desain asli:
         * Informasi Akun
         * Keamanan
         * Lainnya
         */

        if (section === "informasi") {

            if (informasi) {
                informasi.style.display = "";
            }

            if (keamanan) {
                keamanan.style.display = "";
            }

            if (lainnya) {
                lainnya.style.display = "";
            }

            if (notifikasi) {
                notifikasi.classList.remove("show");
                notifikasi.style.display = "none";
            }

            if (bahasa) {
                bahasa.classList.remove("show");
                bahasa.style.display = "none";
            }

            return;
        }


        /*
         * KEAMANAN
         */

        if (section === "keamanan") {

            if (informasi) {
                informasi.style.display = "none";
            }

            if (lainnya) {
                lainnya.style.display = "none";
            }

            if (keamanan) {
                keamanan.style.display = "";
            }

            if (notifikasi) {
                notifikasi.classList.remove("show");
                notifikasi.style.display = "none";
            }

            if (bahasa) {
                bahasa.classList.remove("show");
                bahasa.style.display = "none";
            }

            if (keamanan) {
                keamanan.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            return;
        }


        /*
         * NOTIFIKASI
         */

        if (section === "notifikasi") {

            if (informasi) {
                informasi.style.display = "none";
            }

            if (keamanan) {
                keamanan.style.display = "none";
            }

            if (lainnya) {
                lainnya.style.display = "none";
            }

            if (notifikasi) {
                notifikasi.style.display = "";
                notifikasi.classList.add("show");
            }

            if (bahasa) {
                bahasa.style.display = "none";
                bahasa.classList.remove("show");
            }

            return;
        }


        /*
         * BAHASA
         */

        if (section === "bahasa") {

            if (informasi) {
                informasi.style.display = "none";
            }

            if (keamanan) {
                keamanan.style.display = "none";
            }

            if (lainnya) {
                lainnya.style.display = "none";
            }

            if (notifikasi) {
                notifikasi.style.display = "none";
                notifikasi.classList.remove("show");
            }

            if (bahasa) {
                bahasa.style.display = "";
                bahasa.classList.add("show");
            }

            return;
        }

    });

});


/* =========================================================
   EDIT ACCOUNT DATA
========================================================= */

editButtons.forEach(button => {

    button.addEventListener("click", () => {

        const field =
            button.dataset.edit;

        const input =
            document.querySelector(
                `[data-field="${field}"]`
            );

        if (!input) {
            return;
        }


        /*
         * Aktifkan input
         */

        if (input.disabled) {

            input.disabled = false;

            input.classList.add("editing");

            input.focus();

            input.select();

            button.innerHTML =
                `<i data-lucide="check"></i>`;

            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }

            return;
        }


        /*
         * Selesai edit
         */

        input.disabled = true;

        input.classList.remove("editing");

        button.innerHTML =
            `<i data-lucide="square-pen"></i>`;

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }

        showToast(
            `${capitalize(field)} berhasil diperbarui.`
        );

    });

});


/* =========================================================
   CAPITALIZE
========================================================= */

function capitalize(text) {

    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase() +
        text.slice(1);

}


/* =========================================================
   SAVE CHANGES
========================================================= */

if (saveButton) {

    saveButton.addEventListener("click", () => {

        const inputs =
            document.querySelectorAll(
                ".account-input"
            );

        let changed = false;


        inputs.forEach(input => {

            if (!input.disabled) {

                input.disabled = true;

                input.classList.remove(
                    "editing"
                );

                changed = true;

            }

        });


        editButtons.forEach(button => {

            button.innerHTML =
                `<i data-lucide="square-pen"></i>`;

        });


        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }


        if (changed) {

            showToast(
                "Perubahan akun berhasil disimpan."
            );

        } else {

            showToast(
                "Tidak ada perubahan yang perlu disimpan."
            );

        }

    });

}


/* =========================================================
   SWITCH ACCOUNT
========================================================= */

if (switchAccountButton) {

    switchAccountButton.addEventListener(
        "click",
        () => {

            openModal("switchModal");

        }
    );

}


/* =========================================================
   ACCOUNT OPTION
========================================================= */

document
    .querySelectorAll(".account-option")
    .forEach(option => {

        option.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".account-option"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                        const check =
                            item.querySelector(
                                "svg"
                            );

                        if (check) {
                            check.remove();
                        }

                    });


                option.classList.add("active");


                const icon =
                    document.createElement("i");

                icon.setAttribute(
                    "data-lucide",
                    "check"
                );

                option.appendChild(icon);


                if (
                    typeof lucide !== "undefined"
                ) {
                    lucide.createIcons();
                }


                const name =
                    option.querySelector(
                        ".option-info strong"
                    )?.textContent;


                if (name) {

                    const topName =
                        document.querySelector(
                            ".top-name"
                        );

                    if (topName) {

                        topName.textContent =
                            name.toLowerCase();

                    }

                }


                showToast(
                    `Beralih ke akun ${name || ""}.`
                );


                setTimeout(() => {

                    closeModal(
                        "switchModal"
                    );

                }, 500);

            }
        );

    });


/* =========================================================
   ADD ACCOUNT
========================================================= */

const addAccountButton =
    document.getElementById(
        "addAccountButton"
    );

if (addAccountButton) {

    addAccountButton.addEventListener(
        "click",
        () => {

            showToast(
                "Fitur tambah akun siap dihubungkan ke sistem login."
            );

        }
    );

}


/* =========================================================
   CHANGE PASSWORD
========================================================= */

if (changePasswordButton) {

    changePasswordButton.addEventListener(
        "click",
        () => {

            openModal("passwordModal");

        }
    );

}


/* =========================================================
   PASSWORD FORM
========================================================= */

if (passwordForm) {

    passwordForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const oldPassword =
                document.getElementById(
                    "oldPassword"
                )?.value || "";


            const newPassword =
                document.getElementById(
                    "newPassword"
                )?.value || "";


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                )?.value || "";


            if (!oldPassword) {

                showToast(
                    "Masukkan password saat ini."
                );

                return;
            }


            if (newPassword.length < 8) {

                showToast(
                    "Password baru minimal 8 karakter."
                );

                return;
            }


            if (
                newPassword !==
                confirmPassword
            ) {

                showToast(
                    "Konfirmasi password tidak cocok."
                );

                return;
            }


            closeModal(
                "passwordModal"
            );

            passwordForm.reset();

            showToast(
                "Password berhasil diperbarui."
            );

        }
    );

}


/* =========================================================
   PASSWORD SHOW / HIDE
========================================================= */

document
    .querySelectorAll(".password-toggle")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const targetId =
                    button.dataset.target;


                const input =
                    document.getElementById(
                        targetId
                    );


                if (!input) {
                    return;
                }


                if (
                    input.type === "password"
                ) {

                    input.type = "text";

                    button.innerHTML =
                        `<i data-lucide="eye-off"></i>`;

                } else {

                    input.type = "password";

                    button.innerHTML =
                        `<i data-lucide="eye"></i>`;

                }


                if (
                    typeof lucide !== "undefined"
                ) {
                    lucide.createIcons();
                }

            }
        );

    });


/* =========================================================
   DELETE ACCOUNT
========================================================= */

if (deleteAccountButton) {

    deleteAccountButton.addEventListener(
        "click",
        () => {

            openModal("deleteModal");

        }
    );

}


/* =========================================================
   CONFIRM DELETE
========================================================= */

const confirmDeleteButton =
    document.getElementById(
        "confirmDeleteButton"
    );

if (confirmDeleteButton) {

    confirmDeleteButton.addEventListener(
        "click",
        () => {

            closeModal(
                "deleteModal"
            );

            showToast(
                "Permintaan penghapusan akun diproses."
            );

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Apakah kamu yakin ingin keluar dari akun?"
                );


            if (!confirmed) {
                return;
            }


            showToast(
                "Kamu berhasil keluar dari akun."
            );

        }
    );

}


/* =========================================================
   MODAL OPEN
========================================================= */

function openModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {
        return;
    }


    modal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   MODAL CLOSE
========================================================= */

function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {
        return;
    }


    modal.classList.remove("show");

    document.body.style.overflow =
        "";

}


/* =========================================================
   CLOSE MODAL BUTTONS
========================================================= */

document
    .querySelectorAll(
        "[data-close-modal]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const modalId =
                    button.dataset.closeModal;

                closeModal(modalId);

            }
        );

    });


/* =========================================================
   CLOSE MODAL WHEN CLICK OUTSIDE
========================================================= */

document
    .querySelectorAll(".modal-overlay")
    .forEach(overlay => {

        overlay.addEventListener(
            "click",
            event => {

                if (
                    event.target === overlay
                ) {

                    closeModal(
                        overlay.id
                    );

                }

            }
        );

    });


/* =========================================================
   ESCAPE TO CLOSE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        document
            .querySelectorAll(
                ".modal-overlay.show"
            )
            .forEach(modal => {

                closeModal(
                    modal.id
                );

            });

    }
);


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

    if (!toast || !toastMessage) {
        return;
    }


    toastMessage.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2800);

}


/* =========================================================
   LANGUAGE
========================================================= */

const languageSelect =
    document.getElementById(
        "languageSelect"
    );


/*
 * SEMUA PILIHAN BAHASA
 */

const languages = {

    id: "Bahasa Indonesia",

    en: "English",

    jv: "Basa Jawa",

    su: "Basa Sunda",

    ms: "Bahasa Melayu",

    zh: "中文 (Chinese)",

    ja: "日本語 (Japanese)",

    ko: "한국어 (Korean)",

    ar: "العربية (Arabic)",

    fr: "Français",

    de: "Deutsch",

    es: "Español",

    it: "Italiano",

    pt: "Português",

    nl: "Nederlands",

    ru: "Русский",

    tr: "Türkçe",

    hi: "हिन्दी",

    th: "ไทย",

    vi: "Tiếng Việt"

};


/*
 * Pesan setelah memilih bahasa
 */

const languageMessages = {

    id:
        "Bahasa Indonesia dipilih.",

    en:
        "English selected.",

    jv:
        "Basa Jawa dipilih.",

    su:
        "Basa Sunda dipilih.",

    ms:
        "Bahasa Melayu dipilih.",

    zh:
        "中文已选择。",

    ja:
        "日本語が選択されました。",

    ko:
        "한국어가 선택되었습니다.",

    ar:
        "تم اختيار اللغة العربية.",

    fr:
        "Français sélectionné.",

    de:
        "Deutsch ausgewählt.",

    es:
        "Español seleccionado.",

    it:
        "Italiano selezionato.",

    pt:
        "Português selecionado.",

    nl:
        "Nederlands geselecteerd.",

    ru:
        "Русский выбран.",

    tr:
        "Türkçe seçildi.",

    hi:
        "हिन्दी चुनी गई।",

    th:
        "เลือกภาษาไทยแล้ว",

    vi:
        "Đã chọn Tiếng Việt."

};


/*
 * Isi dropdown bahasa
 */

if (languageSelect) {

    languageSelect.innerHTML = "";


    Object.entries(languages)
        .forEach(
            ([code, name]) => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    code;

                option.textContent =
                    name;

                languageSelect.appendChild(
                    option
                );

            }
        );


    /*
     * Ambil bahasa terakhir
     */

    const savedLanguage =
        localStorage.getItem(
            "trackin_language"
        );


    if (
        savedLanguage &&
        languages[savedLanguage]
    ) {

        languageSelect.value =
            savedLanguage;

    } else {

        languageSelect.value =
            "id";

    }


    /*
     * Ketika bahasa dipilih
     */

    languageSelect.addEventListener(
        "change",
        () => {

            const selected =
                languageSelect.value;


            /*
             * Simpan bahasa
             */

            localStorage.setItem(
                "trackin_language",
                selected
            );


            /*
             * Tampilkan pesan
             */

            showToast(
                languageMessages[selected] ||
                `${languages[selected]} dipilih.`
            );

        }
    );

}


/* =========================================================
   TOP PROFILE BUTTON
========================================================= */

const profileMenuButton =
    document.getElementById(
        "profileMenuButton"
    );


if (profileMenuButton) {

    profileMenuButton.addEventListener(
        "click",
        () => {

            showToast(
                "Profil Yusuf sedang aktif."
            );

        }
    );

}


/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {
            return;
        }

    }
);


/* =========================================================
   INTEGRASI BACKEND (LARAVEL API)
   Ditambahkan di akhir file supaya UI lama tetap jalan.
========================================================= */
const API_URL = "http://127.0.0.1:8000/api";
const authToken = localStorage.getItem("trackin_token");

if (!authToken) {
    window.location.href = "index.html";
}

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
            ...(options.headers || {})
        }
    });

    if (response.status === 401) {
        clearSession();
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

function clearSession() {
    localStorage.removeItem("trackin_token");
    localStorage.removeItem("trackin_user");
}

/* Isi form dengan data user yang sedang login */
const profileFieldMap = {
    username: "username",
    nama: "name",
    email: "email",
    telepon: "phone"
};

function fillProfile(user) {
    if (!user) return;

    Object.entries(profileFieldMap).forEach(([field, key]) => {
        const input = document.querySelector(`[data-field="${field}"]`);
        if (input) input.value = user[key] || "";
    });

    document.querySelectorAll(".top-name, .profile-username, #username")
        .forEach(el => {
            if (el.classList.contains("profile-username")) {
                el.textContent = `@${user.username || user.name}`;
            } else {
                el.textContent = (user.username || user.name || "").toLowerCase();
            }
        });
}

(async function loadProfile() {
    try {
        const user = await apiRequest("/me");
        fillProfile(user);
        localStorage.setItem("trackin_user", JSON.stringify(user));
    } catch (error) {
        showToast(error.message || "Gagal memuat profil.");
    }
})();

/* Simpan perubahan profil */
if (saveButton) {
    saveButton.addEventListener("click", async () => {
        const payload = {};

        Object.entries(profileFieldMap).forEach(([field, key]) => {
            const input = document.querySelector(`[data-field="${field}"]`);
            if (input) payload[key] = input.value.trim();
        });

        try {
            const result = await apiRequest("/me", {
                method: "PUT",
                body: JSON.stringify(payload)
            });
            fillProfile(result.user);
            localStorage.setItem("trackin_user", JSON.stringify(result.user));
            showToast("Perubahan akun tersimpan di server.");
        } catch (error) {
            showToast(error.message || "Gagal menyimpan profil.");
        }
    });
}

/* Ganti password (capture: jalan duluan, lalu menghentikan handler lama) */
if (passwordForm) {
    passwordForm.addEventListener("submit", async event => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const oldPassword = document.getElementById("oldPassword")?.value || "";
        const newPassword = document.getElementById("newPassword")?.value || "";
        const confirmPassword = document.getElementById("confirmPassword")?.value || "";

        if (!oldPassword) return showToast("Masukkan password saat ini.");
        if (newPassword.length < 8) return showToast("Password baru minimal 8 karakter.");
        if (newPassword !== confirmPassword) return showToast("Konfirmasi password tidak cocok.");

        try {
            await apiRequest("/me/password", {
                method: "PUT",
                body: JSON.stringify({
                    current_password: oldPassword,
                    new_password: newPassword
                })
            });
            closeModal("passwordModal");
            passwordForm.reset();
            showToast("Password berhasil diperbarui.");
        } catch (error) {
            showToast(error.message || "Gagal mengganti password.");
        }
    }, true);
}

/* Logout */
if (logoutButton) {
    logoutButton.addEventListener("click", async event => {
        event.stopImmediatePropagation();

        if (!confirm("Apakah kamu yakin ingin keluar dari akun?")) return;

        try {
            await apiRequest("/logout", { method: "POST" });
        } catch (error) {
            console.warn("Logout di server gagal, sesi lokal tetap dihapus:", error.message);
        }

        clearSession();
        showToast("Kamu berhasil keluar dari akun.");
        setTimeout(() => { window.location.href = "index.html"; }, 600);
    }, true);
}

/* Hapus akun */
const confirmDeleteBtn = document.getElementById("confirmDeleteButton");
if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", async event => {
        event.stopImmediatePropagation();
        closeModal("deleteModal");

        try {
            await apiRequest("/me", { method: "DELETE" });
            clearSession();
            showToast("Akun berhasil dihapus.");
            setTimeout(() => { window.location.href = "index.html"; }, 800);
        } catch (error) {
            showToast(error.message || "Gagal menghapus akun.");
        }
    }, true);
}
