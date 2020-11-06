const express = require('express')
const route = express.Router()
const Story = require('../models/Story')
const {ensureAuth, ensureGuest} = require('../middleware/auth')

//@desc     Login/Landing Page
//@route    GET /
route.get('/',ensureGuest, (req, res) => {
    res.render('login',{
        layout: 'login'
    })
})

//@desc     Dashboard
//@route    GET /dashboard
route.get('/dashboard',ensureAuth, async (req, res) => {
    try {
        const story = await Story.find({user: req.user.id}).lean()
        res.render('dashboard', {
            name: req.user.firstName,
             story
        })
    } catch (error) {
        res.render('errors/500')
    }
    
})

module.exports = route