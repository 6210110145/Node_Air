const fs = require('fs');
const exec = require('child_process').exec

const path_JSON = './data/key.json';

const header = '3400 1800 '
const binary_1 = '450 1300 '
const binary_0 = '450 450 '
const tail = '450 '
const redix = 2

//Mitsubishi AirConditioner (Ceiling Suspended Type)
module.exports.airSendMain = function(key) {
    let binary = KeyToBinary(key)
    console.log(binary)
    // console.log(checksum(binary.sum))
    // console.log(getRemote(binary.code, checksum(binary.sum)))

    sendSignals(getRemote(binary.code, checksum(binary.sum))).then((result) => {
        console.log(result + " success")
    })
    .catch(result => {
        console.log(result)
        return false
    })
}

function KeyToBinary(state) {
    let code = 'H' //head
    let checksum_byte = ''

    let sum = 0 // decimal sum of the second frame, บวกทุกๆ 8 bit(1 Byte) ใน frame ที่ 2

    //1 frames (112 bits)
    code += "1100010011010011011001001000000000000000"
    sum += decimal("11000100") + decimal("11010011") + decimal("01100100") + decimal("10000000")

    // Power
    if(state.Power == "ON") {
        code += "00100101"
        sum += decimal("00100101")
    }else { //OFF
        code += "00000101" 
        sum += decimal("00000101")
    }

    // Mode
    switch(state.Mode) {
        case "AUTO":
            code += "00010000"
            sum += decimal("00010000")
            break
        case "COOL":
            code += "11000000"
            sum += decimal("11000000")
            break
        case "DRY":
            code += "01000000"
            sum += decimal("01000000")
            break
        case "FAN":
            code += "11100000"
            sum += decimal("11100000")
            break
    }

    // Temperature
    if(state.Mode == "COOL"){
        switch(state.Temp) {
        case 16:
            code += "11110000"
            sum += decimal("11110000")
            break
        case 17:
            code += "01110000"
            sum += decimal("01110000")
            break
        case 18:
            code += "10110000"
            sum += decimal("10110000")
            break
        case 19:
            code += "00110000"
            sum += decimal("00110000")
            break
        case 20:
            code += "11010000"
            sum += decimal("11010000")
            break
        case 21:
            code += "01010000"
            sum += decimal("01010000")
            break
        case 22:
            code += "10010000"
            sum += decimal("10010000")
            break
        case 23:
            code += "00010000"
            sum += decimal("00010000")
            break
        case 24:
            code += "11100000"
            sum += decimal("11100000")
            break
        case 25:
            code += "01100000"
            sum += decimal("01100000")
            break
        case 26:
            code += "10100000"
            sum += decimal("10100000")
            break
        case 27:
            code += "00100000"
            sum += decimal("00100000")
            break
        case 28:
            code += "11000000"
            sum += decimal("11000000")
            break
        case 29:
            code += "01000000"
            sum += decimal("01000000")
            break
        case 30:
            code += "10000000"
            sum += decimal("10000000")
            break
        }
    }else {
        //Mode: DRY, FAN, AUTO fix Temperature
        code += "11100000"
        sum += decimal("11100000")
        state.Temp = 24
    }
    
    //Fan speed
    switch(state.Fan) {
        case 0:
            code += "0001"
            checksum_byte += "0001"
            break
        case 1:
            code += "0101"
            checksum_byte += "0101"
            break
        case 2:
            code += "1101"
            checksum_byte += "1101"
            break
        case 3:
            code += "1011"
            checksum_byte += "1011"
            break
    }

    // Swing
    if(state.Swing == "ON") {
        code += "1100"
        checksum_byte += "1100"
    }else {
        code += "1000" //P3 (fix)
        checksum_byte += "1000"
    }

    sum += decimal(checksum_byte)

    code += "00000000000000000000000000000000"

    //Checksum byte
    code += "C"

    code += "T"

    state.Turbo = "OFF"
    state.Sleep = "OFF"
    state.Light = "OFF"
    state.Quiet = "OFF"

    // let newKey = JSON.stringify(state, null, 2)

    // fs.writeFileSync("./data/key.json", newKey)

    // console.log('New Update Success\n')

    return {
        code,
        sum
    }
}

