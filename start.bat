@echo off
title Web Dashers - servidor local
cd /d "%~dp0"
echo Iniciando Web Dashers en http://localhost:8080/
echo Cerra esta ventana para detener el servidor.
start "" http://localhost:8080/
node server.js
pause
