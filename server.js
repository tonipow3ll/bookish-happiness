const path = require('path')
const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
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

// body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

//handlebars helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

// handlebars
app.engine('.hbs', exphbs({
    helpers: {formatDate, stripTags, truncate, editIcon, select },
     defaultLayout: 'main', 
     extname: '.hbs' }));
app.set('view engine', '.hbs');

// express session msut be above passport middleware 
app.use(session({
    secret: 'secret secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection})
}))

// auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth(config));

// // req.isAuthenticated is provided from the auth router
// app.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });
//passport middleware
app.use(passport.initialize())
app.use(passport.session())

// set global variable for users
// this allows us to specify in handlebars - see notes in index.hbs
app.use(function(req, res, next) {
    res.locals.user = req.user || null
    next()
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/posts', require('./routes/posts'))

const PORT = process.env.MONGO_URI || 3000
// || 5000;
//

app.listen(PORT, console.log(`Server listening on PORT ${PORT}!`))