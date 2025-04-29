const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const source = path.join(__dirname, '../public/logo.png');
const targetDir = path.join(__dirname, '../public/icons');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function generateIcons() {
  try {
    // Read the source image
    const sourceBuffer = await sharp(source).toBuffer();

    // Generate icons for each size
    for (const size of sizes) {
      const target = path.join(targetDir, `icon-${size}x${size}.png`);
      await sharp(sourceBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFile(target);
      console.log(`Generated ${size}x${size} icon`);
    }

    // Generate favicon.ico
    const faviconTarget = path.join(__dirname, '../public/favicon.ico');
    await sharp(sourceBuffer)
      .resize(32, 32)
      .toFile(faviconTarget);
    console.log('Generated favicon.ico');

    console.log('All PWA assets generated successfully!');
  } catch (error) {
    console.error('Error generating PWA assets:', error);
    process.exit(1);
  }
}

generateIcons(); 