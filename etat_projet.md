# etat_projet.md — KENNY'S MOAS (à lire par la prochaine IA)

**Version** 1.5.0-p5b · un seul ZIP à rendre à chaque étape · plan : `docs/pack/pieces/` (Pièces 0 à 8) · prompt maître : `docs/pack/01_Super_Prompt_Maitre.md` · journal détaillé : `docs/REPRISE.md`.

## Fait
- Pièce 1 : Remarques (ex-erreurs, genres), liens entre objets (`relations.ts`), catégories Cours/Fiche/Exercice/Notes, remplacement de fichier à id conservé, suppression avec confirmation des liens, migration idempotente, tests (14/14 + e2e Chromium), bundle racine recompilé.

- Pièce 2a : nouveau logo + icônes/splash (`tools/make-icons.mjs`), symbole Drive nuage+flèche, états honnêtes, faux textes retirés (voir `RAPPORT-P2A.md`).

## Reste à faire
1. **Pièce 0** (dans une IA avec pnpm + réseau) : build officiel Vite, versionnage SW, version dans Réglages, typecheck des vues.
2. Pièce 2b (audit boutons, design system, apparence/polices) → 2c (matières : couleur/icône, jeu d'icônes) → 3 Bibliothèque par matière/catégorie → 4 lecteurs + remarque depuis le lecteur → 5 emploi du temps + .ics → 6 notes/objectifs → 7 guide/FAQ → 8 finition + GitHub.
3. Idées du prompt maître non commencées : dashboard visuel, streaks/XP, SRS étendu, thèmes/dark mode (déjà partiel), Pomodoro sur les fiches.

**Prochaine pièce à coller : PIÈCE 2 (`docs/pack/pieces/PIECE-2-identite.md`) en précisant « 2a est faite, fais 2b » ; la Pièce 0 reste à faire dans une IA avec pnpm + réseau.**


**Nouveau (30/09/2026)** : lire `docs/retours/RETOURS-UTILISATEUR-2026-09-30.md` avant toute pièce ≥ 2b (emploi du temps réel + retours). Aucun code modifié dans cette étape.


**Pièce 5 (30/09/2026)** : 5a (modèle TA1) et 5b (plusieurs emplois du temps, horaires, export .ics, rappels, cours du jour) faites — voir `RAPPORT-P5A.md`, `RAPPORT-P5B.md`. **Prochaine pièce : 5c** (A/B, jours en plus, copier-coller, réglages calendrier, Google Agenda), puis 2b/2c restants, 3, 4, 6, 7, 8.
