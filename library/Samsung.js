const fs = require('fs');
const exec = require('child_process').exec

const path_JSON = './data/key.json';

const header = '3000 9000 '
const binary_1 = '500 1500 '
const binary_0 = '500 500 '
const gap = '500 3000'
const tail = '500 '
const redix = 2

module.exports.airMain = function(key) {
    if(key.Power == "ON"){
        let binary = KeyToBinaryON(key)

        sendSignals(getRemote(binary.code, checksum(binary.checksum_byte_1), checksum(binary.checksum_byte)))
        .then((result) => { 
            console.log(result + ' success')
        })
        .catch((result) => {
            console.log(result)
        })
    }else {
        let binary = KeyToBinaryOFF(key)

        sendSignals(getRemote(binary.code, checksum(binary.checksum_byte_1), checksum(binary.checksum_byte)))
        .then((result) => { 
            console.log(result + ' success')
        })
        .catch((result) => {
            console.log(result)
        })
    }
}

// Key to Binary Funtion
function KeyToBinaryON(state) {
    let code = ''
    let checksum_byte_1 = "0011"
    let checksum_byte = "0011"

    code += 'H'

    //the first frame (7 Bytes)
    code += "010000000100"
    code += "B" //checksum 1
    code += "00000000000000000000000000000000"

    if(state.Power == "ON") {
        code += "1111"
        checksum_byte_1 += "1111"
    }else { 
        code += "0011" // OFF
        checksum_byte_1 += "0011"
    }
    
    //the second frame (7 Bytes)
    // if(state.Power is OFF){
    //     code += "GH10000000010010111111000000000000000000000000000000000000"
    // }

    //the third frames (7 Bytes)
    code += "GH" //Gap + Header
    code += "100000000100"
    code += "C" //checksum 2

    if(state.Swing == "ON") {
        code += "0101"
        checksum_byte += "0101"
    }else {
        code += "1111"
        checksum_byte += "1111"
    }

    //Turbo is used only COOL 
    if(state.Mode == "COOL") {
        if(state.Turbo == "ON") {
            code += "1110"
            checksum_byte += "1110"
        }else {
            code += "1000"
            checksum_byte += "1000"
        }
    }else {
        code += "1000"
        checksum_byte += "1000"
    }

    code += "11100000"
    checksum_byte += "11100000"

    if(state.Mode == "COOL" || state.Mode == "AUTO") {
        switch(state.Temp) {
            case 16:
                code += "0000"
                checksum_byte += "0000"
                break
            case 17:
                code += "1000"
                checksum_byte += "0001"
                break
            case 18:
                code += "0100"
                checksum_byte += "1000"
                break
            case 19:
                code += "1100"
                checksum_byte += "1100"
                break
            case 20:
                code += "0010"
                checksum_byte += "1000"
                break
            case 21:
                code += "1010"
                checksum_byte += "1100"
                break
            case 22:
                code += "0110"
                checksum_byte += "1100"
                break
            case 23:
                code += "1110"
                checksum_byte += "1110"
                break
            case 24:
                code += "0001"
                checksum_byte += "1000"
                break
            case 25:
                code += "1001"
                checksum_byte += "1100"
                break
            case 26:
                code += "0101"
                checksum_byte += "1100"
                break
            case 27:
                code += "1101"
                checksum_byte += "1110"
                break
            case 28:
                code += "0011"
                checksum_byte += "1100"
                break
            case 29:
                code += "1011"
                checksum_byte += "1110"
                break
            case 30:
                code += "0111"
                checksum_byte += "1110"
                break
        }
    }else if(state.Mode == "DRY"){
        switch(state.Temp) {
            case 16:
            case 17:
            case 18:
                code += "0100"
                checksum_byte += "1000"
                break
            case 19:
                code += "1100"
                checksum_byte += "1100"
                break
            case 20:
                code += "0010"
                checksum_byte += "1000"
                break
            case 21:
                code += "1010"
                checksum_byte += "1100"
                break
            case 22:
                code += "0110"
                checksum_byte += "1100"
                break
            case 23:
                code += "1110"
                checksum_byte += "1110"
                break
            case 24:
                code += "0001"
                checksum_byte += "1000"
                break
            case 25:
                code += "1001"
                checksum_byte += "1100"
                break
            case 26:
                code += "0101"
                checksum_byte += "1100"
                break
            case 27:
                code += "1101"
                checksum_byte += "1110"
                break
            case 28:
                code += "0011"
                checksum_byte += "110"
                break
            case 29:
                code += "1011"
                checksum_byte += "1110"
                break
            case 30:
                code += "0111"
                checksum_byte += "1110"
                break
        }
    }else if(state.Mode == "FAN"){
        switch(state.Temp) {
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
            case 21:
            case 22:
            case 23:
            case 24:
            case 25:
            case 26:
            case 27:
            case 28:
            case 29:
            case 30:
                code += "0001"
                checksum_byte += "1000"
                break
        }
    }

    //Fan
    if(state.Mode == "AUTO"){
        code += "1011"
        checksum_byte += "1110"
    }else if(state.Mode == "DRY") { //Fix Fan 0
        code += "1000"
        checksum_byte += "1000"
    }else { //COOL & FAN
        switch(state.Fan) {
            case 0:
                code += "1000"
                checksum_byte += "1000"
                break
            case 1:
                code += "1010"
                checksum_byte += "1100"
                break
            case 2:
                code += "1001"
                checksum_byte += "1100"
                break
            case 3:
                code += "1101"
                checksum_byte += "1110"
                break
        }
    }

    switch(state.Mode) {
        case "AUTO":
            code += "0000"
            checksum_byte += "0000"
            break
        case "COOL":
            code += "1000"
            checksum_byte += "1000"
            break
        case "DRY":
            code += "0100"
            checksum_byte += "1000"
            break
        case "FAN":
            code += "1100"
            checksum_byte += "1100"
            break
    }

    if(state.Power == "ON") {
        code += '00001111'
        checksum_byte += "1111"
    }else {
        code += '00000011'
        checksum_byte += "0011"
    }

    code += "T"

    return {
        code, 
        checksum_byte,
        checksum_byte_1}
}

