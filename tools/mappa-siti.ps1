# Costruisce i dati della mappa (siti e diving del mondo) da fonti libere.
#  - divelogs-sites.json: siti con numero di schede (file esistente), ripulito da errori evidenti.
#  - dive-sites.json: diving da OpenStreetMap (ODbL) + siti in più da OpenStreetMap, Wikidata (CC0)
#    e dal catalogo curato di sites.js, scartando quelli già presenti nel file principale.
# Uso: powershell -File tools\mappa-siti.ps1 [-Cache cartella]   (scarica ~3 MB, 2-3 minuti)
param([string]$Cache = "$env:TEMP\seadive-mappa")

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding($false)
Add-Type -AssemblyName System.Web
New-Item -ItemType Directory -Force $Cache | Out-Null
$ua = "SeaDive-LogBook-tools/1.0 (sito statico)"

function J([string]$s) { '"' + [System.Web.HttpUtility]::JavaScriptStringEncode($s) + '"' }
function Num([double]$x) { [math]::Round($x, 5).ToString([Globalization.CultureInfo]::InvariantCulture) }
function Norm([string]$s) {
  $d = $s.ToLowerInvariant().Normalize([Text.NormalizationForm]::FormD)
  $d = [regex]::Replace($d, '\p{Mn}', '')
  ([regex]::Replace($d, '[^\p{L}0-9]+', ' ')).Trim()
}
function Clean([string]$s) {
  $t = [System.Net.WebUtility]::HtmlDecode([System.Net.WebUtility]::HtmlDecode([string]$s))
  ([regex]::Replace($t, '\s+', ' ')).Trim()
}
function Km($a1, $o1, $a2, $o2) {
  $r = [math]::PI / 180
  $x = [math]::Pow([math]::Sin(($a2 - $a1) * $r / 2), 2) + [math]::Cos($a1 * $r) * [math]::Cos($a2 * $r) * [math]::Pow([math]::Sin(($o2 - $o1) * $r / 2), 2)
  2 * 6371 * [math]::Asin([math]::Min([double]1, [math]::Sqrt($x)))
}
function NamesNear([string]$a, [string]$b) {
  $x = Norm $a; $y = Norm $b
  if (-not $x -or -not $y) { return $false }
  if ($x -eq $y) { return $true }
  ($x.Length -ge 5 -and $y.Length -ge 5 -and ($x.Contains($y) -or $y.Contains($x)))
}

# Griglia di celle da ~1 km per trovare i vicini in fretta.
class Grid {
  [hashtable]$cells = @{}
  [string] Key([int]$i, [int]$j) { return "$i|$j" }
  [void] Add($p) {
    $k = $this.Key([math]::Floor($p.a * 100), [math]::Floor($p.o * 100))
    if (-not $this.cells.ContainsKey($k)) { $this.cells[$k] = New-Object System.Collections.ArrayList }
    [void]$this.cells[$k].Add($p)
  }
  [object[]] Near([double]$a, [double]$o, [int]$ring) {
    $i = [math]::Floor($a * 100); $j = [math]::Floor($o * 100)
    $out = New-Object System.Collections.ArrayList
    for ($di = -$ring; $di -le $ring; $di++) { for ($dj = -$ring; $dj -le $ring; $dj++) {
      $k = $this.Key($i + $di, $j + $dj)
      if ($this.cells.ContainsKey($k)) { $out.AddRange($this.cells[$k]) }
    } }
    return $out.ToArray()
  }
}

$report = New-Object System.Collections.ArrayList
function Note($s) { [void]$report.Add($s); Write-Output $s }

