# Requires: Windows PowerShell 5+
# Usage examples:
#   ./tools/rename_whatsapp_images.ps1 -Source "שתפ" -Destination "dataset/raw"
#   ./tools/rename_whatsapp_images.ps1 -Source "C:\path\to\src" -Destination "C:\path\to\dataset\raw"

param(
    [string]$Source = "שתפ",
    [string]$Destination = "dataset/raw"
)

if (-not (Test-Path -LiteralPath $Source)) {
    Write-Error "Source folder not found: $Source"
    exit 1
}

# Create destination root if missing
New-Item -ItemType Directory -Force -Path $Destination | Out-Null

$images = Get-ChildItem -LiteralPath $Source -File -Include *.jpg,*.jpeg,*.png
if ($images.Count -eq 0) {
    Write-Host "No images found in $Source"
    exit 0
}

# Regex pattern for WhatsApp naming: "WhatsApp Image 2025-08-17 at 15.12.29 (1).jpeg"
$pattern = '^WhatsApp Image\s+(?<date>\d{4}-\d{2}-\d{2})\s+at\s+(?<time>\d{2}\.\d{2}\.\d{2})'

# Track counters per EtrogId for view indexing
$etrogCounters = @{}

foreach ($img in $images) {
    $name = $img.BaseName
    $ext = $img.Extension.ToLower()
    $m = [regex]::Match($name, $pattern)

    if (-not $m.Success) {
        # Fallback: use file timestamp
        $dateStr = $img.LastWriteTime.ToString('yyyy-MM-dd')
        $timeStr = $img.LastWriteTime.ToString('HH.mm.ss')
    } else {
        $dateStr = $m.Groups['date'].Value
        $timeStr = $m.Groups['time'].Value
    }

    $dateFolder = $dateStr
    $etrogId = "ETROG_" + ($dateStr.Replace('-', '')) + "_" + ($timeStr.Replace('.', ''))

    if (-not $etrogCounters.ContainsKey($etrogId)) {
        $etrogCounters[$etrogId] = 0
    }
    $etrogCounters[$etrogId]++
    $index = $etrogCounters[$etrogId]

    # Build folders
    $targetDir = Join-Path -Path $Destination -ChildPath (Join-Path -Path $dateFolder -ChildPath $etrogId)
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

    # Normalize extension to .jpg
    $targetName = "${etrogId}_view-" + ($index.ToString('00')) + ".jpg"
    $targetPath = Join-Path -Path $targetDir -ChildPath $targetName

    # Convert PNG to JPG if needed, otherwise copy
    if ($ext -eq '.png') {
        try {
            Add-Type -AssemblyName System.Drawing
            $bmp = [System.Drawing.Bitmap]::FromFile($img.FullName)
            $jpegEncoder = ([System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' })
            $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $quality = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 90L)
            $encParams.Param[0] = $quality
            $bmp.Save($targetPath, $jpegEncoder, $encParams)
            $bmp.Dispose()
            Write-Host "Converted: $($img.Name) -> $targetPath"
        } catch {
            Write-Warning "Failed to convert PNG, copying as-is: $($img.Name)"
            Copy-Item -LiteralPath $img.FullName -Destination $targetPath -Force
        }
    } else {
        Copy-Item -LiteralPath $img.FullName -Destination $targetPath -Force
        Write-Host "Copied: $($img.Name) -> $targetPath"
    }
}

Write-Host "Done. Organized images under: $Destination"