function KeyToBinaryOFF(state) {
    let code = ''
    let checksum_byte_1 = "0011"
    let checksum_byte = "0011"

    code += 'H'

    //the first frame
    code += "010000000100"
    code += "B" //checksum
    code += "00000000000000000000000000000000"

    if(state.Power == "ON") {
        code += "1111"
        checksum_byte_1 += "1111"
    }else { 
        code += "0011" // OFF
        checksum_byte_1 += "0011"
    }
    
    //the second frame
    code += "GH10000000010010111111000000000000000000000000000000000000"
    
    //the third frame
    code += "GH" //Gap + Header
    code += "100000000100"
    code += "C" //checksum

    if(state.Swing == "ON") {
        code += "0101"
        checksum_byte += "0101"
    }else {
        code += "1111"
        checksum_byte += "1111"
    }

    //Turbo is used only COOL 
    if(state.Mode == "COOL"){
        if(state.Turbo == "ON") {
            code += "1110"
            checksum_byte += "1110"
        }else{
            code += "1000"
            checksum_byte += "1000"
        }
    }else{
        code += "1000"
        checksum_byte += "1000"
    }

    code += "11100000"
    checksum_byte += "11100000"

    if(state.Mode == "COOL" || state.Mode == "AUTO") {
        switch(state.Temp) {
            case 16:
                code += "0000"
                checksum_byte += "0000"
                break
            case 17:
                code += "1000"
                checksum_byte += "0001"
                break
            case 18:
                code += "0100"
                checksum_byte += "1000"
                break
            case 19:
                code += "1100"
                checksum_byte += "1100"
                break
            case 20:
                code += "0010"
                checksum_byte += "1000"
                break
            case 21:
                code += "1010"
                checksum_byte += "1100"
                break
            case 22:
                code += "0110"
                checksum_byte += "1100"
                break
            case 23:
                code += "1110"
                checksum_byte += "1110"
                break
            case 24:
                code += "0001"
                checksum_byte += "1000"
                break
            case 25:
                code += "1001"
                checksum_byte += "1100"
                break
            case 26:
                code += "0101"
                checksum_byte += "1100"
                break
            case 27:
                code += "1101"
                checksum_byte += "1110"
                break
            case 28:
                code += "0011"
                checksum_byte += "1100"
                break
            case 29:
                code += "1011"
                checksum_byte += "1110"
                break
            case 30:
                code += "0111"
                checksum_byte += "1110"
                break
        }
    }else if(state.Mode == "DRY"){
        switch(state.Temp) {
            case 16:
            case 17:
            case 18:
                code += "0100"
                checksum_byte += "1000"
                break
            case 19:
                code += "1100"
                checksum_byte += "1100"
                break
            case 20:
                code += "0010"
                checksum_byte += "1000"
                break
            case 21:
                code += "1010"
                checksum_byte += "1100"
                break
            case 22:
                code += "0110"
                checksum_byte += "1100"
                break
            case 23:
                code += "1110"
                checksum_byte += "1110"
                break
            case 24:
                code += "0001"
                checksum_byte += "1000"
                break
            case 25:
                code += "1001"
                checksum_byte += "1100"
                break
            case 26:
                code += "0101"
                checksum_byte += "1100"
                break
            case 27:
                code += "1101"
                checksum_byte += "1110"
                break
            case 28:
                code += "0011"
                checksum_byte += "110"
                break
            case 29:
                code += "1011"
                checksum_byte += "1110"
                break
            case 30:
                code += "0111"
                checksum_byte += "1110"
                break
        }
    }else if(state.Mode == "FAN"){
        switch(state.Temp) {
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
            case 21:
            case 22:
            case 23:
            case 24:
            case 25:
            case 26:
            case 27:
            case 28:
            case 29:
            case 30:
                code += "0001"
                checksum_byte += "1000"
                break
        }
    }
    
    // Fan
    if(state.Mode == "AUTO"){
        code += "1011"
        checksum_byte += "1110"
    }else if(state.Mode == "DRY") {
        code += "1000"
        checksum_byte += "1000"
    }else { //COOL & FAN
        switch(state.Fan) {
            case 0:
                code += "1000"
                checksum_byte += "1000"
                break
            case 1:
                code += "1010"
                checksum_byte += "1100"
                break
            case 2:
                code += "1001"
                checksum_byte += "1100"
                break
            case 3:
                code += "1101"
                checksum_byte += "1110"
                break
        }
    }

    switch(state.Mode) {
        case "AUTO":
            code += "0000"
            checksum_byte += "0000"
            break
        case "COOL":
            code += "1000"
            checksum_byte += "1000"
            break
        case "DRY":
            code += "0100"
            checksum_byte += "1000"
            break
        case "FAN":
            code += "1100"
            checksum_byte += "1100"
            break
    }

    if(state.Power == "ON") {
        code += '00001111'
        checksum_byte += "1111"
    }else {
        code += '00000011'
        checksum_byte += "0011"
    }

    code += "T"

    return {
        code, 
        checksum_byte,
        checksum_byte_1}
}

