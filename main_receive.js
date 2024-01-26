const exec = require('child_process').exec
const watch = require('node-watch');
const fs = require('fs');

const { receiveMain, createNewFile } = require('./controller/receive.js')

const path_file_signal = './signal.txt';

// Run Mode2 Command every time
runMode2 = () => {   
    // exec('mode2 -d /dev/lirc1 > signal.txt'), (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(`error: ${error.message}`)
    //         return;
    //     }
    //     if (stderr) {
    //         console.log(`stderr: ${stderr}`)
    //         return;
    //     }
    //     console.log(stdout)
    // }
}

// If signal file is cheanged 
watch(path_file_signal, { delay: 500 }, (event, name) => {
    if(event){
        console.log(event)

        // File is removed, Create New file && Run Mode2 command Again
        if(event == 'remove'){
            runMode2()

            let text = createNewFile()
            console.log(text)

        // File is updated, Read Signal && Update New JSON
        }else {
            fs.readFile(path_file_signal, (err, data) => {
                if(err) {
                    console.log(err)
                    return
                
                // File is empty, do nothing
                }else {
                    if (data.length == 0) {
                        console.log(`${name} is empty!`)
                        return

                    // Have signal, Keep processing
                    }else {
                        receiveMain()
                    }
                }
            });
        }
    }
});