const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();

const User = require('../models/User');

const validateSignup = async (req, res, next) => {
    const {name, email, password, confirmPassword} = req.body
    if(!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.'})
    }

    const doesExist = await User.findOne({email: email})
    if(doesExist) {
       return res.status(400).json({ message: `${email} is already registered.`})
    }

    if(password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match'})
    }

    next();
}


const generateNewToken = user => {
    return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1hr'
    })
}

const signup = async (req, res) => {

    const {name, email, password, confirmPassword} = req.body

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    const body = {
        name,
        email,
        password: encryptedPassword,
        confirmPassword: encryptedPassword
    }

    // Create user in our database
    try {
        const user = await User.create(body)
        if (user) {
            return res.status(200).json({message: 'Successfully Registered'})
        } else {
            return res.status(401).send('User not added');
        }
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}


const signin = async (req, res) =>{
    try {
        if(!req.body.email || !req.body.password) {
            return res.status(400).send({message: 'Email and Password are required!'})
        }
        const user = await User.findOne({email: req.body.email }).exec()
        if(!user) { 
            return res.status(400).send({message: 'User not found'})
        }
    
        bcrypt.compare(req.body.password, user.password, (err, result) => {
           if (err) {
               return res.status(401).json({
                   message: 'Auth Failed'
               })
           }
           if (result) {
            const token = generateNewToken(user)
            return res.status(200).json({
                message: 'Auth Successfull',
                token,
                user,
            });
           }
           res.status(401).json({
                message: 'Auth Failed'
            });
        });
    } catch(err) {
            return res.status(401).send({message: 'Not auth'})
        }
    }


module.exports = {
    signup,
    signin,
    validateSignup
}
