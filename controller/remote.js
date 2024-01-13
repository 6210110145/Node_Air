import keys from '../key.json' assert {type: 'json'};
import * as fs from 'fs';

export function findAll() {
    return {
        success : true,
        keys
    }
}

export function findByName(name) {
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

export function addName(newName) {
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

    fs.writeFile('./key.json', newKey, (err) => {
        if(err) {
            console.log(err)
            return
        }else {
            console.log('Write Success! ')
            return {success : true}
        }
    });
}