const loginButton = document.getElementById("submit");
const getDataError = document.querySelector(".getDataError");
const getToken = document.querySelector(".getToken");

//Envoi des login et password de connexion au serveur
loginButton.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginData = {
        email: email,
        password: password
    };

    const promise = fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(loginData)
    });

    const responseLogin = promise.then((response) => {
        return response.json();
    });

    responseLogin.then((data) => {
        if (data.token !== undefined) {
            localStorage.setItem("token", data.token);
            document.location.href="index.html";
        } else {
            alert("Erreur dans l'identifiant ou le mot de passe");
        }
    });
});




    








