const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Posts = require('../models/Posts')
// login/landing page
// route - GET / 

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

router.get('/signup', ensureGuest, (req,res) => {
    res.render('signup', {
        layout: 'login',
    })
}), 
  

router.get('/dashboard', ensureAuth, async (req, res) => {
    // console.log(req.user)
    try{
        const userPosts = await Posts.find ({ user: req.user.id }).lean()
        // Lean returns plain JS objects, NOT mongoose documents 
        res.render('dashboard' , {
            name: req.user.firstName,
            userPosts
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router