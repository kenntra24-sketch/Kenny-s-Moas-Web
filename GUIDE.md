# KENNY'S MOAS — Application PC (sans navigateur)

## CE QUE C'EST

Ton app dans une **vraie fenêtre d'application**, sans barre d'adresse ni
onglets — comme un vrai logiciel. Fonctionne 100% en local, aucune
connexion internet nécessaire — y compris pour le lecteur PDF intégré
(PDF.js est déjà inclus dans ce dossier, rien à télécharger).

---

## ÉTAPE 1 — Installer pywebview (une seule fois)

Ouvre un terminal (Invite de commandes / PowerShell sur Windows,
Terminal sur Mac) dans ce dossier, puis tape :

```
pip install pywebview
```

Attends que ça s'installe (quelques secondes).

---

## ÉTAPE 2 — Lancer l'app

Toujours dans le terminal, dans ce dossier :

```
python app.py
```

Une fenêtre s'ouvre avec ton app dedans. C'est tout !

> Sur certains systèmes, il faut peut-être taper `python3` au lieu de
> `python`.

---

## ÉTAPE 3 (OPTIONNEL) — Créer un vrai fichier .exe

Si tu veux un fichier `.exe` à double-cliquer directement (sans passer
par le terminal à chaque fois) :

### Installer l'outil de création d'exe

```
pip install pyinstaller
```

### Créer le .exe

Toujours dans ce dossier, tape cette commande complète (en une seule
ligne) :

**Sur Windows :**
```
pyinstaller --onefile --windowed --add-data "index.html;." --add-data "sw.js;." --add-data "manifest.webmanifest;." --add-data "icon-192.png;." --add-data "icon-512.png;." --add-data "icon-192-maskable.png;." --add-data "icon-512-maskable.png;." --add-data "icon.ico;." --icon=icon.ico --name "KENNYS-MOAS" app.py
```

**Sur Mac/Linux**, remplace les `;` par `:` dans les `--add-data` :
```
pyinstaller --onefile --windowed --add-data "index.html:." --add-data "sw.js:." --add-data "manifest.webmanifest:." --add-data "icon-192.png:." --add-data "icon-512.png:." --add-data "icon-192-maskable.png:." --add-data "icon-512-maskable.png:." --add-data "icon.ico:." --icon=icon.ico --name "KENNYS-MOAS" app.py
```

Ça prend 1-2 minutes. Une fois fini, ton `.exe` (ou app Mac) est dans le
dossier **`dist/`** qui vient d'être créé.

Tu peux ensuite :
- Le mettre sur ton Bureau
- Le renommer comme tu veux
- Le partager avec tes amis (ils n'ont besoin de rien installer, le
  `.exe` contient tout — Python inclus dedans)

---

## FAQ

**Est-ce que mes données restent sur mon PC ?**
Oui, exactement comme avant — l'app stocke tout dans le navigateur
intégré (localStorage/IndexedDB), rien ne part sur internet.

**Est-ce que je peux partager le .exe avec un ami sans PC compliqué ?**
Oui ! Une fois le `.exe` créé, il fonctionne tout seul sur n'importe quel
PC Windows, sans que la personne ait besoin d'installer Python ou quoi
que ce soit.

**Le .exe est gros (100+ Mo), c'est normal ?**
Oui, car il embarque Python complet à l'intérieur pour que ça marche sans
rien installer côté utilisateur final.

**Ça marche aussi sur Mac ?**
Oui, la même méthode fonctionne, mais il faut lancer PyInstaller
**depuis un Mac** pour obtenir une app Mac (on ne peut pas fabriquer un
.exe Windows depuis un Mac, ni l'inverse).

---

## FICHIERS DE CE DOSSIER

```
kennys-moas-desktop/
├── app.py                   (le programme qui ouvre la fenêtre)
├── index.html               (l'app elle-même, identique à v1)
├── sw.js, manifest.webmanifest, icon-*.png, icon.ico  (identiques à v1)
└── GUIDE.md                 (ce fichier)
```
