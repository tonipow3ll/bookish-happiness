const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const Posts = require('../models/Posts');
// show add page
// route - GET /posts/add

router.get('/add', ensureAuth, (req, res) => {
    res.render('posts/add')
});

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
});

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
 }});

 // show single post
 router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let post = await Posts.findById(req.params.id).populate('user').lean()

        if(!post) {
            return res.render('error/404')
        }

        res.render('posts/show', {
            post
        })
    } catch(err) {
        console.error(err)
        res.render('error/404')
    }
});

 // show post/edit page
 // get post/edit/:id
 router.get('/edit/:id', ensureAuth, async (req, res) => {
    const post = await Posts.findOne({
        _id: req.params.id
    }).lean()
    if(!post) {
        return res.render('error/404')
    } 
    if(post.user != req.user.id) {
        res.redirect('/posts')
    } else {
        res.render('posts/edit', {
            post,
        })
    }
});

//update post
//PUT /posts/:id

router.put('/:id', ensureAuth, async (req, res) => {
    try{
        let post = await Posts.findById(req.params.id).lean()
        if(!post){
            return res.render('error/404')
        }
        if(post.user != req.user.id) {
            res.redirect('/posts')
        } else {
                post = await Posts.findOneAndUpdate({ _id: req.params.id }, req.body, {
                    new: true,
                    runValidators: true
                })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
});


// delete route 
// delete /posts/:id

router.delete('/:id', ensureAuth, async (req, res) => {
    try{
        await Posts.remove({_id: req.params.id})
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
});

// get all posts from a user
// Should show all posts from a specific user - right now defaults to the error 500 page
router.get('/user/:userId', ensureAuth, async  (req, res) => {
    try {
        const post = await Posts.find({
            user: req.params.userId,
            status: 'public'
        }).populate('user').lean()

        res.render('posts/index', {
            post
        })
    } catch(err) {
        console.error(err)
        res.render('error/500')
    }
});

module.exports = router