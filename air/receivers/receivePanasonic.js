const fs = require('fs');
const path_JSON = './data/key.json';

module.exports.convertKeyPanasonic = async (binaryCode) => {
    let KEY = JSON.parse(fs.readFileSync(path_JSON))

    let binary = binaryCode.substring(binaryCode.length - 154) //Ex. H01000000000001000000011100100000000000001001000000001100000000011100010100000000000000000111000000000111000000000000000010010001000000000000000010011011T
    console.log(binary)

    let power = binary.substring(41, 45)
    let mode = binary.substring(45, 49)
    let tempBit = binary.substring(50, 54)
    let swing = binary.substring(65, 69)
    let fan = binary.substring(69, 73)
    let quiet = binary.substring(109, 113)

    KEY.Name = 'Panasonic'

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
}