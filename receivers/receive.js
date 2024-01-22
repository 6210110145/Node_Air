const exec = require('child_process').exec
const fs = require('fs');
const watch = require('node-watch');

const { convertKeyCentralAir } = require("./receiveCentralAir.js");

const path_file_signal = './signal.txt'
const path_JSON = '../data/key.json'
const keys = require('../data/key.json');

exec('mode2 -d /dev/lirc1 > signal.txt'), (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
}

watch(path_file_signal, { delay: 500 }, (event, name) => {
    if(event){
        fs.readFile(path_file_signal, function(err, data) {
            console.log(data)

            if(err) {
                console.log(err)
                return
            }else {
                if (data.length == 0) {
                    console.log(`${name} is empty!`)
                    return
                }else {
                    console.log(event)
                    receiveMain()
                }
            }
        });
    }
});

async function receiveMain() { 
    const remoteName = keys.Name.toLocaleLowerCase()

    let pulse = await readPulseSpace()
    console.log(pulse)
    
    let binaryCode = await convertToBinary(pulse.pulse_values, pulse.space_values)
    console.log(binaryCode)
    
    let newKey = await checkRemote(remoteName, binaryCode)
    console.log(newKey)
    
    let text_clear = await clearFile()
    console.log(text_clear)

    await writeJSON(newKey)
}

async function checkRemote(name, binary) {
    if(name === 'centralair') {
        let newKey = await convertKeyCentralAir(binary)
        return newKey
    }else if (name === 'samsung') {
        // let newKey = await convertKeyCentral(binary_code)
        // return newKey
    }else {
        return `${name} not Found`
    }
}

// keep the pulse-space from signal file Function
async function readPulseSpace() {
    let pulse_values = []
    let space_values = []

    let data = fs.readFileSync(path_file_signal, 'utf8') // read pulse-space file
    let lines = data.split('\n');

    for (let line of lines) {
        let parts = line.split(/\s+/)
        // console.log(parts)

        /* 
            [ 'space', '8934']  ==> lenght = 2 
            [ 'pulse', '4494']
            ...
        */

        if (parts.length < 4) {
            let [signal_type, value] = parts
            
            if(value < 100000) {
                if (signal_type === "pulse") {
                    space_values.push(parseInt(value, 10))
                } else if (signal_type === "space") {
                    pulse_values.push(parseInt(value, 10))
                }
            }else {
                continue;
            }
        }
    }

    // // lenght of pulse & space must be equal
    console.log(pulse_values.length)
    console.log(space_values.length)

    return {
        pulse_values,
        space_values
    }
}

// Convert signal to binary Function
async function convertToBinary(pulseDurations, spaceDurations) {
    let binaryValues = []

    for (let i = 0; i < spaceDurations.length && i < pulseDurations.length; i++) {
        let pulse = pulseDurations[i];
        let space = spaceDurations[i];

        if(i == 0){
            binaryValues.push('H');
        }else if(i == (pulseDurations.length - 1)) {
            binaryValues.push('T');    
        }else if (space > 3000){
            binaryValues.push('G');    
        }else if (pulse < (space - 200)) {
            binaryValues.push('1');
        }else {
            binaryValues.push('0');
        }
    }

    return binaryValues.join('');
}

//Update JSON Function
async function writeJSON(remote) {
    fs.writeFileSync(path_JSON, remote, (err) => {
        if(err) {
            console.log(err)
            return
        }
    });
    console.log(`update  complete`)
}

// clear the data Function
async function clearFile() {
    fs.truncateSync(path_file_signal, 0)
    // fs.writeFileSync(path_file_signal, "1")
    return `clear data complete!`
}