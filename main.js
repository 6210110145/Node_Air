import exprees from 'express';
import bodyParser from 'body-parser';
import keys from './key.json' assert {type: 'json'};
import * as fs from 'fs';
import { centralairMain } from './aircons/test_centralAir.js';
import { panasonicMain } from './aircons/test_panasonic.js';

const app = exprees()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//get all value of remote
app.get('/remote', (req, res) => {
    res.json({
        success: 'true',
        keys
    })
})

// get remote by name
app.get('/remote/:name', (req, res) => {
    const name = req.params.name
    
    if(keys.Name === "NULL") {
        res.json({
            success: false,
            message: `Name of Air does not added`
        })
    }else if (keys.Name.toLowerCase() != name.toLocaleLowerCase()) {
        res.json({
            success: false,
            message: `${name} is not Found!!`
        })
    }else {
        res.json({
            success: true,
            keys
        }) 
    }
})

//add or change remote air
app.patch('/remote/:name', (req, res) => {
    const new_name = req.params.name

    if(keys.Name == "NULL" || new_name.toLocaleLowerCase() != keys.Name.toLocaleLowerCase()) {
        //add or change the name AIR
        keys.Name = new_name

        //Write name in JSON
        fs.writeFile('./key.json', JSON.stringify(keys, null, 2), (err) => {
            if(err) {
                console.log(err)
                return
            }else {
                res.json({
                    success: true,
                    keys
                })
            }
            console.log('Write Success! ');
        });
    }else {
        res.json({
            message: `${new_name} is alredy used`
        })
    }
})

//update the value and send signals
app.put('/remote/:name', (req, res) => {
    const name = req.params.name

    if(keys.Name.toLowerCase() === name.toLowerCase()) {
        const updateRemote = {
            Name: name,
            Power: req.body.Power,
            Mode: req.body.Mode,
            Temp: req.body.Temp,
            Fan: req.body.Fan,
            Swing: req.body.Swing,
            Sleep: req.body.Sleep,
            Turbo: req.body.Turbo,
            Quiet: req.body.Quiet,
            Light: req.body.Light,
        }

        if(name.toLocaleLowerCase() == 'samsung') {
            if(updateRemote.Power == 'OFF') {
                updateRemote.Name = 'samsungpower'
            }
        }
        
        let newRemote = JSON.stringify(updateRemote, null, 2)

        fs.writeFile('./key.json', newRemote, (err) => {
            if(err) {
                console.log('Update Fail!')
                console.log(err)
                return
            }else {
                console.log('Update Success!')
                // res.json({
                //     success: true,
                //     updateRemote
                // })
            }
        })

        fs.readFile('./key.json', "utf8", async (err, newKey) => {
            if (err) {
                console.log(err)
                return;
            }else {
                let newKeyObj = JSON.parse(newKey)
                // centralairMain(newKeyObj)
                if (newKeyObj.Name.toLocaleLowerCase() == 'centralair') {
                    await centralairMain(newKeyObj)
                }else if (newKeyObj.Name.toLocaleLowerCase() == 'panasonic'){
                    await panasonicMain(newKeyObj)
                }
            } 
            res.json({
                success: true
            })
        }, 1000);
    }else {
        res.json({
            success: 'false',
            message: `${name} Air is not Match! or ${name} is not Added!!`
        })
    }
})

const port = 8001
app.listen(port, () => {
    console.log("web server: http://localhost:" + port)
})