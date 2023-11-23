// Génération dynamique des projets

// Récupération de l'élément du DOM (div "gallery") qui accueillera les projets
const gallery = document.querySelector(".gallery"); 

//Récupération des projets (works) éventuellement stockés dans le localStorage
let projects = window.localStorage.getItem("projects");

if (projects === null) {
    try {
        // Récupération des projets depuis l'API
        const response = await fetch("http://localhost:5678/api/works");
        // Transformation de response en liste d'objets
        const projects = await response.json();
        // Transformation des projets en JSON
        const valueProjects = JSON.stringify(projects);
        // Stockage des informations dans le localStorage
        window.localStorage.setItem("projects", valueProjects);
    } catch {
        const p = document.createElement("p");
        p.classList.add("error");
        p.innerHTML = "Une erreur est survenue lors de la récupération des projets<br><br>Une tentative de reconnexion automatique auras lieu dans une minute<br><br><br><br>Si le problème persiste, veuillez contacter l'administrateur du site";
        gallery.appendChild(p);
        await new Promise(resolve => setTimeout(resolve, 60000));
        window.location.href = "index.html";
    }
} else {
    projects = JSON.parse(projects);
}

export function generateProjects(projects) {
    // Récupération de l'élément du DOM (div "gallery") qui accueillera les projets
    const gallery = document.querySelector(".gallery"); 
    
    for (let i = 0; i < projects.length; i++) {

        const figure = document.createElement("figure");
        gallery.appendChild(figure);

        const img = document.createElement("img");
        img.src = projects[i].imageUrl;
        img.alt = projects[i].title;
        figure.appendChild(img);

        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = projects[i].title;
        figure.appendChild(figcaption);

    }
    
}

generateProjects(projects);

// Gestion des boutons de filtre sur les projets

const filterButtons = document.querySelectorAll(".filter__btn");

const objetsButton = document.querySelector(".filter__btn-id-1");

objetsButton.addEventListener("click", function () {
    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].classList.remove("filter__btn--active");
    }
    objetsButton.classList.add("filter__btn--active");

    const filteredProjects = projects.filter(function (project) {
        return project.categoryId == 1;
    });     
    document.querySelector(".gallery").innerHTML = "";
    generateProjects(filteredProjects);
});

const appartementsButton = document.querySelector(".filter__btn-id-2");

appartementsButton.addEventListener("click", function () {
    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].classList.remove("filter__btn--active");
    }
    appartementsButton.classList.add("filter__btn--active");

    const filteredProjects = projects.filter(function (project) {
        return project.categoryId == 2;
    });
    document.querySelector(".gallery").innerHTML = "";
    generateProjects(filteredProjects);
});

const hotelsButton = document.querySelector(".filter__btn-id-3");

hotelsButton.addEventListener("click", function () {
    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].classList.remove("filter__btn--active");
    }
    hotelsButton.classList.add("filter__btn--active");

    const filteredProjects = projects.filter(function (project) {
        return project.categoryId == 3;
    });
    document.querySelector(".gallery").innerHTML = "";
    generateProjects(filteredProjects);
});

const tousButton = document.querySelector(".filter__btn-id-def");

tousButton.addEventListener("click", function () {
    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].classList.remove("filter__btn--active");
    }
    tousButton.classList.add("filter__btn--active");

    
    document.querySelector(".gallery").innerHTML = "";
    generateProjects(projects);
});
