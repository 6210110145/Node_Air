const exprees = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const route = require('./routes/remoteRoute.js')

const app = exprees()

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(route)

const port = 8001
app.listen(port, () => {
    console.log("web server: http://localhost:" + port)
})
// app.listen(3001, () => console.log('App listening on port 3001!'))  //192.168.0.151:3001