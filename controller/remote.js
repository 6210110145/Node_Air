const fs = require('fs');
const { centralairMain } = require('../air/test_centralAir.js')
const { panasonicMain } = require('../air/test_panasonic.js');
const { samsungMain } = require('../air/test_samsung.js');
const { samsungPowerMain } = require('../air/test_samsungpower.js');

const path = './data/key.json'
const keys = require('../data/key.json');

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
        let newKey = JSON.stringify(keys, null, 2)

        fs.writeFile(path, newKey, (err) => {
            if(err) {
                console.log(err)
                return `Write Fail`
            }else {
                console.log('Write Success! ')
                return {success : true}
            }
        })
    }else {
        return `${newName} is alredy used`
    }
}

module.exports.sendSignals = function(updateRemote) {
    let newRemote = JSON.stringify(updateRemote, null, 2)

    fs.writeFile(path, newRemote, (err) => {
        if(err) {
            console.log(err)
            return `Update Fail`
        }else {
            console.log('Update Success!')
        }
    })

    fs.readFile(path, "utf8", (err, newKey) => {
        if (err) {
            console.log(err)
            return `${err}`
        }else {
            let newKeyObj = JSON.parse(newKey)
            if (newKeyObj.Name.toLocaleLowerCase() == 'centralair') {
                centralairMain(newKeyObj)
            }else if (newKeyObj.Name.toLocaleLowerCase() == 'panasonic') {
                panasonicMain(newKeyObj)
            }else if (newKeyObj.Name.toLocaleLowerCase() == 'samsung') {
                if (newKeyObj.Power == 'OFF') {
                    samsungPowerMain(newKeyObj)
                }else {
                    samsungMain(newKeyObj)
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