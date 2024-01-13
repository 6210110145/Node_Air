import keys from '../key.json' assert {type: 'json'};

export function findAll() {
    return keys
}

export function findByName(name) {
    if(keys.Name === "NULL") {
        return `Name of Air does not added`
    }else if (keys.Name.toLowerCase() != name.toLocaleLowerCase()) {
        return `${name} is not Found!!`
    }else {
        return keys
    }
}

export function addByName(name) {
    
}

// export function updateByName(name, newRemote) {
//     let remote = findByName(name)

//     const updateRemote = {
//         Power: newRemote.Power,
//         Mode: newRemote.Mode,
        
//     }
// }