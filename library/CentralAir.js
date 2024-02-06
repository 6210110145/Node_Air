const fs = require('fs');
const exec = require('child_process').exec

const path_JSON = './data/key.json';

const header = '9000 4500 '
const binary_1 = '650 1600 '
const binary_0 = '650 550 '
const gap = '650 20000'
const tail = '650 '

// CentralAir Function
module.exports.airSendMain = function(key) {
    console.log(KeyToBinary(key))
    
    sendSignals(getRemote(KeyToBinary(key))).then(result => {
        console.log(result + ' success')
        return true
    })
    .catch(result => {
        console.log(result)
        return false
    })
}

// Key to Binary Function
function KeyToBinary(state) {
    var code = 'H'

    // the first Frame
    // Mode
    switch(state.Mode) {
        case "AUTO":
            code += "000"
            break
        case "COOL":
            code += "100"
            break
        case "DRY":
            code += "010"
            break
        case "FAN":
            code += "110"
            break
    }

    // ON-OFF Power
    if(state.Power == "ON") {
        code += '1'
    }else {
        code += '0'
    }

    // Fan Speed
    // DRY Mode --> only 1 fan speed
    if(state.Mode == "DRY") {
        code += '10'
        state.Fan = 1
    }else {
        // COOL,FAN,AUTO 
        switch(state.Fan) {
            case 0:
                code += "00"
                break
            case 1:
                code += "10"
                break
            case 2:
                code += "01"
                break
            case 3:
                code += "11"
                break
        }
    }
    
    // Swing
    if(state.Swing == "ON") {
        code += '1'
    }else {
        code += '0'
    }

    // Sleep Mode
    if(state.Mode == "COOL" || state.Mode == "DRY") {
        if(state.Sleep == "ON") {
            code += '1'
        }else {
            code += '0'
        }
    }else {
        // FAN & AUTO mode = OFF
        code += '0'
        state.Sleep = "OFF"
    }
    
    // Tempertature
    if(state.Mode == "AUTO") {
        code += "1001"
        state.Temp = 25
    }else {
        switch(state.Temp) {
            case 16:
                code += "0000"
                break
            case 17:
                code += "1000"
                break
            case 18:
                code += "0100"
                break
            case 19:
                code += "1100"
                break
            case 20:
                code += "0010"
                break
            case 21:
                code += "1010"
                break
            case 22:
                code += "0110"
                break
            case 23:
                code += "1110"
                break
            case 24:
                code += "0001"
                break
            case 25:
                code += "1001"
                break
            case 26:
                code += "0101"
                break
            case 27:
                code += "1101"
                break
            case 28:
                code += "0011"
                break
            case 29:
                code += "1011"
                break
            case 30:
                code += "0111"
                break
        }
    }
    
    code += "00000000"

    // Turbo mode
    if(state.Mode == "COOL") {
        if(state.Turbo == "ON") {
            code += '1'
        }else {
            code += '0'
        }
    }else {
        // FAN & AUTO & DRY Mode = OFF
        code += '0'
        state.Turbo = "OFF"
    }
    
    // Light Air
    if(state.Light == "ON") {
        code += '1'
    }else {
        code += '0'
    }

    code += "0000001010010" 
    code += "G"
    
    //the second Frame
    if(state.Swing == "ON") {
        code += '1'
    }else {
        code += '0'
    }

    code += "000000000000100000000000000"

    //the last 4 bits (Checksum)
    if(state.Mode == "COOL") {
        switch(state.Temp) {
            case 16:
                code += "101"
                break
            case 17:
                code += "011"
                break
            case 18:
                code += "111"
                break
            case 19:
                code += "000"
                break
            case 20:
                code += "100"
                break
            case 21:
                code += "010"
                break
            case 22:
                code += "110"
                break
            case 23:
                code += "001"
                break
            case 24:
                code += "101"
                break
            case 25:
                code += "011"
                break
            case 26:
                code += "111"
                break
            case 27:
                code += "000"
                break
            case 28:
                code += "100"
                break
            case 29:
                code += "010"
                break
            case 30:
                code += "110"
                break
        }if(state.Temp == 16 || state.Temp == 17 || state.Temp == 18 || state.Temp == 27 || 
            state.Temp == 28 || state.Temp == 29 || state.Temp == 30) {
            if(state.Power == "ON") {
                code += '0'
            }else {
                code += '1'
            }
        }else{
            if(state.Power == "ON") {
                code += '1'
            }else {
                code += '0'
            }
        }
    }else if(state.Mode == "DRY") {
        switch(state.Temp) {
            case 16:
                code += "011"
                break
            case 17:
                code += "111"
                break
            case 18:
                code += "000"
                break
            case 19:
                code += "100"
                break
            case 20:
                code += "010"
                break
            case 21:
                code += "110"
                break
            case 22:
                code += "001"
                break
            case 23:
                code += "101"
                break
            case 24:
                code += "011"
                break
            case 25:
                code += "111"
                break
            case 26:
                code += "000"
                break
            case 27:
                code += "100"
                break
            case 28:
                code += "010"
                break
            case 29:
                code += "110"
                break
            case 30:
                code += "001"
                break
        }if(state.Temp == 16 || state.Temp == 17 || state.Temp == 26 || state.Temp == 27 || 
            state.Temp == 28 || state.Temp == 29 || state.Temp == 30) {
            if(state.Power == "ON") {
                code += '0'
            }else {
                code += '1'
            }
        }else{
            if(state.Power == "ON") {
                code += '1'
            }else {
                code += '0'
            }
        }
    }else if(state.Mode == "FAN") {
        switch(state.Temp) {
            case 16:
                code += "111"
                break
            case 17:
                code += "000"
                break
            case 18:
                code += "100"
                break
            case 19:
                code += "010"
                break
            case 20:
                code += "110"
                break
            case 21:
                code += "001"
                break
            case 22:
                code += "101"
                break
            case 23:
                code += "011"
                break
            case 24:
                code += "111"
                break
            case 25:
                code += "000"
                break
            case 26:
                code += "100"
                break
            case 27:
                code += "010"
                break
            case 28:
                code += "110"
                break
            case 29:
                code += "001"
                break
            case 30:
                code += "101"
                break
        }
        if(state.Temp == 16 || state.Temp == 25 || state.Temp == 26 || state.Temp == 27 || 
            state.Temp == 28 || state.Temp == 29 || state.Temp == 30) {
            if(state.Power == "ON") {
                code += '0'
            }else {
                code += '1'
            }
        }else{
            if(state.Power == "ON") {
                code += '1'
            }else {
                code += '0'
            }
        }
    }else if(state.Mode == "AUTO") {
        if(state.Power == "ON"){
            code += '1011'
        }else {
            code += '1010'
        }
    }

    code += "T"

    state.Quiet = "OFF"

    let newKey = JSON.stringify(state, null, 2)

    fs.writeFileSync("./data/key.json", newKey)

    console.log('New Update Success\n')

    return code
}

