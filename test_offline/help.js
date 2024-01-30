module.exports.help = () => {
    console.log('Usage: node main_offline.js [options] <string> or <number>\n\n' + 
                    'Options:\n' +
                    '  -h, --help     display help for command\n' +
                    '  -n, --name     select of name\'s air-conditioner [CentralAir, Panasonic, Samsung, Mitsubishi]\n' +
                    '  -p, --power    ON / OFF <string>\n' +
                    '  -m, --mode     Mode of AC <string> [COOL, DRY, FAN, AUTO]\n' +
                    '  -t, --temp     Temperature <number> [16-30]\n' +
                    '  -f, --fan      Speed of Fan <number> [0-3]\n' +
                    '                 0 is AUTO\n' +
                    '                 1 is LOW\n' +
                    '                 2 is MIDIUM\n' +
                    '                 3 is HIGH\n\n' +
                    '  --swing        ON / OFF <string>\n' +
                    '  --sleep        ON / OFF <string>\n' +
                    '  --turbo        ON / OFF <string>\n' +
                    '  --quiet        ON / OFF <string>\n' +
                    '  --light        ON / OFF <string>\n\n' +
                    '** You do not need to select all options **')
} 