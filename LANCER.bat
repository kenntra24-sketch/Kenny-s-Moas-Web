@echo off
chcp 65001 >nul
cd /d "%~dp0"
title KENNY'S MOAS
where py >nul 2>nul
if not errorlevel 1 (
  py serve.py
  goto fin
)
where python >nul 2>nul
if not errorlevel 1 (
  python serve.py
  goto fin
)
echo.
echo Python n'est pas installe sur cet ordinateur.
echo Solution de secours : double-clique sur index.html
echo (le lecteur PDF et le mode hors-ligne ne marcheront pas dans ce mode).
echo.
pause
:fin
