const fs = require('fs');

const wc3v         = require('../wc3v');
const express = require('express'),
      md5     = require('md5');

const config = {
  port: 9999
};

console.log("starting bug test server");

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, ticketid, Content-Disposition");
  next();
});

app.post('/upload', (req, res, next) => {
  const replayPath = './bug-test-file.wc3v';
  req.pipe(fs.createWriteStream(replayPath));

  req.on('end', () => {
    const newReplayBuf = fs.readFileSync(replayPath);
      const replayHash = md5(newReplayBuf);

      console.log('parsing replay hash:', replayHash);

      const results = wc3v.parseReplays({
        inTestMode: true,
        isProduction: true,
        paths: [replayPath],
        hashes: [replayHash]
      }); 
  });
})

app.post('/bug', (req, res, next) => {
  console.log('starting bug test');

  const replayPath = '../replays/bad2.w3g';

  const newReplayBuf = fs.readFileSync(replayPath);
  const replayHash = md5(newReplayBuf);

  console.log('md5 of file: ', replayHash);

  const results = wc3v.parseReplays({
    inTestMode: true,
    isProduction: true,
    paths: [replayPath]
  }); 

  console.log('done running test');
});



app.listen(config.port, () => {
  console.log(`started wc3v-bugtest.  port: ${config.port}`);
});

