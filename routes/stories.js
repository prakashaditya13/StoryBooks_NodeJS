const express = require('express')
const route = express.Router()
const Story = require('../models/Story')
const {ensureAuth} = require('../middleware/auth')

//@desc     show add page
//@route    GET /stories/add
route.get('/add',ensureAuth, (req, res) => {
    res.render('stories/add')
})

//@desc     Submit Data
//@route    POST /stories
route.post('/',ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('errors/500')
    }
})


//@desc     show All Stories
//@route    GET /stories
route.get('/public',ensureAuth,async (req, res) => {
    try {
        const story = await Story.find({status: 'public'}).populate('user').sort({createdAt: 'desc'}).lean()
        res.render('stories/index', {story})
    } catch (error) {
        console.log(error)
        res.render('errors/500')
    }
})
module.exports = route