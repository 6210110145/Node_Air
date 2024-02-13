const express = require('express');
const fs = require('fs');
const router = express.Router();

const remote =  require('../controller/transmit.js');
const path_JSON = './data/key.json';

//get all value of remote
router.get('/remote', (req, res) => {
    res.status(200).json(remote.findAll())
});

// get remote by name
router.get('/remote/:name', (req, res) => {
    const name = req.params.name
    res.status(200).json(remote.findByName(name))
});

// add or change remote air
router.patch('/remote', (req, res) => {
    const new_name = req.body.Name
    res.json(remote.addName(new_name))
});

// change room
router.post('/room', (req, res) => {
    const new_room = req.body.Room
    // console.log(req.body.Room)
    res.json(remote.changeRoom(new_room))
});

// change channel
router.post('/channel', (req, res) => {
    const new_channel = req.body.Channel
    // console.log(req.body.Channel)
    res.json(remote.changeChannel(parseInt(new_channel)))
});

// change description
router.post('/description', (req, res) => {
    const new_description = req.body.Description
    // console.log(req.body.Description)
    res.json(remote.changeDescription(new_description))
});

//update the value and send signals
router.post('/remote', (req, res) => {
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
        if(parseInt(temp) < 16) {
            keys.Temp = 16
        }else if(parseInt(temp) > 30) {
            keys.Temp = 30
        }else {
            keys.Temp = parseInt(temp)
        }
    }

    if(fan) {
        if(fan === 'AUTO') {
            keys.Fan = 0
        }else if(parseInt(fan) > 3) {
            keys.Fan = 3
        }else {
            keys.Fan = parseInt(fan)
        }
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

    setTimeout(() => {
        res.status(200).json({
            message: 'Air SEND'
        });
    }, 1000)
    
});

module.exports = router