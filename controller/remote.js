import { keys } from "../key.js"

export function findAll() {
    return keys
}

export function findByName(name) {
    for (let i = 0; i < keys.length; i++) {
        if (keys[i].Name.toLowerCase() == name.toLowerCase()) {
            return keys[i]
        }
    }
}

// export function updateByName(name, newRemote) {
//     let remote = findByName(name)

//     const updateRemote = {
//         Power: newRemote.Power,
//         Mode: newRemote.Mode,
        
//     }
// }