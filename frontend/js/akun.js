document.addEventListener("DOMContentLoaded", () => {

    lucide.createIcons();

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


        /* Default sections */
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
         * Saat Informasi Akun dipilih,
         * tampilkan desain utama seperti gambar.
         */

        if (section === "informasi") {

            informasi.style.display = "";
            keamanan.style.display = "";
            lainnya.style.display = "";

            notifikasi.classList.remove("show");
            bahasa.classList.remove("show");

            return;
        }


        /*
         * Keamanan
         */

        if (section === "keamanan") {

            informasi.style.display = "none";
            lainnya.style.display = "none";

            keamanan.style.display = "";

            notifikasi.classList.remove("show");
            bahasa.classList.remove("show");

            keamanan.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            return;
        }


        /*
         * Notifikasi
         */

        if (section === "notifikasi") {

            informasi.style.display = "none";
            keamanan.style.display = "none";
            lainnya.style.display = "none";

            notifikasi.classList.add("show");

            bahasa.classList.remove("show");

            return;
        }


        /*
         * Bahasa
         */

        if (section === "bahasa") {

            informasi.style.display = "none";
            keamanan.style.display = "none";
            lainnya.style.display = "none";

            bahasa.classList.add("show");

            notifikasi.classList.remove("show");

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
         * Kalau masih disabled,
         * aktifkan input.
         */

        if (input.disabled) {

            input.disabled = false;

            input.classList.add("editing");

            input.focus();

            /*
             * Select semua text
             */

            input.select();

            button.innerHTML =
                `<i data-lucide="check"></i>`;

            lucide.createIcons();

            return;
        }


        /*
         * Kalau sudah editing,
         * simpan sementara.
         */

        input.disabled = true;

        input.classList.remove("editing");

        button.innerHTML =
            `<i data-lucide="square-pen"></i>`;

        lucide.createIcons();


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

    return text.charAt(0).toUpperCase() + text.slice(1);

}


/* =========================================================
   SAVE CHANGES
========================================================= */

saveButton.addEventListener("click", () => {

    const inputs =
        document.querySelectorAll(".account-input");


    let changed = false;


    inputs.forEach(input => {

        if (!input.disabled) {

            input.disabled = true;

            input.classList.remove("editing");

            changed = true;

        }

    });


    /*
     * Kembalikan semua tombol edit
     */

    editButtons.forEach(button => {

        button.innerHTML =
            `<i data-lucide="square-pen"></i>`;

    });


    lucide.createIcons();


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


/* =========================================================
   SWITCH ACCOUNT
========================================================= */

switchAccountButton.addEventListener(
    "click",
    () => {

        openModal("switchModal");

    }
);


/* =========================================================
   ACCOUNT OPTION
========================================================= */

document
    .querySelectorAll(".account-option")
    .forEach(option => {

        option.addEventListener("click", () => {

            document
                .querySelectorAll(".account-option")
                .forEach(item => {

                    item.classList.remove("active");

                    const check =
                        item.querySelector("svg");

                    if (check) {
                        check.remove();
                    }

                });


            option.classList.add("active");


            /*
             * Tambahkan ikon check
             */

            const icon =
                document.createElement("i");

            icon.setAttribute(
                "data-lucide",
                "check"
            );

            option.appendChild(icon);

            lucide.createIcons();


            const name =
                option.querySelector(
                    ".option-info strong"
                )?.textContent;


            if (name) {

                document.querySelector(
                    ".top-name"
                ).textContent =
                    name.toLowerCase();

            }


            showToast(
                `Beralih ke akun ${name || ""}.`
            );


            setTimeout(() => {

                closeModal("switchModal");

            }, 500);

        });

    });


/* =========================================================
   ADD ACCOUNT
========================================================= */

document
    .getElementById("addAccountButton")
    .addEventListener("click", () => {

        showToast(
            "Fitur tambah akun siap dihubungkan ke sistem login."
        );

    });


/* =========================================================
   CHANGE PASSWORD
========================================================= */

changePasswordButton.addEventListener(
    "click",
    () => {

        openModal("passwordModal");

    }
);


/* =========================================================
   PASSWORD FORM
========================================================= */

passwordForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const oldPassword =
            document.getElementById(
                "oldPassword"
            ).value;


        const newPassword =
            document.getElementById(
                "newPassword"
            ).value;


        const confirmPassword =
            document.getElementById(
                "confirmPassword"
            ).value;


        /*
         * Password lama
         */

        if (!oldPassword) {

            showToast(
                "Masukkan password saat ini."
            );

            return;
        }


        /*
         * Minimal password
         */

        if (newPassword.length < 8) {

            showToast(
                "Password baru minimal 8 karakter."
            );

            return;
        }


        /*
         * Konfirmasi
         */

        if (newPassword !== confirmPassword) {

            showToast(
                "Konfirmasi password tidak cocok."
            );

            return;
        }


        /*
         * Berhasil
         */

        closeModal("passwordModal");

        passwordForm.reset();

        showToast(
            "Password berhasil diperbarui."
        );

    }
);


/* =========================================================
   PASSWORD SHOW / HIDE
========================================================= */

document
    .querySelectorAll(".password-toggle")
    .forEach(button => {

        button.addEventListener("click", () => {

            const targetId =
                button.dataset.target;


            const input =
                document.getElementById(
                    targetId
                );


            if (!input) {
                return;
            }


            if (input.type === "password") {

                input.type = "text";

                button.innerHTML =
                    `<i data-lucide="eye-off"></i>`;

            } else {

                input.type = "password";

                button.innerHTML =
                    `<i data-lucide="eye"></i>`;

            }


            lucide.createIcons();

        });

    });


/* =========================================================
   DELETE ACCOUNT
========================================================= */

deleteAccountButton.addEventListener(
    "click",
    () => {

        openModal("deleteModal");

    }
);


/* =========================================================
   CONFIRM DELETE
========================================================= */

document
    .getElementById("confirmDeleteButton")
    .addEventListener("click", () => {

        closeModal("deleteModal");


        showToast(
            "Permintaan penghapusan akun diproses."
        );

    });


/* =========================================================
   LOGOUT
========================================================= */

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


        /*
         * Kalau sudah mempunyai login.html,
         * bagian ini bisa diaktifkan:
         *
         * window.location.href = "login.html";
         */

    }
);


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

    document.body.style.overflow = "hidden";

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

    document.body.style.overflow = "";

}


/* =========================================================
   CLOSE MODAL BUTTONS
========================================================= */

document
    .querySelectorAll("[data-close-modal]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const modalId =
                button.dataset.closeModal;

            closeModal(modalId);

        });

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

                closeModal(modal.id);

            });

    }
);


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

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


languageSelect.addEventListener(
    "change",
    () => {

        const selected =
            languageSelect.value;


        if (selected === "en") {

            showToast(
                "English dipilih."
            );

        } else {

            showToast(
                "Bahasa Indonesia dipilih."
            );

        }

    }
);


/* =========================================================
   TOP PROFILE BUTTON
========================================================= */

document
    .getElementById("profileMenuButton")
    .addEventListener("click", () => {

        showToast(
            "Profil Yusuf sedang aktif."
        );

    });


/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {
            return;
        }

        /*
         * Bisa digunakan untuk refresh
         * data akun dari backend nanti.
         */

    }
);