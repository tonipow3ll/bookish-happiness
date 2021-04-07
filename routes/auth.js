const express = require('express');
const passport = require('passport')
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

module.exports = router