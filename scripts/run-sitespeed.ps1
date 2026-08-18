param(
  [ValidateSet('representative', 'all-public')]
  [string]$Mode = 'representative',
  [string]$Site = 'http://host.docker.internal:4173'
)

$ErrorActionPreference = 'Stop'

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw 'Docker is required for the repeatable sitespeed.io audit. Install/start Docker Desktop first.'
}

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Push-Location $projectRoot

try {
  node ./scripts/generate-performance-urls.mjs --mode $Mode --site $Site
  $urls = Get-Content ./audit/performance-urls.txt | Where-Object { $_ -and -not $_.StartsWith('#') }

  if (-not $urls -or $urls.Count -eq 0) {
    throw 'No performance URLs were generated.'
  }

  Write-Host "Auditing $($urls.Count) Bonga URLs with sitespeed.io..." -ForegroundColor Cyan
  Write-Host 'The HTML report will be written to ./performance-results' -ForegroundColor Cyan

  $dockerArgs = @(
    'run', '--shm-size=2g', '--rm',
    '-v', "${projectRoot}:/sitespeed.io",
    'sitespeedio/sitespeed.io:42.6.0-plus1',
    '--preScript', '/sitespeed.io/audit/sitespeed/seed-state.mjs',
    '--browsertime.my.origin', $Site,
    '--plugins.remove', '@sitespeed.io/plugin-gpsi',
    '--mobile',
    '-n', '3',
    '--video',
    '--visualMetrics',
    '--cpu',
    '--axe.enable',
    '--budget.configPath', '/sitespeed.io/audit/performance-budget.json',
    '--budget.output', 'json',
    '--outputFolder', '/sitespeed.io/performance-results'
  ) + $urls

  & docker @dockerArgs
  exit $LASTEXITCODE
}
finally {
  Pop-Location
}
