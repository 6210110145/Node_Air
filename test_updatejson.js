import * as fs from 'fs';
import keys from './key.json' assert {type: 'json'};

console.log(keys)
keys.Name = "news";

fs.writeFile('./key.json', JSON.stringify(keys, null, 2), (err) => {
    if(err) {
        console.log(err)
        return
    }
    console.log(JSON.stringify(keys));
    console.log('Write Success! ');
});