# ---------- 1. File principale: correzioni ----------
$mainPath = Join-Path $root "divelogs-sites.json"
$rows = [IO.File]::ReadAllText($mainPath, $utf8) | ConvertFrom-Json
Note "Siti con schede, prima: $($rows.Count)"
$fixedNames = 0; $dropped = New-Object System.Collections.ArrayList; $main = New-Object System.Collections.ArrayList
foreach ($r in $rows) {
  $name = Clean $r[0]; if ($name -ne [string]$r[0]) { $fixedNames++ }
  $a = [double]$r[1]; $o = [double]$r[2]; $c = [int]$r[3]
  $roundDeg = ($a -eq [math]::Round($a) -and $o -eq [math]::Round($o))
  $nearZero = ([math]::Abs($a) -lt 0.5 -and [math]::Abs($o) -lt 0.5)
  if (-not $name -or [math]::Abs($a) -gt 85 -or [math]::Abs($o) -gt 180 -or $roundDeg -or $nearZero) {
    [void]$dropped.Add("$name ($a, $o)"); continue
  }
  [void]$main.Add([pscustomobject]@{ n = $name; a = $a; o = $o; c = $c })
}
Note "Nomi con codici HTML corretti: $fixedNames"
Note "Tolti per coordinate impossibili o arrotondate al grado (fino a 100 km di errore): $($dropped.Count)"
$dropped | ForEach-Object { Note "  - $_" }

# Doppioni: stesso nome entro 1 km -> un punto solo, schede sommate, posizione del più documentato.
$g = [Grid]::new(); $merged = 0; $keep = New-Object System.Collections.ArrayList
foreach ($p in ($main | Sort-Object c -Descending)) {
  $twin = $g.Near($p.a, $p.o, 1) | Where-Object { (Norm $_.n) -eq (Norm $p.n) -and (Km $_.a $_.o $p.a $p.o) -le 1 } | Select-Object -First 1
  if ($twin) { $twin.c += $p.c; $merged++; continue }
  $g.Add($p); [void]$keep.Add($p)
}
Note "Doppioni uniti (stesso nome entro 1 km): $merged"
$main = $keep | Sort-Object c -Descending
Note "Siti con schede, dopo: $($main.Count)"

# ---------- 2. OpenStreetMap ----------
$osmFile = Join-Path $Cache "osm.json"
if (-not (Test-Path $osmFile) -or (Get-Item $osmFile).LastWriteTime -lt (Get-Date).AddDays(-7)) {
  $q = '[out:json][timeout:300];(nwr["amenity"="dive_centre"];nwr["shop"="scuba_diving"];nwr["sport"~"^(scuba_diving|diving|free_diving)$"];nwr["scuba_diving:divespot"="yes"];);out center tags;'
  Invoke-WebRequest "https://overpass-api.de/api/interpreter" -Method Post -Body @{ data = $q } -UserAgent $ua -OutFile $osmFile -TimeoutSec 400 -UseBasicParsing
}
$els = ([IO.File]::ReadAllText($osmFile, $utf8) | ConvertFrom-Json).elements
Note "OpenStreetMap: $($els.Count) elementi"
$diving = New-Object System.Collections.ArrayList; $extra = New-Object System.Collections.ArrayList
$skip = @{ tuffi = 0; senzaNome = 0 }
foreach ($el in $els) {
  $t = $el.tags; if (-not $t) { continue }
  $a = if ($el.lat) { [double]$el.lat } else { [double]$el.center.lat }
  $o = if ($el.lon) { [double]$el.lon } else { [double]$el.center.lon }
  if (-not $a -and -not $o) { continue }
  $sports = @(([string]$t.sport) -split ';' | ForEach-Object { $_.Trim() })
  $scuba = ($sports -contains 'scuba_diving') -or ($sports -contains 'free_diving') -or $t.'scuba_diving:divespot' -eq 'yes'
  $isCentre = $t.amenity -eq 'dive_centre' -or $t.shop -eq 'scuba_diving'
  # sport=diving in OSM sono i tuffi dal trampolino: si tengono solo se c'è anche un segno di immersione.
  if (-not $isCentre -and -not $scuba) { $skip.tuffi++; continue }
  if ($t.leisure -in @('swimming_pool', 'pitch') -or $t.'diving' -eq 'springboard' -or $t.leisure -eq 'water_park') { $skip.tuffi++; continue }
  $name = Clean ($(if ($t.name) { $t.name } elseif ($t.'name:en') { $t.'name:en' } else { '' }))
  $isPlace = $t.'scuba_diving:divespot' -eq 'yes' -or (-not $isCentre -and -not ($t.club -or $t.office -or $t.building -or $t.leisure -in @('sports_centre', 'club') -or $t.amenity -or $t.shop))
  if ($isPlace -and -not $isCentre) {
    [void]$extra.Add([pscustomobject]@{ n = $(if ($name) { $name } else { '' }); a = $a; o = $o; s = 'o' })
  } else {
    if (-not $name) { $skip.senzaNome++; continue }
    $web = [string]$(if ($t.website) { $t.website } elseif ($t.'contact:website') { $t.'contact:website' } else { '' })
    $web = ($web -split ';')[0].Trim()
    if ($web -and $web -notmatch '^https?://') { $web = "https://$web" }
    if ($web -notmatch '^https?://[^\s"<>]+$') { $web = '' }
    $city = Clean ([string]$(if ($t.'addr:city') { $t.'addr:city' } elseif ($t.'addr:place') { $t.'addr:place' } else { '' }))
    [void]$diving.Add([pscustomobject]@{ n = $name; a = $a; o = $o; t = $city; w = $web })
  }
}
Note "  diving con nome: $($diving.Count); siti: $($extra.Count); scartati tuffi/piscine: $($skip.tuffi); diving senza nome: $($skip.senzaNome)"

