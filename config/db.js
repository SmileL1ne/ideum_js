const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI

        await mongoose.connect(uri, {dbName: 'ideum'})
        
        console.log('MongoDB Atlas connected')
    } catch(error) {
        console.error('MongoDB Atlas connection failed:', error)
        process.exit(1)
    }
}

module.exports = connectDB

