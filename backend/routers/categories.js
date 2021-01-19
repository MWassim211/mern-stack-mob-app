const express = require('express')
const router = express.Router()
const Category = require('../models/category')

router.get('/',async (req,res)=>{
    const caterogyList = await Category.find();
    if(!caterogyList){
        res.status(500).json({success : true})
    }
    res.status(200).send(caterogyList);
})

router.get('/:id',(req,res)=>{
    Category.findById(req.params.id)
    .then((category)=>{
        if(category){
            res.status(200).json(category)
        }else {
            res.status(404).json({
                success : false,
                message : "Category doesn't exist"
            })
        }
    })
    .catch((err)=>{
        res.status(500).json({
            success : false,
            error : err
        })
    })
})

router.put('/:id',(req,res)=>{
    const category  =  {
        name : req.body.name,
        icon : req.body.icon,
        color : req.body.color
    }

    Category.findOneAndUpdate(req.params.id,category, {new : true}).then((updatedCategory)=>{
        if(updatedCategory){
            res.status(200).json(updatedCategory)
        }else {
            res.status(400).json({
                succes : false,
                message : "Category can't be updated"
            })
        }
    })
    .catch((err)=>{
        res.status(500).json({
            success : false,
            error : err
        })
    })
})


router.post('/',async (req,res)=>{
    const category = new Category({
        name : req.body.name,
        icon : req.body.icon,
        color : req.body.color
    })
    category.save(category).then((createdCategory)=>{
        res.status(201).json(createdCategory)
    })
    .catch((err)=>{
        res.status(500).json({
            error : err,
            success : false
        })
    })
})

router.delete('/:id',(req,res)=>{
    Category.findByIdAndRemove(req.params.id)
    .then((category)=>{
        if (category){
            return res.status(200).json({
                success : true,
                message : 'the category has been deleted'
            })
        }else {
            return res.status(404).json({
                success : false,
                message : "the category can not be deleted"
            })
        }
    }).catch((err)=>{ 
        res.status(400).json({
            success : false,
            error: err
        })
    })
})

module.exports = router