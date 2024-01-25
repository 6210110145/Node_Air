const exec = require('child_process').exec
const watch = require('node-watch');
const fs = require('fs');

const { receiveMain, createNewFile } = require('./receivers/receive.js')

const path_file_signal = './signal.txt';

runMode2 = () => {   
    // exec('mode2 -d /dev/lirc1 > signal.txt'), (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(`error: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         console.log(`stderr: ${stderr}`);
    //         return;
    //     }
    //     console.log(stdout)
    // }
}

watch(path_file_signal, { delay: 500 }, (event, name) => {
    if(event){
        console.log(event)

        if(event == 'remove'){
            runMode2()

            let text = createNewFile()
            console.log(text)
        }else {
            fs.readFile(path_file_signal, (err, data) => {
                if(err) {
                    console.log(err)
                    return
                }else {
                    if (data.length == 0) {
                        console.log(`${name} is empty!`)
                        return
                    }else {
                        receiveMain()
                    }
                }
            });
        }
    }
});