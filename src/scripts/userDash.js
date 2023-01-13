import {
    patchEditUser,
    getUserData,
    getCoWork,
    getAllDeps,
    getAllCompanys,
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

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

async function renderUserData() {
    const userDataRequest = await getUserData();

    const userData = document.querySelector(".main__userData");

    const h2 = document.createElement("h2");
    h2.innerText = userDataRequest.username;

    const userFoot = document.createElement("div");
    userFoot.classList.add("userFoot__div");

    const divParags = document.createElement("div");
    divParags.classList.add("userInfos__div");

    const email = document.createElement("p");
    email.innerText = "Email: " + userDataRequest.email;

    const userExp = document.createElement("p");
    if (userDataRequest.professional_level !== null) {
        userExp.innerText = userDataRequest.professional_level.capitalize();
    } else {
        userExp.classList = "hide";
    }

    const kindOfWork = document.createElement("p");
    if (userDataRequest.kind_of_work !== null) {
        kindOfWork.innerText = userDataRequest.kind_of_work.capitalize();
    } else {
        kindOfWork.classList = "hide";
    }

    const divImg = document.createElement("div");
    divImg.classList.add("imgDiv");

    const edit = document.createElement("img");
    edit.src = "../assets/edit-icon-purple.svg";
    edit.id = "edit";

    edit.addEventListener("click", () => {
        modalBg(editUserForm());
    });

    divParags.append(email, userExp, kindOfWork);
    userFoot.append(divParags);
    userData.append(h2, userFoot, edit);
}
renderUserData();

function editUserForm() {
    const title = document.createElement("h2");
    title.innerText = "Editar Perfil";

    const form = document.createElement("form");
    form.classList.add("form__modal");

    const name = document.createElement("input");
    name.placeholder = "Seu nome";

    const email = document.createElement("input");
    email.placeholder = "Seu e-mail";
    email.type = "email";

    const password = document.createElement("input");
    password.placeholder = "Sua senha";
    password.type = "password";

    const button = document.createElement("button");
    button.innerText = "Editar perfil";
    button.type = "submit";
    button.classList.add("purpleBtn", "modal__btn--edit");

    let body = {};

    button.addEventListener("click", async (e) => {
        // e.preventDefault();

        body = {
            username: name.value,
            email: email.value,
            password: password.value,
        };

        await patchEditUser(body);
    });

    form.append(title, name, email, password, button);
    return form;
}

async function renderUserCoWork() {
    const userData = await getUserData();
    const coWorks = await getCoWork();
    const allCompanies = await getAllCompanys();
    const allDeps = await getAllDeps();

    const employeeData = document.querySelector(".main__employeeData");
    if (userData.department_uuid !== null) {
        const findDepName = await allDeps.departments.find(
            (element) => element.uuid === userData.department_uuid
        );

        const allCompaniesFind = allCompanies.find(
            (element) => element.uuid === findDepName.company_uuid
        );

        employeeData.innerHTML = "";

        const h2 = document.createElement("h2");
        h2.classList.add("main__employeeData--title");
        h2.innerText = `${allCompaniesFind.name} - ${findDepName.name}`;

        const ul = document.createElement("ul");
        ul.classList.add("list__employees");

        coWorks[0].users.forEach((element) => {
            const li = document.createElement("li");
            li.classList.add("list__item");

            const h3 = document.createElement("h3");
            h3.innerText = element.username;

            const p = document.createElement("p");
            p.innerText = findDepName.name;

            li.append(h3, p);
            ul.appendChild(li);
        });

        employeeData.append(h2, ul);
    } else {
        const p = document.createElement("p");
        p.innerText = "Você ainda não foi contratado";
        employeeData.classList = "notHired";
        employeeData.appendChild(p);
    }
}
renderUserCoWork();
