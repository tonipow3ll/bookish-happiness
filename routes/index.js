const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// login/landing page
// route - GET / 

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

router.get('/dashboard', ensureAuth, (req, res) => {
    console.log(req.user)
    res.render('dashboard')
})

module.exports = router