const express = require('express');
const passport = require('passport')
const User = require('../models/User')
const router = express.Router();

// auth with google
// route - GET /auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// google auth callback
// /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), 
    (req, res) => {
    res.redirect('/dashboard')
})


router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/signup'); }
	
	// NEED TO CALL req.login()!!!
        req.login(user, next);
    })(req, res, next);
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}))

// POST ROUTE FOR SIGNUP 
router.post('/signup', async (req, res) => {
    try {
      const newUser = await User.create({
        displayName: req.body.displayName,
        email: req.body.email,
        password: req.body.password
      });
      console.log(newUser)
      //  return res.redirect(`/`)
      return res.redirect(`/dashboard`)
     
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  });


// router.post('/signup', function(req, res, next) {
//     passport.authenticate('local', function(err, user, info) {
//         let newUser = User.findOne({ where: email === req.body.email })
//         if (err) { return next(err); }
//         if (!newUser) { User.create([
//             {
//                 email: req.body.email,
//                 password: req.body.password
//             }
//         ])}
//         req.login(user, next);
//     })(req, res, next);
// });
// router.post('/login',  passport.authenticate('local', {failureRedirect: '/login'}), (req, res) => {
//     try{
//         const newUser =  User.findOne({ where: {email: req.body.email } });
//         if(!newUser) {
//             return res.status(401).json({ message: 'Incorrect email or password, please try again' })
//         }
//         const validPassword =  newUser.checkPassword(req.body.password);
//         if(!validPassword) {
//             return res.status(401).json({ message: 'Incorrect eamil or password, please try again' });
//         } else {
//             req.login(newUser, next)
//         }
//     } catch (err) {
//         res.render('error/500')
//     }
//     res.redirect('/dashboard')
// })

// logout user
// auth/logout

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})
module.exports = router