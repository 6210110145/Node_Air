// const { keys } = require("json/key.json");
const keys = require('../json/key.json');
const fs = require('fs');
const path = './json/key.json'

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