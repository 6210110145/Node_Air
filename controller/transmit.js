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

    if(keys.Name != undefined || newName.toLocaleLowerCase() != keys.Name.toLocaleLowerCase()) {
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

module.exports.changeRoom = (newRoom) => {
    let keys = JSON.parse(fs.readFileSync(path_JSON));

    if(newRoom != undefined || newRoom.toLocaleLowerCase() != keys.Room.toLocaleLowerCase()) {
        keys.Room = newRoom
        let newKey = JSON.stringify(keys, null, 2)

        fs.writeFile(path_JSON, newKey, (err) => {
            if(err) {
                console.log(err)
                return `Write Fail`
            }else {
                console.log('Write Success! ')
            }
        })
        return `Change Room Success`
    }else {
        return `${newRoom} is used!`
    }
}

module.exports.changeChannel = (newChannel) => {
    let keys = JSON.parse(fs.readFileSync(path_JSON));

    if(newChannel != undefined || newChannel != keys.Channel) {
        keys.Channel = newChannel
        let newKey = JSON.stringify(keys, null, 2)

        fs.writeFile(path_JSON, newKey, (err) => {
            if(err) {
                console.log(err)
                return `Write Fail`
            }else {
                console.log('Write Channel Success! ')
            }
        })
        return `Change new Channel Success`
    }else {
        return `${newChannel} is used!`
    }
}

module.exports.changeDescription = (newDescription) => {
    let keys = JSON.parse(fs.readFileSync(path_JSON));

    if(newDescription != undefined) {
        keys.Description = newDescription
        let newKey = JSON.stringify(keys, null, 2)

        fs.writeFile(path_JSON, newKey, (err) => {
            if(err) {
                console.log(err)
                return `Write Fail`
            }else {
                console.log('Write Description Success! ')
            }
        })
        return `Change descriptionl Success`
    }else {
        return `the description undefined`
    }
}
 
module.exports.sendSignals = () => {
    fs.readFile(path_JSON, "utf8", (err, newKey) => {
        if (err) {
            console.log("read fail")
            return `${err}`
        }else {
            let newKeyObj = JSON.parse(newKey)

            console.log(newKeyObj)

            airSendMain(newKeyObj)
        } 
    });
}