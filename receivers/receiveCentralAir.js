const fs = require('fs');
const path_JSON = './data/key.json';

// Convert binary to KEY Function
module.exports.convertKeyCentralAir = async (binaryCode) => {
    let KEY = JSON.parse(fs.readFileSync(path_JSON))

    let binary = binaryCode.substring(binaryCode.length - 70) //Ex. H10011000011000000000000000001010010G00000000000001000000000000001111T
    console.log(binary)

    let mode = binary.substring(1, 4)
    let power = binary[4]
    let fan = binary.substring(5, 7)
    let swing = binary[7]
    let sleep = binary[8]
    let temp_bit = binary.substring(9, 13)
    let turbo = binary[21]
    let light = binary[22]

    KEY.Name = "CentralAir"

    // Mode
    if(mode == '000') {
        KEY.Mode = "AUTO"
    }else if(mode == '100') {
        KEY.Mode = "COOL"
    }else if(mode == '010') {
        KEY.Mode = "DRY"
    }else if(mode == '110') {
        KEY.Mode = "FAN"
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
    KEY.Temp = temp

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

    let newRemote = JSON.stringify(KEY, null, 2)

    return newRemote
}