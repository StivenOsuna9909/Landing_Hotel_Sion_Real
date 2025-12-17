# Script para convertir videos .MOV a .MP4 usando FFmpeg
# Requiere FFmpeg instalado: https://ffmpeg.org/download.html

$videosPath = "public\videos"
$movFiles = Get-ChildItem -Path $videosPath -Filter "*.MOV"

if ($movFiles.Count -eq 0) {
    Write-Host "No se encontraron archivos .MOV en $videosPath" -ForegroundColor Yellow
    exit
}

# Verificar si FFmpeg está instalado
$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ffmpeg) {
    Write-Host "FFmpeg no está instalado o no está en el PATH." -ForegroundColor Red
    Write-Host "Por favor, instala FFmpeg desde: https://ffmpeg.org/download.html" -ForegroundColor Yellow
    Write-Host "O descarga la versión para Windows desde: https://www.gyan.dev/ffmpeg/builds/" -ForegroundColor Yellow
    exit
}

Write-Host "Convirtiendo $($movFiles.Count) archivo(s) de .MOV a .MP4..." -ForegroundColor Green
Write-Host ""

foreach ($file in $movFiles) {
    $outputFile = Join-Path $videosPath "$($file.BaseName).mp4"
    
    if (Test-Path $outputFile) {
        Write-Host "Saltando $($file.Name) - ya existe $($file.BaseName).mp4" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "Convirtiendo: $($file.Name) -> $($file.BaseName).mp4" -ForegroundColor Cyan
    
    # Comando FFmpeg para convertir a MP4 con buena calidad
    $ffmpegArgs = @(
        "-i", "`"$($file.FullName)`"",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "192k",
        "-movflags", "+faststart",
        "`"$outputFile`""
    )
    
    & ffmpeg $ffmpegArgs
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Convertido exitosamente: $($file.BaseName).mp4" -ForegroundColor Green
    } else {
        Write-Host "✗ Error al convertir: $($file.Name)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "Conversión completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Nota: Los archivos .MOV originales se mantienen. Puedes eliminarlos después de verificar que los .MP4 funcionan correctamente." -ForegroundColor Yellow

