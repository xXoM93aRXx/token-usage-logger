const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv= require('dotenv')


dotenv.config()

const routes =  require('./routes')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/api',routes)

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`)
})