document.addEventListener("DOMContentLoaded", function () {
    const placeholder = document.getElementById("navbar-placeholder");
    if (!placeholder) return;

    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            placeholder.innerHTML = data;

            // Deteksi nama file halaman aktif
            let currentPage = window.location.pathname.split("/").pop();
            if (!currentPage || currentPage === "") {
                currentPage = "dashboard.html";
            }

            // Beri class 'active' pada menu yang sesuai
            const navLinks = placeholder.querySelectorAll(".nav-item");
            navLinks.forEach(link => {
                if (link.getAttribute("href") === currentPage) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });
        })
        .catch(error => console.error("Gagal memuat navbar:", error));
});