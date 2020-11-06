const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')
const { urlencoded } = require('express')

//Load Config File
dotenv.config({path: './config/config.env'})
//Passport Config File
require('./config/passport')(passport)
//Establishing Connection
connectDB()
const app = express()

//body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'))
}
//Handlebars Helpers
const {formatDate, truncate, stripTags, editIcon} = require('./helpers/hbs')
// template Engine (Handlebars)
app.engine('.hbs', exphbs({helpers: {formatDate, truncate, stripTags, editIcon},defaultLayout: 'main',extname: '.hbs'}));
app.set('view engine', '.hbs');

//session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({mongooseConnection: mongoose.connection})
}))

//Passport Initialization
app.use(passport.initialize())
app.use(passport.session())


//static Files
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))



const port = process.env.PORT || 3000
app.listen(port, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`) )