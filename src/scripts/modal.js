export function modalBg(content) {
    const body = document.querySelector("body");

    const modalBground = document.createElement("section");
    modalBground.classList = "modal__bg";

    const modal = document.createElement("div");
    modal.classList = "modal";

    const figure = document.createElement("figure");
    figure.classList = "closeButton";

    const closeModal = document.createElement("img");
    closeModal.src = "../assets/close-icon.svg";
    closeModal.addEventListener("click", () => modalBground.remove());
    figure.appendChild(closeModal);

    modal.append(figure, content);

    modalBground.appendChild(modal);
    body.insertAdjacentElement("afterbegin", modalBground);
}
