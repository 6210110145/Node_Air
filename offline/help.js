module.exports.help = function() {
    console.log('Usage: node main.js [options] <string> or <number>\n\n' + 
                    'Options:\n' +
                    '  -h, --help     display help for command\n' +
                    '  -s, --show     display the data of key.json\n'+
                    '  -n, --name     Show the name of AC\n\n' +
                    '  -p, --power    ON / OFF <string>\n' +
                    '  -m, --mode     Mode of AC <string> [COOL, DRY, FAN, AUTO]\n' +
                    '  -t, --temp     Temperature <number> [16-30]\n' +
                    '  -f, --fan      Speed of Fan <string> or <number> [AUTO, 1-3]\n' +
                    '                 AUTO or auto is AUTO mode\n' +
                    '                 1 is LOW Speed\n' +
                    '                 2 is MEDIUM Speed\n' +
                    '                 3 is HIGH Speed\n\n' +
                    '  --swing        ON / OFF <string>\n' +
                    '  --sleep        ON / OFF <string>\n' +
                    '  --turbo        ON / OFF <string>\n' +
                    '  --quiet        ON / OFF <string>\n' +
                    '  -l, --light    ON / OFF <string>\n\n' +
                    '** You do not need to select all options **')
}