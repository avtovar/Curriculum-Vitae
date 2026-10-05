@echo off
REM ============================================
REM CV Local Runner - Windows Batch (todo en uno)
REM ============================================
REM - Verifica dependencias
REM - Optimiza imagenes (convert-webp.js)
REM - Inicia servidor local
REM - Abre navegador automaticamente
REM ============================================

setlocal enabledelayedexpansion

echo ╔══════════════════════════════════════════════════════════╗
echo ║  CV Local Runner - Ali Valentin Tovar Morales             ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

set "PORT=8000"
set "SERVER=auto"
set "NOBROWSER=false"
set "SKIPOPTIMIZE=false"
set "OPTIMIZE=false"

REM Parsear argumentos
:parse_args
if "%~1"=="" goto :args_done
if "%~1"=="--port" (set "PORT=%~2" & shift & shift & goto :parse_args)
if "%~1"=="--server" (set "SERVER=%~2" & shift & shift & goto :parse_args)
if "%~1"=="--no-browser" (set "NOBROWSER=true" & shift & goto :parse_args)
if "%~1"=="--skip-optimize" (set "SKIPOPTIMIZE=true" & shift & goto :parse_args)
if "%~1"=="--optimize" (set "OPTIMIZE=true" & shift & goto :parse_args)
if "%~1"=="-h" goto :help
if "%~1"=="--help" goto :help
shift
goto :parse_args

:args_done

echo 📁 Directorio: %CD%
echo.

REM ─── 1. Verificar dependencias ───
echo ▶ Verificando dependencias...

where node >nul 2>&1 && (
    for /f "tokens=*" %%i in ('node --version') do set "NODE_VER=%%i"
    echo   ✅ Node.js: !NODE_VER!
    set "HAS_NODE=1"
) || set "HAS_NODE=0"

where npx >nul 2>&1 && set "HAS_NPX=1" || set "HAS_NPX=0"

where python >nul 2>&1 && (
    for /f "tokens=*" %%i in ('python --version') do set "PY_VER=%%i"
    echo   ✅ Python: !PY_VER!
    set "HAS_PYTHON=1"
) || set "HAS_PYTHON=0"

where php >nul 2>&1 && (
    for /f "tokens=*" %%i in ('php --version ^| findstr /R /C:"^PHP"') do set "PHP_VER=%%i"
    echo   ✅ PHP: !PHP_VER!
    set "HAS_PHP=1"
) || set "HAS_PHP=0"

if "%HAS_NODE%"=="0" if "%HAS_PYTHON%"=="0" if "%HAS_PHP%"=="0" (
    echo   ❌ No se encontro Node.js, Python ni PHP.
    echo   Instala uno desde: https://nodejs.org | https://python.org | https://php.net
    pause
    exit /b 1
)

echo.

REM ─── 2. Optimizar imagenes (SOLO con --optimize) ───
if "%OPTIMIZE%"=="true" (
    echo ▶ Optimizando imagenes (WebP) y build...

    if exist convert-webp.js (
        if "%HAS_NODE%"=="1" (
            node convert-webp.js
            if errorlevel 1 (echo   ❌ Error en convert-webp.js) else echo   ✅ convert-webp.js completado
        ) else (
            echo   ⏭ Node.js no disponible, saltando convert-webp.js
        )
    )

    if exist convert-webp2.js (
        if "%HAS_NODE%"=="1" (
            node convert-webp2.js
            if errorlevel 1 (echo   ❌ Error en convert-webp2.js) else echo   ✅ convert-webp2.js completado
        )
    )

    if exist build.js (
        if "%HAS_NODE%"=="1" (
            node build.js
            if errorlevel 1 (echo   ❌ Error en build.js) else echo   ✅ build.js completado
        )
    )
    echo.
)

REM ─── 3. Seleccionar servidor ───
set "CHOSEN_SERVER=%SERVER%"
if "%SERVER%"=="auto" (
    if "%HAS_NPX%"=="1" set "CHOSEN_SERVER=node"
    if "%CHOSEN_SERVER%"=="auto" if "%HAS_NODE%"=="1" set "CHOSEN_SERVER=node"
    if "%CHOSEN_SERVER%"=="auto" if "%HAS_PYTHON%"=="1" set "CHOSEN_SERVER=python"
    if "%CHOSEN_SERVER%"=="auto" if "%HAS_PHP%"=="1" set "CHOSEN_SERVER=php"
)

set "URL=http://localhost:%PORT%"
echo ▶ Iniciando servidor: %CHOSEN_SERVER% en puerto %PORT%
echo 🌐 URL: %URL%
echo.

REM ─── 4. Abrir navegador (después de 1.5s) ───
if "%NOBROWSER%"=="false" (
    timeout /t 1 /nobreak >nul
    start "" "%URL%"
    echo   ✅ Navegador abierto
)

echo.
echo 📡 Servidor corriendo... Presiona Ctrl+C para detener
echo ────────────────────────────────────────

REM ─── 5. Iniciar servidor (bloqueante) ───
if "%CHOSEN_SERVER%"=="node" (
    if "%HAS_NPX%"=="1" (
        npx serve . -l %PORT%
    ) else if "%HAS_NODE%"=="1" (
        echo   ⚠️ npx no disponible, intentando: node -e "require('http-server')..."
        npx serve . -l %PORT%
    ) else (
        echo   ❌ npx/Node.js requerido para modo node
        pause
        exit /b 1
    )
) else if "%CHOSEN_SERVER%"=="python" (
    python -m http.server %PORT%
) else if "%CHOSEN_SERVER%"=="php" (
    php -S localhost:%PORT%
) else (
    echo   ❌ Servidor desconocido: %CHOSEN_SERVER%
    pause
    exit /b 1
)

:help
echo.
echo Uso: run-all.bat [opciones]
echo.
echo Opciones:
echo   --port N           Puerto (default: 8000)
echo   --server TYPE      Servidor: node, python, php, auto (default: auto)
echo   --no-browser       No abrir navegador automaticamente
echo   --optimize       Ejecutar convert-webp*/build.js antes de servir
echo   --help, -h         Mostrar esta ayuda
echo.
echo Ejemplos:
echo   run-all.bat
echo   run-all.bat --port 3000 --server python
echo   run-all.bat --no-browser --skip-optimize
echo.
pause