$root = $PSScriptRoot
$port = 5173
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
try {
  $listener.Start()
} catch {
  Write-Output "Porta $port occupata. Chiudi l'altro SeaDive e riprova."
  throw
}

$lan = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
  Where-Object { $_.IPAddress -notlike "127.*" -and $_.PrefixOrigin -ne "WellKnown" -and $_.IPAddress -notlike "169.254.*" } |
  Select-Object -ExpandProperty IPAddress -First 1)

Write-Output "PC:      http://127.0.0.1:$port/"
if ($lan) { Write-Output "Telefono (stessa Wi-Fi): http://${lan}:$port/" }
Write-Output "Il telefono deve essere sul Wi-Fi di casa, non sulla rete mobile."

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".json" = "application/json"
  ".svg"  = "image/svg+xml"
  ".pdf"  = "application/pdf"
  ".uddf" = "application/xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".webmanifest" = "application/manifest+json"
}

function Send-Http($stream, $code, $ctype, $bytes) {
  $reason = switch ($code) { 200 { "OK" } 404 { "Not Found" } default { "OK" } }
  $head = "HTTP/1.1 $code $reason`r`nContent-Type: $ctype`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n"
  $hdr = [Text.Encoding]::ASCII.GetBytes($head)
  $stream.Write($hdr, 0, $hdr.Length)
  if ($bytes.Length) { $stream.Write($bytes, 0, $bytes.Length) }
}

while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $client.ReceiveTimeout = 8000
    $stream = $client.GetStream()
    $buf = New-Object byte[] 8192
    $n = $stream.Read($buf, 0, $buf.Length)
    if ($n -le 0) { $client.Close(); continue }
    $req = [Text.Encoding]::ASCII.GetString($buf, 0, $n)
    $line = ($req -split "`r`n")[0]
    $rel = "/"
    if ($line -match '^[A-Z]+ (\S+)') { $rel = $Matches[1] }
    $path = [Uri]::UnescapeDataString(($rel -split "\?")[0].TrimStart("/"))
    if ([string]::IsNullOrWhiteSpace($path)) { $path = "index.html" }
    $full = Join-Path $root $path
    if (-not (Test-Path -LiteralPath $full) -or (Get-Item -LiteralPath $full).PSIsContainer) {
      Send-Http $stream 404 "text/plain; charset=utf-8" ([Text.Encoding]::UTF8.GetBytes("Not found"))
    } else {
      $ext = [IO.Path]::GetExtension($full).ToLowerInvariant()
      $ctype = $mime[$ext]
      if (-not $ctype) { $ctype = "application/octet-stream" }
      Send-Http $stream 200 $ctype ([IO.File]::ReadAllBytes($full))
    }
    $stream.Flush()
  } catch {
    # client dropped
  } finally {
    $client.Close()
  }
}