// Checksum Function
function checksum(num) {
    let count1s = num.split('1').length-1 // นับจำนวนของบิต 1s
    let decimal = 255 - count1s           // ลบด้วย 255
    let binary = String(decimal.toString( redix ).padStart(8, '0'))  // แปลงเป็น binary

    return String(binary).split("").reverse().join("")  // reverse binary
}

// Binary to Signals Function
function getRemote(binary, checksum1, checksum2) {
    let raw_code = ''
    let text_checksum_1 = checksum1.toString()
    let text_checksum_2 = checksum2.toString()
    
    for(let i = 0; i < binary.length; i++) {
        if(binary[i] == 'H') {
            raw_code += header
        }else if(binary[i] == 'B') { //checksum frame 1
            for(let k = 0; k < text_checksum_1.length; k++){
                if(text_checksum_1[k] == '1') {
                    raw_code += binary_1
                    if(k%3 == 1) {
                        raw_code += '\n\t\t\t'
                    }
                }else if(text_checksum_1[k] == '0') {
                    raw_code += binary_0
                    if(k%3 == 1) {
                        raw_code += '\n\t\t\t'
                    }
                }
            }
        }else if(binary[i] == 'C') { //checksum frame 2
            for(let j = 0; j < text_checksum_2.length; j++){
                if(text_checksum_2[j] == '1') {
                    raw_code += binary_1
                    if(j%3 == 1) {
                        raw_code += '\n\t\t\t'
                    }
                }else if(text_checksum_2[j] == '0') {
                    raw_code += binary_0
                    if(j%3 == 1) {
                        raw_code += '\n\t\t\t'
                    }
                }
            }
        }else if(binary[i] == '1') {
            raw_code += binary_1
            if((i%3 == 1)) {
                raw_code += '\n\t\t\t'
            }
        }else if(binary[i] == '0') {
            raw_code += binary_0
            if((i%3 == 1)) {
                raw_code += '\n\t\t\t'
            }
        }else if(binary[i] == "G") {
            raw_code += gap + '\n\n\t\t\t'
        }else if(binary[i] == "T") {
            raw_code += tail
        }else {
            break
        }
    }

    return 'begin remote\n\n  name  AIR\n  flags RAW_CODES\n  eps            30\n  aeps          100\n\n ' +
    'gap          124928\n\n\t\tbegin raw_codes\n\n\t\t  name command\n\n'+'\t\t\t'+raw_code+'\n\n\t\tend raw_codes\n\nend remote\n';
}

