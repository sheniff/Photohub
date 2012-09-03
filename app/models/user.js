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
everyauth.facebook.scope('email, user_about_me')

// Eleminate timeout completely
everyauth.facebook.moduleTimeout(-1)

// To see all the configurable options
// console.log(everyauth.facebook.configurable())

// everyauth.everymodule.findUserById( function(userId, callback){

// });

var AccountType = "free premium superadmin".split(" ");

UserSchema.add({
  email: String,
  name: {
    first: String, 
    last: String
  },
  account_type: {type: String, enum: AccountType, default: "free"},
  bio: String,
  created_at: {type : Date, default : Date.now}
});


// everyauth.everymodule.findUserById (function(id,callback){
//   console.log("AAAAAAAAAAAAAAGGHHHH ", id);
//   User.findById(id, function(err, user) {
//     if(err) return callback(err);
//     callback(null, user);
//   });
// });


UserSchema.plugin(mongooseAuth, {
  everymodule: {
    everyauth: {
      User: function() {
        return User;
      },
      //Method rewriting to work properly with mongoose!!
      findUserById: function (userId, callback) {
        User.findById(userId, function(err, user){
          if(err) return callback(err);
          callback(null,user);
        });
      }
    }
  },
  password: {
    loginWith: 'email',
    everyauth: {
      getLoginPath: '/login',
      postLoginPath: '/login',
      loginView: 'users/login.jade',
      loginSuccessRedirect: '/',
      loginLocals: {
        appName: "Login",
        title: "PhotoHub"
      },
      getRegisterPath: '/register',
      postRegisterPath: '/register',
      registerView: 'users/register.jade',
      registerSuccessRedirect: '/',
      registerLocals: {
        appName: "Register",
        title: "PhotoHub"
      },
    }
  },
  facebook: {
    everyauth: {
      myHostname: config.facebook.host_uri,
      appId: config.facebook.appId,
      appSecret: config.facebook.appSecret,
      redirectPath: '/',
      findOrCreateUser: function (session, accessTok, accessTokExtra, fbUser) {
        var promise = this.Promise(),
          User = this.User()();

        User.findById(session.auth.userId, function (err, foundUser) {
          if (err) return promise.fail(err);          
          if (!foundUser) {
            User.where('password.email', fbUser.mail).findOne( function (err, user) {
              if (err) return promise.fail(err);
              if (!user) {
                User.createWithFB(fbUser, accessTok, accessTokExtra.expires, function (err, createdUser) {
                  if (err) return promise.fail(err);
                  return promise.fulfill(createdUser);
                }); 
              } else {
                assignFbDataToUser(user, accessTok, accessTokExtra, fbUser);
                user.save( function (err, user) {
                  if (err) return promise.fail(err);
                  promise.fulfill(user);
                });
              }
            });
          } else {
            assignFbDataToUser(user, accessTok, accessTokExtra, fbUser);
            user.save( function (err, user) {
              if (err) return promise.fail(err);
              promise.fulfill(user);
            });
          }
        });
        return promise;
      }
    }
  },
  twitter: {
    everyauth: {
      consumerKey: config.twitter.consumerKey,
      consumerSecret: config.twitter.consumerSecret,
      redirectPath: '/',
      findOrCreateUser: function (session, accessToken, accessTokenSecret, twUser) {
        var promise = this.Promise(),
          User = this.User()();

        User.findById(session.auth.userId, function (err, foundUser) {
          if (err) return promise.fail(err);
          if (!foundUser) {
            User.where('password.email', twUser.mail).findOne( function (err, user) {
              if (err) return promise.fail(err);
              if (!user) {
                User.createWithTW(twUser, accessToken, accessTokenSecret, function (err, createdUser) {
                  if (err) return promise.fail(err);
                  return promise.fulfill(createdUser);
                }); 
              } else {
                assignTwDataToUser(user, accessToken, accessTokenSecret, twUser);
                user.save( function (err, user) {
                  if (err) return promise.fail(err);
                  promise.fulfill(user);
                });
              }
            });
          } else {
            assignTwDataToUser(foundUser, accessToken, accessTokenSecret, twUser);
            user.save( function (err, user) {
              if (err) return promise.fail(err);
              promise.fulfill(user);
            });
          }
        });

        return promise;
      }
    }
  }
});

//////////////////
// Extra functions
//////////////////

var assignFbDataToUser = function (user, accessTok, accessTokExtra, fbUser) {
  user.fb.accessToken = accessTok;
  user.fb.expires = accessTokExtra.expires;
  user.fb.id = fbUser.id;
  user.fb.name = fbUser.name;
};

var assignTwDataToUser = function (user, accessTok, accessTokSecret, twUser) {
  user.twit.accessToken = accessTok;
  user.twit.accessTokenSecret = accessTokSecret;
  user.twit.id = twUser.id;
  user.twit.name = twUser.screen_name;
};

// validations

UserSchema.path('fb.name.full').validate(function (name) {
  return name.trim().split(' ').length >= 2
}, 'Please provide your fullname')

UserSchema.path('fb.email').validate(function (email) {
  return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(email)
}, 'Please provide a proper email')

// virtual attributes

var exports = module.exports = User = mongoose.model('User', UserSchema);
