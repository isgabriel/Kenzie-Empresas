import {
    getAllDepartaments,
    getAllEmployees,
    getAllCompanys,
    postCreateDepartament,
    deleteDepartament,
    deleteUser,
    adminEditUser,
    getDepartamentsId,
    getOutOfWork,
    patchHire,
    patchEditDepartament,
    patchDismiss,
} from "./requests.js";
import { modalBg } from "./modal.js";

function logout() {
    const logoutBtn = document.querySelector(".logoutBtn");

    logoutBtn.addEventListener("click", () => {
        localStorage.clear();

        window.location.replace("../../index.html");
    });
}
logout();

const token = JSON.parse(localStorage.getItem("token")) || "";
if (!token) {
    window.location.replace("../../index.html");
}

async function departamentRender() {
    const allDep = await getAllDepartaments();

    const allCompanys = await getAllCompanys();
    const select = document.querySelector("#select");

    allCompanys.forEach((element) => {
        const option = document.createElement("option");
        option.innerText = element.name;
        select.appendChild(option);
    });

    select.addEventListener("change", () => {
        const departmentFilter = allDep.filter(
            (element) => element.companies.name === select.value
        );
        if (select.value === "Selecionar empresas") {
            cardRender(allDep);
        } else {
            cardRender(departmentFilter);
        }
    });

    cardRender(allDep);
}

function cardRender(array) {
    const departamentContainer = document.querySelector(
        ".departament-container"
    );
    departamentContainer.innerHTML = "";

    array.forEach((element) => {
        let cardRender = cardMaker(element);
        departamentContainer.appendChild(cardRender);
    });
}

function cardMaker(element) {
    const card = document.createElement("li");
    card.classList.add("list__item--departDesc");

    const departTitle = document.createElement("h4");
    departTitle.innerText = element.name;

    const departDescription = document.createElement("p");
    departDescription.innerText = element.description;

    const companyName = document.createElement("span");
    companyName.innerText = element.companies.name;

    const figureContainer = document.createElement("figure");
    figureContainer.classList.add("images__container");

    const eyeImg = document.createElement("img");
    eyeImg.src = "../assets/visibility-icon.svg";
    eyeImg.addEventListener("click", async () => {
        modalBg(await hireUserModal(element.companies.uuid));
    });

    const editImg = document.createElement("img");
    editImg.src = "../assets/edit-icon-black.svg";
    editImg.addEventListener("click", () => {
        modalBg(editDepartamentModal(element.uuid, element.description));
    });

    const trashImg = document.createElement("img");
    trashImg.src = "../assets/delete-icon.svg";
    trashImg.addEventListener("click", async () => {
        modalBg(await deleteDepartamentModal(element.name, element.uuid));
    });

    figureContainer.append(eyeImg, editImg, trashImg);
    card.append(departTitle, departDescription, companyName, figureContainer);

    return card;
}

