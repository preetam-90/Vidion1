// Script to check YouTube API keys
const fs = require('fs');
const path = require('path');
const https = require('https');

// Load API keys from .env.local file
const envFilePath = path.join(__dirname, '.env.local');
let apiKeys = [];

try {
  const envContent = fs.readFileSync(envFilePath, 'utf8');
  const match = envContent.match(/NEXT_PUBLIC_YOUTUBE_API_KEYS=(.+)/);
  if (match && match[1]) {
    apiKeys = match[1].split(',').map(key => key.trim());
    console.log(`Found ${apiKeys.length} API keys to check`);
  } else {
    console.error('No YouTube API keys found in .env.local');
    process.exit(1);
  }
} catch (error) {
  console.error('Error reading .env.local file:', error);
  process.exit(1);
}

// Function to check a single API key
function checkApiKey(key, index) {
  return new Promise((resolve) => {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=id&maxResults=1&chart=mostPopular&key=${key}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          if (response.error) {
            if (response.error.errors && response.error.errors[0].reason === 'quotaExceeded') {
              console.log(`❌ Key ${index + 1}: Quota exceeded`);
              resolve({ index, valid: false, reason: 'quota' });
            } else {
              console.log(`❌ Key ${index + 1}: Invalid (${response.error.message || 'Unknown error'})`);
              resolve({ index, valid: false, reason: 'invalid' });
            }
          } else {
            console.log(`✅ Key ${index + 1}: Valid`);
            resolve({ index, valid: true });
          }
        } catch (error) {
          console.log(`❌ Key ${index + 1}: Error parsing response`);
          resolve({ index, valid: false, reason: 'parse_error' });
        }
      });
    }).on('error', (error) => {
      console.log(`❌ Key ${index + 1}: Request failed (${error.message})`);
      resolve({ index, valid: false, reason: 'request_error' });
    });
  });
}

// Check all API keys
async function checkAllKeys() {
  console.log('Checking API keys...');

  const results = await Promise.all(apiKeys.map(checkApiKey));

  const validKeys = results.filter(r => r.valid).length;
  const quotaExceeded = results.filter(r => r.reason === 'quota').length;
  const invalidKeys = results.filter(r => r.reason === 'invalid').length;
  const errorKeys = results.filter(r => r.reason === 'request_error' || r.reason === 'parse_error').length;

  console.log('\nSummary:');
  console.log(`Total keys: ${apiKeys.length}`);
  console.log(`Valid keys: ${validKeys}`);
  console.log(`Quota exceeded: ${quotaExceeded}`);
  console.log(`Invalid keys: ${invalidKeys}`);
  console.log(`Error checking: ${errorKeys}`);

  if (validKeys === 0) {
    console.log('\n❌ No valid keys available! The application will use fallback data.');
  } else {
    console.log(`\n✅ ${validKeys} valid keys available.`);
  }
}

checkAllKeys();