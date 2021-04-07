const path = require('path')
const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const exphbs = require('express-handlebars')
const passport = require('passport');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')

// load config 
dotenv.config({ path: './config/.env'})

//passport config
require('./config/passport')(passport)

// connects to MongoDB
connectDB()

const app = express();

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// express session msut be above passport middleware 
app.use(session({
    secret: 'secret secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection})
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server listening on PORT ${PORT}!`))