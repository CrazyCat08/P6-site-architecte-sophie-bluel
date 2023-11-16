// Ici on adapte le layout de la page index.html en fonction du
// statut de connexion (connecté ou pas)

const editionBanner = document.querySelector(".edition__banner");
const loginLink = document.getElementById("login-link");
loginLink.style.fontSize = "1.2em";
const goToModal = document.getElementById("goToModal");



// Si le token existe, on fait apparaître la page en mode édition
// Sinon, c'est le mode visiteur
if (localStorage.getItem("token")) {
    editionBanner.style.display = "flex";
    loginLink.innerHTML = "logout";
    goToModal.style.display = "flex";
} else {
    editionBanner.style.display = "none";
    loginLink.innerHTML = "login";
    goToModal.style.display = "none";
}

// Quand on clique sur le lien logout, suppression du token
// pour se déconnecter et quitter le mode édition
loginLink.addEventListener("click", () => {
    if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
    }
});


