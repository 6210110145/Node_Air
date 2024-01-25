const exec = require('child_process').exec
const fs = require('fs');
const watch = require('node-watch');

const { convertKeyCentralAir } = require('./receiveCentralAir.js')
// import { convertKeySamsung } from "./test_receive_samsung.js";

const path_file_signal = './signal.txt';
const path_JSON = './reKey.json';

let keys = JSON.parse(fs.readFileSync("../data/key.json"));
// const sleep = ms => new Promise(r => setTimeout(r, ms));

export function runMode2(){   
    exec('mode2 -d /dev/lirc1 > signal.txt'), (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(stdout)
    }
}

watch(path_file_signal, { delay: 500 }, (event, name) => {
    if(event){
        console.log(event)

        if(event == 'remove'){
            runMode2()

            let text = creatNewFile()
            console.log(text)
        }else {
            fs.readFile(path_file_signal, (err, data) => {
                if(err) {
                    console.log(err)
                    return
                }else {
                    if (data.length == 0) {
                        console.log(`${name} is empty!`)
                        return
                    }else {
                        receiveMain()
                    }
                }
            });
        }
    }
});

async function receiveMain() { 
    const remoteName = keys.Name.toLocaleLowerCase()

    let pulse = await readPulseSpace()
    console.log(pulse)
    
    let binaryCode = await convertToBinary(pulse.pulseValues, pulse.spaceValues)
    console.log(binaryCode)
    
    let newKey = await checkRemote(remoteName, binaryCode)
    console.log(newKey)
    
    await writeJSON(newKey)

    // delete file in 60 seconds or another
    setTimeout(() => {
       deleteFile() 
    }, 60000)
}

// keep the pulse-space from signal file Function
async function readPulseSpace() {
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
async function convertToBinary(pulseDurations, spaceDurations) {
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
async function checkRemote(name, binary) {
    if(name === 'centralair') {
        let newKey = await convertKeyCentralAir(binary)
        return newKey
    }else if (name === 'samsung') {
        let newKey = await convertKeySamsung(binary)
        return newKey
    }else {
        console.log(`${name} not Found!!`)
        return JSON.stringify(keys, null, 2)
    }
}

//Update JSON (Database) Function
async function writeJSON(remote) {
    fs.writeFileSync(path_JSON, remote, (err) => {
        if(err) {
            console.log(err)
            return
        }
    });
    console.log(`update  complete`)
}

// Delete file Function
function deleteFile() {
    // // Cleart data in .txt file
    // fs.truncateSync(path_file_signal, 0)
    // fs.writeFileSync(path_file_signal, "")

    fs.readFile(path_file_signal, (err, data) => {
        if(err) {
            console.log(err)
        }else {
            if(data.length == 0) {
                console.log("file is still alive")
            }else {
                fs.unlinkSync(path_file_signal);
                console.log("delete file complete")
            }
        }
    })
}

// Create new signal file Function After run Mode2 again
function creatNewFile() {
    fs.writeFileSync("signal.txt", "")
    return `create New signal file`
}