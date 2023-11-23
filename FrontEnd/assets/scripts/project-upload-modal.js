import { generateProjects } from "./works.js";
import { generateModalProjects } from "./modal.js";
import { deleteProject } from "./modal.js";


// const inputPhoto = document.querySelector(".js-photo").files[0];
// console.log(inputPhoto);
// const title = document.querySelector(".js-title").value;
// const categoryId = document.querySelector(".js-categoryId").value

const addPicture = document.querySelector(".photo-label");
const photo = document.querySelector(".js-photo");
const title = document.querySelector(".js-title");
const categoryId = document.querySelector(".js-categoryId");

const submitProject = document.querySelector(".js-add-project");

const formPhotoContainer = document.querySelector(".form-photo-container");


// Changement de la couleur du bouton submit ("Valider") 
// quand le formulaire est rempli
photo.addEventListener("change", () => {
    if (photo.value !== "" && title.value !== "" && categoryId.value !== "") {
        submitProject.style.background = '#1D6154';
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

// Aperçu de la photo avant la validation de l'ajout de projet
photo.addEventListener("change", () => {
    let file = photo.files[0];
    formPhotoContainer.style.background = "center / contain no-repeat url(" + URL.createObjectURL(file) + ")";
    
    document.querySelector(".fa-image").style.display = "none";
    document.querySelector(".photo-label").style.display = "none";
    document.querySelector(".upload-specs").style.display = "none";
});



// Envoi du formulaire d'ajout de projet (Valider)

submitProject.addEventListener("click", addProject);

  
// Ajout d'un projet
async function addProject(event) {
    event.preventDefault(); 
    
    if (photo === undefined || title === "" || categoryId === "") {
        alert("Tous les champs doivent être complétés");
        return;
    } else if (categoryId !== "1" && categoryId !== "2" && categoryId !== "3") {
        alert("Veuillez choisir une catégorie valide");
        return;
    } else {
        try {
            const formData = new FormData();
            formData.append("image", photo.files[0]);
            formData.append("title", title.value);
            formData.append("category", categoryId.value);

            const responseAddProject = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: { Authorization: "Bearer " + localStorage.getItem("token")},
                body: formData
            });

            if (responseAddProject.status === 201) {
                alert("Projet ajouté avec succès!");
                // Rechargement dynamique des projets
                const updateProjects = async () => {
                    let responseProjects = await fetch('http://localhost:5678/api/works/');
                    let projects = await responseProjects.json();
                    generateProjects(projects);
                    generateModalProjects(projects);       
                    deleteProject();
                }
                updateProjects();
                //Reset du formulaire d'ajout de photo
                document.querySelector(".modal-project-form").reset()
                document.querySelector(".form-photo-container").style.background = "#E8F1F6";
                document.querySelector(".fa-image").style.display = "block";
                document.querySelector(".photo-label").style.display = "flex";
                document.querySelector(".upload-specs").style.display = "block";
                let image = document.getElementById("photo");
                if (image.files && ImageBitmap.files[0]) {
                    image.files[0] = null;
                }
            }
        } catch(error) {
            console.error(error);
        }
    }
}




        // if (response.status === 201) {      
        
        //     // Reset du formulaire d'ajout de projet
        //     document.querySelector(".modal-project-form").reset()
        //     document.querySelector(".form-photo-container").style.background = "#E8F1F6";
        //     document.querySelector(".fa-image").style.display = "flex";
        //     document.querySelector(".photo-label").style.display = "flex";
        //     document.querySelector(".upload-specs").style.display = "flex";
        //     let photo = document.getElementById("photo");
        //     if (photo.files && photo.files[0]) {
        //            photo.files[0] = null;
        //     }
        // }
        
