// start here

import { getAllCompanys, getAllCompanysSectors } from "./requests.js";

// redirecionar por botões do header
function redirectPages() {
    const login = document.querySelector("#login");

    login.addEventListener("click", () => {
        window.location.replace("src/pages/login.html");
    });

    const register = document.querySelector(".signUpBtn");

    register.addEventListener("click", () => {
        window.location.replace("src/pages/register.html");
    });
}
redirectPages();

// renderiza as empresas da API
async function companysRender() {
    const allCompanys = await getAllCompanys();
    const allSectors = await getAllCompanysSectors();

    let select = document.querySelector("select");

    allSectors.forEach((element) => {
        const option = document.createElement("option");
        option.classList.add("setor__divHeader--title");
        option.value = element.description;
        option.innerText = element.description;
        select.appendChild(option);
    });

    select.addEventListener("change", () => {
        const companyFilter = allCompanys.filter(
            (element) => element.sectors.description === select.value
        );
        if (select.value === "Selecionar Setor" || select.value === "") {
            renderCards(allCompanys);
        } else {
            renderCards(companyFilter);
        }
    });

    renderCards(allCompanys);
}

// renderiza cards
function renderCards(array) {
    const list = document.querySelector(".setor__list");
    list.innerHTML = "";
    array.forEach((element) => {
        let renderCard = cardMaker(element);
        list.appendChild(renderCard);
    });
}

// cria o card
function cardMaker(element) {
    const card = document.createElement("li");
    const divInfos = document.createElement("div");
    const cardTitle = document.createElement("p");
    const subDivInfos = document.createElement("div");
    const openHour = document.createElement("p");
    const sector = document.createElement("span");

    card.classList.add("list__item");
    divInfos.classList.add("divInfos");
    cardTitle.classList.add("divInfos__name");
    subDivInfos.classList.add("subDivInfos");
    openHour.classList.add("subDivInfos__time");
    sector.classList.add("subDivInfos__btn");

    cardTitle.innerText = element.name;
    openHour.innerText = element.opening_hours.slice(1, 2) + " horas";
    sector.innerText = element.sectors.description;

    subDivInfos.append(openHour, sector);
    divInfos.append(cardTitle, subDivInfos);
    card.appendChild(divInfos);

    return card;
}

companysRender();
