# Genera marine-catalog.json: il catalogo esteso della Biologia Marina (Mediterraneo e resto del mondo).
# Fonti aperte: iNaturalist (specie osservate, nomi italiani, foto con licenza libera e credito)
# e WoRMS (solo specie registrate come marine). Le 543 schede scritte a mano in biology.js restano a parte.
# Uso:  powershell -NoProfile -ExecutionPolicy Bypass -File tools\catalogo-marino.ps1
# Rispetta i limiti d'uso: circa 1 richiesta al secondo a iNaturalist.

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding($false)
$ua = @{ "User-Agent" = "SeaDiveLogBook-catalogo/1.0 (sito statico GitHub Pages)" }

# Sezione della guida -> gruppi iNaturalist, gruppi da escludere, quante specie al massimo (Mediterraneo / mondo)
$groups = @(
  @{ id = "pesci";       taxa = "47178,47273";                              without = "";                                   med = 600; world = 1500 },
  @{ id = "flora";       taxa = "50863,48220,57774,71606,50376,52615";      without = "";                                   med = 250; world = 400 },
  @{ id = "coralli";     taxa = "47532,340493,121454,51198,152818";         without = "";                                   med = 150; world = 450 },
  @{ id = "nudibranchi"; taxa = "47113,775804,47801,775833,49784";          without = "";                                   med = 300; world = 500 },
  @{ id = "molluschi";   taxa = "47459,47584,47114,47429";                  without = "47113,775804,47801,775833,49784";    med = 300; world = 500 },
  @{ id = "crostacei";   taxa = "47187,144117";                             without = "";                                   med = 250; world = 400 },
  @{ id = "meduse";      taxa = "48332,68095,48921,51508,47797,47705";      without = "";                                   med = 150; world = 300 },
  @{ id = "spugne";      taxa = "48824";                                    without = "";                                   med = 100; world = 200 },
  @{ id = "echinodermi"; taxa = "47549";                                    without = "";                                   med = 150; world = 350 },
  @{ id = "vermi";       taxa = "47490,52318";                              without = "";                                   med = 100; world = 200 },
  @{ id = "tunicati";    taxa = "47811,51104";                              without = "";                                   med = 80;  world = 150 },
  @{ id = "briozoi";     taxa = "68104";                                    without = "";                                   med = 60;  world = 100 },
  @{ id = "rettili";     taxa = "39657,39675,492346";                       without = "";                                   med = 20;  world = 40 },
  @{ id = "mammiferi";   taxa = "152871,46306,41687,41736,41764";           without = "";                                   med = 40;  world = 120 },
  @{ id = "altri";       taxa = "326110";                                   without = "";                                   med = 5;   world = 10 }
)

# Mediterraneo in due riquadri, per lasciare fuori il Mar Nero
$medBoxes = @("swlat=30&swlng=-6&nelat=46&nelng=27", "swlat=30&swlng=27&nelat=40.5&nelng=36.5")

$lastCall = [DateTime]::MinValue
function Get-Inat([string]$query) {
  $wait = 1100 - ((Get-Date) - $script:lastCall).TotalMilliseconds
  if ($wait -gt 0) { Start-Sleep -Milliseconds ([int]$wait) }
  $script:lastCall = Get-Date
  for ($try = 0; $try -lt 4; $try++) {
    try { return Invoke-RestMethod -Headers $ua "https://api.inaturalist.org/v1/observations/species_counts?$query" }
    catch { Start-Sleep -Seconds (3 * ($try + 1)) }
  }
  throw "iNaturalist non risponde: $query"
}

function Get-Counts([string]$taxa, [string]$without, [string]$area, [int]$max, [int]$minObs) {
  $rows = @()
  $page = 1
  while ($rows.Count -lt $max) {
    $q = "taxon_id=$taxa&quality_grade=research&rank=species&locale=it&per_page=500&page=$page"
    if ($without) { $q += "&without_taxon_id=$without" }
    if ($area) { $q += "&$area" }
    $r = Get-Inat $q
    $batch = @($r.results | Where-Object { $_.count -ge $minObs })
    $rows += $batch
    if ($r.results.Count -lt 500 -or $batch.Count -lt $r.results.Count) { break }
    $page++
  }
  return $rows | Select-Object -First $max
}

function Credit($photo) {
  if (-not $photo -or -not $photo.license_code) { return "" }
  $t = ($photo.attribution -replace ',\s*uploaded by .*$', '').Trim()
  if (-not $t) { $t = "iNaturalist, " + $photo.license_code.ToUpper() }
  return $t
}

# Nomi già presenti nella guida scritta a mano
$bio = [IO.File]::ReadAllText((Join-Path $root "biology.js"), $utf8)
$curated = @{}
[regex]::Matches($bio, 'sp\("[^"]+",\s*"[^"]*",\s*"([^"]+)"') | ForEach-Object { $curated[$_.Groups[1].Value.ToLower()] = $true }
Write-Output ("Schede scritte a mano: {0}" -f $curated.Count)

