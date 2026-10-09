/* Incolla il Client ID Google (Applicazione web) tra le virgolette. */
window.SEADIVE_GOOGLE_CLIENT_ID = window.SEADIVE_GOOGLE_CLIENT_ID || "281185517573-dspugb9fsrmi1qhktd7an8l8grmrtvo3.apps.googleusercontent.com";

/* Chiave Maps JavaScript API (stesso progetto Google). Attiva “Maps JavaScript API”. */
window.SEADIVE_GOOGLE_MAPS_KEY = window.SEADIVE_GOOGLE_MAPS_KEY || "";

window.SEADIVE_OAUTH = {
  google: {
    authorize: "https://accounts.google.com/o/oauth2/v2/auth",
    signup: "https://accounts.google.com/signup",
    userinfo: "https://www.googleapis.com/oauth2/v3/userinfo",
    scope: "openid email profile https://www.googleapis.com/auth/drive.appdata",
  },
};
