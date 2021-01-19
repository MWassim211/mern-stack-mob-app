const express = require('express')
const { PromiseProvider } = require('mongoose')
const {Order} = require('../models/order')
const OrderItem = require('../models/order-Item')
const router = express.Router()

router.get('/',async(req,res)=>{
    const orderList = await Order.find().populate(['orderItems', 'user']).sort({'dateOrdered' : -1})
    if(!orderList){
        return res.status(500).json({success :false})
    }
    return res.status(200).send(orderList)
})

router.get('/:id',async(req,res)=>{
    const order = await Order.findById(req.params.id)
    .populate( 'user' , 'name')
    .populate({ path : 'orderItems' , populate : {path : 'product' , populate : 'category'}})
    if(!order){
        return res.status(500).json({success :false})
    }
    return res.status(200).send(order)
})

router.post('/',async (req,res)=>{
        const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem=>{
            let newOrderItem = new OrderItem({
                quantity : orderItem.quantity,
                product : orderItem.product
            })
            newOrderItem = await newOrderItem.save()
            return newOrderItem._id;
        }))


    const orderItemsIdsResolved = await orderItemsIds

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product','price')
        const totalPrice = orderItem.product.price * orderItem.quantity
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b)=>a+b,0)
    let order = new Order({
        orderItems : orderItemsIdsResolved,
        shippingAddress1 : req.body.shippingAddress1,
        shippingAddress2 : req.body.shippingAddress2,
        city : req.body.city,
        zip : req.body.zip,
        country : req.body.country,
        phone : req.body.phone,
        status : req.body.status,
        totalPrice : totalPrice,
        user : req.body.user
    })

    order = await order.save()

    if(!order){
        return res.status(400).send('the order can not be created !')
    }

    return res.send(order)
})

router.put('/:id',async (req,res)=>{
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status : req.body.status
        },
        {new  : true}
    )

    if(!order){
        return res.status(400).json({succes :false , message : "The order can not be found"})
    }
    return res.status(200).send(order)
})

router.delete('/:id', async (req,res)=>{
    Order.findByIdAndRemove(req.params.id).then(async (orderRemoved)=>{
        if(orderRemoved){
            await orderRemoved.orderItems.map(async (orderItem)=>{
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success : true , message : "The order was successfuly removed"})
        }else {
            return res.status(400).json({success : false , message :"Order not found"})
        }
    })
    .catch((err)=>{
        return res.status(500).json({
            success : false,
            error : err
        })
    })
})

router.get('/get/totalsales',async(req,res)=>{
    const totalSales = await Order.aggregate([
        { $group:{ _id: null, totalSales : {$sum : '$totalPrice'}}}
    ])
    if(!totalSales){
        return res.status(400).json("The order sales can not be generated")
    }
    return res.send(totalSales)
})

router.get('/users/:id',async(req,res)=>{
    const userOrders = await Order.find({user : req.params.id})
    
    if(!userOrders){
        return res.status(400).json("Can not get user orders")
    }
    return res.send(userOrders)
})

module.exports = router