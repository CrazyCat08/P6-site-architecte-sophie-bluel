import { generateProjects } from "./works.js";

// Récupération de l'élément modale
const modal = document.querySelector(".modal");

// Récupération de l'élément bouton qui permet d'ouvrir la modale
const openModalButton = document.getElementById("goToModal");

// Récupération de l'élément bouton qui permet de fermer la modale
let closeModalButton = document.querySelector(".js-modal-close");
 

// Récupération de l'élément modal wrapper
const modalWrapper = document.querySelector(".modal-wrapper");

// Récupération de l'élément project modal wrapper
const projectModalWrapper = document.querySelector(".project-modal-wrapper")


// Ajout d'un EventListener sur le bouton "ouverture modale"
openModalButton.addEventListener("click", (event) => {
    event.preventDefault();
    modal.style.display = "flex";
    modalWrapper.style.display = "flex";
    projectModalWrapper.style.display = "none";
});

// Ajout d'un EventListener sur le bouton "fermeture modale"
closeModalButton.addEventListener("click", (event) => {
    event.preventDefault();
    modal.style.display = "none";
});

// Ajout d'un EventListener pour fermer la modale si on clique
// en dehors
modal.addEventListener("click", (event) => {
    event.preventDefault();
    if ((!event.target.closest(".modal-wrapper") 
        && !event.target.closest(".project-modal-wrapper")) ) {
        modal.style.display = "none";
    }
});

// Ajout d'un event listener sur la touche Escape pour fermer la modale
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        modal.style.display = "none";
    }
});


// Récupération des projets depuis l'API
const response = await fetch("http://localhost:5678/api/works");
// Transformation de response en liste d'objets
const projects = await response.json();
// Transformation des projets en JSON
const valueProjects = JSON.stringify(projects);
// Stockage des informations dans le localStorage
window.localStorage.setItem("projects", valueProjects);

// Génération dynamique de tous les projets dans la modale
export function generateModalProjects(projects){
    const modalGallery = document.querySelector(".js-projects-admin");
    modalGallery.innerHTML = "";
    for (let i = 0; i < projects.length; i++) {
        // Création de la div qui va contenir le projet
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("js-project-div");
        modalGallery.appendChild(projectDiv);

        const img = document.createElement("img");
        img.src = projects[i].imageUrl;
        img.alt = projects[i].title;
        projectDiv.appendChild(img);

        const iconTrashDiv = document.createElement("div");
        iconTrashDiv.classList.add("js-trash-div");
        iconTrashDiv.setAttribute("id", projects[i].id);
        projectDiv.appendChild(iconTrashDiv);

        const iconTrash = document.createElement("i");
        iconTrash.classList.add("fa-solid");
        iconTrash.classList.add("fa-xs");
        iconTrash.classList.add("fa-trash-can");
        iconTrashDiv.appendChild(iconTrash);
    }
};

generateModalProjects(projects);



// Récupération du token
const token = localStorage.getItem("token");
console.log(token);


// Ajout fonctionnalité de suppression de photo

export function deleteProject () {
    const deleteButtons = document.querySelectorAll(".js-trash-div");
    deleteButtons.forEach(button => {
        button.addEventListener("click", async () => {
            let id = button.getAttribute("id");
            fetch (`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })
            .then(async (response) => {
                if (response.ok) {
                    const response = await fetch("http://localhost:5678/api/works");
                    const projects = await response.json();
                    // Rafraichissement dynamique de la page d'accueil et de la modale
                    generateProjects(projects);
                    generateModalProjects(projects);
                    deleteProject ();
                    console.log(projects);
                }
                else {
                    alert("Une erreur s'est produite");
                }
            })    
        })
    })
};

deleteProject();



// Ajout d'un EventListener sur le bouton "ajouter photo"
const addPhotoButton = document.querySelector(".open-projectModal");
addPhotoButton.addEventListener("click", (event)=> {
    event.preventDefault();
    // Fermeture de la modale "Gallerie de photo"
    modalWrapper.style.display = "none";
    // Ouverture de la modale "Ajout de photo"
    projectModalWrapper.style.display = "flex"
    
    //Reset du formulaire d'ajout de photo
    document.querySelector(".modal-project-form").reset()
    document.querySelector(".form-photo-container").style.background = "#E8F1F6";
    document.querySelector(".fa-image").style.display = "block";
    document.querySelector(".photo-label").style.display = "flex";
    document.querySelector(".upload-specs").style.display = "block";
    let photo = document.getElementById("photo");
    if (photo.files && photo.files[0]) {
        photo.files[0] = null;
    }
    // récupération de l'élément qui permet de fermer la modale d'ajout de projet
    let closeModalButton2 = document.querySelector(".js-modal-close2");
    // Récupération de l'élément flèche qui permet de revenir à la galerie photo
    let goBackToGallery = document.querySelector(".js-modal-goback")
    // Ajout d'un event listener sur la flèche pour revenir à la galerie photo
    goBackToGallery.addEventListener ("click", (e) => {
        e.preventDefault();
        // Fermeture de la modale "Ajout de photo"
        projectModalWrapper.style.display = "none";
        // Ouverture de la modale "Gallerie de photo"
        modalWrapper.style.display = "flex";
    });
    
    // Fermeture de la modale "Ajout de photo"
    closeModalButton2.addEventListener("click", (event) => {
        event.preventDefault();
        modal.style.display = "none";
    });
});


// Fonction de recherche de l'id de la catégorie
const searchIdCategory = (category) => {
    return fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(catArray => {
        for (let i = 0; i < catArray.length; i++) {
            if (catArray[i].name === category) {
                return catArray[i].id
            }
        }
    })
    .catch(console.error);
}