import * as fs from 'fs';
import { exec } from "child_process";

const binary_1 = '650 1600 '
const binary_0 = '650 550 '
const header = '9000 4500 '
const gap = '650 20000'
const tail = '650 '

export function centralairMain(key) {
    return new Promise((resolve, reject) => {
        sendSignals(getRemote(KeyToBinary(key))).then((result) => {
            resolve(result)
        })
        .catch( result => {
            reject(result)
        })
        // if(a == true){
            
        // }else {
        //     reject('fail')
        // }
        // .then((result) => {
        //     resolve(result)
        // })
        // .catch( result => {
        //     reject(result)
        // })
        
    })
}

function KeyToBinary(state) {
    var code = 'H'

    //the Frame 1
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

    if(state.Power == "ON") {
        code += '1'
    }else {
        code += '0'
    }

    switch(state.Fan) {
        case '0':
            code += "00"
            break
        case '1':
            code += "10"
            break
        case '2':
            code += "01"
            break
        case '3':
            code += "11"
            break
    }

    if(state.Swing == "ON") {
        code += '1'
    }else {
        code += '0'
    }

    if(state.Sleep == "ON") {
        code += '1'
    }else {
        code += '0'
    }

    switch(state.Temp) {
        case '16':
            code += "0000"
            break
        case '17':
            code += "1000"
            break
        case '18':
            code += "0100"
            break
        case '19':
            code += "1100"
            break
        case '20':
            code += "0010"
            break
        case '21':
            code += "1010"
            break
        case '22':
            code += "0110"
            break
        case '23':
            code += "1110"
            break
        case '24':
            code += "0001"
            break
        case '25':
            code += "1001"
            break
        case '26':
            code += "0101"
            break
        case '27':
            code += "1101"
            break
        case '28':
            code += "0011"
            break
        case '29':
            code += "1011"
            break
        case '30':
            code += "0111"
            break
    }

    code += "00000000"

    if(state.Turbo == "ON") {
        code += '1'
    }else {
        code += '0'
    }

    if(state.Light == "ON") {
        code += '1'
    }else {
        code += '0'
    }

    code += "0000001010010" 
    code += "G"
    
    //the Frame 2
    if(state.Swing == "ON") {
        code += '1'
    }else {
        code += '0'
    }

    code += "000000000000100000000000000"

    //the last 4 bits (Checksum)
    if(state.Mode == "COOL") {
        switch(state.Temp) {
            case '16':
                code += "101"
                break
            case '17':
                code += "011"
                break
            case '18':
                code += "111"
                break
            case '19':
                code += "000"
                break
            case '20':
                code += "100"
                break
            case '21':
                code += "010"
                break
            case '22':
                code += "110"
                break
            case '23':
                code += "001"
                break
            case '24':
                code += "101"
                break
            case '25':
                code += "011"
                break
            case '26':
                code += "111"
                break
            case '27':
                code += "000"
                break
            case '28':
                code += "100"
                break
            case '29':
                code += "010"
                break
            case '30':
                code += "110"
                break
        }if(state.Temp == "16" || state.Temp == "17" || state.Temp == "18" || state.Temp == "27" || 
            state.Temp == "28" || state.Temp == "29" || state.Temp == "30") {
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
            case '16':
                code += "011"
                break
            case '17':
                code += "111"
                break
            case '18':
                code += "000"
                break
            case '19':
                code += "100"
                break
            case '20':
                code += "010"
                break
            case '21':
                code += "110"
                break
            case '22':
                code += "001"
                break
            case '23':
                code += "101"
                break
            case '24':
                code += "011"
                break
            case '25':
                code += "111"
                break
            case '26':
                code += "000"
                break
            case '27':
                code += "100"
                break
            case '28':
                code += "010"
                break
            case '29':
                code += "110"
                break
            case '30':
                code += "001"
                break
        }if(state.Temp == "16" || state.Temp == "17" || state.Temp == "26" || state.Temp == "27" || 
            state.Temp == "28" || state.Temp == "29" || state.Temp == "30") {
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
            case '16':
                code += "111"
                break
            case '17':
                code += "000"
                break
            case '18':
                code += "100"
                break
            case '19':
                code += "010"
                break
            case '20':
                code += "110"
                break
            case '21':
                code += "001"
                break
            case '22':
                code += "101"
                break
            case '23':
                code += "011"
                break
            case '24':
                code += "111"
                break
            case '25':
                code += "000"
                break
            case '26':
                code += "100"
                break
            case '27':
                code += "010"
                break
            case '28':
                code += "110"
                break
            case '29':
                code += "001"
                break
            case '30':
                code += "101"
                break
        }
        if(state.Temp == "16" || state.Temp == "25" || state.Temp == "26" || state.Temp == "27" || 
            state.Temp == "28" || state.Temp == "29" || state.Temp == "30") {
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

    return code
}

function getRemote(binary) {
    var raw_code = ''
    for(let i = 0; i < binary.length; i++) {
        if(binary[i] == 'H') {
            raw_code += header
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

    return 'begin remote\n\n  name  AIR\n  flags RAW_CODES\n  eps            30\n  aeps          100\n\n  gap          124928' +
            '\n\n\t\tbegin raw_codes\n\n\t\t  name command\n\n'+'\t\t\t'+raw_code+'\n\n\t\tend raw_codes\n\nend remote\n';
}

async function sendSignals(remote) {
    new Promise((resolve, reject) => {
        fs.writeFile('./AIR.lircd.conf', remote, (err) => {
        if(err) {
            return console.log(err)
        }
        console.log('File created.')

    
        exec('sudo cp ./AIR.lircd.conf /etc/lirc/lircd.conf', (error, stdout, stderr) => {
            if (error) {
                console.log(stderr)
            }   
        })
        console.log("File copyed.");

        exec("sudo systemctl start lircd.socket", (error, stdout, stderr) => {
            if (error) {
                console.log(stderr)
            }
        })

        exec("sudo systemctl stop lircd", (error, stdout, stderr) => {
            if (error) {
                console.log(stderr)
            }
        })

        setTimeout(() => {
            console.log("Commande send")
            resolve('central Air')
            // exec('irsend SEND_ONCE AIR command'), (error, stdout, stderr) => {
            //     if (error) {
            //         console.log(stderr)
            //     }
            // } 
            
        }, 2000) 
    })
    })
    
}