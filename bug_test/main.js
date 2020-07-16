const wc3v         = require('../wc3v');

const replayPath1 = '../replays/bufferissue.w3g';

console.log("starting bug test 1");

const express = require('express');

const config = {
  port: 9999
};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, ticketid, Content-Disposition");
  next();
});

app.post('/upload', (req, res, next) => {
  console.log('starting bug test');
  
  const results = wc3v.parseReplays({
    inTestMode: true,
    isProduction: true,
    paths: [replayPath1]
  }); 

  console.log('done running test');
});
