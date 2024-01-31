require('dotenv').config();
const exprees = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const route = require('./routes/remoteRoute.js');
const { Command } = require('commander');
const program = new Command();

const app = exprees()

program
    .name('NODE-AIR')
    .description('This program for control air-condition\nnpm start for process')
    .version('1.0.0')

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(route)

program.parse()

const { SERVER_PORT } = process.env
app.listen(SERVER_PORT, () => {
    console.log("web server: http://localhost:" + SERVER_PORT) //http://localhost:8001
})
// app.listen(3001, () => console.log('App listening on port 3001!'))  //192.168.0.151:3001