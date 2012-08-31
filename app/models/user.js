/*
    IMPORTANTE TODO:

    Definir los datos a guardar para un usuario que se logee, aparte de los que
    aportará cada red social por la que se conecte. Pero debería haber un ID único.
    Quitaré el bloque llamado "fb" y el de "tw" para hacer uno general, que sino puede
    ser un maldito caos según quién se registre y por dónde lo haga.

    Habilitar el registro tradicional, que está más abajo, como están los otros.
*/

var exports = module.exports = everyauth = require('everyauth')
  , Promise = everyauth.Promise
  , UserSchema = new Schema({})
  , User


var exports = module.exports = mongooseAuth = require('mongoose-auth')

everyauth.debug = true

/*******************************************/
/*** FACEBOOK / TWITTER / LOGIN & PASS *****/
/*******************************************/

/// FACEBOOK CONFIG PARAMS

// This is how you request permissions
everyauth.facebook.scope('email, user_about_me, user_location')

// Eleminate timeout completely
everyauth.facebook.moduleTimeout(-1)

// To see all the configurable options
// console.log(everyauth.facebook.configurable())

/// TWITTER CONFIG PARAMS


/// LOGIN & PASS CONFIG PARAMS


UserSchema.add({
    bio: String
  , location: {
      name: String
    }
  , fbProfileUrl: String
  , created_at  : {type : Date, default : Date.now}
})


UserSchema.plugin(mongooseAuth, {
    everymodule: {
      everyauth: {
        User: function () {
          return User
        }
      }
    }
  , facebook: {
      everyauth: {
          myHostname: config.facebook.host_uri
        , appId: config.facebook.appId
        , appSecret: config.facebook.appSecret
        , redirectPath: '/'
        , findOrCreateUser: function (sess, accessTok, accessTokExtra, fbUser) {
            var promise = this.Promise()
              , User = this.User()()
            // TODO Check user in session or request helper first
            //      e.g., req.user or sess.auth.userId
            User.findOne({'fb.id': fbUser.id}, function (err, foundUser) {
              if (err) return promise.fail(err)
              if (foundUser) {
                return promise.fulfill(foundUser)
              }
              
              console.log("Not found... CREATING")

              var expiresDate = new Date
              expiresDate.setSeconds(expiresDate.getSeconds() + accessTokExtra)

              user = new User({
                  fb: {
                      id: fbUser.id
                    , accessToken: accessTok
                    , expires: expiresDate
                    , name: {
                          full: fbUser.name
                        , first: fbUser.first_name
                        , last: fbUser.last_name
                      }
                    , alias: fbUser.link.match(/^http:\/\/www.facebook\.com\/(.+)/)[1]
                    , gender: fbUser.gender
                    , email: fbUser.email
                    , timezone: fbUser.timezone
                    , locale: fbUser.locale
                    , updatedTime: fbUser.updated_time
                  }
                , fbProfileUrl: fbUser.link
                , bio: fbUser.bio
                , location: {
                    name: fbUser.location && fbUser.location.name ? fbUser.location.name : ''
                  }
              })

              user.save( function (err, savedUser) {
                promise.fulfill(savedUser)
              })
            })

            return promise
          }
      }
    }
  , twitter: {
      everyauth: {
        , consumerKey: config.twitter.consumerKey
        , consumerSecret: config.twitter.consumerSecret
        , redirectPath: '/'
        , findOrCreateUser: function (sess, accessToken, accessSecret, twitUser) {
            var promise = this.Promise()
              , User = this.User()()
            User.findOne({'tw.id': twitUser.id}, function (err, foundUser) {
              if (err) return promise.fail(err)
              if (foundUser) {
                return promise.fulfill(foundUser)
              }
              console.log("CREATING")

              user = new User({
                  tw: {
                      id: twitUser.id
                    , accessToken: accessToken
                    , accessSecret: accessSecret
                    , expires: expiresDate
                    , name: {
                          full: twitUser.name
                        , first: twitUser.first_name
                        , last: twitUser.last_name
                      }
                    , alias: twitUser.link.match(/^http:\/\/www.facebook\.com\/(.+)/)[1]
                    , gender: fbUser.gender
                    , email: fbUser.email
                    , timezone: fbUser.timezone
                    , locale: fbUser.locale
                    , updatedTime: fbUser.updated_time
                  }
                , twProfileUrl: twitUser.link
                , bio: twitUser.bio
                , location: {
                    name: twitUser.location && twitUser.location.name ? twitUser.location.name : ''
                  }
              })

              user.save( function (err, savedUser) {
                promise.fulfill(savedUser)
              })
            })

            return promise
          }
      }      
    }
})

// validations

UserSchema.path('fb.name.full').validate(function (name) {
  return name.trim().split(' ').length >= 2
}, 'Please provide your fullname')

UserSchema.path('fb.email').validate(function (email) {
  return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(email)
}, 'Please provide a proper email')

/**************************/
/**** USERNAME & PASS *****/
/**************************/

/*
everyauth
  .password
    .loginWith('email')
    .getLoginPath('/login')
    .postLoginPath('/login')
    .loginView('login.jade')
//    .loginLocals({
//      title: 'Login'
//    })
//    .loginLocals(function (req, res) {
//      return {
//        title: 'Login'
//      }
//    })
    .loginLocals( function (req, res, done) {
      setTimeout( function () {
        done(null, {
          title: 'Async login'
        });
      }, 200);
    })
    .authenticate( function (login, password) {
      var errors = [];
      if (!login) errors.push('Missing login');
      if (!password) errors.push('Missing password');
      if (errors.length) return errors;
      var user = usersByLogin[login];
      if (!user) return ['Login failed'];
      if (user.password !== password) return ['Login failed'];
      return user;
    })

    .getRegisterPath('/register')
    .postRegisterPath('/register')
    .registerView('register.jade')
//    .registerLocals({
//      title: 'Register'
//    })
//    .registerLocals(function (req, res) {
//      return {
//        title: 'Sync Register'
//      }
//    })
    .registerLocals( function (req, res, done) {
      setTimeout( function () {
        done(null, {
          title: 'Async Register'
        });
      }, 200);
    })
    .validateRegistration( function (newUserAttrs, errors) {
      var login = newUserAttrs.login;
      if (usersByLogin[login]) errors.push('Login already taken');
      return errors;
    })
    .registerUser( function (newUserAttrs) {
      var login = newUserAttrs[this.loginKey()];
      return usersByLogin[login] = addUser(newUserAttrs);
    })

    .loginSuccessRedirect('/')
    .registerSuccessRedirect('/');
*/

// virtual attributes

var exports = module.exports = User = mongoose.model('User', UserSchema)
