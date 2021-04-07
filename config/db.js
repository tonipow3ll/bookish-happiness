const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            userNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log(`MongoDB Connected ${conn.connection.host}`)
        // return mongoose.connect(uri, config)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB