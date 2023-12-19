// Récupération des catégories de projets depuis l'API
async function getCategories () {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error(
            "Problème lors de la récupération des catégories:", error);
    }
};

// Récupération des projets depuis l'API
async function getProjects () {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const projects = await response.json();
        return projects;
    } catch (error) {
        console.error(
            "Problème lors de la récupération des projets:", error);
    }
};
 
async function displayFiltersAndProjects() {
    const categories = await getCategories ();
    const projects = await getProjects ();
    generateFilters(categories);
    generateProjects(projects);
    filterProjectsByCategory(projects, categories);
}

displayFiltersAndProjects();

// Affichage dynamique des projets sur la homepage
function generateProjects(projects) {
    // Récupération de l'élément du DOM (div "gallery") qui accueillera les projets
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; 
    
    projects.forEach((project) => {
        const figure = document.createElement("figure");
        gallery.appendChild(figure);

        const img = document.createElement("img");
        img.src = project.imageUrl;
        img.alt = project.title;
        figure.appendChild(img);

        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = project.title;
        figure.appendChild(figcaption);
    });
}

//Création et affichage dynamique des boutons de filtres

function generateFilters (categories) {
    // Récupération de l'élément du DOM (div "filters") qui accueillera les boutons de filtre
    const filterDiv = document.querySelector(".filters");
    filterDiv.innerHTML = "";

    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("filter__btn", "all__btn", "filter__btn--active");
    filterDiv.appendChild(allButton);

    categories.forEach((category) => {
        const categoryButton = document.createElement("button");
        categoryButton.textContent = category.name;
        categoryButton.classList.add("filter__btn", "category__btn");
        filterDiv.appendChild(categoryButton);
    });

};

// Filtrage des projets par catégorie

function filterProjectsByCategory(projects, categories) {
    const filterButtons = document.querySelectorAll(".filter__btn");
    const allButton = document.querySelector(".all__btn");
    const categoryButtons = document.querySelectorAll(".category__btn");
    const gallery = document.querySelector(".gallery");

    allButton.addEventListener("click", () => {
        filterButtons.forEach((button) => {
            button.classList.remove("filter__btn--active");
        });
 
        allButton.classList.add("filter__btn--active");
    
        gallery.innerHTML = "";
        generateProjects(projects);
    });

    categoryButtons.forEach((button) => {
        button.addEventListener("click", function () {
            filterButtons.forEach((button) => {
                button.classList.remove("filter__btn--active");
            });
            
            button.classList.add("filter__btn--active");
            
            const buttonName = button.textContent;
            const filteredProjects = projects.filter((project) => {
                return project.category.name === buttonName;
            });

            gallery.innerHTML = "";
            generateProjects(filteredProjects); 

        })
        
    });
    
};


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
    
    deleteProject ();

    async function deleteProject () {
        const deleteButtons = document.querySelectorAll(".js-trash-div");
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
                        generateProjects(projects);
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
document.addEventListener('DOMContentLoaded', () => {
    // Récupération de l'élément bouton qui permet d'ouvrir la modale
    const openModalButton = document.getElementById("goToModal");
    // Récupération de la modale
    const modal = document.querySelector(".modal");
    // Récupération de l'élément qui permet de fermer la modale
    // const closeModalButton = document.querySelector(".js-modal-close");
    const closeModalButton = document.querySelector(".fa-xmark");
    const modalWrapper = document.querySelector(".modal-wrapper");
    const projectModalWrapper = document.getElementById("projectModalWrapper");
    // Récupération du bouton "ajouter une photo"
    const addPhotoButton = document.querySelector(".open-projectModal");
    // Flèche "retour sur la modale gallerie"
    // const goBackToGallery = document.querySelector(".js-modal-goback");
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

});


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

// Changement de la couleur du bouton submit ("Valider") 
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
    console.log("champ photo: ", photo.files[0]);
    console.log("champ titre: ", title.value);
    console.log("champ catégorie: ", categoryId.value);

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
                let responseProjects = await fetch('http://localhost:5678/api/works/');
                let projects = await responseProjects.json();
                generateProjects(projects);
                generateModalProjects(projects);       
            }
            updateProjects();
            //Reset du formulaire d'ajout de photo
            document.querySelector(".modal-project-form").reset()
            document.querySelector(".form-photo-container").style.background = "#E8F1F6";
            document.querySelector(".fa-image").style.display = "block";
            document.querySelector(".photo-label").style.display = "flex";
            document.querySelector(".upload-specs").style.display = "block";
            let image = document.querySelector(".js-photo");
            console.log("image: ", image);
            if (image.files[0] && ImageBitmap.files[0]) {
                image.files[0] = null;
            }
        }
        else {
            alert("Echec de l'ajout du projet. Erreur: ", responseAddProject.status);
        }
    })
});

  

