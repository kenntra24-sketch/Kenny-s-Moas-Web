"""
KENNY'S MOAS — Application PC native (sans navigateur)
========================================================
Lance un petit serveur local (invisible) + affiche l'app dans une vraie
fenêtre d'application, sans barre d'adresse ni onglets de navigateur.

100% local, aucune connexion internet requise, aucune donnée envoyée
nulle part.

INSTALLATION (une seule fois) :
    pip install pywebview

LANCEMENT :
    python app.py

Pour en faire un vrai .exe (optionnel, voir COMMENT-CREER-EXE.txt) :
    pip install pyinstaller
    pyinstaller --onefile --windowed --add-data "index.html;." --add-data "sw.js;." --add-data "manifest.webmanifest;." --add-data "icon-192.png;." --add-data "icon-512.png;." --add-data "icon-192-maskable.png;." --add-data "icon-512-maskable.png;." --add-data "icon.ico;." --icon=icon.ico --name "KENNYS-MOAS" app.py
"""

import http.server
import socketserver
import threading
import sys
import os
import webview


def get_app_dir():
    """Trouve le dossier de l'app, que ce soit en script normal ou empaqueté en .exe (PyInstaller)."""
    if getattr(sys, 'frozen', False):
        return sys._MEIPASS  # dossier temporaire créé par PyInstaller
    return os.path.dirname(os.path.abspath(__file__))


def start_server(directory, port):
    """Démarre un serveur HTTP local silencieux, servant les fichiers de l'app."""
    handler_class = http.server.SimpleHTTPRequestHandler

    class QuietHandler(handler_class):
        def log_message(self, format, *args):
            pass  # pas de logs dans la console

        def translate_path(self, path):
            # Force tous les chemins à être résolus depuis "directory"
            path = super().translate_path(path)
            rel = os.path.relpath(path, os.getcwd())
            return os.path.join(directory, rel)

    with socketserver.TCPServer(("127.0.0.1", port), QuietHandler) as httpd:
        httpd.serve_forever()


def find_free_port():
    """Trouve un port local libre automatiquement."""
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


# Port fixe utilisé en priorité : la connexion Google (OAuth) exige une
# "origine autorisée" (http://127.0.0.1:PORT) déclarée à l'avance dans
# Google Cloud Console. Un port qui changerait à chaque lancement rendrait
# la connexion Google impossible. Voir SETUP.md. Si ce port est déjà pris
# par un autre programme, l'app retombe automatiquement sur un port libre
# quelconque (l'app fonctionne quand même, seule la connexion Google
# nécessiterait alors de redéclarer temporairement la nouvelle origine).
FIXED_PORT = 8765


def is_port_free(port):
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.bind(("127.0.0.1", port))
        return True
    except OSError:
        return False
    finally:
        s.close()


def main():
    app_dir = get_app_dir()
    port = FIXED_PORT if is_port_free(FIXED_PORT) else find_free_port()

    server_thread = threading.Thread(
        target=start_server, args=(app_dir, port), daemon=True
    )
    server_thread.start()

    icon_path = os.path.join(app_dir, "icon.ico")

    webview.create_window(
        "KENNY'S MOAS",
        f"http://127.0.0.1:{port}/index.html",
        width=1280,
        height=820,
        min_size=(900, 600),
    )
    webview.start()


if __name__ == "__main__":
    main()
