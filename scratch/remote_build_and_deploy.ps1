$ErrorActionPreference = "Stop"

$portainerUrl = "https://pac.produtoweb.com.br"
$user = "pwbot"
$pass = 'McdSdM*1317a'
$stackId = 147
$endpointId = 3
$imageTag = "ghcr.io/ivensaugusto/datapath:latest"

Write-Host "=================================================="
Write-Host "🚀 INICIANDO BUILD E DEPLOY REMOTO - DATAPATH"
Write-Host "=================================================="

# 1. Autenticação Portainer
Write-Host "[1/5] Autenticando no Portainer..."
$authBody = @{ username = $user; password = $pass } | ConvertTo-Json
$authRes = Invoke-RestMethod -Uri "$portainerUrl/api/auth" -Method Post -Body $authBody -ContentType "application/json"
$token = [string]$authRes.jwt
$headers = @{ "Authorization" = "Bearer " + $token }

# 2. Empacotamento do contexto limpo
Write-Host "[2/5] Empacotando contexto da aplicação em tar.gz..."
$tarPath = "scratch/build_context.tar.gz"
if (Test-Path $tarPath) { Remove-Item $tarPath -Force }

tar -czf $tarPath --exclude="frontend/node_modules" --exclude="frontend/dist" --exclude="backend/src/*/bin" --exclude="backend/src/*/obj" --exclude="backend/tests/*/bin" --exclude="backend/tests/*/obj" --exclude=".git" Dockerfile.prod nginx.prod.conf backend frontend
$tarBytes = [System.IO.File]::ReadAllBytes((Get-Item $tarPath).FullName)
Write-Host ("Pacote gerado: " + [math]::Round($tarBytes.Length / 1MB, 2) + " MB")

# 3. Disparo do Build do Docker na VPS
Write-Host "[3/5] Enviando para o Docker Engine remoto e compilando imagem multi-stage ($imageTag)..."
$buildUri = "$portainerUrl/api/endpoints/$endpointId/docker/build?t=" + [System.Uri]::EscapeDataString($imageTag) + "&dockerfile=Dockerfile.prod"

$req = [System.Net.HttpWebRequest]::Create($buildUri)
$req.Method = "POST"
$req.Headers.Add("Authorization", "Bearer " + $token)
$req.ContentType = "application/x-tar"
$req.ContentLength = $tarBytes.Length
$req.Timeout = 1200000 # 20 minutos de timeout

$reqStream = $req.GetRequestStream()
$reqStream.Write($tarBytes, 0, $tarBytes.Length)
$reqStream.Flush()
$reqStream.Close()

Write-Host "Aguardando compilação do Docker na VPS..."
$resp = $req.GetResponse()
$respStream = $resp.GetResponseStream()
$reader = New-Object System.IO.StreamReader($respStream)

while (-not $reader.EndOfStream) {
    $line = $reader.ReadLine()
    if ($line) {
        try {
            $json = $line | ConvertFrom-Json
            if ($json.stream) {
                Write-Host $json.stream -NoNewline
            } elseif ($json.error) {
                Write-Error $json.error
            }
        } catch {
            Write-Host $line
        }
    }
}
$reader.Close()
$resp.Close()

Write-Host "`n✅ Imagem Docker construída com sucesso no servidor!"

# 4. Atualização e Inicialização da Stack no Portainer
Write-Host "[4/5] Atualizando e iniciando a stack app-datapath (Stack ID: $stackId)..."
$fileRes = Invoke-RestMethod -Uri "$portainerUrl/api/stacks/$stackId/file" -Method Get -Headers $headers
$stackRes = Invoke-RestMethod -Uri "$portainerUrl/api/stacks/$stackId" -Method Get -Headers $headers

$updateUrl = "$portainerUrl/api/stacks/$stackId?endpointId=$endpointId"
$updatePayload = @{
    stackFileContent = $fileRes.StackFileContent
    env = $stackRes.Env
    prune = $true
    pullImage = $false
} | ConvertTo-Json -Depth 10

$updateRes = Invoke-RestMethod -Uri $updateUrl -Method Put -Headers $headers -Body $updatePayload -ContentType "application/json"
Write-Host "Stack inicializada com sucesso!"

# 5. Validação dos Containers
Write-Host "[5/5] Verificando status dos containers em execução..."
Start-Sleep -Seconds 5
$containers = Invoke-RestMethod -Uri "$portainerUrl/api/endpoints/$endpointId/docker/containers/json?all=1" -Method Get -Headers $headers
$datapathContainers = $containers | Where-Object { $_.Names -match "datapath" }

foreach ($c in $datapathContainers) {
    Write-Host ("Container: " + ($c.Names -join ", ") + " | Estado: " + $c.State + " | Status: " + $c.Status)
}

Write-Host "=================================================="
Write-Host "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
Write-Host "🌐 Aplicação Online: https://datapath.produtoweb.com.br"
Write-Host "=================================================="
