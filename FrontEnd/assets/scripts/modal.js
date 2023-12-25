
//*************************************/
//********* Modale ********************/
//*************************************/

// Génération dynamique de tous les projets dans la modale
// generateModalProjects(projects);

function generateModalProjects(projects){
    const modalPortfolio = document.querySelector(".js-projects-admin");
    modalPortfolio.innerHTML = "";
    for (let i = 0; i < projects.length; i++) {
        // Création de la div qui va contenir le projet
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("js-project-div");
        modalPortfolio.appendChild(projectDiv);

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
    
    // Ajout fonctionnalité de suppression de photo
    deleteProject();

    async function deleteProject () {
        const deleteButtons = document.querySelectorAll(".js-trash-div");
        // Récupération du token
        const token = localStorage.getItem("token");

        deleteButtons.forEach(button => {
            button.addEventListener("click", async () => {
                let id = button.getAttribute("id");
                await fetch (`http://localhost:5678/api/works/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                })
                .then(async (response) => {
                    if (response.ok) {
                        let response = await fetch("http://localhost:5678/api/works");
                        let projects = await response.json();
                        alert("Suppression réussie!");
                        // Rafraichissement dynamique de la page d'accueil et de la modale
                        generateModalProjects(projects);
                        displayFiltersAndProjects();
                    }
                    else {
                        alert("Une erreur s'est produite");
                    }
                })
                .catch(error => {
                    console.erreur("Une erreur s'est produite lors de la requête API: ", error);
                });    
            })
        })
    }
};
    



// Gestion des évènements de clicks d'ouverture et fermeture des modales
// et génération dynamique des projets dans la modale

// Récupération de l'élément bouton qui permet d'ouvrir la modale
const openModalButton = document.getElementById("goToModal");
// Récupération de la modale
const modal = document.querySelector(".modal");
// Récupération de l'élément qui permet de fermer la modale
const closeModalButton = document.querySelector(".fa-xmark");
const modalWrapper = document.querySelector(".modal-wrapper");
const projectModalWrapper = document.getElementById("projectModalWrapper");
// Récupération du bouton "ajouter une photo"
const addPhotoButton = document.querySelector(".open-projectModal");
// Flèche "retour sur la modale gallerie"
const goBackToGallery = document.querySelector(".fa-arrow-left");

openModalButton.addEventListener("click", () => {
    modal.style.display = "flex";
});

closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

addPhotoButton.addEventListener("click", () => {
    modalWrapper.style.display = "none";
    projectModalWrapper.style.display = "flex";
    goBackToGallery.style.display = "flex";
});

goBackToGallery.addEventListener("click", () => {
    projectModalWrapper.style.display = "none";
    modalWrapper.style.display = "flex";
});

async function displayProjectsInModal() {
    const projects = await getProjects ();
    generateModalProjects(projects);
}
    
displayProjectsInModal();

// Génération dynamique du choix des catégories dans la modale
// d'ajout de projet
function createCategoryOptions(categories) {
    const categorySelectList = document.querySelector(".js-categoryId");
    categorySelectList.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.label = "Choisir une catégorie";
    categorySelectList.appendChild(defaultOption);

    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelectList.appendChild(option);
    });
};    


async function displayCategorySelection() {
    const categories = await getCategories ();
    createCategoryOptions(categories);
}

displayCategorySelection();


///////////////////////////////
// Ajout d'un nouveau projet //
///////////////////////////////


const addPicture = document.querySelector(".photo-label");
const photo = document.querySelector(".js-photo");
const title = document.querySelector(".js-title");
const categoryId = document.querySelector(".js-categoryId");
const formPhotoContainer = document.querySelector(".form-photo-container");

const submitProject = document.querySelector(".js-add-project");


// Prévisualisation de la photo uploadée
photo.addEventListener("change", () => {
    let file = photo.files[0];
    formPhotoContainer.style.background = "center / contain no-repeat url(" + URL.createObjectURL(file) + ")";
    
    document.querySelector(".fa-image").style.display = "none";
    document.querySelector(".photo-label").style.display = "none";
    document.querySelector(".upload-specs").style.display = "none";

    console.log("fichier téléchargé: ", file)
});

// Le bouton submit ("Valider") devient vert
// quand tous les champs du formulaire sont complétés
photo.addEventListener("change", () => {
    if (photo.value !== "" && title.value !== "" && categoryId.value !== "") {
        submitProject.style.background = "#1D6154";
    }
});
    
title.addEventListener("change", () => {
    if (photo.value !== "" && title.value !== "" && categoryId.value !== "") {
        submitProject.style.background = '#1D6154';
    }
});
    
categoryId.addEventListener("change", () => {
    if (photo.value !== "" && title.value !== "" && categoryId.value !== "") {
        submitProject.style.background = '#1D6154';
    }
});



// Envoi du formulaire d'ajout de projet (Valider)

submitProject.addEventListener("click", async (e) => {
    e.preventDefault(); 

    const image = photo.files[0];
    const titre = title.value;
    const numcat = categoryId.value;

    if (image === undefined || titre === "" || numcat === "") {
        alert("Tous les champs doivent être complétés");
        return;
    }
    
    const formData = new FormData();
    formData.append("image", photo.files[0]);
    formData.append("title", title.value);
    formData.append("category", categoryId.value);

    const responseAddProject = fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: "Bearer " + localStorage.getItem("token")},
        body: formData
    })
    .then((responseAddProject) => {
        if (responseAddProject.status === 201) {
            alert("Projet ajouté avec succès!");
            // Rechargement dynamique des projets
            const updateProjects = async () => {
                let responseProjects = await fetch("http://localhost:5678/api/works/");
                let projects = await responseProjects.json();
                generateModalProjects(projects);       
                displayFiltersAndProjects();
            }
            updateProjects();
            //Reset du formulaire d'ajout de photo
            document.querySelector(".modal-project-form").reset()
            document.querySelector(".form-photo-container").style.background = "#E8F1F6";
            document.querySelector(".fa-image").style.display = "flex";
            document.querySelector(".photo-label").style.display = "flex";
            document.querySelector(".upload-specs").style.display = "flex";
            let image = document.querySelector(".js-photo");
            if (image.files[0]) {
                image.files[0] = null;
            }
            // Le bouton submit "Valider" redevient gris
            submitProject.style.background = "#A7A7A7";
        }
        else {
            alert("Echec de l'ajout du projet. Erreur: ", responseAddProject.status);
        }
    })
});