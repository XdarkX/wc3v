const W3GReplay = require('./node_modules/w3gjs');
const { ActionBlockList } = require('./node_modules/w3gjs/parsers/actions');
const Parser = new W3GReplay();

const config = require("./config/config");
const UnitManager = require("./lib/UnitManager");

const fs = require('fs'),
      path = require('path');

let unitManager;
let actionCount = 0;
let hasParsedMeta = false;

let globalTime = 0;

/*
* For now - configure the replay files to parse here in the `paths`
*           list.
*           
* To enable verbose debugging, configure the UnitManager.js debugActions
* flag - or use player specific ID debugging.
*/
const paths = config.replayPaths;

const writeOutput = (filename, replay, players) => {

  const output = {
    replay: replay,
    players: players
  };

  console.log("about to write file", path.basename(filename));

  try {
    fs.writeFileSync(`./output/${path.basename(filename)}.wc3v`, JSON.stringify(output));
    console.log("done");
  } catch (e) {
    console.log("file write error: ", e);
  }
};

W3GReplay.prototype.processTimeSlot = function (timeSlotBlock) {
  if (!hasParsedMeta) {
    unitManager.setMetaData(this.gameMetaDataDecoded.meta);
    hasParsedMeta = true;
  }

  if (this.leaveEvents.length) {
    console.log("###");
    console.log("Found leave event:", this.leaveEvents);
    console.log("###");
  }

  globalTime += timeSlotBlock.timeIncrement;
  unitManager.processTick(globalTime);

  timeSlotBlock.actions.forEach(actionBlock => {
  	// try {
      unitManager.checkCreatePlayer(actionBlock);

	  	ActionBlockList.parse(actionBlock.actions).forEach(action => {
        actionCount++;

        // console.log("================================");
        // console.log(`Action ${actionCount} Player ${actionBlock.playerId}`);
        // console.log("================================");

        unitManager.handleAction(actionBlock, action);
	  	});
  	// } catch (ex) {
   //  	console.error(ex);
  	// }

    this.processCommandDataBlock(actionBlock);
  });
};

paths.forEach(path => {
  const {file} = path;
  
  unitManager = new UnitManager();
  hasParsedMeta = false;
  
  console.log("Parsing file: ", file);
  
  const replay = Parser.parse(file);
  let players = unitManager.players;

  writeOutput(file, replay, players);

  Object.keys(players).forEach(playerId => {
    console.log("************************************");
    console.log(`Inspecting player: ${playerId}`);

    // console.log(players[playerId]);

    let units = players[playerId].units;

    console.log(`Unit count: ${units.length}`);
    console.log(`Unregistered units: ${players[playerId].unregisteredUnitCount}`);

    let removedBuildings = players[playerId].removedBuildings;
    if (removedBuildings.length) {
      console.log("Showing removed buildings:");

      removedBuildings.forEach(building => {
        console.log("(removed)", building.displayName);
      });

      console.log("------------------------------------");
    }

    units.sort(unit => { 
      return unit.displayName;
    });

    units.forEach(unit => {
      if (unit.meta.hero) {
        const items = Object.keys(unit.items).map(key => {
          const item = unit.items[key];

          if (!item) {
            return `empty`;
          } else {
            return item.displayName;
          }
        });

        if (unit.isIllusion) {
          console.log(`${unit.displayName} (Illusion)`);
          return;
        }

        console.log(unit.displayName, `(${unit.knownLevel})`, "items: ", items);
        console.log("IDs: ", unit.itemId1, unit.itemId2, unit.objectId1, unit.objectId2);
        
        console.log("---");
      } else {
        if (unit.isBuilding) {
          console.log(`${unit.displayName} (B)`);  
        } else {
          console.log(unit.displayName);
        }
      }
    });

    
    
    console.log("************************************");
  });
});

process.exit();
