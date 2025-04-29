#!/bin/bash

# Check if port 3000 is already in use
if ss -tulpn | grep ":3000" > /dev/null; then
  echo "Port 3000 is already in use. Killing processes..."
  
  # Find process IDs using port 3000
  PIDS=$(ss -tulpn | grep ":3000" | awk '{print $7}' | cut -d"=" -f2 | cut -d"," -f1)
  
  # Kill each process
  for PID in $PIDS; do
    echo "Killing process $PID"
    kill -9 $PID
  done
  
  echo "Processes killed. Waiting for port to be released..."
  sleep 2
fi

# Double check that the port is free now
if ss -tulpn | grep ":3000" > /dev/null; then
  echo "Failed to free port 3000. Please check manually."
  exit 1
fi

# Start the Next.js server on port 3000
echo "Starting Next.js server on port 3000..."
exec next dev -p 3000 