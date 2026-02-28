# PowerShell script to start the backend server
Set-Location -Path "C:\Users\MR\OneDrive\Desktop\Learning\backend"
Write-Host "Changed to: $(Get-Location)"
Write-Host "Starting server..."
& node server.js
