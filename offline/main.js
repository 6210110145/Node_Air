const fs = require('fs');

const path_JSON = '../data/key.json';
const { sendSignal } = require('./air.js')
const { help } = require('./help.js')

var keys = JSON.parse(fs.readFileSync(path_JSON));

var argv = require('minimist')(process.argv.slice(2), {
    string: ['name', 'power', 'mode', 'swing', 'sleep', 'turbo', 'quiet', 'light'],
    boolean: ['help', 'show'],
    number: ['temp', 'fan'],
    alias: {n: 'name', p: 'power', m: 'mode', t: 'temp', f: 'fan', s: 'swing', l: 'light', h: 'help', s: 'show'},
    unknown: () => {
        console.log('Unkown argument\nPlease print --help for Help')
    }
});

function mainOffline() {
    if(argv.name) {
        keys.Name = argv.name
    }

    if(argv.power) {
        keys.Power = argv.power.toUpperCase()
    }

    if(argv.mode) {
        keys.Mode = argv.mode.toUpperCase()
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
        if(argv.fan == 'auto' || argv.fan == 'AUTO' || argv.fan == 'Auto') {
            keys.Fan = 0
        }else if(argv.fan > 3) {
            keys.Fan = 3
        }else {
            keys.Fan = argv.fan
        }
    }

    if(argv.swing) {
        keys.Swing = argv.swing.toUpperCase()
    }

    if(argv.sleep) {
        keys.Sleep = argv.sleep.toUpperCase()
    }

    if(argv.turbo) {
        keys.Turbo = argv.turbo.toUpperCase()
    }

    if(argv.quiet) {
        keys.Quiet = argv.quiet.toUpperCase()
    }

    if(argv.light) {
        keys.Light = argv.light.toUpperCase()
    }

    let newKey = JSON.stringify(keys, null, 2)

    fs.writeFileSync(path_JSON, newKey);

    if(argv.name) {
        console.log('Update Success')
        sendSignal(argv.name)
    }else {
        console.log(`You must select name Air before`)
    }

    if(argv.show) {
        console.log(keys)
    }

    if(argv.help) {
        help()
    }
}

mainOffline()