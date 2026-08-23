$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$clientDirectory = Join-Path $projectRoot 'client'
$serverDirectory = Join-Path $projectRoot 'server'
$pythonExecutable = Join-Path $serverDirectory '.venv\Scripts\python.exe'
$nodeExecutable = 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$vinextCli = Join-Path $clientDirectory 'node_modules\vinext\dist\cli.js'

if (-not (Test-Path -LiteralPath $pythonExecutable)) {
    throw 'Backend environment is missing. Create server/.venv and install server/requirements.txt first.'
}

function Stop-PortfolioListener {
    param(
        [int]$Port,
        [string[]]$AllowedProcessNames
    )

    $listeners = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    foreach ($processId in @($listeners.OwningProcess | Sort-Object -Unique)) {
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if ($process -and $process.ProcessName -notin $AllowedProcessNames) {
            throw "Port $Port is being used by $($process.ProcessName). Stop it before starting the portfolio."
        }
        if ($process) {
            Stop-Process -Id $processId -Force
        }
    }
}

Stop-PortfolioListener -Port 3000 -AllowedProcessNames @('node')
Stop-PortfolioListener -Port 8080 -AllowedProcessNames @('python', 'pythonw')

$backendProcess = Start-Process `
    -FilePath $pythonExecutable `
    -ArgumentList 'app.py' `
    -WorkingDirectory $serverDirectory `
    -WindowStyle Hidden `
    -PassThru

try {
    Write-Host 'Portfolio: http://localhost:3000'
    Write-Host 'Press Ctrl+C to stop.'
    Push-Location $clientDirectory
    try {
        & $nodeExecutable $vinextCli dev
    }
    finally {
        Pop-Location
    }
}
finally {
    if ($backendProcess -and -not $backendProcess.HasExited) {
        Stop-Process -Id $backendProcess.Id
    }
}
