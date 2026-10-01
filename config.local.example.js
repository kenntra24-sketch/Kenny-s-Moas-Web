/* Modèle de configuration Google Drive — copie ce fichier en « config.local.js » (même dossier) et remplis-le.
   ATTENTION : l'ID client commence DIRECTEMENT par des chiffres (ex. 123456789012-abc...xyz.apps.googleusercontent.com),
   sans le mot « client » ni espace devant. Ouvre diagnostic.html pour vérifier ta configuration.
   Sans ce fichier, l'appli fonctionne normalement ; seule la synchronisation Google Drive reste désactivée. */
window.KM_GOOGLE = {
  clientId: 'REMPLACE_PAR_TON_CLIENT_ID.apps.googleusercontent.com',
  apiKey:   'REMPLACE_PAR_TA_CLE_API'
};
