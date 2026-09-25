$ErrorActionPreference = "Stop"

$portainerUrl = "https://pac.produtoweb.com.br"
$user = "pwbot"
$pass = $env:PORTAINER_PASSWORD

Write-Host "[1/6] Compilando Frontend e Site Vitrine..."
Set-Location -Path "frontend"
npm run build
Set-Location -Path "..\site"
npm run build
Set-Location -Path ".."

Write-Host "[2/6] Preparando pacote de deploy..."
if (Test-Path "deploy_tmp") { Remove-Item -Recurse -Force "deploy_tmp" }
New-Item -ItemType Directory -Force -Path "deploy_tmp\sistema" | Out-Null
New-Item -ItemType Directory -Force -Path "deploy_tmp\site" | Out-Null

Copy-Item "nginx.prod.conf" "deploy_tmp\default.conf"
Copy-Item -Recurse "frontend\dist\*" "deploy_tmp\sistema\"
Copy-Item -Recurse "site\dist\*" "deploy_tmp\site\"

$tarPath = "scratch/full_dist.tar.gz"
if (Test-Path $tarPath) { Remove-Item $tarPath -Force }
tar -czf $tarPath -C deploy_tmp .

Write-Host "[3/6] Autenticando no Portainer API..."
$authBody = @{ username = $user; password = $pass } | ConvertTo-Json
$authRes = Invoke-RestMethod -Uri "$portainerUrl/api/auth" -Method Post -Body $authBody -ContentType "application/json"
$token = [string]$authRes.jwt
$headers = @{ "Authorization" = "Bearer " + $token }

Write-Host "[4/6] Localizando container '/datapath-web' (ou app)..."
$containers = Invoke-RestMethod -Uri "$portainerUrl/api/endpoints/3/docker/containers/json?all=1" -Method Get -Headers $headers
$targetContainer = $containers | Where-Object { $_.Names -match "datapath-web|datapath-app" } | Select-Object -First 1

if (-not $targetContainer) {
    Write-Error "Container web não foi encontrado."
}

$targetId = $targetContainer.Id
Write-Host ("Container localizado: " + $targetId)

$tarBytes = [System.IO.File]::ReadAllBytes((Get-Item $tarPath).FullName)
$b64 = [Convert]::ToBase64String($tarBytes)
Write-Host ("Base64 Length: " + $b64.Length)

Write-Host "[5/6] Transmitindo arquivos (isso pode levar uns instantes)..."
$cmdInit = "rm -rf /tmp/deploy_work && mkdir -p /tmp/deploy_work && rm -f /tmp/dist.b64"
$execConfig1 = @{ AttachStdout = $true; AttachStderr = $true; Cmd = @("sh", "-c", $cmdInit) } | ConvertTo-Json
$exec1 = Invoke-RestMethod -Uri ("$portainerUrl/api/endpoints/3/docker/containers/" + $targetId + "/exec") -Method Post -Headers $headers -Body $execConfig1 -ContentType "application/json"
$startConfig = @{ Detach = $false; Tty = $false } | ConvertTo-Json
$null = Invoke-RestMethod -Uri ("$portainerUrl/api/endpoints/3/docker/exec/" + $exec1.Id + "/start") -Method Post -Headers $headers -Body $startConfig -ContentType "application/json"

$chunkSize = 25000
for ($i = 0; $i -lt $b64.Length; $i += $chunkSize) {
    $len = [Math]::Min($chunkSize, $b64.Length - $i)
    $part = $b64.Substring($i, $len)
    $cmdChunk = "echo '$part' >> /tmp/dist.b64"
    $execChunkConfig = @{ AttachStdout = $true; AttachStderr = $true; Cmd = @("sh", "-c", $cmdChunk) } | ConvertTo-Json
    $execChunk = Invoke-RestMethod -Uri ("$portainerUrl/api/endpoints/3/docker/containers/" + $targetId + "/exec") -Method Post -Headers $headers -Body $execChunkConfig -ContentType "application/json"
    $null = Invoke-RestMethod -Uri ("$portainerUrl/api/endpoints/3/docker/exec/" + $execChunk.Id + "/start") -Method Post -Headers $headers -Body $startConfig -ContentType "application/json"
    Write-Host "." -NoNewline
}
Write-Host ""

Write-Host "[6/6] Aplicando arquivos e recarregando Nginx..."
$cmdExtract = "cd /tmp/deploy_work && base64 -d /tmp/dist.b64 > full_dist.tar.gz && tar -xzf full_dist.tar.gz && cp default.conf /etc/nginx/sites-available/default && rm -rf /usr/share/nginx/html/* && cp -r sistema /usr/share/nginx/html/ && cp -r site /usr/share/nginx/html/ && nginx -s reload"
$execExtConfig = @{ AttachStdout = $true; AttachStderr = $true; Cmd = @("sh", "-c", $cmdExtract) } | ConvertTo-Json
$execExt = Invoke-RestMethod -Uri ("$portainerUrl/api/endpoints/3/docker/containers/" + $targetId + "/exec") -Method Post -Headers $headers -Body $execExtConfig -ContentType "application/json"
$extRes = Invoke-RestMethod -Uri ("$portainerUrl/api/endpoints/3/docker/exec/" + $execExt.Id + "/start") -Method Post -Headers $headers -Body $startConfig -ContentType "application/json"
Write-Host $extRes

Write-Host "DEPLOIED CONCLUIDO COM SUCESSO VIA HOT-DEPLOY!"
Write-Host "Site Vitrine: https://datapath.produtoweb.com.br"
Write-Host "Sistema Principal: https://datapath.produtoweb.com.br/sistema"

