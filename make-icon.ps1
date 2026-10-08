Add-Type -AssemblyName System.Drawing
$src = "C:\Users\kokun\.cursor\projects\c-Users-kokun-SeaDive-LogBook\assets\c__Users_kokun_AppData_Roaming_Cursor_User_workspaceStorage_efa1aae3406d8ef03212f6d5d69be3d5_images_IMG_20260901_112749_075_13_13-4dcda2c7-b146-4463-93bd-7e63a6786635.jpg"
$outDir = $PSScriptRoot
$img = [System.Drawing.Image]::FromFile($src)
$side = [Math]::Min($img.Width, $img.Height)
$sx = [int](($img.Width - $side) / 2)
$sy = [int](($img.Height - $side) * 0.22)

function Save-Icon([int]$size, [string]$path) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 7
  $g.SmoothingMode = 2
  $g.TextRenderingHint = 4
  $dest = New-Object System.Drawing.Rectangle 0, 0, $size, $size
  $srcR = New-Object System.Drawing.Rectangle $sx, $sy, $side, $side
  $g.DrawImage($img, $dest, $srcR, [System.Drawing.GraphicsUnit]::Pixel)
  $bandH = [int]($size * 0.3)
  $overlay = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(195, 2, 16, 24))
  $g.FillRectangle($overlay, 0, $size - $bandH, $size, $bandH)
  $titlePt = [Math]::Max(14, $size / 7.2)
  $subPt = [Math]::Max(8, $size / 16)
  $titleFont = New-Object System.Drawing.Font "Georgia", ([single]$titlePt), ([System.Drawing.FontStyle]::Bold)
  $subFont = New-Object System.Drawing.Font "Segoe UI", ([single]$subPt), ([System.Drawing.FontStyle]::Bold)
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = 1
  $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(245, 251, 247))
  $sand = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(237, 217, 163))
  $g.DrawString("SeaDive", $titleFont, $white, (New-Object System.Drawing.RectangleF 0, ($size - $bandH + $size * 0.035), $size, ($titlePt * 1.4)), $sf)
  $g.DrawString("LogBook", $subFont, $sand, (New-Object System.Drawing.RectangleF 0, ($size - $bandH + $titlePt * 1.35), $size, ($subPt * 1.6)), $sf)
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  $titleFont.Dispose()
  $subFont.Dispose()
  $overlay.Dispose()
}

Save-Icon 512 (Join-Path $outDir "icon-512.png")
Save-Icon 192 (Join-Path $outDir "icon-192.png")
Save-Icon 180 (Join-Path $outDir "apple-touch-icon.png")
$img.Dispose()
Write-Output "ok"
