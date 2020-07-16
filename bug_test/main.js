const W3GReplay = require('../node_modules/w3gjs');
const Parser = new W3GReplay();

const replayFile = '../replays/bufferissue.w3g';

console.log("starting bug test");

try {
  Parser.parse(replayFile);
  console.log("replay worked");
} catch (e) {
  console.log("error: ", e);
}

console.log("done with bug test");
