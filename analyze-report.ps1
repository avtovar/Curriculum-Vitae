param($pdfPath = 'c:\Users\avtov\Downloads\Informe_Completo_CV_Ali-Tovar.pdf')

$bytes = [System.IO.File]::ReadAllBytes($pdfPath)
$encoding = New-Object System.Text.UTF8Encoding
$text = $encoding.GetString($bytes)
Write-Host "Size: $($bytes.Length)"
# Buscar título
$titleStr = '/Title ('
$titleStart = $text.IndexOf($titleStr)
if ($titleStart -ge 0) {
  $titleEnd = $text.IndexOf(')', $titleStart + $titleStr.Length)
  Write-Host "Title: " + $text.Substring($titleStart + $titleStr.Length, $titleEnd - $titleStart - $titleStr.Length)
} else { Write-Host "Title: not found" }
$authorStr = '/Author ('
$authorStart = $text.IndexOf($authorStr)
if ($authorStart -ge 0) {
  $authorEnd = $text.IndexOf(')', $authorStart + $authorStr.Length)
  Write-Host "Author: " + $text.Substring($authorStart + $authorStr.Length, $authorEnd - $authorStart - $authorStr.Length)
} else { Write-Host "Author: not found" }
$subjectStr = '/Subject ('
$subjectStart = $text.IndexOf($subjectStr)
if ($subjectStart -ge 0) {
  $subjectEnd = $text.IndexOf(')', $subjectStart + $subjectStr.Length)
  Write-Host "Subject: " + $text.Substring($subjectStart + $subjectStr.Length, $subjectEnd - $subjectStart - $subjectStr.Length)
} else { Write-Host "Subject: not found" }
# Contar páginas por /Type /Page
$pageCount = 0
$idx = 0
do {
  $idx = $text.IndexOf('/Type /Page', $idx)
  if ($idx -eq -1) { break }
  $pageCount++
  $idx++
} while ($idx -ne -1)
Write-Host "Pages: $pageCount"
# Contar streams
$streamCount = [regex]::Match($text, 'stream').Count
Write-Host "Streams: $streamCount"