async function hireUserModal(id) {
    let allUsers = await getAllEmployees();
    let departamentsId = await getDepartamentsId();
    let usersOutOfWork = await getOutOfWork();

    const form = document.createElement("form");
    form.classList.add("form__hireUser");

    const title = document.createElement("h2");
    title.innerText = departamentsId[0].name;

    const div1 = document.createElement("div");
    div1.classList.add("hireUser__div1");

    const departamentDescription = document.createElement("h3");
    departamentDescription.innerText = departamentsId[0].description;

    const select = document.createElement("select");

    usersOutOfWork.forEach((element) => {
        const option = document.createElement("option");
        option.innerText = element.username;
        option.value = element.uuid;
        select.appendChild(option);
    });

    div1.append(departamentDescription, select);

    const div2 = document.createElement("div");
    div2.classList.add("hireUser__div2");

    const companyName = document.createElement("p");
    companyName.innerText = departamentsId[0].companies.name;

    const employeeList = document.createElement("ul");
    employeeList.classList.add("employee__list");

    let body = {};

    const allUsersFilter = allUsers.filter(
        (element) =>
            !element.is_admin &&
            element.department_uuid === departamentsId[0].uuid
    );

    const hire = document.createElement("button");
    hire.type = "button";
    hire.innerText = "Contratar";
    hire.addEventListener("click", async (e) => {
        e.preventDefault();

        body = {
            user_uuid: select.value,
            department_uuid: departamentsId[0].uuid,
        };

        await patchHire(body);
        const rr = document.querySelector(".modal__bg");
        rr.remove();
        modalBg(await hireUserModal(id));
    });

    div2.append(companyName, hire);

    test(allUsersFilter);

    function test(elt) {
        employeeList.innerHTML = "";
        const filter2 = elt.filter(
            (element) => element.department_uuid !== null
        );
        filter2.map((element) => {
            const card = document.createElement("li");

            const cardTitle = document.createElement("h3");
            cardTitle.innerText = element.username;

            const userExp = document.createElement("p");
            userExp.innerText = element.professional_level;

            const companieName = document.createElement("span");
            companieName.innerText = departamentsId[0].companies.name;

            const buttonDiv = document.createElement("div");
            buttonDiv.classList.add("item__btnDiv");

            const dismiss = document.createElement("button");
            dismiss.innerText = "Desligar";
            dismiss.type = "submit";
            dismiss.addEventListener("click", async (e) => {
                e.preventDefault();

                element.department_uuid = null;
                await patchDismiss(element.uuid);

                test(allUsersFilter);
            });

            buttonDiv.appendChild(dismiss);
            card.append(cardTitle, userExp, companieName, buttonDiv);
            employeeList.appendChild(card);
        });
    }

    form.append(title, div1, div2, employeeList);

    return form;
}

function editDepartamentModal(id, element) {
    const form = document.createElement("form");
    form.classList.add("form__modal", "form__editUser");

    const title = document.createElement("h2");
    title.innerText = "Editar departamento";

    const textArea = document.createElement("textarea");
    textArea.placeholder = element;
    textArea.rows = "5";

    let body = {};

    const button = document.createElement("button");
    button.innerText = "Salvar alterações";
    button.type = "submit";
    button.addEventListener("click", async () => {
        body = {
            description: textArea.value,
        };

        await patchEditDepartament(id, body);
    });

    form.append(title, textArea, button);
    return form;
}

function deleteDepartamentModal(name, id) {
    const departmentDelete = document.createElement("form");
    departmentDelete.classList.add("delete__department");

    const title = document.createElement("h2");
    title.innerText = `Realmente deseja deletar o departamento ${name} e demitir seus funcionários?`;

    const button = document.createElement("button");
    button.type = "submit";
    button.innerText = "confirmar";
    button.addEventListener("click", async () => {
        await deleteDepartament(id);
    });

    departmentDelete.append(title, button);
    return departmentDelete;
}

async function usersRender() {
    const allUsers = await getAllEmployees();
    const users = allUsers.filter((element) => !element.is_admin);
    cardUserRender(users);
}

function cardUserRender(array) {
    const userContainer = document.querySelector(".list__users");
    userContainer.innerHTML = "";

    array.forEach(async (element) => {
        let cardRender = await cardUserMaker(element);
        userContainer.appendChild(cardRender);
    });
}

async function cardUserMaker(element) {
    const departmentId = await getAllDepartaments();
    const card = document.createElement("li");
    card.classList.add("");

    const userName = document.createElement("h4");
    userName.innerText = element.username;

    const userExp = document.createElement("p");
    userExp.innerText = element.professional_level;

    const userCompany = document.createElement("span");
    if (element.department_uuid === null) {
        userCompany.innerText("Não empregado");
    } else {
        userCompany.id = element.department_uuid;

        let depFind = departmentId.find(
            (element) => element.uuid === userCompany.id
        );
        userCompany.innerText = depFind.companies.name;
    }

    const figureContainer = document.createElement("figure");
    figureContainer.classList.add("");

    const pencilIcon = document.createElement("img");
    pencilIcon.src = "../assets/edit-icon-black.svg";
    pencilIcon.addEventListener("click", async () => {
        modalBg(await editUserModal(element.uuid));
    });

    const trashIcon = document.createElement("img");
    trashIcon.src = "../assets/delete-icon.svg";
    trashIcon.addEventListener("click", async () => {
        modalBg(await deleteUserModal(element.username, element.uuid));
    });

    figureContainer.append(pencilIcon, trashIcon);
    card.append(userName, userExp, userCompany, figureContainer);

    return card;
}

