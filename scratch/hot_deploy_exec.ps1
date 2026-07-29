$ErrorActionPreference = "Stop"

$portainerUrl = "https://pac.produtoweb.com.br"
$user = "pwbot"
$pass = "sneviugaS!26"

Write-Host "[1/5] Compilando Frontend React..."
Set-Location -Path "frontend"
npm run build
Set-Location -Path ".."

Write-Host "[2/5] Autenticando no Portainer API..."
$authBody = @{ username = $user; password = $pass } | ConvertTo-Json
$authRes = Invoke-RestMethod -Uri "$portainerUrl/api/auth" -Method Post -Body $authBody -ContentType "application/json"
$token = [string]$authRes.jwt
$headers = @{ "Authorization" = "Bearer " + $token }

Write-Host "[3/5] Localizando container '/datapath-app'..."
$containers = Invoke-RestMethod -Uri "$portainerUrl/api/endpoints/3/docker/containers/json?all=1" -Method Get -Headers $headers
$targetContainer = $containers | Where-Object { $_.Names -match "datapath-app" } | Select-Object -First 1

if (-not $targetContainer) {
    Write-Error "Container '/datapath-app' não foi encontrado."
}

$targetId = $targetContainer.Id
Write-Host ("Container localizado: " + $targetId)

Write-Host "[4/5] Compactando pasta dist..."
$tarPath = "scratch/frontend_dist.tar.gz"
if (Test-Path $tarPath) { Remove-Item $tarPath -Force }

tar -czf $tarPath -C frontend/dist .
$tarBytes = [System.IO.File]::ReadAllBytes((Get-Item $tarPath).FullName)
$b64 = [Convert]::ToBase64String($tarBytes)

Write-Host ("Base64 Length: " + $b64.Length)

Write-Host "[5/5] Transmitindo arquivos e recarregando Nginx via Exec API..."

# Limpa destino
$cmdInit = "rm -f /tmp/dist.b64 && rm -rf /usr/share/nginx/html/*"
$execConfig1 = @{ AttachStdout = $true; AttachStderr = $true; Cmd = @("sh", "-c", $cmdInit) } | ConvertTo-Json
$exec1 = Invoke-RestMethod -Uri ("$portainerUrl/api/endpoints/3/docker/containers/" + $targetId + "/exec") -Method Post -Headers $headers -Body $execConfig1 -ContentType "application/json"
$startConfig = @{ Detach = $false; Tty = $false } | ConvertTo-Json
$null = Invoke-RestMethod -Uri ("$portainerUrl/api/endpoints/3/docker/exec/" + $exec1.Id + "/start") -Method Post -Headers $headers -Body $startConfig -ContentType "application/json"

# Envia em partes
$chunkSize = 20000
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

# Descompacta e recarrega Nginx
$cmdFinal = "base64 -d /tmp/dist.b64 | tar -xz -C /usr/share/nginx/html && rm -f /tmp/dist.b64 && nginx -s reload"
$execFinalConfig = @{ AttachStdout = $true; AttachStderr = $true; Cmd = @("sh", "-c", $cmdFinal) } | ConvertTo-Json
$execFinal = Invoke-RestMethod -Uri ("$portainerUrl/api/endpoints/3/docker/containers/" + $targetId + "/exec") -Method Post -Headers $headers -Body $execFinalConfig -ContentType "application/json"
$resFinal = Invoke-RestMethod -Uri ("$portainerUrl/api/endpoints/3/docker/exec/" + $execFinal.Id + "/start") -Method Post -Headers $headers -Body $startConfig -ContentType "application/json"

Write-Host "🎉 HOT-DEPLOY REALIZADO COM SUCESSO EM PRODUÇÃO!"
Write-Host "🌐 Aplicação Online: https://datapath.produtoweb.com.br"
