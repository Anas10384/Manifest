const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Channel list
const channels = {
  '1': 'http://exm3u.extraott.com:80/live/2249871453/1991220000/400159598.m3u8',
  '2': 'http://exm3u.extraott.com:80/live/2249871453/1991220000/401627870.m3u8',
  '3': 'http://exm3u.extraott.com:80/live/2249871453/1991220000/187263.m3u8',
  '4': 'http://ptu.ridsys.in/riptv/live/stream20/index.m3u8',
  '5': 'http://exm3u.extraott.com:80/live/2249871453/1991220000/400157873.m3u8',
  '6': 'http://exm3u.extraott.com:80/live/2249871453/1991220000/400157873.m3u8'
};

// Serve DASH output folder
app.use('/dash', express.static(path.join(__dirname, 'dash')));

app.get('/box.mpd', (req, res) => {
  const id = req.query.id;
  if (!channels[id]) return res.status(404).send('Channel not found.');

  const streamUrl = channels[id];
  const outputDir = path.join(__dirname, 'dash');

  // Clear old files
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir);

  // FFmpeg command to convert M3U8 to DASH (MPD)
  const ffmpeg = spawn('ffmpeg', [
    '-i', streamUrl,
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-f', 'dash',
    '-seg_duration', '4',
    path.join(outputDir, 'stream.mpd')
  ]);

  ffmpeg.stderr.on('data', data => console.error(`FFmpeg: ${data}`));

  ffmpeg.on('close', code => {
    console.log(`FFmpeg exited with code ${code}`);
  });

  // Respond with .mpd path to play
  res.send(`<video controls autoplay src="/dash/stream.mpd" type="application/dash+xml"></video>`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