function deleteUserModal(nome, id) {
    const departmentDelete = document.createElement("form");
    departmentDelete.classList.add("");

    const title = document.createElement("h2");
    title.innerText = `Realmente deseja remover o usuário ${nome}?`;

    const button = document.createElement("button");
    button.type = "submit";
    button.innerText = "Deletar";
    button.addEventListener("click", async () => {
        await deleteUser(id);
    });

    departmentDelete.append(title, button);
    return departmentDelete;
}

function editUserModal(id) {
    const form = document.createElement("form");
    form.classList.add("");

    const h2 = document.createElement("h2");
    h2.innerText = "Editar usuário";

    const kindOfWord = document.createElement("select");

    const option0 = document.createElement("option");
    option0.innerText = "Selecionar modalidade de trabalho";
    option0.selected;
    option0.disabled;

    const option1 = document.createElement("option");
    option1.innerText = "home office";
    option1.value = "home office";

    const option2 = document.createElement("option");
    option2.innerText = "hibrido";
    option2.value = "hibrido";

    const option3 = document.createElement("option");
    option3.innerText = "presencial";
    option3.value = "presencial";

    kindOfWord.append(option0, option1, option2, option3);

    const userExp = document.createElement("select");

    const optionZero = document.createElement("option");
    optionZero.innerText = "Selecionar nível profissional";
    optionZero.selected;
    optionZero.disabled;

    const estagio = document.createElement("option");
    estagio.innerHTML = "estágio";
    estagio.value = "estágio";

    const junior = document.createElement("option");
    junior.innerText = "júnior";
    junior.value = "júnior";

    const pleno = document.createElement("option");
    pleno.innerText = "pleno";
    pleno.value = "pleno";

    const senior = document.createElement("option");
    senior.innerText = "sênior";
    senior.value = "sênior";

    userExp.append(optionZero, estagio, junior, pleno, senior);

    const button = document.createElement("button");
    button.innerText = "Editar";
    button.type = "submit";

    let body = {};

    form.addEventListener("submit", async () => {
        body = {
            kind_of_work: kindOfWord.value,
            professional_level: userExp.value,
        };

        await adminEditUser(id, body);
    });

    form.append(h2, kindOfWord, userExp, button);
    return form;
}

async function createDepartament() {
    const createDepForm = await createDepartamentForm();
    const createDepartBtn = document.querySelector("#create-departament");
    createDepartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modalBg(createDepForm);
    });
}

async function createDepartamentForm() {
    const allCompanys = await getAllCompanys();

    const title = document.createElement("h2");
    title.innerText = "Criar departamento";

    const form = document.createElement("form");
    form.classList.add("");

    const departamentName = document.createElement("input");
    departamentName.placeholder = "Nome do departamento";

    const departamentDesc = document.createElement("input");
    departamentDesc.placeholder = "Descrição";

    const select = document.createElement("select");
    select.id = "modal-form-select";

    allCompanys.forEach((element) => {
        const option = document.createElement("option");
        option.innerText = element.name;
        option.value = element.uuid;
        select.appendChild(option);
    });

    let body = {};

    const submitBtn = document.createElement("button");
    submitBtn.innerText = "Criar o departamento";
    submitBtn.type = "submit";
    submitBtn.addEventListener("click", async () => {
        body = {
            name: departamentName.value,
            description: departamentDesc.value,
            company_uuid: select.value,
        };

        await postCreateDepartament(body);
    });

    form.append(title, departamentName, departamentDesc, select, submitBtn);
    return form;
}

createDepartament();

departamentRender();
usersRender();
