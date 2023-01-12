// Abrir menu mobile
function openMenuPages() {
    const navBar = document.querySelector(".navbar");
    const btnMenu = document.querySelector(".navbar__menuMobile");
    const divBtns = document.querySelector(".btn__div");
    // ../../src/assets/menu-mobile.svg (caminho da imagem que deve ser alterada com  click)

    btnMenu.src = "../../src/assets/menu-mobile.svg";
    btnMenu.addEventListener("click", () => {
        btnMenu.classList.toggle("closeIcon");
        if (btnMenu.classList.contains("closeIcon")) {
            btnMenu.src = "../../src/assets/close-icon.svg";
        } else {
            btnMenu.src = "../../src/assets/menu-mobile.svg";
        }
        navBar.classList.toggle("changeNav");
        divBtns.classList.toggle("openMenuBtn");
    });
}
openMenuPages();
