const fs = require('fs');
const { centralairMain } = require('../air/centralAir.js')
const { panasonicMain } = require('../air/panasonic.js');
const { samsungMain } = require('../air/samsung.js');
const { samsungPowerMain } = require('../air/samsungpower.js');
const { mitsubishiMain } = require('../air/mitsubishi.js');

const path_JSON = './data/key.json';

module.exports.findAll = () => {
    let keys = JSON.parse(fs.readFileSync(path_JSON));

    console.log("read success");

    return {
        keys
    }
}

module.exports.findByName = (name) => {
    let keys = JSON.parse(fs.readFileSync(path_JSON));

    if(keys.Name === "NULL") {
        return `Name of Air does not added`
    }else if (keys.Name.toLowerCase() != name.toLocaleLowerCase()) {
        return `${name} is not Found!!`
    }else {
        console.log("read success");

        return {
            keys
        }
    }
}

module.exports.addName = (newName) => {
    let keys = JSON.parse(fs.readFileSync(path_JSON));

    if(keys.Name == "NULL" || newName.toLocaleLowerCase() != keys.Name.toLocaleLowerCase()) {
        keys.Name = newName
        let newKey = JSON.stringify(keys, null, 2)

        fs.writeFile(path_JSON, newKey, (err) => {
            if(err) {
                console.log(err)
                return `Write Fail`
            }else {
                console.log('Write Success! ')
                return `Add ${newName} Success`
            }
        })
    }else {
        return `${newName} is used!`
    }
}

module.exports.sendSignals = (updateRemote) => {
    let newRemote = JSON.stringify(updateRemote, null, 2)

    fs.writeFile(path_JSON, newRemote, (err) => {
        if(err) {
            console.log(err)
            return `Update Fail`
        }else {
            console.log('Update Success!')
        }
    })

    fs.readFile(path_JSON, "utf8", (err, newKey) => {
        if (err) {
            console.log("read fail")
            return `${err}`
        }else {
            let newKeyObj = JSON.parse(newKey)
            let nameAir = newKeyObj.Name.toLocaleLowerCase()

            if (nameAir === 'centralair') {
                centralairMain(newKeyObj)
            }else if (nameAir === 'panasonic') {
                panasonicMain(newKeyObj)
            }else if (nameAir === 'samsung') {
                if (newKeyObj.Power === 'OFF') {
                    samsungPowerMain(newKeyObj)
                }else {
                    samsungMain(newKeyObj)
                }       
            }else if (nameAir === 'mitsubishi') {
                mitsubishiMain(newKeyObj)
            }else{
                return({
                    success: false,
                    message: `Can Not Send Signals`
                });
            }
        } 
    });
}