const express = require('express');
const fs = require('fs');
const router = express.Router();

const remote =  require('../controller/remote.js');
const path_JSON = './data/key.json';

//get all value of remote
router.get('/remote', (req, res) => {
    res.status(200).send(remote.findAll())
});

// get remote by name
router.get('/remote/:name', (req, res) => {
    const name = req.params.name
    res.status(200).send(remote.findByName(name))
});

//add or change remote air
router.patch('/remote', (req, res) => {
    const new_name = req.body.Name
    res.send(remote.addName(new_name))
});

//update the value and send signals
router.put('/remote', (req, res) => {
    const keys = JSON.parse(fs.readFileSync(path_JSON));
    const name = req.body.Name

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
        
        remote.sendSignals(updateRemote)

        res.status(200).send({
            success: true,
            message: 'Air SEND'
        });
       
    }else {
        res.send({
            success: false,
            message: `${name} Air is not Match! or ${name} is not Added!!`
        });
    }
});

module.exports = router