// Send signal Function
function sendSignals(remote) {
    return new Promise((resolve, reject) => {
        fs.writeFile('./AIR.lircd.conf', remote, (err) => {
            if(err) {
                console.log(err)
                // reject(err)
            }
            console.log('File created.')

    
            exec('sudo cp ./AIR.lircd.conf /etc/lirc/lircd.conf', (error, stdout, stderr) => {
                if (error) {
                    console.log(stderr)
                    // reject(err)
                    }   
                })
                console.log("File copyed.");

            exec("sudo systemctl start lircd.socket", (error, stdout, stderr) => {
                if (error) {
                    console.log(stderr)
                    // reject(error)
                }
            })

            exec("sudo systemctl stop lircd", (error, stdout, stderr) => {
                if (error) {
                    console.log(stderr)
                    // reject(error)
                }
            })

            setTimeout(() => {
                exec('irsend SEND_ONCE AIR command'), (error, stdout, stderr) => {
                    if (error) {
                        reject("Command sent fail")
                        console.log(stderr)
                    }
                }
                resolve("Samsung")
            }, 500);
        })
    })
}

// Receiver Samsung Function
module.exports.airReceiveMain = async (binary) => {
    let KEY = JSON.parse(fs.readFileSync(path_JSON))

    if(KEY.Name.toLowerCase() === 'samsung') {
        // select only the last frame
        let binaryCode = binary.substring(binary.length - 58) //Ex. H10000000010010110111111110001110000010011000100000001111T
        // console.log(binaryCode)

        let swing = binaryCode.substring(21, 25)
        let turbo = binaryCode.substring(25, 29)
        let tempBit = binaryCode.substring(37, 41)
        let fan = binaryCode.substring(41, 45)
        let mode = binaryCode.substring(45, 49)
        let power = binaryCode.substring(53, 57)

        KEY.Name = "Samsung"

        // Swing
        if(swing == '0101') {
            KEY.Swing = "ON"
        }else if(swing == '1111') {
            KEY.Swing = "OFF"
        }

        // Turbo option
        if(turbo == '1000') {
            KEY.Turbo = "OFF"
        }else if(turbo == '1110') {
            KEY.Turbo = "ON"
        }

        // Temperature
        let decimal = parseInt(String(tempBit).split("").reverse().join(""), 2)
        let temp = 16 + decimal
        KEY.Temp = temp

        // Fan Speed
        if(fan == '1000' || fan == '1011') {
            KEY.Fan = 0
        }else if(fan == '1010') {
            KEY.Fan = 1
        }else if(fan == '1001') {
            KEY.Fan = 2
        }else if(fan == '1101') {
            KEY.Fan = 3
        }

        // Mode
        if(mode == '0000') {
            KEY.Mode = "AUTO"
        }else if(mode == '1000') {
            KEY.Mode = "COOL"
        }else if(mode == '0100') {
            KEY.Mode = "DRY"
        }else if(mode == '1100') {
            KEY.Mode = "FAN"
        }

        // ON-OFF
        if(power == '1111') {
            KEY.Power = "ON"
        }else if(power == '0011') {
            KEY.Power = "OFF"
        }

        // No option
        KEY.Light = "OFF"
        KEY.Sleep = "OFF"
        KEY.Quiet = "OFF"

        let newRemote = JSON.stringify(KEY, null, 2)

        return newRemote
    }else {
        return "fail"
    }
}