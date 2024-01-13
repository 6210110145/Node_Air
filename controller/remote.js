const fs = require('fs');
const { centralairMain } = require('../air/test_centralAir.js')
const { panasonicMain } = require('../air/test_panasonic.js');
const { samsungMain } = require('../air/test_samsung.js');
const { samsungPowerMain } = require('../air/test_samsungpower.js');

const path = './json/key.json'
const keys = require('../json/key.json');

module.exports.findAll = function() {
    return {
        success : true,
        keys
    }
}

module.exports.findByName = function(name) {
    if(keys.Name === "NULL") {
        return `Name of Air does not added`
    }else if (keys.Name.toLowerCase() != name.toLocaleLowerCase()) {
        return `${name} is not Found!!`
    }else {
        return {
            success : true,
            keys
        }
    }
}

module.exports.addName = function(newName) {
    if(keys.Name == "NULL" || newName.toLocaleLowerCase() != keys.Name.toLocaleLowerCase()) {
        keys.Name = newName

        //Write name in JSON
        writeJSON(keys)
    }else {
        return `${newName} is alredy used`
    }
}

module.exports.sendSignals = function(updateRemote) {
    let newRemote = JSON.stringify(updateRemote, null, 2)

    fs.writeFile(path, newRemote, (err) => {
        if(err) {
            console.log('Update Fail!')
            console.log(err)
            return
        }else {
            console.log('Update Success!')
        }
    })

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    fs.readFile(path, "utf8", (err, newKey) => {
        if (err) {
            console.log(err)
            return;
        }else {
            let newKeyObj = JSON.parse(newKey)
            if (newKeyObj.Name.toLocaleLowerCase() == 'centralair') {
                centralairMain(newKeyObj)
                
                // return({
                //     success: true,
                //     message: 'Central Air can send'
                // })
            }else if (newKeyObj.Name.toLocaleLowerCase() == 'panasonic') {
                panasonicMain(newKeyObj).then(async (result) => {
                    await sleep(1500)
                    return({
                        success: true,
                        message: `${result} can send`
                    })
                })
                .catch(result => {
                    console.log("can not send")
                    return({
                        success: false,
                        message: `${result}`
                    })
                }) 
            }else if (newKeyObj.Name.toLocaleLowerCase() == 'samsung') {
                if (newKeyObj.Power == 'OFF') {
                    samsungPowerMain(newKeyObj).then(async (result) => {
                        await sleep(1500)
                        return({
                            success: true,
                            message: `${result} can send`
                        })
                    })
                    .catch(result => {
                        console.log("can not send")
                        return({
                            success: false,
                            message: `${result}`
                        })
                    }) 
                }else {
                    samsungMain(newKeyObj).then(async (result) => {
                        await sleep(1500)
                        return({
                            success: true,
                            message: `${result} can send`
                        })
                    })
                    .catch(result => {
                        console.log("can not send")
                        return({
                            success: false,
                            message: `${result}`
                        })
                    }) 
                }       
            }else {
                return({
                    success: false,
                    message: `Can Not Send Signals`
                })
            }
        } 
    });
}

function writeJSON(data) {
    let newKey = JSON.stringify(data, null, 2)

    fs.writeFile(path, newKey, (err) => {
        if(err) {
            console.log(err)
            return
        }else {
            console.log('Write Success! ')
            return {success : true}
        }
    });
}