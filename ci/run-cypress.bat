@echo on
setlocal enabledelayedexpansion

REM --- START marker ---
echo === START Install/Run/Report ===

REM --- Versions ---
echo === Node and NPM versions ===
node -v
npm -v

REM --- Install dependencies ---
if exist package-lock.json (
  echo Found package-lock.json ^> running npm ci
  npm ci
) else (
  echo No package-lock.json ^> running npm install
  npm install
)

REM --- Ensure mochawesome toolchain (only if missing) ---
call npm ls mochawesome >nul 2>&1 || npm i -D mochawesome
call npm ls mochawesome-merge >nul 2>&1 || npm i -D mochawesome-merge
call npm ls mochawesome-report-generator >nul 2>&1 || npm i -D mochawesome-report-generator

REM --- Run Cypress with mochawesome JSON outputs ---
npx cypress run ^
  --config baseUrl=https://example.com,video=true ^
  --reporter mochawesome ^
  --reporter-options html=false,json=true,reportDir=cypress/reports

REM --- Merge JSON and generate HTML report ---
if exist cypress\reports\*.json (
  npx mochawesome-merge cypress\reports\*.json > cypress\reports\merged.json
  npx marge cypress\reports\merged.json -o cypress\reports --inline
) else (
  echo No Mochawesome JSON reports found to merge.
)

REM --- Diagnostics: list produced files ---
echo Workspace: %cd%
if exist cypress (
  echo === File tree under cypress ===
  dir cypress /s /b
) else (
  echo No cypress folder found in workspace.
)

REM --- Temporary: create a dummy artifact to validate archiving ---
mkdir cypress\reports 2>nul
echo dummy > cypress\reports\_dummy.txt

echo === END Install/Run/Report ===
endlocal