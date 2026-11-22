import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { doc, setDoc, updateDoc, getDoc, deleteDoc, serverTimestamp, collection, getDocs } from "firebase/firestore";
import { readFileSync } from "fs";
import { createHash } from "crypto";

const code = (sub) => createHash("sha256").update("seadive|" + sub).digest("hex").slice(0, 32);
const ANNA = code("sub-anna"), BRUNO = code("sub-bruno"), EVA = code("sub-eva");
const env = await initializeTestEnvironment({ projectId: "seadive-test", firestore: { rules: readFileSync("firestore.rules", "utf8"), host: "127.0.0.1", port: 8085 } });
const as = (sub) => env.authenticatedContext("uid-" + sub, { firebase: { sign_in_provider: "google.com", identities: { "google.com": [sub] } } }).firestore();
const anna = as("sub-anna"), bruno = as("sub-bruno"), eva = as("sub-eva");
const anon = env.unauthenticatedContext().firestore();
const [L, R] = [ANNA, BRUNO].sort(); const PAIR = L + "~" + R;
const annaSide = L === ANNA ? "left" : "right", brunoSide = annaSide === "left" ? "right" : "left";

let pass = 0, fail = 0;
async function t(name, p) { try { await p; pass++; console.log("ok  ", name); } catch (e) { fail++; console.log("FAIL", name, String(e.message || e).slice(0, 160)); } }

const prof = (c, extra = {}) => ({ id: c, owner: c, at: "2026-11-22T10:00:00Z", firstName: "Anna", lastName: "Test", name: "Anna Test", key: "anna-test", portrait: "data:image/jpeg;base64,AAAA", pub: { x: "abc", y: "def" }, ...extra });

// Profili
await t("anna scrive il suo profilo", assertSucceeds(setDoc(doc(anna, "profiles", ANNA), prof(ANNA))));
await t("bruno NON scrive il profilo di anna", assertFails(setDoc(doc(bruno, "profiles", ANNA), prof(ANNA, { name: "Finto" }))));
await t("anna NON mette il brevetto nel profilo", assertFails(setDoc(doc(anna, "profiles", ANNA), prof(ANNA, { cert: "123" }))));
await t("anna NON usa un owner diverso", assertFails(setDoc(doc(anna, "profiles", ANNA), prof(ANNA, { owner: BRUNO }))));
await t("chi non ha fatto l'accesso NON legge", assertFails(getDoc(doc(anon, "profiles", ANNA))));
await t("bruno legge il profilo di anna", assertSucceeds(getDoc(doc(bruno, "profiles", ANNA))));
await t("bruno NON cancella il profilo di anna", assertFails(deleteDoc(doc(bruno, "profiles", ANNA))));
await t("foto troppo grande rifiutata", assertFails(setDoc(doc(anna, "profiles", ANNA), prof(ANNA, { portrait: "x".repeat(13000) }))));

// Collegamenti
const base = { pair: PAIR, left: L, right: R };
await t("anna crea il collegamento col suo Segui", assertSucceeds(setDoc(doc(anna, "links", PAIR), { ...base, [annaSide + "Follows"]: true }, { merge: true })));
await t("eva (estranea) NON tocca il collegamento", assertFails(setDoc(doc(eva, "links", PAIR), { [annaSide + "Follows"]: false }, { merge: true })));
await t("bruno NON cambia il Segui di anna", assertFails(setDoc(doc(bruno, "links", PAIR), { [annaSide + "Follows"]: false }, { merge: true })));
await t("bruno mette il suo Segui", assertSucceeds(setDoc(doc(bruno, "links", PAIR), { [brunoSide + "Follows"]: true, [brunoSide + "Name"]: "Bruno Prova", [brunoSide + "Box"]: { v: 1, iv: "aaa", ct: "bbb", from: "x", to: "y" } }, { merge: true })));
await t("anna mette nome e busta sul suo lato", assertSucceeds(setDoc(doc(anna, "links", PAIR), { [annaSide + "Name"]: "Anna Test", [annaSide + "Box"]: { v: 1, iv: "c", ct: "d", from: "x", to: "y" } }, { merge: true })));
const row = (await getDoc(doc(bruno, "links", PAIR))).data();
await t("dopo le due scritture vi seguite", (row.leftFollows && row.rightFollows) ? Promise.resolve() : Promise.reject(new Error(JSON.stringify(row))));
await t("collegamento con chiave sbagliata rifiutato", assertFails(setDoc(doc(anna, "links", "zzz"), { ...base, [annaSide + "Follows"]: true })));
const [L2, R2] = [ANNA, EVA].sort();
await t("anna NON crea un collegamento col Segui di eva già messo", assertFails(setDoc(doc(anna, "links", L2 + "~" + R2), { pair: L2 + "~" + R2, left: L2, right: R2, leftFollows: true, rightFollows: true })));
await t("anna toglie il suo Segui", assertSucceeds(updateDoc(doc(anna, "links", PAIR), { [annaSide + "Follows"]: false })));

// Messaggi
const msg = (id, from, extra = {}) => ({ _id: id, v: 2, thread: "dm:" + PAIR, with: PAIR, from, name: "Anna Test", boxes: { [BRUNO]: { iv: "a", ct: "b" } }, at: "2026-11-22T10:00:00Z", kind: "dm", ts: serverTimestamp(), ...extra });
await t("anna scrive un messaggio a suo nome", assertSucceeds(setDoc(doc(anna, "messages", "abc12345"), msg("abc12345", ANNA))));
await t("bruno NON scrive a nome di anna", assertFails(setDoc(doc(bruno, "messages", "abc12346"), msg("abc12346", ANNA))));
await t("messaggio NON modificabile", assertFails(setDoc(doc(anna, "messages", "abc12345"), msg("abc12345", ANNA, { name: "x" }))));
await t("bruno NON cancella il messaggio di anna", assertFails(deleteDoc(doc(bruno, "messages", "abc12345"))));
await t("ora finta rifiutata", assertFails(setDoc(doc(anna, "messages", "abc12347"), msg("abc12347", ANNA, { ts: new Date(0) }))));
await t("bruno legge i messaggi", assertSucceeds(getDocs(collection(bruno, "messages"))));
await t("anna cancella il suo messaggio", assertSucceeds(deleteDoc(doc(anna, "messages", "abc12345"))));

// Voti
await t("anna vota 5", assertSucceeds(setDoc(doc(anna, "ratings", ANNA), { stars: 5, at: "2026-11-22" })));
await t("voto 9 rifiutato", assertFails(setDoc(doc(anna, "ratings", ANNA), { stars: 9, at: "2026-11-22" })));
await t("bruno NON vota per anna", assertFails(setDoc(doc(bruno, "ratings", ANNA), { stars: 1, at: "2026-11-22" })));

// Altro
await t("raccolte sconosciute chiuse", assertFails(setDoc(doc(anna, "altro", "x"), { a: 1 })));
await t("anna esce: cancella il collegamento", assertSucceeds(deleteDoc(doc(anna, "links", PAIR))));

console.log(`\n${pass} ok, ${fail} falliti`);
await env.cleanup();
process.exit(fail ? 1 : 0);
