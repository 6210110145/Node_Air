const fs = require('fs');
const exec = require('child_process').exec

const path_JSON = './data/key.json';

const header = '3500 1750 '
const binary_1 = '435 1300 '
const binary_0 = '435 435 '
const gap = '435 10000 '
const tail = '435 '
const redix = 2

module.exports.airSendMain = function(key) {
    let binary = KeyToBinary(key)
    // console.log(binary)
    // console.log(binary.sum)
    // console.log(checksum(binary.sum))
    
    sendSignals(getRemote(binary.code, checksum(binary.sum))).then(result => { 
        console.log(result + ' success')
    })
    .catch(result => {
        console.log(result)
        return false
    })
}

// Key to Binary Funtion
function KeyToBinary(state) {
    let code = 'H' //head
    let checksum_byte_1 = ''
    let checksum_byte_2 = ''

    let sum // decimal sum of the second frame, บวกทุกๆ 8 bit(1 Byte) ใน frame ที่ 2

    //The first frames (64 bits)
    code += "0100000000000100000001110010000000000000000000000000000001100000"

    //Gap & Header
    code += "GH" 

    //The second frames (152 bits)
    code += "0100000000000100000001110010000000000000"
    sum = decimal("01000000") + decimal("00000100") + decimal("00000111") + decimal("00100000")

    if(state.Power == "ON") {
        code += "1001"
        checksum_byte_1 += "1001"
    }else { //OFF
        code += "0001" 
        checksum_byte_1 += "0001"
    }

    switch(state.Mode) {
        case "AUTO":
            code += "0000"
            checksum_byte_1 += "0000"
            break
        case "COOL":
            code += "1100"
            checksum_byte_1 += "1100"
            break
        case "DRY":
            code += "0100"
            checksum_byte_1 += "0100"
            break
    }

    sum += decimal(checksum_byte_1)

    switch(state.Temp) {
        case 16:
            code += "00000100"
            sum += decimal("00000100")
            break
        case 17:
            code += "01000100"
            sum += decimal("01000100")
            break
        case 18:
            code += "00100100"
            sum += decimal("00100100")
            break
        case 19:
            code += "01100100"
            sum += decimal("01100100")
            break
        case 20:
            code += "00010100"
            sum += decimal("00010100")
            break
        case 21:
            code += "01010100"
            sum += decimal("01010100")
            break
        case 22:
            code += "00110100"
            sum += decimal("00110100")
            break
        case 23:
            code += "01110100"
            sum += decimal("01110100")
            break
        case 24:
            code += "00001100"
            sum += decimal("00001100")
            break
        case 25:
            code += "01001100"
            sum += decimal("01001100")
            break
        case 26:
            code += "00101100"
            sum += decimal("00101100")
            break
        case 27:
            code += "01101100"
            sum += decimal("01101100")
            break
        case 28:
            code += "00011100"
            sum += decimal("00011100")
            break
        case 29:
            code += "01011100"
            sum += decimal("01011100")
            break
        case 30:
            code += "00111100"
            sum += decimal("00111100")
            break
    }

    code += "00000001"
    sum += decimal("00000001")

    if(state.Swing == "ON") {
        code += "1111"
        checksum_byte_2 += "1111"
    }else {
        code += "1100" //P3 (fix)
        checksum_byte_2 += "1100"
    }

    //Fan
    if(state.Mode == "AUTO"){
        code += "0101" //Auto Fan
        checksum_byte_2 += "0101"
    }else {
        switch(state.Fan) {
            case 0:
                code += "0101"
                checksum_byte_2 += "0101"
                break
            case 1:
                code += "1100"
                checksum_byte_2 += "1100"
                break
            case 2:
                code += "1010"
                checksum_byte_2 += "1010"
                break
            case 3:
                code += "1110"
                checksum_byte_2 += "1110"
                break
        }
    }

    sum += decimal(checksum_byte_2)

    code += "00000000000000000111000000000111"

    sum += decimal("01110000") + decimal("00000111")

    if(state.Quiet == "OFF") {
        code += "00000000"
    }else {
        code += "00000100"
        sum += decimal("00000100")
    }

    code += "00000000100100010000000000000000"
    sum += decimal("10010001")

    //Checksum byte
    code += "C"

    code += "T"

    return {
        code,
        sum}
}

//Checksum Function
function decimal(num) {
    return ( 
        //reverse ก่อน แล้วแปลงเป็น decimal
        parseInt(String(num).split("").reverse().join(""), 2) 
    )
}
function checksum(number) {
    let sum = number % 256
    return ( 
        //แปลงเป็น binary ก่อนแล้ว reverse
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
            if(i%3 == 1) {
                raw_code += '\n\t\t\t'
            }
        }else if(binary[i] == '0') {
            raw_code += binary_0
            if(i%3 == 1) {
                raw_code += '\n\t\t\t'
            }
        }else if(binary[i] == 'C') { // Checksum
            for(let j = 0; j < text_checksum.length; j++){
                if(text_checksum[j] == '1') {
                    raw_code += binary_1
                    if(j%3 == 1) {
                        raw_code += '\n\t\t\t'
                    }
                }else if(text_checksum[j] == '0') {
                    raw_code += binary_0
                    if(j%3 == 1) {
                        raw_code += '\n\t\t\t'
                    }
                }
            }
        }else if(binary[i] == 'G') {
            raw_code += gap
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
                resolve("Panasonic")
            }, 500);
        })
    })
}

// Receiver Panasonic Function
module.exports.airReceiveMain = async (binaryCode) => {
    let KEY = JSON.parse(fs.readFileSync(path_JSON))

    if(KEY.Name.toLowerCase() === 'panasonic') {
        let binary = binaryCode.substring(binaryCode.length - 154) //Ex. H01000000000001000000011100100000000000001001000000001100000000011100010100000000000000000111000000000111000000000000000010010001000000000000000010011011T

        console.log(binary)

        let power = binary.substring(41, 45)
        let mode = binary.substring(45, 49)
        let tempBit = binary.substring(50, 54)
        let swing = binary.substring(65, 69)
        let fan = binary.substring(69, 73)
        let quiet = binary.substring(109, 113)

        // KEY.Name = 'Panasonic'

        // ON-OFF
        if(power == '1001') {
            KEY.Power = "ON"
        }else if(power == '0001') {
            KEY.Power = "OFF"
        }

        // Mode
        if(mode == '0000') {
            KEY.Mode = "AUTO"
        }else if(mode == '1100') {
            KEY.Mode = "COOL"
        }else if(mode == '0100') {
            KEY.Mode = "DRY"
        }

        // Temperature
        let decimal = parseInt(String(tempBit).split("").reverse().join(""), 2)
        let temp = 16 + decimal
        KEY.Temp = temp

        // Swing
        if(swing == '1111') {
            KEY.Swing = "ON"
        }else {
            KEY.Swing = "OFF"
        }

        // Fan Speed
        if(fan == '0101') {
            KEY.Fan = 0
        }else if(fan == '1100' || fan == '0010') {
            KEY.Fan = 1
        }else if(fan == '1010') {
            KEY.Fan = 2
        }else if(fan == '1110' || fan == '0110') {
            KEY.Fan = 3
        }

        // Quiet option
        if(quiet == '0000') {
            KEY.Quiet = "OFF"
        }else if(quiet == '0100') {
            KEY.Quiet = "ON"
        }

        KEY.Light = "OFF"
        KEY.Sleep = "OFF"
        KEY.Turbo = "OFF"

        let newRemote = JSON.stringify(KEY, null, 2)

        return newRemote
    }else {
        return "fail"
    }
}