$all = @{}   # nome latino -> scheda
$curatedPhotos = @{}   # nome latino (guida scritta a mano) -> @(foto, credito, id foto)
$curatedIds = @{}      # nome latino (guida scritta a mano) -> id iNaturalist
foreach ($g in $groups) {
  $medRows = @()
  foreach ($box in $medBoxes) { $medRows += Get-Counts $g.taxa $g.without $box $g.med 2 }
  $worldRows = Get-Counts $g.taxa $g.without "" $g.world 3
  $medNames = @{}
  foreach ($r in $medRows) { $medNames[$r.taxon.name.ToLower()] = $true }
  foreach ($r in @($medRows + $worldRows)) {
    $t = $r.taxon
    $key = $t.name.ToLower()
    if ($curated.ContainsKey($key)) {
      # Specie già nella guida scritta a mano: serve solo la sua foto libera, così l'app non la cerca in rete
      $credit = Credit $t.default_photo
      if ($credit -and -not $curatedPhotos.ContainsKey($key)) {
        $curatedPhotos[$key] = @([string]$t.default_photo.medium_url, $credit, [string]$t.default_photo.id)
      }
      if (-not $curatedIds.ContainsKey($key)) { $curatedIds[$key] = [string]$t.id }
      continue
    }
    $zone = if ($medNames.ContainsKey($key)) { "med" } else { "world" }
    if ($all.ContainsKey($key)) {
      if ($zone -eq "med") { $all[$key].z = "med" }
      $all[$key].n = [Math]::Max($all[$key].n, [int]$r.count)
      continue
    }
    $credit = Credit $t.default_photo
    $all[$key] = [ordered]@{
      la = $t.name
      it = [string]$t.preferred_common_name
      g  = $g.id
      z  = $zone
      n  = [int]$r.count
      p  = if ($credit) { [string]$t.default_photo.medium_url } else { "" }
      c  = $credit
      ph = if ($credit) { [string]$t.default_photo.id } else { "" }
      t  = [string]$t.id
      a  = ""
      v  = ""
    }
  }
  Write-Output ("{0}: Mediterraneo {1}, mondo {2}, catalogo finora {3}" -f $g.id, $medRows.Count, $worldRows.Count, $all.Count)
}

$freshFamilies = @("Salmonidae", "Gasterosteidae", "Cyprinidae", "Centrarchidae", "Poeciliidae", "Cichlidae", "Percidae", "Ictaluridae", "Esocidae", "Catostomidae", "Cobitidae", "Leuciscidae", "Fundulidae", "Cyprinodontidae", "Osmeridae", "Coregonidae", "Thymallidae")

# Solo specie marine, secondo WoRMS
$names = @($all.Keys)
$keep = @{}
for ($i = 0; $i -lt $names.Count; $i += 50) {
  $batch = $names[$i..([Math]::Min($i + 49, $names.Count - 1))]
  $qs = ($batch | ForEach-Object { "scientificnames[]=" + [Uri]::EscapeDataString($all[$_].la) }) -join "&"
  $res = $null
  for ($try = 0; $try -lt 4 -and $null -eq $res; $try++) {
    try { $res = Invoke-RestMethod -Headers $ua "https://www.marinespecies.org/rest/AphiaRecordsByMatchNames?$qs&marine_only=true" }
    catch { Start-Sleep -Seconds (3 * ($try + 1)) }
  }
  for ($j = 0; $j -lt $batch.Count; $j++) {
    $m = @($res[$j]) | Where-Object { $_ -and $_.AphiaID } | Select-Object -First 1
    if (-not $m) { continue }
    # Solo specie registrate come marine: "salmastra" da sola fa entrare carpe, gambusie e simili.
    if ($m.isMarine -ne 1) { continue }
    # Famiglie d'acqua dolce che WoRMS segna anche come marine (specie che risalgono i fiumi o vivono in laguna)
    if ($freshFamilies -contains [string]$m.family) { continue }
    $row = $all[$batch[$j]]
    $row.a = [string]$m.valid_AphiaID
    if ($m.valid_name -and $m.valid_name -ne $row.la) { $row.v = [string]$m.valid_name }
    $keep[$batch[$j]] = $true
  }
  Start-Sleep -Milliseconds 300
}
Write-Output ("Marine secondo WoRMS: {0} su {1}" -f $keep.Count, $all.Count)

