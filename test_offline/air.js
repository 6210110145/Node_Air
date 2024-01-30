const fs = require('fs');
const path_JSON = '../data/key.json';
const { centralairMain } = require('../air/centralAir.js');
const { panasonicMain } = require('../air/panasonic.js');
const { samsungMain } = require('../air/samsung.js');
const { samsungPowerMain } = require('../air/samsungpower.js');
const { mitsubishiMain } = require('../air/mitsubishi.js');

module.exports.sendSignal = (nameAir) => {
    let name = nameAir.toLowerCase()
    let keys = JSON.parse(fs.readFileSync(path_JSON));

    if(name === 'centralair') {
        console.log(keys)
        centralairMain(keys)
    }else if(name === 'panasonic') {
        console.log(keys)
        panasonicMain(keys)
    }else if(name === 'samsung') {
        if(keys.Power === 'OFF'){
            console.log(keys)
            samsungPowerMain(keys)
        }else {
            console.log(keys)
            samsungMain(keys)
        }
    }else if(name === 'mitsubishi') {
        console.log(keys)
        mitsubishiMain(keys)
    }else {
        console.log(`${name} not found\n` + 
        `Please select of CentralAir or Panasonic or Samsung or Mitsubishi`)
    }
}