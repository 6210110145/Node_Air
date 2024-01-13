const exprees = require('express');
const bodyParser = require('body-parser');
// const fs = require('fs');

const remote =  require('./controller/remote.js');
const keys = require('./data/key.json');
// const path = './json/key.json'

const app = exprees()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello World')
})

//get all value of remote
app.get('/remote', (req, res) => {
    res.send(remote.findAll())
})

// get remote by name
app.get('/remote/:name', (req, res) => {
    const name = req.params.name
    res.send(remote.findByName(name))
})

//add or change remote air
app.patch('/remote/:name', (req, res) => {
    const new_name = req.params.name
    res.send(remote.addName(new_name))
})

//update the value and send signals
app.put('/remote/:name', async (req, res) => {
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
        
        remote.sendSignals(updateRemote)

        res.send({
            success: true,
            message: 'Air SEND'
        })
       
    }else {
        res.send({
            success: false,
            message: `${name} Air is not Match! or ${name} is not Added!!`
        })
    }
})

// const port = 8001
// app.listen(port, () => {
//     console.log("web server: http://localhost:" + port)
// })

app.listen(3001, () => console.log('Example app listening on port 3000!'))  //192.168.0.151:3001