const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


exports.signup = ( req, res, next ) => {
    User.find({email: req.body.email})
        .then( user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'email already use'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        console.log(user);
                        user
                        .save()
                        .then( result => {
                            res.status(201).json({
                                message: 'User created'
                            })
                        } )
                    }
                } )
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                 message: 'Error creating user',
                error: err
            })
        });
}

exports.login = ( req, res, next ) => {
    User.findOne({ email: req.body.email})
    .exec()
    .then( user => {
        console.log('then')
        if (user.length < 1) {
            console.log('length')
            return res.status(401).json({
                message: 'auth failed'
            })
        }
        console.log('avant bcrypt')
        console.log(req.body.password)
        console.log(user.password)
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                console.log('if qui marche pas')
                return res.status(401).json({
                    message: 'auth failed',
                    error: err
                })
            }
            if (result) {
                const token = jwt.sign({
                    email: user.email,
                    userId: user._id
                }, process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                })
                return res.status(200).json({
                    message: 'auth succeeded',
                    token
                })
            }
            console.log(result)
            res.status(500).json({
                err
            })
        })
    } )
    .catch( err => {
        res.status(500).json({
            message: 'Error creating user',
           error: err
       })
    } )
}

exports.delete_one = ( req, res, next ) => {
    User.remove({_id: req.params.userId}).exec()
    .then( result => {
        res.status(200).json({
            message: 'user deeleted'
        })
    } )
    .catch( err => {
        res.status(500).json({
            error: err
        })
    } )
}