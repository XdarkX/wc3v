const wc3v         = require('../wc3v');
const replayFile = '../replays/bufferissue.w3g';

console.log("starting bug test");

const results = wc3v.parseReplays({
        inTestMode: true,
        isProduction: true,
        paths: [replayPath],
        hashes: [replayHash]
      }); 

console.log("done with bug test");
