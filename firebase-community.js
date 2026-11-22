/* Registro Community su Firebase (Firestore + accesso Google), al posto di Pantry.
   - Ognuno scrive solo le sue cose: lo controllano le regole in firebase/firestore.rules.
   - Profili, "Segui", messaggi e voti arrivano in tempo reale (ascolto continuo), e restano in una copia
     sul telefono: la Community si apre subito anche con poco segnale.
   - Le scritture fatte senza rete restano in coda sul telefono e partono appena torna la connessione.
   Le librerie si caricano da gstatic.com solo quando serve la Community. */
(function () {
  const FB_VERSION = "13.4.0";
  const MESSAGE_WINDOW = 300;

  let mods = null;
  let app = null;
  let auth = null;
  let db = null;
  let loading = null;
  let liveOn = false;
  const live = {
    profiles: new Map(),
    links: new Map(),
    messages: new Map(),
    ratings: new Map(),
    ready: { profiles: false, links: false, messages: false, ratings: false },
    waiters: [],
    unsub: [],
  };
  const listeners = new Set();

  function config() {
    return window.SEADIVE_FIREBASE && window.SEADIVE_FIREBASE.projectId ? window.SEADIVE_FIREBASE : null;
  }

  function enabled() {
    return Boolean(config());
  }

  async function load() {
    if (loading) return loading;
    loading = (async () => {
      const base = `https://www.gstatic.com/firebasejs/${FB_VERSION}/`;
      const [a, au, fs] = await Promise.all([
        import(base + "firebase-app.js"),
        import(base + "firebase-auth.js"),
        import(base + "firebase-firestore.js"),
      ]);
      mods = { a, au, fs };
      app = a.initializeApp(config(), "seadive-community");
      auth = au.initializeAuth(app, { persistence: [au.indexedDBLocalPersistence, au.browserLocalPersistence] });
      let cache;
      try {
        cache = fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() });
      } catch {
        cache = fs.memoryLocalCache();
      }
      db = fs.initializeFirestore(app, { localCache: cache });
      if (window.SEADIVE_FB_EMULATOR) {
        au.connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
        fs.connectFirestoreEmulator(db, "127.0.0.1", 8085);
      }
      await auth.authStateReady();
    })().catch((err) => {
      loading = null;
      throw err;
    });
    return loading;
  }

  function googleSub(user) {
    return user?.providerData?.find((p) => p.providerId === "google.com")?.uid || "";
  }

  // Collegato a Firebase con lo stesso account Google dell'app?
  async function signedInAs(sub) {
    if (!enabled() || !sub) return false;
    await load();
    return Boolean(auth.currentUser) && googleSub(auth.currentUser) === sub;
  }

  /* Accesso: usa il permesso Google che l'app ha già (nessuna seconda finestra).
     Firebase poi tiene l'accesso da solo, anche dopo che il permesso Google è scaduto. */
  async function signIn(sub, accessToken) {
    if (!enabled()) throw new Error("community-off");
    await load();
    if (await signedInAs(sub)) return true;
    if (auth.currentUser) await mods.au.signOut(auth);
    if (!accessToken && !window.SEADIVE_FB_EMULATOR) throw new Error("community-auth");
    const cred = window.SEADIVE_FB_EMULATOR
      ? mods.au.GoogleAuthProvider.credential(JSON.stringify({ sub, email: `${sub}@prova.local`, email_verified: true }))
      : mods.au.GoogleAuthProvider.credential(null, accessToken);
    const res = await mods.au.signInWithCredential(auth, cred);
    if (googleSub(res.user) !== sub) {
      await mods.au.signOut(auth);
      throw new Error("community-account");
    }
    startLive();
    return true;
  }

  async function signOut() {
    stopLive();
    if (!loading) return;
    await load().catch(() => null);
    if (auth?.currentUser) await mods.au.signOut(auth).catch(() => null);
  }

  function notify(kind) {
    listeners.forEach((fn) => {
      try {
        fn(kind);
      } catch {
        /* chi ascolta non deve fermare gli altri */
      }
    });
  }

  function markReady(kind) {
    live.ready[kind] = true;
    live.waiters = live.waiters.filter((w) => {
      if (w.kinds.every((k) => live.ready[k])) {
        w.resolve();
        return false;
      }
      return true;
    });
  }

  function plain(snap) {
    const data = snap.data({ serverTimestamps: "estimate" }) || {};
    if (data.ts && typeof data.ts.toMillis === "function") data.ts = data.ts.toMillis();
    return data;
  }

  function follow(kind, ref, map) {
    const fail = () => {
      // Senza permesso (accesso scaduto o tolto) si ferma tutto: al prossimo accesso riparte.
      stopLive();
      notify("auth");
    };
    live.unsub.push(
      mods.fs.onSnapshot(
        ref,
        { includeMetadataChanges: false },
        (qs) => {
          qs.docChanges().forEach((ch) => {
            if (ch.type === "removed") map.delete(ch.doc.id);
            else map.set(ch.doc.id, plain(ch.doc));
          });
          markReady(kind);
          notify(kind);
        },
        fail
      )
    );
  }

  function startLive() {
    if (liveOn || !db) return;
    liveOn = true;
    const fs = mods.fs;
    follow("profiles", fs.collection(db, "profiles"), live.profiles);
    follow("links", fs.collection(db, "links"), live.links);
    follow("ratings", fs.collection(db, "ratings"), live.ratings);
    follow("messages", fs.query(fs.collection(db, "messages"), fs.orderBy("ts", "desc"), fs.limit(MESSAGE_WINDOW)), live.messages);
  }

  function stopLive() {
    live.unsub.splice(0).forEach((u) => {
      try {
        u();
      } catch {
        /* già fermo */
      }
    });
    liveOn = false;
    Object.keys(live.ready).forEach((k) => {
      live.ready[k] = false;
    });
    live.profiles.clear();
    live.links.clear();
    live.messages.clear();
    live.ratings.clear();
  }

  function waitFor(kinds, ms = 12000) {
    if (kinds.every((k) => live.ready[k])) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const w = { kinds, resolve };
      live.waiters.push(w);
      setTimeout(() => {
        live.waiters = live.waiters.filter((x) => x !== w);
        reject(new Error("network"));
      }, ms);
    });
  }

  function requireLive() {
    if (!auth?.currentUser) throw new Error("community-auth");
    startLive();
  }

  async function board() {
    await load();
    requireLive();
    await waitFor(["profiles", "messages"]);
    const profiles = {};
    live.profiles.forEach((row, id) => {
      profiles[id] = row;
    });
    const messages = [...live.messages.values()].sort((a, b) => String(a.at || "").localeCompare(String(b.at || "")));
    return { profiles, links: {}, messages };
  }

  async function linkMap() {
    await load();
    requireLive();
    await waitFor(["links"]);
    const out = {};
    live.links.forEach((row, id) => {
      out[row.pair || id] = row;
    });
    return out;
  }

  async function ratings() {
    await load();
    requireLive();
    await waitFor(["ratings"]);
    const votes = {};
    live.ratings.forEach((row, id) => {
      votes[id] = { stars: Number(row.stars) || 0, at: String(row.at || "") };
    });
    return { votes, history: [] };
  }

  // Scrittura: con la rete risponde quando il server l'ha salvata; senza rete resta in coda sul telefono.
  async function write(task) {
    await load();
    requireLive();
    return task(mods.fs);
  }

  function putMessage(msg) {
    return write((fs) => {
      const row = { ...msg, kind: msg.kind === "dm" ? "dm" : "group", ts: fs.serverTimestamp() };
      live.messages.set(msg._id, { ...row, ts: Date.now() });
      const ref = fs.doc(db, "messages", msg._id);
      // Un messaggio non si può riscrivere: se c'è già (risposta persa al primo invio) è partito.
      return fs.setDoc(ref, row).catch(async (err) => {
        const there = await fs.getDoc(ref).catch(() => null);
        if (there?.exists() && there.data().from === msg.from) return;
        throw err;
      });
    });
  }

  function putProfile(owner, row) {
    return write((fs) => fs.setDoc(fs.doc(db, "profiles", owner), row));
  }

  function putLinkPart(part) {
    return write((fs) => fs.setDoc(fs.doc(db, "links", part.pair), part, { merge: true }));
  }

  function putRating(owner, stars, at) {
    return write((fs) =>
      stars >= 1
        ? fs.setDoc(fs.doc(db, "ratings", owner), { stars: Math.round(stars), at })
        : fs.deleteDoc(fs.doc(db, "ratings", owner))
    );
  }

  // Uscita dalla Community: si tolgono profilo, messaggi, collegamenti e voto.
  async function leave(owner) {
    return write(async (fs) => {
      const del = [];
      const mine = await fs.getDocs(fs.query(fs.collection(db, "messages"), fs.where("from", "==", owner)));
      mine.forEach((d) => del.push(fs.deleteDoc(d.ref)));
      for (const side of ["left", "right"]) {
        const rows = await fs.getDocs(fs.query(fs.collection(db, "links"), fs.where(side, "==", owner)));
        rows.forEach((d) => del.push(fs.deleteDoc(d.ref)));
      }
      del.push(fs.deleteDoc(fs.doc(db, "profiles", owner)));
      del.push(fs.deleteDoc(fs.doc(db, "ratings", owner)));
      await Promise.all(del);
    });
  }

  /* ---------- Copia privata del diario (vaults/{codice}) ----------
     Ogni parte è salvata come testo JSON: Firestore non accetta tutte le forme di dato del diario
     (per esempio elenchi dentro elenchi nei profili del computer). */
  async function vaultLoad(code) {
    await load();
    if (!auth?.currentUser) throw new Error("community-auth");
    const fs = mods.fs;
    const base = fs.doc(db, "vaults", code);
    const [main, dives, people] = await Promise.all([
      fs.getDoc(base),
      fs.getDocs(fs.collection(base, "dives")),
      fs.getDocs(fs.collection(base, "people")),
    ]);
    const rows = (qs) => qs.docs.map((d) => ({ id: d.id, json: d.data().json, fp: d.data().fp || "" }));
    return {
      main: main.exists() ? { json: main.data().json, fp: main.data().fp || "" } : null,
      dives: rows(dives),
      people: rows(people),
    };
  }

  // Scrive solo le parti cambiate, a gruppi sotto i limiti di Firestore (500 operazioni, ~10 MB).
  async function vaultWrite(code, { main, dives = [], removeDives = [], people = [], removePeople = [] }) {
    await load();
    if (!auth?.currentUser) throw new Error("community-auth");
    const fs = mods.fs;
    const base = fs.doc(db, "vaults", code);
    const at = new Date().toISOString();
    const ops = [];
    if (main) ops.push({ size: main.json.length, run: (b) => b.set(base, { json: main.json, fp: main.fp, at }) });
    dives.forEach((d) => ops.push({ size: d.json.length, run: (b) => b.set(fs.doc(base, "dives", d.id), { json: d.json, fp: d.fp, at }) }));
    people.forEach((p) => ops.push({ size: p.json.length, run: (b) => b.set(fs.doc(base, "people", p.id), { json: p.json, fp: p.fp, at }) }));
    removeDives.forEach((id) => ops.push({ size: 100, run: (b) => b.delete(fs.doc(base, "dives", id)) }));
    removePeople.forEach((id) => ops.push({ size: 100, run: (b) => b.delete(fs.doc(base, "people", id)) }));
    let batch = null;
    let size = 0;
    let count = 0;
    const commits = [];
    for (const op of ops) {
      if (!batch || count >= 400 || size + op.size > 7000000) {
        if (batch) commits.push(batch.commit());
        batch = fs.writeBatch(db);
        size = 0;
        count = 0;
      }
      op.run(batch);
      size += op.size;
      count += 1;
    }
    if (batch) commits.push(batch.commit());
    await Promise.all(commits);
  }

  window.SeaDiveCloud = {
    vaultLoad,
    vaultWrite,
    enabled,
    load,
    signedInAs,
    signIn,
    signOut,
    board,
    linkMap,
    ratings,
    putMessage,
    putProfile,
    putLinkPart,
    putRating,
    leave,
    onChange(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
})();
