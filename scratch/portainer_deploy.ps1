$ErrorActionPreference = "Stop"

$portainerUrl = "https://pac.produtoweb.com.br"
$user = "pwbot"
$pass = "sneviugaS!26"
$stackName = "app-datapath"

Write-Host "[1/4] Autenticando no Portainer..."
$authBody = @{ username = $user; password = $pass } | ConvertTo-Json
$authRes = Invoke-RestMethod -Uri "$portainerUrl/api/auth" -Method Post -Body $authBody -ContentType "application/json"
$token = [string]$authRes.jwt

Write-Host "[2/4] Buscando Stacks..."
$headers = @{
    "Authorization" = "Bearer $token"
}

$stacks = Invoke-RestMethod -Uri "$portainerUrl/api/stacks" -Method Get -Headers $headers

$targetStack = $stacks | Where-Object { $_.Name -eq $stackName }

if (-not $targetStack) {
    Write-Host "Stacks disponíveis:"
    foreach ($s in $stacks) {
        Write-Host ("ID: " + $s.Id + " | Name: " + $s.Name + " | EndpointId: " + $s.EndpointId)
    }
    $targetStack = $stacks | Where-Object { $_.Name -like "*datapath*" -or $_.Name -like "*app-*" } | Select-Object -First 1
}

Write-Host ("Target Stack -> ID: " + $targetStack.Id + " | Nome: " + $targetStack.Name)

Write-Host "[3/4] Obtendo docker-compose da Stack..."
$fileRes = Invoke-RestMethod -Uri ("$portainerUrl/api/stacks/" + $targetStack.Id + "/file") -Method Get -Headers $headers

Write-Host "[4/4] Executando Redeploy..."
$endpointId = $targetStack.EndpointId
$updateUrl = "$portainerUrl/api/stacks/" + $targetStack.Id + "?endpointId=" + $endpointId

$updatePayload = @{
    stackFileContent = $fileRes.StackFileContent
    env = $targetStack.Env
    prune = $true
    pullImage = $true
} | ConvertTo-Json -Depth 10

$updateRes = Invoke-RestMethod -Uri $updateUrl -Method Put -Headers $headers -Body $updatePayload -ContentType "application/json"

Write-Host "DEPLOIED CONCLUIDO COM SUCESSO!"
Write-Host "URL: https://datapath.produtoweb.com.br"