# Diving doppi (nodo + edificio dello stesso centro).
$gd = [Grid]::new(); $dk = New-Object System.Collections.ArrayList; $dd = 0
foreach ($p in $diving) {
  $twin = $gd.Near($p.a, $p.o, 1) | Where-Object { (Km $_.a $_.o $p.a $p.o) -le 0.03 -or ((NamesNear $_.n $p.n) -and (Km $_.a $_.o $p.a $p.o) -le 0.3) } | Select-Object -First 1
  if ($twin) { if (-not $twin.w -and $p.w) { $twin.w = $p.w }; if (-not $twin.t -and $p.t) { $twin.t = $p.t }; $dd++; continue }
  $gd.Add($p); [void]$dk.Add($p)
}
$diving = $dk
Note "  diving doppi uniti: $dd -> diving: $($diving.Count)"

# ---------- 3. Wikidata ----------
$wdFile = Join-Path $Cache "wikidata.json"
if (-not (Test-Path $wdFile) -or (Get-Item $wdFile).LastWriteTime -lt (Get-Date).AddDays(-7)) {
  $sparql = 'SELECT ?s ?sLabel ?c WHERE { VALUES ?t { wd:Q2141554 wd:Q26205080 } ?s wdt:P31 ?t ; wdt:P625 ?c . SERVICE wikibase:label { bd:serviceParam wikibase:language "it,en,fr,es,de,pt,nl" . } }'
  Invoke-WebRequest ("https://query.wikidata.org/sparql?format=json&query=" + [uri]::EscapeDataString($sparql)) -UserAgent $ua -OutFile $wdFile -TimeoutSec 120 -UseBasicParsing
}
$wd = ([IO.File]::ReadAllText($wdFile, $utf8) | ConvertFrom-Json).results.bindings
$wdn = 0
foreach ($b in $wd) {
  if ($b.c.value -notmatch 'Point\(([-0-9.eE]+) ([-0-9.eE]+)\)') { continue }
  $o = [double]::Parse($Matches[1], [Globalization.CultureInfo]::InvariantCulture); $a = [double]::Parse($Matches[2], [Globalization.CultureInfo]::InvariantCulture)
  $name = Clean $b.sLabel.value
  if ($name -match '^Q\d+$') { continue }
  [void]$extra.Add([pscustomobject]@{ n = $name; a = $a; o = $o; s = 'w' }); $wdn++
}
Note "Wikidata: $wdn siti"

# ---------- 4. Catalogo curato (sites.js) ----------
$sitesJs = [IO.File]::ReadAllText((Join-Path $root "sites.js"), $utf8)
$cur = [regex]::Matches($sitesJs, '\{ id: "[^"]+", name: "([^"]+)", country: "([^"]*)", lat: (-?[0-9.]+), lng: (-?[0-9.]+) \}')
$curated = foreach ($m in $cur) { [pscustomobject]@{ n = $m.Groups[1].Value; k = $m.Groups[2].Value; a = [double]::Parse($m.Groups[3].Value, [Globalization.CultureInfo]::InvariantCulture); o = [double]::Parse($m.Groups[4].Value, [Globalization.CultureInfo]::InvariantCulture) } }
Note "Catalogo curato: $(@($curated).Count) siti"
# Controllo: stesso nome nel file principale ma lontano -> possibile errore di posizione (solo segnalato).
foreach ($p in $curated) {
  $best = $null; $bestKm = 1e9
  foreach ($q in $g.Near($p.a, $p.o, 30)) { if ((Norm $q.n) -eq (Norm $p.n)) { $km = Km $p.a $p.o $q.a $q.o; if ($km -lt $bestKm) { $bestKm = $km; $best = $q } } }
  if ($best -and $bestKm -gt 5 -and $best.c -ge 10) { Note ("  posizione da verificare: {0} ({1}) dista {2:N1} km da '{3}' ({4} schede)" -f $p.n, $p.k, $bestKm, $best.n, $best.c) }
  [void]$extra.Add([pscustomobject]@{ n = $p.n; a = $p.a; o = $p.o; s = 's' })
}

