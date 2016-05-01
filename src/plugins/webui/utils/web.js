import _ from 'lodash'
import express from 'express'
import path from 'path'
import passHash from 'password-hash'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import expressSession from 'express-session'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import logger from 'morgan'
import config from '../../../../config.json'
import { getPlugins } from './plugins'
//import { User } from '../../../database.js'
var plugins;

const app = express()

const test = {
  id: 34543634532543543,
  name: 'js41637',
  slackID: 'U0D4UA5TJ',
  access: 'superadmin',
  password: 'sha1$73995179$1$e687fb6d9460b2d2b15ff2e75d25d8337de05704'
}

app.set('view engine', 'jade')
app.set('views', path.join(__dirname, 'views'))
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressSession({ secret: 'magic', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  console.log("serialize", user)
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  console.log("deserialize", id)
  if (id == test.id)
    done(null, test)
  else
    done(null, false)
})

passport.use(new LocalStrategy((username, password, done) => {
  if (passHash.verify(password, test.password)) {
    console.log("User verified", test)
    return done(null, test)
  } else {
    console.log("Incorrect password")
    return done(null, false)
  }
}))

/*passport.deserializeUser((id, done) => User.findOneByID(id).then(user => {
  console.log(user)
  done(null, user)
}))

passport.use(new LocalStrategy((username, password, done) => User.findOneByName(username).then(user => {
  if (!user) {
    console.log("Unknown user | User not setup")
    return done(null, false)
  }
  if (passHash.verify(password, user.password)) {
    console.log("User verified")
    return done(null, user)
  } else {
    console.log("Incorrect password")
    return done(null, false)
  }
})))*/

const port = 3000
const server = app.listen(port)

server.on('error', onError)
server.on('listening', () => console.log('Listening on port ' + server.address().port))

app.get('/login', (req, res) => res.render('login', { name: _.capitalize(config.botname), user: req.user }))

app.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' }))

getPlugins().then(daPlugins => {
  plugins = daPlugins;
  _.forEach(daPlugins.pages, page => {
    app.get(page.url, hasAccess, page.func)
  })
  onLoad();
})

const onLoad = () => {
  console.log(plugins.routes)
  app.get('/', (req, res) => res.render('index', {
    name: _.capitalize(config.botname),
    user: req.user,
    routes: plugins.routes
  }))
}

const hasAccess = (req, res, next) => {
  if (!req.isAuthenticated()) return res.render('login', { name: _.capitalize(config.botname), 'message': 'You need to log in to access this page.' })
  let access = plugins.pages[req.route.path].access
  if (!access || (access && _.includes(access, req.user.access))) return next()
  else return res.render('error', { name: _.capitalize(config.botname), 'message': "You're not allowed to access this page :/" })
}

function onError(error) {
  if (error.syscall !== 'listen') throw error
  switch (error.code) {
    case 'EACCES':
      console.error('Port ' + port + ' requires elevated privileges')
      process.exit(1)
      break;
    case 'EADDRINUSE':
      console.error('Port ' + port + ' is already in use')
      process.exit(1)
      break;
    default:
      throw error;
  }
}

module.exports = app
