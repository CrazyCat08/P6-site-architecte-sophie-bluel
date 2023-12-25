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



  

