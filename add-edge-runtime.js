const fs = require('fs');
const path = require('path');

// Function to recursively find all route.ts or route.js files
function findRouteFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fileList = findRouteFiles(filePath, fileList);
    } else if (file === 'route.ts' || file === 'route.js' || 
               (file === 'page.tsx' && dir.includes('[')) || 
               (file === 'page.ts' && dir.includes('['))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to add Edge Runtime to a file if it doesn't have it
function addEdgeRuntime(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the file already has runtime defined
  if (!content.includes('export const runtime')) {
    // Add the runtime declaration after imports
    const lines = content.split('\n');
    let importEndIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '' && i > 0 && (lines[i-1].includes('import') || lines[i-1].includes('from'))) {
        importEndIndex = i;
        break;
      }
      if (i > 10) break; // Only check the first few lines
    }
    
    lines.splice(importEndIndex + 1, 0, "export const runtime = 'edge'", '');
    content = lines.join('\n');
    
    fs.writeFileSync(filePath, content);
    console.log(`Added Edge Runtime to: ${filePath}`);
  } else {
    console.log(`Edge Runtime already exists in: ${filePath}`);
  }
}

// Find all route files in the app directory
const appDir = path.join(__dirname, 'app');
const routeFiles = findRouteFiles(appDir);

// Add Edge Runtime to each file
routeFiles.forEach(addEdgeRuntime);

console.log(`\nAdded Edge Runtime to ${routeFiles.length} files.`); 