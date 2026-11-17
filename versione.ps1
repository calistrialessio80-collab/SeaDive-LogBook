# Aggiorna il numero di versione di SeaDive in tutti i file che lo contengono.
# Da usare prima di pubblicare su main, così telefoni e service worker scaricano i file nuovi.
#   .\versione.ps1          -> versione attuale + 1
#   .\versione.ps1 230      -> imposta la versione 230
param([int]$Nuova = 0)

$root = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
$attuale = [int]((Get-Content -Raw (Join-Path $root "version.txt")).Trim())
if ($Nuova -le 0) { $Nuova = $attuale + 1 }
if ($Nuova -le $attuale) { throw "La nuova versione ($Nuova) deve essere maggiore di quella attuale ($attuale)." }

# file -> elenco di (espressione regolare, sostituzione)
$regole = [ordered]@{
  "app.js"        = @(, @('const APP_VERSION = "\d+";', "const APP_VERSION = `"$Nuova`";"))
  "sw.js"         = @(, @('seadive-logbook-v\d+', "seadive-logbook-v$Nuova"))
  "manifest.json" = @(, @('"start_url": "\./\?v=\d+"', "`"start_url`": `"./?v=$Nuova`""))
  "aggiorna.js"   = @(, @('searchParams\.set\("v", "\d+"\)', "searchParams.set(`"v`", `"$Nuova`")"))
  "aggiorna.html" = @(, @('aggiorna\.js\?v=\d+', "aggiorna.js?v=$Nuova"))
  # In index.html tutti gli script e i fogli di stile del sito prendono lo stesso numero.
  "index.html"    = @(, @('(\./[\w-]+\.(?:js|css))\?v=\d+', "`$1?v=$Nuova"))
}

foreach ($file in $regole.Keys) {
  $path = Join-Path $root $file
  $testo = [IO.File]::ReadAllText($path, $utf8)
  $prima = $testo
  foreach ($r in $regole[$file]) { $testo = [regex]::Replace($testo, $r[0], $r[1]) }
  if ($testo -eq $prima) { throw "In $file non ho trovato il numero di versione da cambiare: controlla il file." }
  [IO.File]::WriteAllText($path, $testo, $utf8)
  Write-Output "aggiornato $file"
}
[IO.File]::WriteAllText((Join-Path $root "version.txt"), "$Nuova`n", $utf8)
Write-Output "Versione $attuale -> $Nuova"
