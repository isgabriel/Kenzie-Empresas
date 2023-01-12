import { postRegister } from "./requests.js";

// Redirecionar por botões do header
function redirectPagesRegister() {
    const login = document.querySelector(".loginBtn");
    login.addEventListener("click", () => {
        window.location.replace("./login.html");
    });

    const home = document.getElementsByClassName("homeBtn");
    const homeIndex = [...home];
    homeIndex.forEach((element) => {
        element.addEventListener("click", () => {
            window.location.replace("../../index.html");
        });
    });
}

redirectPagesRegister();

async function eventRegister() {
    const form = document.querySelector(".register-form");

    const elements = [...form];

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const body = {};

        elements.forEach((element) => {
            if (
                element.tagName === "INPUT" ||
                (element.tagName === "SELECT" && element.value != "")
            ) {
                body[element.name] = element.value;
            }
        });

        await postRegister(body);
    });
}

eventRegister();
