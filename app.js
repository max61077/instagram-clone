const express = require('express');
const mongoose = require('mongoose')
const app = express()
const path = require('path')


const {MONGOURI} = require('./config/keys');

mongoose.connect(MONGOURI, {
    useUnifiedTopology:true,
    useNewUrlParser:true
})

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDb');
})

mongoose.connection.on('error', (err) => {
    console.log('Error Connecting', err);
})

require('./models/user')
require('./models/post')


app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));