# Specie senza foto libera: si cerca tra le altre foto della specie la prima con licenza
$missing = @($keep.Keys | Where-Object { -not $all[$_].p -and $all[$_].t })
for ($i = 0; $i -lt $missing.Count; $i += 30) {
  $batch = $missing[$i..([Math]::Min($i + 29, $missing.Count - 1))]
  $ids = ($batch | ForEach-Object { $all[$_].t }) -join ","
  $wait = 1100 - ((Get-Date) - $script:lastCall).TotalMilliseconds
  if ($wait -gt 0) { Start-Sleep -Milliseconds ([int]$wait) }
  $script:lastCall = Get-Date
  try { $res = Invoke-RestMethod -Headers $ua "https://api.inaturalist.org/v1/taxa/$ids" } catch { continue }
  foreach ($t in $res.results) {
    $key = $batch | Where-Object { $all[$_].t -eq [string]$t.id } | Select-Object -First 1
    if (-not $key) { continue }
    $photo = @($t.taxon_photos | ForEach-Object { $_.photo } | Where-Object { $_.license_code }) | Select-Object -First 1
    $credit = Credit $photo
    if ($credit) {
      $all[$key].p = [string]$photo.medium_url
      $all[$key].c = $credit
      $all[$key].ph = [string]$photo.id
    }
  }
}
Write-Output ("Specie senza foto libera alla fine: {0}" -f @($keep.Keys | Where-Object { -not $all[$_].p }).Count)

# Foto per le schede scritte a mano che le liste non hanno trovato: ricerca per nome, poi tra tutte le foto
$needIds = @{}
foreach ($key in @($curated.Keys | Where-Object { -not $curatedPhotos.ContainsKey($_) })) {
  if ($curatedIds.ContainsKey($key)) { $needIds[$key] = $curatedIds[$key]; continue }
  $wait = 1100 - ((Get-Date) - $script:lastCall).TotalMilliseconds
  if ($wait -gt 0) { Start-Sleep -Milliseconds ([int]$wait) }
  $script:lastCall = Get-Date
  try { $res = Invoke-RestMethod -Headers $ua ("https://api.inaturalist.org/v1/taxa?per_page=10&q=" + [Uri]::EscapeDataString($key)) } catch { continue }
  $hit = @($res.results | Where-Object { $_.name.ToLower() -eq $key }) | Select-Object -First 1
  if (-not $hit) { continue }
  $credit = Credit $hit.default_photo
  if ($credit) { $curatedPhotos[$key] = @([string]$hit.default_photo.medium_url, $credit, [string]$hit.default_photo.id) }
  else { $needIds[$key] = [string]$hit.id }
}
$needKeys = @($needIds.Keys)
for ($i = 0; $i -lt $needKeys.Count; $i += 30) {
  $batch = $needKeys[$i..([Math]::Min($i + 29, $needKeys.Count - 1))]
  $wait = 1100 - ((Get-Date) - $script:lastCall).TotalMilliseconds
  if ($wait -gt 0) { Start-Sleep -Milliseconds ([int]$wait) }
  $script:lastCall = Get-Date
  try { $res = Invoke-RestMethod -Headers $ua ("https://api.inaturalist.org/v1/taxa/" + (($batch | ForEach-Object { $needIds[$_] }) -join ",")) } catch { continue }
  foreach ($t in $res.results) {
    $key = $batch | Where-Object { $needIds[$_] -eq [string]$t.id } | Select-Object -First 1
    if (-not $key) { continue }
    $photo = @($t.taxon_photos | ForEach-Object { $_.photo } | Where-Object { $_.license_code }) | Select-Object -First 1
    $credit = Credit $photo
    if ($credit) { $curatedPhotos[$key] = @([string]$photo.medium_url, $credit, [string]$photo.id) }
  }
}
Write-Output ("Foto per le schede scritte a mano: {0} su {1}" -f $curatedPhotos.Count, $curated.Count)

$order = @{}
for ($k = 0; $k -lt $groups.Count; $k++) { $order[$groups[$k].id] = $k }
$species = @($keep.Keys | ForEach-Object { $all[$_] } | Sort-Object @{ e = { $order[$_.g] } }, @{ e = { $_.n }; Descending = $true })
$rows = $species | ForEach-Object { , @($_.la, $_.it, $_.g, $_.z, $_.n, $_.p, $_.c, $_.ph, $_.t, $_.a, $_.v) }
$doc = [ordered]@{
  v = 1
  generated = (Get-Date).ToString("yyyy-MM-dd")
  fields = @("la", "it", "g", "z", "n", "p", "c", "ph", "t", "a", "v")
  sources = "iNaturalist (osservazioni verificate, nomi comuni, foto con licenza libera) e WoRMS (specie marine)"
  species = $rows
  # Foto delle schede scritte a mano: nome latino (minuscolo) -> [foto, credito, id foto]
  curatedPhotos = $curatedPhotos
}
$json = $doc | ConvertTo-Json -Depth 5 -Compress
[IO.File]::WriteAllText((Join-Path $root "marine-catalog.json"), $json, $utf8)
Write-Output ("Scritto marine-catalog.json: {0} specie, {1} KB" -f $species.Count, [Math]::Round($json.Length / 1024))
