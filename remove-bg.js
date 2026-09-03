const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function removeBackground() {
  const inputPath = path.join(__dirname, 'public', 'images', 'logo.png');
  const tempPath = path.join(__dirname, 'public', 'images', 'logo_temp.png');
  
  try {
    const { data, info } = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const threshold = 240;

    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (r > threshold && g > threshold && b > threshold) {
        data[i + 3] = 0;
      }
    }

    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels
      }
    })
    .png()
    .toFile(tempPath);
    
    fs.renameSync(tempPath, inputPath);
    console.log('Background removed successfully!');
  } catch (err) {
    console.error('Error:', err);
  }
}

removeBackground();
