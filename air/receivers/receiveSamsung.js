const fs = require('fs');
const path_JSON = './data/key.json';

// Convert binary to KEY Function
module.exports.convertKeySamsung = async (binary) => {
    let KEY = JSON.parse(fs.readFileSync(path_JSON))

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
}