// Binary to lircd Function
function getRemote(binary) {
    var raw_code = ''
    
    for(let i = 0; i < binary.length; i++) {
        if(binary[i] == 'H') {
            raw_code += header
        }else if(binary[i] == '1') {
            raw_code += binary_1
            if(i%3 == 1) {
                raw_code += '\n\t\t\t'
            }
        }else if(binary[i] == '0') {
            raw_code += binary_0
            if(i%3 == 1) {
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

    return 'begin remote\n\n  name  AIR\n  flags RAW_CODES\n  eps            30\n  aeps          100\n\n  gap          124928' +
            '\n\n\t\tbegin raw_codes\n\n\t\t  name command\n\n'+'\t\t\t'+raw_code+'\n\n\t\tend raw_codes\n\nend remote\n';
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
                resolve("Central Air")
            }, 500);
        })
    })
}

// Receiver CentralAir Function
module.exports.airReceiveMain = async (binaryCode) => {
    let KEY = JSON.parse(fs.readFileSync(path_JSON))

    if(KEY.Name.toLowerCase() === 'centralair') {
        let binary = binaryCode.substring(binaryCode.length - 70) //Ex. H10011000011000000000000000001010010G00000000000001000000000000001111T
        console.log(binary)
        console.log(binary.length)

        if(binary.length == 70 && binary[0] == 'H') {
            let mode = binary.substring(1, 4)
            let power = binary[4]
            let fan = binary.substring(5, 7)
            let swing = binary[7]
            let sleep = binary[8]
            let temp_bit = binary.substring(9, 13)
            let turbo = binary[21]
            let light = binary[22]

            // Mode
            if(mode == '000') {
                KEY.Mode = "AUTO"
            }else if(mode == '100') {
                KEY.Mode = "COOL"
            }else if(mode == '010') {
                KEY.Mode = "DRY"
            }else if(mode == '110') {
                KEY.Mode = "FAN"
            }else {
                KEY.Mode = "COOL"
            }

            //ON-OFF
            if(power == '1') {
                KEY.Power = "ON"
            }else {
                KEY.Power = "OFF"
            }

            // Fan speed
            if(fan == '00') {
                KEY.Fan = 0
            }else if(fan == '10') {
                KEY.Fan = 1
            }else if(fan == '01') {
                KEY.Fan = 2
            }else {
                KEY.Fan = 3
            }

            // Swing
            if(swing == '1') {
                KEY.Swing = 'ON'
            }else {
                KEY.Swing = 'OFF'
            }

            // Sleep option
            if(sleep == '1') {
                KEY.Sleep = "ON"
            }else {
                KEY.Sleep = "OFF"
            }
            
            // Temperature
            let decimal = parseInt(String(temp_bit).split("").reverse().join(""), 2)
            let temp = 16 + decimal
            if(temp > 15 && temp < 31) {
                KEY.Temp = temp
            }else {
                KEY.Temp = 25
            }
            
            // Turbo option
            if(turbo == '1') {
                KEY.Turbo = "ON"
            }else {
                KEY.Turbo = "OFF"
            }

            // Light option
            if(light == '1') {
                KEY.Light = "ON"
            }else {
                KEY.Light = "OFF"
            }

            KEY.Quiet = "OFF"

            let newRemote = JSON.stringify(KEY, null, 2)

            return newRemote
        }else {
            return "fail"
        }
    }else {
        return "fail"
    }
}