const fs = require('fs');
const { airSendMain } = require('../remotes/remoteAir.js');

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
    }else if (keys.Name.toLowerCase() != name.toLowerCase()) {
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

module.exports.sendSignals = () => {
    fs.readFile(path_JSON, "utf8", (err, newKey) => {
        if (err) {
            console.log("read fail")
            return `${err}`
        }else {
            let newKeyObj = JSON.parse(newKey)
            airSendMain(newKeyObj)
        } 
    });
}