#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Runs the CV site locally with a simple HTTP server
.DESCRIPTION
    Starts a local server to preview the static CV site.
    Supports multiple server options (Node.js, Python, PHP).
#>

param(
    [int]$Port = 8000,
    [string]$Server = "auto"  # auto, node, python, php
)

Write-Host "🚀 Starting local CV preview..." -ForegroundColor Cyan
Write-Host "📁 Directory: $(Get-Location)" -ForegroundColor Gray

# Check available servers
$hasNode = Get-Command node -ErrorAction SilentlyContinue
$hasPython = Get-Command python -ErrorAction SilentlyContinue
$hasPhp = Get-Command php -ErrorAction SilentlyContinue

$chosenServer = $Server
if ($Server -eq "auto") {
    if ($hasNode) { $chosenServer = "node" }
    elseif ($hasPython) { $chosenServer = "python" }
    elseif ($hasPhp) { $chosenServer = "php" }
    else { 
        Write-Host "❌ No server found. Install Node.js, Python, or PHP." -ForegroundColor Red
        exit 1
    }
}

$url = "http://localhost:$Port"

switch ($chosenServer) {
    "node" {
        if (-not $hasNode) { Write-Host "❌ Node.js not found" -ForegroundColor Red; exit 1 }
        Write-Host "🟢 Using Node.js (npx serve)" -ForegroundColor Green
        Write-Host "🌐 Open: $url" -ForegroundColor Yellow
        npx serve . -l $Port
    }
    "python" {
        if (-not $hasPython) { Write-Host "❌ Python not found" -ForegroundColor Red; exit 1 }
        Write-Host "🐍 Using Python http.server" -ForegroundColor Green
        Write-Host "🌐 Open: $url" -ForegroundColor Yellow
        python -m http.server $Port
    }
    "php" {
        if (-not $hasPhp) { Write-Host "❌ PHP not found" -ForegroundColor Red; exit 1 }
        Write-Host "🐘 Using PHP built-in server" -ForegroundColor Green
        Write-Host "🌐 Open: $url" -ForegroundColor Yellow
        php -S localhost:$Port
    }
    default {
        Write-Host "❌ Unknown server: $chosenServer" -ForegroundColor Red
        exit 1
    }
}