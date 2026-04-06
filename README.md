<p align="center">
<img width="200" src="./assets/logo_1801grv.png">
</p>

## ℹ️ website-1801grv

**Live Demo:** https://albertofardin.github.io/website-1801grv/

Questo sito raccoglie le illustrazioni dei personaggi della campagna LARP , per avere sempre a portata di mano volti e nomi tra un evento e l’altro. Non è il sito ufficiale della campagna (che fornisce ambientazione e regolamento), ma serve da supporto visivo per i partecipanti.

## 📝 Istruzioni per l’uso in locale

1. Posizionati nella cartella del progetto.
2. Installa il server statico:
   ```bash
   npm install -g serve
   ```
3. Avvia il server:
   ```bash
   serve -l 8080
   ```
4. Apri il browser all’indirizzo:
   ```
   http://localhost:8080/
   ```

## 📁 Gestione dei Regni tramite JSON

La sezione Kingdoms è completamente data-driven: ogni regno è definito tramite un file JSON dedicato all’interno della cartella /kingdoms. Questo approccio permette di separare i dati dalla logica, rendendo il sistema più scalabile e facile da mantenere.

Ogni file rappresenta un singolo regno che contiene tutte le informazioni necessarie alla renderizzazione del pannello informativo con tutti i relativi personaggi.

I file JSON vengono caricati dinamicamente tramite fetch() all’avvio dell’applicazione e aggregati in un oggetto KINGDOMS utilizzato per popolare l’interfaccia. In questo modo i pannelli informativi di ogni regno non sono già cablati nell'HTML ma vengono creati al volo solo al click dell'utente per avere una interfaccia più snella e veloce.

Vantaggi

- Separazione tra contenuto e codice
- Facilità di aggiornamento senza modificare l’HTML
- Possibilità di aggiungere nuovi regni semplicemente creando un nuovo file JSON
- Base pronta per integrazione con CMS o backend futuri
