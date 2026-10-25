# Sube el sitio a Cloudflare Pages en tandas chicas.
#
# Sirve cuando `wrangler pages deploy .` falla con "Failed to upload files"
# porque la conexion se corta con el volumen total (~75 MB).
#
# Wrangler deduplica por hash: al terminar, un deploy completo normal
# sube 0 archivos y publica todo junto.
#
# Uso:  powershell -ExecutionPolicy Bypass -File subir-por-partes.ps1

$ErrorActionPreference = "Stop"

$src    = $PSScriptRoot
$work   = Join-Path $env:TEMP "geometria-deploy"
$batch  = Join-Path $work "batch"
$cfrun  = Join-Path $work "run"
$LIMIT  = 8MB
$PROJECT = "geometria-conurbano"

Write-Host "Preparando copia limpia del sitio..."
if (Test-Path $work) { Remove-Item $work -Recurse -Force }
New-Item -ItemType Directory -Path $batch, $cfrun -Force | Out-Null

$exclude = @(".git", "node_modules", "_logo_backup", "cfworker", "assets-tmp")
$files = Get-ChildItem $src -Recurse -File | Where-Object {
    $rel = $_.FullName.Substring($src.Length).TrimStart("\")
    $skip = $false
    foreach ($e in $exclude) { if ($rel -like "$e\*" -or $rel -eq $e) { $skip = $true } }
    -not $skip -and $_.Name -ne "subir-por-partes.ps1"
}

# Agrupar en tandas de hasta $LIMIT
$groups = @(); $cur = @(); $curSize = 0
foreach ($f in $files) {
    if ($curSize + $f.Length -gt $LIMIT -and $cur.Count -gt 0) {
        $groups += ,$cur; $cur = @(); $curSize = 0
    }
    $cur += $f; $curSize += $f.Length
}
if ($cur.Count -gt 0) { $groups += ,$cur }

Write-Host "Tandas: $($groups.Count)"

for ($i = 0; $i -lt $groups.Count; $i++) {
    if (Test-Path $batch) { Remove-Item $batch -Recurse -Force }
    New-Item -ItemType Directory -Path $batch | Out-Null

    foreach ($f in $groups[$i]) {
        $rel = $f.FullName.Substring($src.Length).TrimStart("\")
        $dst = Join-Path $batch $rel
        $dir = Split-Path $dst -Parent
        if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
        Copy-Item $f.FullName $dst
    }

    $mb = [math]::Round((($groups[$i] | Measure-Object Length -Sum).Sum) / 1MB, 1)
    Write-Host "=== Tanda $($i+1)/$($groups.Count) ($mb MB, $($groups[$i].Count) archivos)"

    Push-Location $cfrun
    $out = & npx --yes wrangler pages deploy $batch --project-name $PROJECT --branch main --commit-dirty=true 2>&1
    Pop-Location

    $out | Select-String -Pattern "Success! Uploaded|Deployment complete|ERROR" | Select-Object -Last 2 |
        ForEach-Object { "   " + $_.Line.Trim() }

    if (-not ($out | Select-String -Pattern "Deployment complete")) {
        Write-Host "   !! Fallo la tanda $($i+1). Reintentá el script: lo ya subido no se re-sube."
        exit 1
    }
}

Write-Host ""
Write-Host "Tandas completas. Ahora publicá todo junto:"
Write-Host "  npx wrangler pages deploy . --project-name $PROJECT --branch main"