# ---------- 5. Siti in più: solo quelli che mancano nel file principale ----------
$ge = [Grid]::new(); $ek = New-Object System.Collections.ArrayList; $already = 0; $twins = 0
foreach ($p in ($extra | Sort-Object @{ e = { @{ s = 0; w = 1; o = 2 }[$_.s] } }, @{ e = { -not $_.n } })) {
  if ([math]::Abs($p.a) -gt 85 -or ($p.a -eq [math]::Round($p.a) -and $p.o -eq [math]::Round($p.o))) { continue }
  $hit = $g.Near($p.a, $p.o, 2) | Where-Object { $km = Km $_.a $_.o $p.a $p.o; $km -le 0.25 -or ($km -le 2 -and (NamesNear $_.n $p.n)) } | Select-Object -First 1
  if ($hit) { $already++; continue }
  $twin = $ge.Near($p.a, $p.o, 1) | Where-Object { $km = Km $_.a $_.o $p.a $p.o; $km -le 0.1 -or ($km -le 1 -and (NamesNear $_.n $p.n)) } | Select-Object -First 1
  if ($twin) { if (-not $twin.n -and $p.n) { $twin.n = $p.n }; $twins++; continue }
  $ge.Add($p); [void]$ek.Add($p)
}
Note "Siti in più: $($ek.Count) nuovi (già presenti: $already, doppi tra fonti: $twins)"
$ek | Group-Object s | ForEach-Object { Note ("  fonte {0}: {1}" -f @{ o = 'OpenStreetMap'; w = 'Wikidata'; s = 'catalogo curato' }[$_.Name], $_.Count) }

# ---------- 6. Scrittura ----------
$sb = New-Object Text.StringBuilder; [void]$sb.Append('[')
$first = $true
foreach ($p in $main) { if (-not $first) { [void]$sb.Append(',') }; $first = $false; [void]$sb.Append('[' + (J $p.n) + ',' + (Num $p.a) + ',' + (Num $p.o) + ',' + $p.c + ']') }
[void]$sb.Append(']'); [IO.File]::WriteAllText($mainPath, $sb.ToString(), $utf8)

$sb = New-Object Text.StringBuilder; [void]$sb.Append('{"d":[')
$first = $true
foreach ($p in ($diving | Sort-Object a, o)) { if (-not $first) { [void]$sb.Append(',') }; $first = $false; [void]$sb.Append('[' + (J $p.n) + ',' + (Num $p.a) + ',' + (Num $p.o) + ',' + (J $p.t) + ',' + (J $p.w) + ']') }
[void]$sb.Append('],"s":[')
$first = $true
foreach ($p in ($ek | Sort-Object a, o)) { if (-not $first) { [void]$sb.Append(',') }; $first = $false; [void]$sb.Append('[' + (J $p.n) + ',' + (Num $p.a) + ',' + (Num $p.o) + ',' + (J $p.s) + ']') }
[void]$sb.Append(']}'); [IO.File]::WriteAllText((Join-Path $root "dive-sites.json"), $sb.ToString(), $utf8)

Note ("Scritti: divelogs-sites.json {0:N0} KB, dive-sites.json {1:N0} KB" -f ((Get-Item $mainPath).Length / 1KB), ((Get-Item (Join-Path $root "dive-sites.json")).Length / 1KB))
[IO.File]::WriteAllLines((Join-Path $Cache "rapporto.txt"), [string[]]$report, $utf8)
