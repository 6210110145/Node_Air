const fs = require('fs');

const { convertKeyCentralAir } = require('../receivers/receiveCentralAir.js');
const { convertKeySamsung } = require("../receivers/receiveSamsung.js");
const { convertKeyPanasonic } = require("../receivers/receivePanasonic.js");
// let KEY = require('../data/key.json');

const path_file_signal = './signal.txt';
const path_JSON = './data/key.json';

// const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports.receiveMain = async() => { 
    let KEY = JSON.parse(fs.readFileSync(path_JSON));

    const remoteName = KEY.Name.toLocaleLowerCase()
    // console.log(remoteName)

    let pulse = await readPulseSpace()
    // console.log(pulse)
    
    let binaryCode = await convertToBinary(pulse.pulseValues, pulse.spaceValues)
    // console.log(binaryCode)
    
    let newKey = await checkRemote(remoteName, binaryCode)
    console.log(newKey)
    
    await updateJSON(newKey)

    // delete file in 60 seconds or another
    setTimeout(() => {
       deleteFile() 
    }, 60000)
}

// keep the pulse-space from signal file Function
readPulseSpace = async () => {
    let pulseValues = []
    let spaceValues = []

    let data = fs.readFileSync(path_file_signal, "utf8") // read pulse-space file
    let lines = data.split('\n');

    for (let line of lines) {
        let parts = line.split(/\s+/)

        /* 
            ['Warning:', 'Running', 'as', 'root.'] ==> lenght = 4 (X)
            [ 'space', '8934', '']  ==> lenght = 3                (/)
            [ 'pulse', '4494', '']                                (/)
            ...
        */

        if (parts.length < 4) {
            let [signal_type, value] = parts
            
            if (signal_type === "pulse") {
                spaceValues.push(parseInt(value, 10))
            } else if (signal_type === "space") {
                pulseValues.push(parseInt(value, 10))
            }
        }
    }

    // // lenght of pulse & space must be equal
    // console.log(pulseValues.length)
    // console.log(spaceValues.length)

    return {
        pulseValues,
        spaceValues
    }
}

// Convert signal to binary Function
convertToBinary = async (pulseDurations, spaceDurations) => {
    let binaryValues = []

    for (let i = 0; i < spaceDurations.length && i < pulseDurations.length; i++) {
        let pulse = pulseDurations[i];
        let space = spaceDurations[i];

        // convert to binary code
        if (i == 0) {
            continue
        }else if(pulse > 2500) {
            binaryValues.push('H');
        }else if(i == (pulseDurations.length - 1) || i == (spaceDurations.length - 1)) {
            binaryValues.push('T');    
        }else if (space > 2500){
            binaryValues.push('G');    
        }else if (pulse < (space - 200)) {
            binaryValues.push('1');
        }else {
            binaryValues.push('0');
        }
    }

    return binaryValues.join('');
}

// Check name of Air && Convert to KEYS Function
checkRemote = async (name, binary) => {
    if(name === 'centralair') {
        let newKey = await convertKeyCentralAir(binary)
        return newKey
    }else if (name === 'samsung') {
        let newKey = await convertKeySamsung(binary)
        return newKey
    }else if(name === 'panasonic') {
        let newKey = await convertKeyPanasonic(binary)
        return newKey
    }else {
        console.log(`${name} not Found!!`)
        return JSON.stringify(keys, null, 2)
    }
}

//Update JSON (Database) Function
updateJSON = async (newRemote) => {
    fs.writeFileSync(path_JSON, newRemote, (err) => {
        if(err) {
            console.log(err)
            return
        }
    });
    console.log(`update  complete`)
}

// Delete file Function
deleteFile = () => {
    fs.readFile(path_file_signal, (err, data) => {
        if(err) {
            console.log(err)
        }else {
            if(data.length == 0) {
                console.log("file is still alive")
                return
            }else {
                fs.unlinkSync(path_file_signal);
                console.log("delete file complete")
            }
        }
    })
}

// Create new signal file Function After run Mode2 again
module.exports.createNewFile = () => {
    fs.writeFileSync("signal.txt", "")
    return `create New signal file`
}