//Checksum Function
function decimal(num) {
    return ( //reverse ก่อน แล้วแปลงเป็น decimal
        parseInt(String(num).split("").reverse().join(""), 2) 
    )
}
function checksum(number) {
    let sum = number % 256
    return ( //แปลงเป็น binary ก่อนแล้ว reverse
        String(sum.toString(redix).padStart(8, '0')).split("").reverse().join("") 
    )
}

//covert to lircd file Funtion
function getRemote(binary, checksum) {
    let raw_code = ''
    let text_checksum = checksum

    for(let i = 0; i < binary.length; i++) {
        if(binary[i] == 'H') {
            raw_code += header
        }else  if(binary[i] == '1') {
            raw_code += binary_1
            if((i%3 == 1)) {
                raw_code += '\n\t\t\t'
            }
        }else if(binary[i] == '0') {
            raw_code += binary_0
            if((i%3 == 1)) {
                raw_code += '\n\t\t\t'
            }
        }else if(binary[i] == 'C') { //checksum
            for(let j = 0; j < text_checksum.length; j++){
                if(text_checksum[j] == '1') {
                    raw_code += binary_1
                    if((j%3 == 1)) {
                        raw_code += '\n\t\t\t'
                    }
                }else if(text_checksum[j] == '0') {
                    raw_code += binary_0
                    if((j%3 == 1)) {
                        raw_code += '\n\t\t\t'
                    }
                }
            }
        }else if(binary[i] == 'T') {
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
                resolve("Mitsubishi")
            }, 500);
        })
    })
}

// Mitsubishi Receiver Function
module.exports.airReceiveMain = function(binaryCode) {
    let KEY = JSON.parse(fs.readFileSync(path_JSON))

    if(KEY.Name.toLowerCase() === 'mitsubishi') {
        let binary = binaryCode.substring(binaryCode.length - 114) //Ex. H1100010011010011011001001000000000000000001001011100000011000000000111000000000000000000000000000000000011101111T
        console.log(binary)
        console.log(binary.length)

        if(binary.length == 114 && binary[0] == 'H') {
            let power = binary.substring(41, 45)
            let mode = binary.substring(49, 53)
            let temp_bit = binary.substring(57, 61)
            let fan = binary.substring(65, 69)
            let swing = binary.substring(69, 73)

            //ON-OFF
            if(power == '0010') {
                KEY.Power = "ON"
            }else {
                KEY.Power = "OFF"
            }

            // Mode
            if(mode == '0001') {
                KEY.Mode = "AUTO"
            }else if(mode == '1100') {
                KEY.Mode = "COOL"
            }else if(mode == '0100') {
                KEY.Mode = "DRY"
            }else if(mode == '1110') {
                KEY.Mode = "FAN"
            }else {
                KEY.Mode = "COOL"
            }

            // Temperature
            let decimal = parseInt(String(temp_bit).split("").reverse().join(""), 2)
            let temp = Math.abs(decimal - 31)
            if(temp > 15 && temp < 31) {
                KEY.Temp = temp
            }else {
                KEY.Temp = 25
            }

            // Fan speed
            if(fan == '0001') {
                KEY.Fan = 0
            }else if(fan == '0101') {
                KEY.Fan = 1
            }else if(fan == '1101') {
                KEY.Fan = 2
            }else if(fan == '1011'){
                KEY.Fan = 3
            }else {
                KEY.Fan = 0
            }

            // Swing
            if(swing == '1100') {
                KEY.Swing = 'ON'
            }else {
                KEY.Swing = 'OFF'
            }

            KEY.Quiet = "OFF"
            KEY.Light = "OFF"
            KEY.Sleep = "OFF"
            KEY.Turbo = "OFF"

            let newRemote = JSON.stringify(KEY, null, 2)

            return newRemote
        }else {
            return "fail"
        }
    }else {
        return "fail"
    }
}