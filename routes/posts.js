const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth')

const Posts = require('../models/Posts')
// show add page
// route - GET /posts/add

router.get('/add', ensureAuth, (req, res) => {
    res.render('posts/add')
})

// process add form
// post req to posts
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Posts.create(req.body)
        res.redirect('/dashboard')
    } catch(err) {
        console.error(err)
        res.render('error/500')
    }
})

// show all posts
router.get('/', ensureAuth, async (req, res) => {
    try {
        const posts = await Posts.find({ status: 'public'})
            .populate('user')
            .sort({ createdAt: 'desc'})
            .lean()

            res.render('posts/index', {
                posts,
            } )
    } catch (err) {
    console.error(err)
    res.render('error/500')
 }})


module.exports = router