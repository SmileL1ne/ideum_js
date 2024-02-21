const express = require('express')
const dbConn = require('./config/db')
const connectDB = require('./config/db')

const app = express()

connectDB()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})