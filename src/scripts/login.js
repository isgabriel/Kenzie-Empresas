import { postLogin, getVerifyAdm } from "./requests.js";

// Redirecionar por botões do header
function redirectPagesLogin() {
    const register = document.getElementsByClassName("signUpBtn");
    const registerPage = [...register];
    registerPage.forEach((element) => {
        element.addEventListener("click", () => {
            window.location.replace("./register.html");
        });
    });

    const indexRedirect = document.querySelector(".homeBtn");
    indexRedirect.addEventListener("click", () => {
        window.location.replace("../../index.html");
    });
}

redirectPagesLogin();

async function eventLogin() {
    const form = document.querySelector("#login-form");

    const elements = [...form];
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const body = {};

        elements.forEach((element) => {
            body[element.name] = element.value;
        });

        await postLogin(body);
    });
}

eventLogin();
