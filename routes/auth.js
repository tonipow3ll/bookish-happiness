const express = require('express');
const passport = require('passport')
const router = express.Router();

// auth with google
// route - GET /auth/google

router.get('/google', passport.authenticate('google', { scope: profile }))

router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

module.exports = router