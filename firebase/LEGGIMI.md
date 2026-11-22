# Registro Community su Firebase

- `firestore.rules`: regole di sicurezza del database. Si copiano nella console Firebase (Firestore → Regole → Pubblica).
- `rules.test.mjs` + `firebase.json`: prove delle regole sull'emulatore, senza toccare i dati veri:
  `npx firebase emulators:exec --only firestore --project seadive-test "node rules.test.mjs"`
  (servono Node.js, Java e, nella stessa cartella, `npm install firebase-tools @firebase/rules-unit-testing firebase`).

Ognuno è identificato dal codice SeaDive = primi 32 caratteri di SHA-256("seadive|" + id Google):
le regole lo ricalcolano dall'accesso Google, così nessuno scrive a nome di un altro.
