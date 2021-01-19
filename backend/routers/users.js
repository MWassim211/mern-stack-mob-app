const express = require('express')
const router = express.Router()
const {User} = require('../models/user')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

router.get('/',async (req,res)=>{
    const userList = await User.find().select('-passwordHash')
    if(!userList){
        res.status(500).json({success :false})
    }
    res.status(200).send(userList)
})


router.post('/',async (req,res)=>{
    let user = new User({
        name : req.body.name,
        email : req.body.email,
        passwordHash : bcrypt.hashSync(req.body.password,10),
        phone : req.body.phone,
        isAdmin : req.body.isAdmin,
        street : req.body.street,
        apartment : req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country : req.body.country
    })

    user = await user.save()
    if(!user){
        return res.status(500).json({success: false})
    }
    res.send(user)
})

router.get('/:id',(req,res)=>{
    const user = User.findById(req.params.id).select('-passwordHash')
    .then((user)=>{
        if (user) {
            res.send(user)
        }else{
            res.send(404).json({success : false})
        }
    })
    .catch((err)=>{
        res.status(500).json({
            success : false,
            error: err
        })
    })
})

router.post('/login',async(req,res)=>{
    const user = await User.findOne({email : req.body.email})
    if(!user){
        return res.status(400).send('User not found')
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jsonwebtoken.sign({
            userId: user.id,
            isAdmin: user.isAdmin
        },
        process.env.SECRET,
        {expiresIn : '1d'})
        return res.status(200).send({user: user.email, token:token})
    }else{
        return res.status(400).send('Password is worng')
    }
})

router.get('/get/count',async (req,res)=>{
    const usersCount = await User.countDocuments((count)=> count)
    if(!usersCount){
        return res.status(500).json({success :false}) 
    }
    return res.status(200).send({count : usersCount})
})

router.delete('/:id',async (req,res)=>{
    User.findByIdAndRemove(req.params.id).then((user)=>{
        if(user){
            return res.status(200).json({success : true})
        }else {
            return res.status(404).json({success : false, message : 'User not found'})
        }
    }).ctahc((err)=>{
        return res.status(500).json({
            message : false,
            error: err
        })
    })
})

module.exports = router 