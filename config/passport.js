// const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require ('mongoose');
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            email: profile.emails[0].value
        }
        try {
            let user = await User.findOne({ googleId: profile.id})
            if (user) {
                done(null, user)
            } else {
                user = await User.create(newUser)
                done(null, user)
            }
        } catch (err){
            console.error(err)
        }
    }))

// ==========================
// PASSPORT LOCAL ONLY 
// ==========================
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
},
  function (email, password, done) {
    User.findOne({ where: { 'email': email } }, function (err, user) {
      if (err) { return done(err) }
      if (!User) {
        return done(null, false, { message: 'incorrect username or password' });
      }
      if (!User.validPassword(password)) {
        return done(null, false, { message: 'incorrect username or password' });
      }
      return done(null, User)
    })
  }
));

// This is how you initialize the local strategy module

// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     // might not need these two
//     // passReqToCallback: true,
//     // session: false
//   },
//     function (email, password, done) {
//       User.findOne({ where: { 'email': email } }, function (err, user) {
//         if (err) { return done(err) }
//         if (!User) {
//           return done(null, false, { message: 'incorrect username or password' });
//         } if (User.password != password) { return done(null, false,{ message: 'incorrect username or password' } )}
//         else {
//           let newUser = new User();

//           newUser.local.email = email;
//           newUser.local.password = newUser.generateHash(password);
//           newUser.save(function(err) {
//             if (err)
//               throw err;
//               return done(null, newUser)
//           })
//         } 
//         // {
//         //   return done(null, false, { message: 'incorrect username or password' });
//         // }
//         // return done(null, User)
//       })
//     }
//   ))
    passport.serializeUser((user, done) => {
        done(null, user.id)
      })
    
      passport.deserializeUser((id, done) => {
            User.findById(id, (err, user) => done (err, user))
      });
}