# Relais — Chantier "iOS friendly + design moins IA"

## Contexte
Demande : rendre l'app iOS-friendly (ajout à l'écran d'accueil) + remplacer les émojis
par de vraies icônes + design plus professionnel/sérieux (police, arrondis, ombres).

## Fait
1. **Icônes SVG** : quasi tous les émojis colorés (📚📝🎯📅🧠📎🔁⚠️ etc., ~150 occurrences)
   remplacés par un système d'icônes SVG cohérent, construit en réutilisant/étendant le
   système déjà présent dans le code (fonction `I()` + tableau `SECS` vers ~ligne 752, et
   nouveau dictionnaire `HI` + fonctions `H()`/`Is()` juste après `const I=...`).
   - Titres statiques (h2/h3) : convertis en `<span class="hic" data-hic="clé"></span>`
     hydratés par un petit script juste après la définition de `H()`.
   - Contenus dynamiques (badges, boutons générés en JS) : `${H('clé')}` directement
     dans les template strings.
   - **Exception volontaire** : `LIB_IMPORT_TYPES` est resté en texte pur (sans icône)
     car ce tableau alimente aussi un `<select><option>` natif, qui ne peut pas afficher
     de SVG. Ne pas lui remettre d'icône sans séparer les deux usages.
   - Les glyphes typographiques simples (✓ ✕ ✗ ★ ⌂ ↗) ont été laissés tels quels :
     ce sont des symboles sobres, pas des émojis colorés — pas besoin de les changer.
   - JS revérifié avec `node --check` → syntaxe OK.

2. **iOS "Ajouter à l'écran d'accueil"** :
   - Meta tags ajoutés dans `<head>` : `apple-mobile-web-app-capable`,
     `apple-mobile-web-app-status-bar-style`, `apple-mobile-web-app-title`,
     `format-detection`.
   - Icônes `apple-touch-icon` générées en 120/152/167/180 px depuis
     `icon-512-maskable.png` (pleine surface, sans coins pré-arrondis — c'est iOS qui
     applique son propre masque).
   - Écrans de démarrage (`splash/splash-*.png`) générés pour les tailles d'iPhone
     courantes (SE → 16 Pro Max), avec les `<link rel="apple-touch-startup-image" media="...">`
     correspondants, pour éviter le flash blanc au lancement.
   - Zones sûres iOS (encoche / Dynamic Island / barre du bas) gérées via
     `env(safe-area-inset-*)` sur `.topbar`, la nav mobile (bottom bar), `#fab`,
     `#fabMenu`, `#toasts`.

3. **Design "moins IA"** (démarré, à poursuivre) :
   - `--r` (arrondi des cartes) réduit de 18px → 13px, `--r-sm` 12px → 9px
     (moins "bulle", plus structuré).
   - Ombres (`--sh`, `--sh2`) allégées, moins "flottantes/candy".
   - Police : `--font-main` et nouveau `--font-head` (piles système `-apple-system`/
     `system-ui`/SF Pro, sans dépendance réseau puisque l'app doit rester 100% locale)
     appliqués aux titres/valeurs chiffrées pour un rendu un peu plus soigné.

## Reste à faire (prioritaire en haut)
1. **Vérifier visuellement le rendu** (ouvrir `index.html` dans un navigateur, capture
   d'écran desktop + mobile) — pas encore fait dans cette session, donc pas de contrôle
   visuel réel des changements CSS/icônes.
2. Pousser un peu plus le polish typographique : hiérarchie des poids de titres
   (h2/h3 pourraient mériter un `font-weight` explicite un peu plus marqué), espacement
   des lettres sur `.brand`.
3. Vérifier que le nouveau `--r`/`--r-sm` plus petit ne casse rien visuellement sur les
   éléments qui dépendaient d'un arrondi plus généreux (boutons ronds, chips, cover
   des matières dans la Bibliothèque).
4. `manifest.webmanifest` : pas encore mis à jour avec les nouvelles tailles d'icônes
   (120/152/167/180) — pas obligatoire pour iOS (qui utilise les balises `<link>` du
   head, pas le manifest) mais propre à faire pour Android/Chrome.
5. Repasser un coup de `grep` sur les émojis restants après tout changement futur pour
   s'assurer qu'aucun n'est réapparu par erreur.

## Comment continuer
Le zip livré (`kennys-moas-desktop-iOS.zip`) contient tout l'état actuel. Dézipper,
reprendre `index.html`, chercher les sections marquées ci-dessus.
