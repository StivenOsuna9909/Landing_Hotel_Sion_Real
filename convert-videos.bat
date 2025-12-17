@echo off
REM Script para convertir videos .MOV a .MP4 usando FFmpeg
REM Requiere FFmpeg instalado: https://ffmpeg.org/download.html

set VIDEOS_PATH=public\videos

echo Verificando si FFmpeg esta instalado...
where ffmpeg >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo FFmpeg no esta instalado o no esta en el PATH.
    echo Por favor, instala FFmpeg desde: https://ffmpeg.org/download.html
    echo O descarga la version para Windows desde: https://www.gyan.dev/ffmpeg/builds/
    pause
    exit /b 1
)

echo.
echo Convirtiendo archivos .MOV a .MP4...
echo.

cd /d "%~dp0"

for %%F in ("%VIDEOS_PATH%\*.MOV") do (
    set "INPUT=%%F"
    set "OUTPUT=%%~dpnF.mp4"
    
    if exist "%%~dpnF.mp4" (
        echo Saltando %%~nxF - ya existe %%~nF.mp4
    ) else (
        echo Convirtiendo: %%~nxF -^> %%~nF.mp4
        ffmpeg -i "%%F" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 192k -movflags +faststart "%%~dpnF.mp4"
        if !ERRORLEVEL! EQU 0 (
            echo [OK] Convertido exitosamente: %%~nF.mp4
        ) else (
            echo [ERROR] Error al convertir: %%~nxF
        )
    )
    echo.
)

echo Conversión completada!
echo.
echo Nota: Los archivos .MOV originales se mantienen. Puedes eliminarlos después de verificar que los .MP4 funcionan correctamente.
pause

