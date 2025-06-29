#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Vidion environment variables...\n');

// Check if .env.local already exists
const envLocalPath = path.join(process.cwd(), '.env.local');
const envTemplatePath = path.join(process.cwd(), 'env.template');

if (fs.existsSync(envLocalPath)) {
  console.log('⚠️  .env.local already exists. Skipping creation.');
  console.log('   If you need to update your Clerk credentials, please edit .env.local manually.\n');
} else {
  if (fs.existsSync(envTemplatePath)) {
    // Copy env.template to .env.local
    const templateContent = fs.readFileSync(envTemplatePath, 'utf8');
    fs.writeFileSync(envLocalPath, templateContent);
    console.log('✅ Created .env.local from env.template');
    console.log('📝 Please review and update the Clerk credentials in .env.local\n');
  } else {
    console.log('❌ env.template not found. Please create .env.local manually.');
    console.log('   You can copy the example from the README.md file.\n');
  }
}

// Validate Clerk configuration
console.log('🔍 Validating Clerk configuration...');

const requiredVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_CLERK_FRONTEND_API'
];

if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const envVars = envContent.split('\n').reduce((acc, line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      acc[key.trim()] = valueParts.join('=').trim();
    }
    return acc;
  }, {});

  const missingVars = requiredVars.filter(varName => !envVars[varName]);
  
  if (missingVars.length === 0) {
    console.log('✅ All required Clerk environment variables are present');
  } else {
    console.log('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\n   Please update your .env.local file with the missing variables.');
  }
} else {
  console.log('❌ .env.local not found. Please create it first.');
}

console.log('\n🎉 Setup complete!');
console.log('   Run "pnpm dev" to start the development server.'); 