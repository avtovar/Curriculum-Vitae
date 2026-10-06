#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script completo para configurar y ejecutar el CV localmente
.DESCRIPTION
    - Verifica dependencias (Node/Python/PHP)
    - Optimiza imágenes (convert-webp.js) con flag -Optimize
    - Inicia servidor local
    - Abre navegador automáticamente
.PARAMETER Port
    Puerto para el servidor local (default: 8000)
.PARAMETER Server
    Servidor a usar: auto, node, python, php (default: auto)
.PARAMETER NoBrowser
    No abrir navegador automáticamente
.PARAMETER Optimize
    Ejecutar scripts de optimización WebP antes de iniciar
.EXAMPLE
    .\run.ps1
.EXAMPLE
    .\run.ps1 -Port 3000 -Optimize
#>

param(
    [int]$Port = 8000,
    [string]$Server = "auto",
    [switch]$NoBrowser,
    [switch]$Optimize
)

$ErrorActionPreference = "Stop"

Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  CV Local Runner - Ali Valentin Tovar Morales           ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ─── Verificar directorio ───
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir
Write-Host "Directorio: $(Get-Location)" -ForegroundColor Gray

# ─── Funciones helper ───
function Test-Command($cmd) {
    Get-Command $cmd -ErrorAction SilentlyContinue
}

function Write-Step($msg) {
    Write-Host "`n▶ $msg" -ForegroundColor Yellow
}

function Write-Success($msg) {
    Write-Host "  ✅ $msg" -ForegroundColor Green
}

function Write-Error($msg) {
    Write-Host "  ❌ $msg" -ForegroundColor Red
}

function Write-Info($msg) {
    Write-Host "  ℹ️  $msg" -ForegroundColor Gray
}

# ─── 1. Verificar dependencias ───
Write-Step "Verificando dependencias..."

$hasNode = Test-Command node
$hasNpx = Test-Command npx
$hasPython = Test-Command python
$hasPhp = Test-Command php

if ($hasNode) { Write-Success "Node.js: $((node --version).Trim())" }
if ($hasPython) { Write-Success "Python: $((python --version).Trim())" }
if ($hasPhp) { Write-Success "PHP: $((php --version | Select-Object -First 1).Trim())" }

# ─── 2. Optimizar imágenes (solo con -Optimize) ───
if ($Optimize) {
    Write-Step "Optimizando imágenes (WebP)..."

    if (Test-Path "convert-webp.js") {
        try {
            if ($hasNode) {
                node convert-webp.js
                Write-Success "convert-webp.js completado"
            } else {
                Write-Info "Node.js no disponible, saltando optimización WebP"
            }
        } catch {
            Write-Error "Error en convert-webp.js: $_"
        }
    }

    if (Test-Path "convert-webp2.js") {
        try {
            if ($hasNode) {
                node convert-webp2.js
                Write-Success "convert-webp2.js completado"
            }
        } catch {
            Write-Error "Error en convert-webp2.js: $_"
        }
    }

    if (Test-Path "build.js") {
        try {
            if ($hasNode) {
                node build.js
                Write-Success "build.js completado"
            }
        } catch {
            Write-Error "Error en build.js: $_"
        }
    }
}

# ─── 3. Seleccionar servidor ───
$chosenServer = $Server
$url = "http://localhost:$Port"

if ($Server -eq "auto") {
    if ($hasNpx -or $hasNode) { $chosenServer = "node" }
    elseif ($hasPython) { $chosenServer = "python" }
    elseif ($hasPhp) { $chosenServer = "php" }
    else {
        Write-Error "No se encontró Node.js, Python ni PHP. Instala uno para continuar."
        exit 1
    }
}

Write-Step "Iniciando servidor: $chosenServer en puerto $Port"
Write-Host "🌐 URL: $url" -ForegroundColor Cyan

# ─── 4. Abrir navegador ───
if (-not $NoBrowser) {
    Start-Sleep -Milliseconds 1500
    try {
        Start-Process $url
        Write-Success "Navegador abierto"
    } catch {
        Write-Info "No se pudo abrir navegador automáticamente. Abre manualmente: $url"
    }
}

# ─── 5. Iniciar servidor (bloqueante) ───
Write-Host "`n📡 Servidor corriendo... Presiona Ctrl+C para detener" -ForegroundColor Gray
Write-Host "────────────────────────────────────────" -ForegroundColor Gray

try {
    switch ($chosenServer) {
        "node" {
            if (-not $hasNpx) { throw "npx no encontrado" }
            npx serve . -l $Port
        }
        "python" {
            if (-not $hasPython) { throw "python no encontrado" }
            python -m http.server $Port
        }
        "php" {
            if (-not $hasPhp) { throw "php no encontrado" }
            php -S "localhost:$Port"
        }
        default {
            throw "Servidor desconocido: $chosenServer"
        }
    }
} catch {
    Write-Error "Error al iniciar servidor: $_"
    exit 1
}
