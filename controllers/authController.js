const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User')


module.exports = (req, res, next) => {
    const {authorization} = req.headers
    console.log('authorization: ', authorization)
    if(!authorization) {
        res.status(401).json({error: 'You must be logged in'})
    }
    const token = authorization.split(' ')[1]
    console.log('token: ', token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err) {
            return res.status(401).json({error: 'You must be logged in'})
        }
        const {id} = payload
        User.findById(id).then(user => {
            console.log('user: ', user)
            req.user = user
            next()
        })
    })
}

