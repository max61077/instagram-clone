const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const {JWT_SECRET, SENDGRID_API, SITE} = require('../config/keys');
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(SENDGRID_API)

router.get('/', (req, res) => {
    res.json({msg: 'hello'})
})

router.post('/signup', (req, res) => {
    const {name, email, password, pic} = req.body;

    if(!email || !password || !name)
        return res.status(422).json({error: "Please add all the fields"})

    User.findOne({email: email})
    .then(savedUser => {
        if(savedUser)
            return res.status(422).json({error: "User Already exists"})

        bcrypt.hash(password, 12)
        .then(hashpassword => {
            const user = new User({
                email,
                password:hashpassword,
                name,
                pic
            })
    
            user.save()
            .then(user => {
                sgMail.send({
                    to: user.email,
                    from: {
                        email: 'max61077@gmail.com',
                        name: 'no-reply@instagram.com'
                    },
                    subject: "SignUp Success",
                    html: "<h1>Welcome to Instagram</h1>"
                })
                res.json({message: "Saved Successfully"})
            })
            .catch(err => {
                console.log(err)
            })
    
        })
        
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/signin', (req, res) => {
    const {email, password} = req.body

    if(!email || !password)
        return res.status(422).json({error: "Please fill all the fields"})

    User.findOne({email: email})
    .then(savedUser => {
        if(!savedUser)
           return res.status(422).json({error: "Invalid username or password"})

        bcrypt.compare(password, savedUser.password)
        .then(matched => {
            if(matched){
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                const {_id, name, email, followers, following, pic} = savedUser
                res.json({token, user: {_id, name, email, followers, following, pic}})
            }
            else
                return res.status(422).json({error: "Invalid username or password"})
        })
        .catch(err => {
            console.log(err)
        })

    })
})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err)
            console.log(err)
        else{
            const token = buffer.toString('hex')
            User.findOne({email: req.body.email})
            .then(user => {
                if(!user){
                    return res.status(422).json({error: "User doesn't exist"})
                }

                user.resetToken = token
                user.expireToken = Date.now() + 600000
                user.save().then(result => {
                    sgMail.send({
                        to: user.email,
                        from: {
                            name: "no-reply@instagram.com",
                            email: 'max61077@gmail.com'
                        },
                        subject: "Password Reset",
                        html: `
                        <p>You requested for password reset</p>
                        <h5>Click this <a href="${SITE}/reset/${token}">link</a> to reset password</h5>
                        `
                    })
                    res.json({message: "Check your email"})
                })
            })
        }

    })
})

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken: sentToken, expireToken: {$gt: Date.now()}})
    .then(user => {
        if(!user)
            return res.status(422).json({error: "Session Expired"})
        bcrypt.hash(newPassword, 12)
        .then(hashpassword => {
            user.password = hashpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save()
            .then(savedUser => {
                res.json({message: "Password Updated Successfully"})
            })
        })
    }).catch(err => {
        console.log(err)
    })
})

module.exports = router;