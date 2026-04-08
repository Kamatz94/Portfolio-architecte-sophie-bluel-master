// RECUPERATION DES ELEMENTS DU FORMULAIRE DE CONNEXION
let userEmail = document.getElementById("email");
let userPassword = document.getElementById("password");

// MESSAGE D'ERREUR EMAIL ET MOT DE PASSE
const emailError = document.createElement("p");
emailError.innerText = "Erreur dans l’identifiant ou le mot de passe";
const parentToAppend = document.getElementById("loginMessage");

// EVENT AU CLIQUE "SE CONNECTER" AVEC TEST DU TOKEN
const getData = () => {
    document.getElementById("signIn").addEventListener("submit", async (event) => {
        // EVITE LE RECHARGEMENT DE LA PAGE
        event.preventDefault();
        try {
            // RECUPERATION DES VALEURS DES CHAMPS EMAIL ET MOT DE PASSE
            const valueUserEmail = userEmail.value;
            const valueUserPassword = userPassword.value;
            // VERIFICATION DES IDENTIFIANTS VIA API ET RECUPERATION DU TOKEN
            const userToken = await testLogin(valueUserEmail, valueUserPassword);
            if (!userToken) {
                // AFFICHAGE DU MSG D'ERREUR
                parentToAppend.innerHTML = "";
                parentToAppend.appendChild(emailError);
            } else {
                // EFFACE LE CONTENU DE LA DIV MSG ERROR ET REDIRECTION VERS LA PAGE D'ACCUEIL
                parentToAppend.innerHTML = "";
                window.location.href = "index.html";
            }
        } catch (error) {
            console.log(error);
        }
    });
};

getData();

//envoi des information et retour du token si informations correctes
const testLogin = async (valueUserEmail, valueUserPassword) => {
    try {
        // ENVOI DE LA REQUETE A L'API AVEC LES IDENTIFIANTS
        const responseLogin = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            body: JSON.stringify({
                email: valueUserEmail,
                password: valueUserPassword
            }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8",
                //permet de contourner l'erreur CORS
                "Access-Control-Allow-Origin": "*"
            },
        });
        // RECUPERATION DU TOKEN DANS LA REPONSE DE L'API
        const token = await responseLogin.json();
        // STOKAGE DU TOKEN DANS LE SESSIONSTORAGE
        const strigifiedToken = JSON.stringify(token);
        sessionStorage.setItem("token", strigifiedToken);
        // VERIFICATION DU STATUT DE LA REPONSE DE L'API, SI DIFFERENT DE 200 RETOURNE FALSE
        if(responseLogin.status !== 200){
            return false;
        }
        // SI TOUT EST OK RETOURNE LE TOKEN
        return token;
    } catch (err) {
        console.error(err);
    }
};