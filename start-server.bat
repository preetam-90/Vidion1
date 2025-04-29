@echo off
echo Checking if port 3000 is in use...

:: Check if port 3000 is already in use
netstat -ano | findstr ":3000" > nul
if %errorlevel% == 0 (
  echo Port 3000 is already in use. Killing processes...
  
  :: Find process IDs using port 3000 and kill them
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
    echo Killing process %%a
    taskkill /F /PID %%a
  )
  
  echo Processes killed. Waiting for port to be released...
  timeout /t 2 /nobreak > nul
)

:: Double check that the port is free now
netstat -ano | findstr ":3000" > nul
if %errorlevel% == 0 (
  echo Failed to free port 3000. Please check manually.
  exit /b 1
)

:: Start the Next.js server on port 3000
echo Starting Next.js server on port 3000...
next dev -p 3000 