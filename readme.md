# Front End Stack

## Overview

* Applicazione in angular.js 1.3.20 e materializecss (attraverso angular-materialize)
* Gulp per bundling, minification, creazione della index.html, copia dei file per pacchetto dist, css autoprefixer, linting del codice, watch dei file per l'ambiente di sviluppo, server browsersync per velocizzare i test multi device/browser
* Webpack per il bundling del sorgente javascript e il transpiling
* Redux e seamless-immutables per la gestione di tutti i flussi di prenotazione a FE
* metodo `.component` di angular 1.5 backportato a angular >= 1.3.*

## Avvio

**TL;DR**:
```
npm install
gulp serve
```

**Dettaglio:**

Dopo aver clonato la repository in una cartella, occorre installare le dependency node attraverso il comando `npm install`. Non è invece necessario installare le dependency `bower` poichè, essendo alcuni modificati rispetto al sorgente originale, non sono ignorati da `git`.

Una volta installate le dependencies si può avviare il server locale di dev attraverso il comando `gulp serve`, visitabile a `localhost:3000`. Il server locale è un server `browsersync`, quindi tutte le istanze di browser connesse navigheranno in sincro (utilissimo per tesatre contempoaneamente browser diversi e device diversi). Inoltre gulp, a server avviato, osserva le modifiche ai file, quindi ad ogni modifica le pagine del browser si autorefreshano.


## Sviluppo

Le tipologie di file presenti nel sorgente della app in se sono javascript, scss e html. I file javascript vengono importati staticamente attraverso le funzioni di `import`/`export` di javascript, dove `index.module.js` corrisponde al file root e all'entry point per webpack.

I file scss vengono invece importati automaticamente da gulp attraverso uno scan delle cartelle, non c'è quindi bisogno di preoccuparsene. È comunque presente un file root SCSS (`index.scss`) che viene importato prima degli altri e che include alcune variabili utilizzate negli altri file.

I file html sono invece referenziati nei vari controller/directives/services/factories/routing di angular. Quando si richiama un file bisogna sempre fare riferimenti alla **path relativa dalla root della app, e non del progetto**, quindi per esempio `app/file/to/path`. In fase di compiling gulp si preoccupa di trasformare tutti i file html in stringhe javascript e preparare una `$templateCache` per la app, mantenendo però le path originali.

## Compiling

Per compilare la versione di distribuzione è sufficiente utilizzare il comando `gulp build`. Gulp si preoccupa di compiare i file statici presenti in `assets`, come anche compilare tutti i template html nelle `$templateCache` di angular.

I file javascript e css vengono bundlati e minificati in 4 files: `vendor.js`, `app.js`, `vendor.css` e `app.css`. Ogni build crea nuovi file solo se ci sono state effettivamente delle modifiche nei sorgenti, in questo modo viene velocizzato il processo poichè gran parte delle volte non serve ribuildare i file `vendor`.
La cartella di output è `web`. Dentro alla cartella sono presenti anche file che non centrano con il progetto, come gli assets per le mail che manda il BE oppure il file per il tracking di google. Di fatto così la cartella web è una copia della folder FTP dell'ambiente di produzione.

È possibile chiamare il comando con due flag:

* `--production` farà si che durante il processo di building venga sostituita la stringa delle api da `int.api.ilmiosupereroe.it` a `api.ilmiosupereroe.it`, quindi di fatto collegarlo al back end di produzione.
* `--stripDebug` farà si che vengano rimossi tutti i comandi di log dal codice.

es: `gulp build --production --stripDebug`

Attualmente il rilascio viene fatto a mano su due instance EC2 di AWS, e sono gestite da un payloader.

## Dove iniziare

Il mio consiglio è di partire dalla cartella di `gulp` per farsi un idea di dove stanno i file principali della app e che features sono presenti (autoprefixer per i css, transpile di ES2015, possibilità di rimuovere tutti i log di console in fase di building, eccetera). Di seguito poi partire dall'`index.module.js` (root di tutta l'applicazione e main module di angular) e lavorare a ritroso sui file importati per farsi un idea delle macro aree.