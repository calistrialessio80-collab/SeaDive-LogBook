# SeaDive LogBook

Diario immersioni digitale dal logbook cartaceo `logbook_immersioni.pdf`, con atmosfera marina ispirata a SeaLog.

Apri `index.html` nel browser, oppure dalla cartella del progetto:

```powershell
powershell -File .\serve.ps1
```

Poi vai su http://127.0.0.1:5173/ — i dati restano sul dispositivo (localStorage). Sul telefono in Wi‑Fi usa l’indirizzo LAN stampato dallo script.

## Telefono senza PC, Bluetooth, Drive

- **Android Chrome:** schermata Computer → Scarica via Bluetooth (EON Core / Steel / D5). Il computer deve essere sbloccato e vicino.
- **iPhone:** Safari non consente il Bluetooth alle app web. Dall’app Suunto: sincronizza → Condividi UDDF → apri in SeaDive. Resta tutto sul telefono.
- **Google Drive:** Profilo → Client ID OAuth web + Collega Drive. I backup vanno nella cartella nascosta dell’app (`appDataFolder`), uno per account Google.

## Telefono, amici e backup

L’app è una PWA: ogni telefono ha un diario proprio. Installa dalla Home (Safari/Chrome), poi in **Profilo** salva il file `.json` su iCloud o Google Drive. Se cambi telefono, apri SeaDive e **Ripristina da backup**. Non condividere quel file se non vuoi copiare le immersioni.

## Cosa include

- Profilo subacqueo, brevetti, emergenza, attrezzatura e “se lo trovi restituisci a”
- Schede immersione con tutti i campi del cartaceo
- Profilo di profondità disegnabile
- Tipi (riva, barca, notturna, relitto…) e stelle per le sensazioni
- Collezione specie / avvistamenti
- Foto, firme buddy e guida
- Riepilogo (totali, profondità max, tempo di fondo, tabella)
- Esporta / importa backup JSON
- Import dal computer subacqueo (Suunto EON Core, Shearwater, Garmin, Mares, Cressi, Scubapro…): UDDF, XML Suunto, CSV
- Esempio: `examples/suunto-eon-core.uddf`
- Tre immersioni di esempio da sostituire con le tue

## Suunto EON Core

1. Sincronizza l’EON Core con l’app Suunto (Bluetooth).
2. Esporta o condividi le immersioni in UDDF o XML.
3. In SeaDive apri **Computer** e importa il file.

Il browser può riconoscere il computer via Web Bluetooth, ma il log dell’EON Core è un protocollo proprietario: il file resta il canale affidabile, come per SeaLog con i dump UDDF.
