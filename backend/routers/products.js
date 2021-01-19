const Product = require('../models/product')
const Category = require('../models/category')
const express = require('express')
const router = express.Router() // used as middleware
const mongoose = require('mongoose')
const multer = require('multer')

const FILE_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'jpeg',
    'image/jpg' : 'jpg'
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('invalid image type');
        if(isValid){
            uploadError = null;
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype]
      cb(null,`${fileName}-${Date.now()}.${extension}`)
    }
  })

const uploadOptions = multer({ storage : storage})  
// http://locahost:3000/api/v1/products
router.get('/', async (req,res)=>{
    let filter = {}
    if(req.query.categories){
        filter = {category : req.query.categories.split(',')}
    }

    const productList = await Product.find().populate('category');
    if(!productList){
        res.status(500).json({
            success: false
        })
    }
    res.send(productList)
})

router.get('/:id', async (req,res)=>{
    if (!mongoose.isValidObjectId(req.params.id))
        return res.status(400).send("Invalid Object Id")
    const product = await Product.findById(req.params.id).populate('category');
    if(!product){
        res.status(500).json({
            success: false
        })
    }
    res.send(product)
})

router.post('/',uploadOptions.single('image'),async (req,res)=>{ 

    const category = await Category.findById(req.body.category)
    if (!category){
        return res.status(400).send("Invalid Category")
    }

    const file = req.file;
    if(!file) return res.status(400).send('no image in the request')
    const fileName = req.file.filename
    const basePath=`${req.protocol}://${req.get('host')}/public/uploads/`
    const product = new Product({
        name : req.body.name,
        description : req.body.description,
        richDescription : req.body.richDescription,
        image : `${basePath}${fileName}`,
        images : req.body.images,
        brand : req.body.richDescription,
        price : req.body.price,
        category : req.body.category,
        countInStock : req.body.countInStock,
        numReviews : req.body.numReviews,
        isFeatured : req.body.isFeatured,
        dateCreated : req.body.dateCreated,
    })
    product.save().then((createdProduct)=>{
        if(createdProduct){
            res.status(201).json(createdProduct)
        }else{
            res.status(400).json({
                success : false,
                message : "Product can't be created"
            })
        }
    }).catch((err)=>{
        res.status(500).json({
            error : err,
            success: false
        })
    })
})

router.put('/:id',async (req,res)=>{

    if (!mongoose.isValidObjectId(req.params.id))
        return res.status(400).send("Invalid Object Id")

    const category = await Category.findById(req.body.category)
    if (!category){
        console.log("impossible")
        return res.status(400).send("Invalid Category")
    }

    const product = {
        name : req.body.name,
        description : req.body.description,
        richDescription : req.body.richDescription,
        image : req.body.image,
        images : req.body.images,
        brand : req.body.richDescription,
        price : req.body.price,
        category : req.body.category,
        countInStock : req.body.countInStock,
        numReviews : req.body.numReviews,
        isFeatured : req.body.isFeatured,
        dateCreated : req.body.dateCreated,
    }

    Product.findByIdAndUpdate(req.params.id,product,{new : true}).then((updatedProduct)=>{
        if (updatedProduct){
            res.status(200).json(updatedProduct)
        }else {
            res.status(400).json({
                success :false,
                message : "Product can not be updated"
            })
        }
    })
    .catch((err)=>{
        res.status(500).json({
            success : false,
            error: err
        })
    })
})

router.delete('/:id', async (req,res)=>{
    if (!mongoose.isValidObjectId(req.params.id))
        return res.status(400).send("Invalid Object Id")
    const deletedproduct = await Product.findByIdAndRemove(req.params.id)
    if(!deletedproduct)
        return res.status(400).json({success : false, message : "product can't be deleted"})
    res.status(200).json({success :true, message : "Product deleted successfuly"})
})

router.get('/get/count',async (req,res)=>{
    const productCount = await Product.countDocuments((count)=> count)
    if (!productCount)
        res.status(400).json({success :false})
    res.status(200).json({ productCount : productCount})
})


router.get('/get/featured/:count',async (req,res)=>{
    const count = req.params.count ?  req.params.count : 0
    const productFeatured = await Product.find({ isFeatured: true}).limit(+count)
    if (!productFeatured)
        res.status(400).json({success :false})
    res.status(200).send(productFeatured)
})

router.put('/gallery-images/:id', uploadOptions.array('images',10),async  (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id))
        return res.status(400).send("Invalid Object Id")

    const files = req.files
    const basePath=`${req.protocol}://${req.get('host')}/public/uploads/`
    const imagesPath = []
    if(files){
        files.map((file)=>{
            imagesPath.push(`${basePath}${file.filename}`)
        })
    }
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images : imagesPath
        },
        {new : true}
    )

    if (!product){
        return res.status(500).send('the product can not be updated')
    }
    return res.send(product)
})


module.exports = router;