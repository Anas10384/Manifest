const { exec } = require('child_process');
const path = require('path');

// Change this to your input URL or local file
const inputURL = 'https://ts-j8bh.onrender.com/box.ts?id=4';
const outputMPD = 'output/Tamil.mpd';

const cmd = `ffmpeg -i "${inputURL}" -c:v copy -c:a copy -f dash -seg_duration 4 ${outputMPD}`;

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`FFmpeg stderr:\n${stderr}`);
  }
  console.log(`FFmpeg stdout:\n${stdout}`);
  console.log('Conversion complete. MPD file saved at:', outputMPD);
});
