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
    let keys = JSON.parse(fs.readFileSync(path_JSON));
    
    // const name = req.body.Name
    const power = req.body.Power
    const mode = req.body.Mode
    const temp = req.body.Temp
    const fan = req.body.Fan
    const swing = req.body.Swing
    const sleep = req.body.Sleep
    const turbo = req.body.Turbo
    const quiet = req.body.Quiet
    const light = req.body.Light


    if(power) {
        keys.Power = power
    }

    if(mode) {
        keys.Mode = mode
    }

    if(temp) {
        keys.Temp = temp
    }

    if(fan) {
        keys.Fan = fan
    }

    if(swing) {
        keys.Swing = swing
    }

    if(sleep) {
        keys.Sleep = sleep
    }

    if(turbo) {
        keys.Turbo = turbo
    }

    if(quiet) {
        keys.Quiet = quiet
    }

    if(light) {
        keys.Light = light
    }

    let newKey = JSON.stringify(keys, null, 2)

    fs.writeFileSync(path_JSON, newKey)
            
    remote.sendSignals()

    res.status(200).json({
        message: 'Air SEND',
        keys
    });
});

module.exports = router