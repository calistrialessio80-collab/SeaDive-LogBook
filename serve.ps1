$root = $PSScriptRoot
$port = 5173
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
try {
  $listener.Start(64)
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
  ".fit"  = "application/octet-stream"
  ".gpx"  = "application/gpx+xml"
  ".svg"  = "image/svg+xml"
  ".pdf"  = "application/pdf"
  ".uddf" = "application/xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".webmanifest" = "application/manifest+json"
}

$pool = [runspacefactory]::CreateRunspacePool(1, 32)
$pool.Open()
$pending = [System.Collections.Generic.List[object]]::new()

$handler = {
  param($client, $root, $mime)
  try {
    $client.ReceiveTimeout = 5000
    $client.SendTimeout = 20000
    $stream = $client.GetStream()
    $buf = New-Object byte[] 8192
    $n = $stream.Read($buf, 0, $buf.Length)
    if ($n -le 0) { return }
    $req = [Text.Encoding]::ASCII.GetString($buf, 0, $n)
    $line = ($req -split "`r`n")[0]
    $rel = "/"
    if ($line -match '^[A-Z]+ (\S+)') { $rel = $Matches[1] }
    $path = [Uri]::UnescapeDataString(($rel -split "\?")[0].TrimStart("/"))
    if ([string]::IsNullOrWhiteSpace($path)) { $path = "index.html" }
    $full = Join-Path $root ($path -replace "/", "\")
    $rootFull = [IO.Path]::GetFullPath($root)
    $full = [IO.Path]::GetFullPath($full)
    if (-not $full.StartsWith($rootFull, [StringComparison]::OrdinalIgnoreCase)) { return }

    $send = {
      param($stream, $code, $ctype, $body)
      $reason = switch ($code) { 200 { "OK" } 404 { "Not Found" } default { "OK" } }
      $head = "HTTP/1.1 $code $reason`r`nContent-Type: $ctype`r`nContent-Length: $($body.Length)`r`nAccess-Control-Allow-Origin: *`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n"
      $hdr = [Text.Encoding]::ASCII.GetBytes($head)
      $stream.Write($hdr, 0, $hdr.Length)
      $offset = 0
      while ($offset -lt $body.Length) {
        $take = [Math]::Min(65536, $body.Length - $offset)
        $stream.Write($body, $offset, $take)
        $offset += $take
      }
      $stream.Flush()
    }

    if (-not (Test-Path -LiteralPath $full) -or (Get-Item -LiteralPath $full).PSIsContainer) {
      & $send $stream 404 "text/plain; charset=utf-8" ([Text.Encoding]::UTF8.GetBytes("Not found"))
    } else {
      $ext = [IO.Path]::GetExtension($full).ToLowerInvariant()
      $ctype = $mime[$ext]
      if (-not $ctype) { $ctype = "application/octet-stream" }
      & $send $stream 200 $ctype ([IO.File]::ReadAllBytes($full))
    }
  } catch {
    [Console]::Out.WriteLine("ERR " + $_.Exception.Message)
  } finally {
    try { $client.Close() } catch {}
  }
}

while ($true) {
  $client = $listener.AcceptTcpClient()
  $ps = [powershell]::Create()
  $ps.RunspacePool = $pool
  [void]$ps.AddScript($handler).AddArgument($client).AddArgument($root).AddArgument($mime)
  $handle = $ps.BeginInvoke()
  $pending.Add([pscustomobject]@{ Ps = $ps; Handle = $handle })
  for ($i = $pending.Count - 1; $i -ge 0; $i--) {
    if ($pending[$i].Handle.IsCompleted) {
      try { $pending[$i].Ps.EndInvoke($pending[$i].Handle) } catch {}
      $pending[$i].Ps.Dispose()
      $pending.RemoveAt($i)
    }
  }
}
