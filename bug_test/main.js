const wc3v         = require('../wc3v');

const replayPath1 = '../replays/bufferissue.w3g';

console.log("starting bug test 1");

const results = wc3v.parseReplays({
        inTestMode: true,
        isProduction: true,
        paths: [replayPath1]
      }); 

console.log("done with bug test 1");

const replayPath2 = '../replays/bufferissue.w3g';

console.log("starting bug test 2");

const results = wc3v.parseReplays({
        inTestMode: true,
        isProduction: true,
        paths: [replayPath2]
      }); 

console.log("done with bug test 2");
