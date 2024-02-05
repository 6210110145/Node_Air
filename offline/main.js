const fs = require('fs');

const path_JSON = '../data/key.json';
const { help } = require('./help.js')
const { airSendMain } = require('../remotes/remoteAir.js')

var keys = JSON.parse(fs.readFileSync(path_JSON));

var argv = require('minimist')(process.argv.slice(2), {
    string: ['power', 'mode', 'swing', 'sleep', 'turbo', 'quiet', 'light'],
    boolean: ['help', 'show', 'name'],
    number: ['temp', 'fan'],
    alias: {n: 'name', p: 'power', m: 'mode', t: 'temp', f: 'fan', l: 'light', h: 'help', s: 'show'},
    unknown: () => {
        console.log('Unkown argument\nPlease print --help for Help\n')
        process.exit(1)
    }
});

function mainOffline() {
    if(argv.name) {
        console.log(keys.Name)
        process.exit(1)
    }

    if(argv.power) {
        if("ON" == argv.power.toUpperCase()) {
            keys.Power = "ON"
        }else if("OFF" == argv.power.toUpperCase()) {
            keys.Power = "OFF"
        }else {
            console.log("-p or --power, Wrong command\nThe command is \"on\" or \"off\"")
            process.exit(1)
        }
    }

    if(argv.mode) {
        if("COOL" == argv.mode.toUpperCase()) {
            keys.Mode = "COOL"
        }else if("DRY" == argv.mode.toUpperCase()) {
            keys.Mode = "DRY"
        }else if("FAN" == argv.mode.toUpperCase()) {
            keys.Mode = "FAN"
        }else if("AUTO" == argv.mode.toUpperCase()) {
            keys.Mode = "AUTO"
        }else {
            console.log("-m or --mode, Wrong command\nThe command is \"cool\" or \"dry\" or \"fan\" or \"auto\"")
            process.exit(1)
        }
    }

    if(argv.temp) {
        if(argv.temp < 16) {
            keys.Temp = 16
        }else if(argv.temp > 30) {
            keys.Temp = 30
        }else {
            keys.Temp = argv.temp
        }
    }

    if(argv.fan) {
        console.log(argv.fan)
        if(argv.fan == 'auto' || argv.fan == 'AUTO' || argv.fan == 'Auto' || argv.fan < 0) {
            keys.Fan = 0
        }else if(argv.fan == 3 || argv.fan > 3) {
            keys.Fan = 3
        }else if(argv.fan == 1){
            keys.Fan = 1
        }else if(argv.fan == 2){
            keys.Fan = 2
        }else {
            console.log("-f or --fan, Wrong command\nIf the command is 0, Please input \"AUTO\" instead")
            process.exit(1)
        }
    }

    if(argv.swing) {
        if("ON" == argv.swing.toUpperCase()) {
            keys.Swing = "ON"
        }else if("OFF" == argv.swing.toUpperCase()) {
            keys.Swing = "OFF"
        }else {
            console.log("--swing, Wrong command\nThe command is \"on\" or \"off\"")
            process.exit(1)
        }
    }

    if(argv.sleep) {
        if("ON" == argv.sleep.toUpperCase()) {
            keys.Sleep = "ON"
        }else if("OFF" == argv.sleep.toUpperCase()) {
            keys.Sleep = "OFF"
        }else {
            console.log("--sleep, Wrong command\nThe command is \"on\" or \"off\"")
            process.exit(1)
        }
    }

    if(argv.turbo) {
        if("ON" == argv.turbo.toUpperCase()) {
            keys.Turbo = "ON"
        }else if("OFF" == argv.turbo.toUpperCase()) {
            keys.Turbo = "OFF"
        }else {
            console.log("--turbo, Wrong command\nThe command is \"on\" or \"off\"")
            process.exit(1)
        }
    }

    if(argv.quiet) {
        if("ON" == argv.quiet.toUpperCase()) {
            keys.Quiet = "ON"
        }else if("OFF" == argv.quiet.toUpperCase()) {
            keys.Quiet = "OFF"
        }else {
            console.log("--quiet, Wrong command\nThe command is \"on\" or \"off\"")
            process.exit(1)
        }
    }

    if(argv.light) {
        if("ON" == argv.light.toUpperCase()) {
            keys.Light = "ON"
        }else if("OFF" == argv.light.toUpperCase()) {
            keys.Light = "OFF"
        }else {
            console.log("-l or --light, Wrong command\nThe command is \"on\" or \"off\"")
            process.exit(1)
        }
    }

    if(argv.show) {
        console.log(keys)
        process.exit(1)
    }

    if(argv.help) {
        help()
        process.exit(1)
    }

    let newKey = JSON.stringify(keys, null, 2)

    fs.writeFileSync(path_JSON, newKey)

    console.log('Update Success\n')

    fs.readFile(path_JSON, "utf8", (err, newKey) => {
        if (err) {
            console.log("read fail")
            process.exit(1)
        }else {
            console.log('Send Success\n')
            
            let newKeyObj = JSON.parse(newKey)
            airSendMain(newKeyObj)
        } 
    });
}

mainOffline()