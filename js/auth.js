// ID Y KEY del cliente
const CLIENT_ID = "775821347748-lanao4ggabv9a9qjaq7k6lj89ggt1k5p.apps.googleusercontent.com";
const API_KEY = "AIzaSyASHdxYBYKv12hIQonTh9v0mUGzvACjYss";

// URL del documento para Inicio Rápido
const DISCOVERY_DOC = "https://sheets.googleapis.com/$discovery/rest?version=v4";

// Permisos de la Aplicación con respecto a la cuenta
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

let tokenClient;
let gapiInited = false;
let gisInited = false;


loadDom();

function loadDom() {
    document.getElementById("gapi").addEventListener("load", gapiLoaded);
    document.getElementById("gis").addEventListener("load", gisLoaded);
}


document.getElementById("authorize_button").style.visibility = "hidden";
document.getElementById("productos_authorize").style.visibility = "hidden";
document.getElementById("signout_button").style.visibility = "hidden";

/* Ejecutar una vez que este cargado el cliente */
function gapiLoaded() {
    gapi.load("client", initializeGapiClient);
}

/* Inicializar la API */
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/* Servicios de Google */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: ""
    });
    gisInited = true;
    maybeEnableButtons();
}

/* Habilitar la interacción una vez cargadas las librerias */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById("authorize_button").style.visibility = "visible";
    }
}

/* Login una vez el usuario presiona el botón */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw resp;
        }
        document.getElementById("signout_button").style.visibility = "visible";
        document.getElementById("authorize_button").style.visibility = "hidden";
        document.getElementById("productos_authorize").style.visibility = "visible";

        /* Guardamos el Token en el LocalStorage */
        localStorage.setItem('authToken', JSON.stringify(gapi.client.getToken()));

         /* Obtener el perfil del usuario */
        const userInfo = await gapi.client.request({
            'path': 'https://people.googleapis.com/v1/people/me?personFields=emailAddresses',
        });

        const email = userInfo.result.emailAddresses[0].value;
        console.log("Correo del usuario:", email);

        await getProducts();
    };

    if (gapi.client.getToken() === null) {
        /* Solicitar al usuario seleccionar una cuenta de google y 
        el consentimiento para compartir sus datos al iniciar sesión */
        tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
        /* Omitir la visualizacion del selector de la cuenta para una sesión existente */
        tokenClient.requestAccessToken({ prompt: "" });
    }
}


/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken("");
        document.getElementById("authorize_button").style.visibility = "visible";
        document.getElementById("signout_button").style.visibility = "hidden";
        document.getElementById("productos_authorize").style.visibility = "hidden";
    }
}

/*
    Print the names and majors of students in a sample spreadsheet:
    https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
*/

