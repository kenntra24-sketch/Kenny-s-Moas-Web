"""KENNY'S MOAS — lanceur local (aucune installation : Python seul, bibliothèque standard).

Sert le site (index.html, à côté de ce fichier) sur http://127.0.0.1:8765 et ouvre ton navigateur.
Le port 8765 est le même que celui de l'ancienne application bureau (desktop/app.py) : ainsi, les données
déjà saisies dans l'ancienne version (stockées par le navigateur pour cette adresse) sont retrouvées.
Ferme cette fenêtre pour arrêter l'application. Rien n'est envoyé sur internet."""
import http.server, os, socket, socketserver, sys, threading, time, webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))   # le site compilé est à la racine du dépôt
PORT = 8765


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
                      '.webmanifest': 'application/manifest+json', '.html': 'text/html; charset=utf-8'}

    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def log_message(self, *a):
        pass

    def end_headers(self):  # pas de cache agressif pendant qu'on développe / met à jour
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


def free(port):
    s = socket.socket()
    if os.name != 'nt':  # Linux/Mac : un port en TIME_WAIT après un arrêt récent reste utilisable
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        s.bind(('127.0.0.1', port)); return True
    except OSError:
        return False
    finally:
        s.close()


def main():
    if not os.path.isfile(os.path.join(ROOT, 'index.html')):
        print("index.html est introuvable à côté de serve.py. Décompresse tout le dossier avant de lancer (voir LISEZ-MOI.txt)."); input('Entrée pour fermer…'); return
    port = PORT
    if not free(port):
        s = socket.socket(); s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]; s.close()
        print(f"(Le port {PORT} est déjà pris — utilisation du port {port} : tes anciennes données locales peuvent ne pas apparaître.)")
    socketserver.ThreadingTCPServer.allow_reuse_address = os.name != 'nt'
    with socketserver.ThreadingTCPServer(('127.0.0.1', port), Handler) as httpd:
        url = f'http://127.0.0.1:{port}/index.html'
        print(f"\n  KENNY'S MOAS est lancé : {url}\n  (garde cette fenêtre ouverte ; ferme-la pour arrêter)\n")
        threading.Thread(target=lambda: (time.sleep(0.6), webbrowser.open(url)), daemon=True).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == '__main__':
    try:
        main()
    except Exception as e:  # garde la fenêtre ouverte pour lire l'erreur
        print('Erreur :', e); input('Entrée pour fermer…')
