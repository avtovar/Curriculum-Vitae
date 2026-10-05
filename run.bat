@echo off
REM ============================================
REM CV Local Preview - Windows Batch
REM ============================================
echo 🚀 Starting local CV preview...
echo 📁 Directory: %CD%

REM Try different servers in order
where npx >nul 2>&1 && (
    echo 🟢 Using Node.js (npx serve)
    echo 🌐 Open: http://localhost:8000
    npx serve . -l 8000
    goto :eof
)

where python >nul 2>&1 && (
    echo 🐍 Using Python http.server
    echo 🌐 Open: http://localhost:8000
    python -m http.server 8000
    goto :eof
)

where php >nul 2>&1 && (
    echo 🐘 Using PHP built-in server
    echo 🌐 Open: http://localhost:8000
    php -S localhost:8000
    goto :eof
)

echo ❌ No server found. Install Node.js, Python, or PHP.
pause
exit /b 1