// noinspection JSCheckFunctionSignatures

import Order from "../model/Order.js";
import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import Product from "../model/Product.js";
import {Stripe} from "stripe";
import dotenv from "dotenv";
import Coupon from "../model/Coupon.js";
dotenv.config();




//@desc create Orders
//@route POST /api/v1/orders
//@route private

//Stripe  INstance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async (req,res)=>{

    // //get the coupons
    // const {coupon} = req?.query;
    //
    // const couponFound = await Coupon.findOne({
    //     code: coupon?.toUpperCase(),
    // });
    //
    // if(couponFound?.isExpired){
    //     throw new Error("Coupon Expired")
    // }
    //
    // if(!couponFound){
    //     throw new Error("Coupon does Exists");
    // }

    //getthe discount
    // const discount = couponFound?.discount/100;

    //get the payload(customer,orderd items, shipping iaddress, total price);
    const {orderItems, shippingAddress, totalPrice}= req.body;

    //find the user
    const user = await User.findById(req.userAuthId);

    //checkif user has shipping Address
    if(!user?.hasShippingAddress){
        throw new Error("please provide shipping Address");
    }

    //Check if order in not empty
    if(orderItems?.length<=0){
        throw new Error("No Order Items");
    }


    //place order -save into db
    const order = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,
        // totalPrice :couponFound ? totalPrice - totalPrice * discount : totalPrice,
        totalPrice,
    });

    // console.log(order);







    //update the product qty chatgpt
    const products = await Product.find({ _id: { $in: orderItems } });

    orderItems?.map(async (order) => {
        const product = products?.find((product) => {
            return product?._id?.toString() === order?._id?.toString();
        });

        if (product) {
            product.totalSold += order.qty;
            // Add error handling here to catch any potential errors during saving
            try {
                await product.save();
            } catch (error) {
                console.error('Error saving product:', error);
            }
        } else {
            console.error('Product not found for order:', order._id);
        }
    });





//push order into user
    user.orders.push(order?._id);
    await user.save();





    //make payment (stripe)
    // convert order items to have same structure that stripe need

//     const convertedOrders = orderItems.map((item)=>{
//         return{
//             price_data :{
//                 currency: "usd",
//                 product_data: {
//                     name : item?.name,
//                     description: item?.description,
//                 },
//                 unit_amount: item?.price * 100,
//             },
//             quantity: item?.qty,
//         };
//     });
//
//
// const session = await stripe.checkout.sessions.create({
//    line_items: convertedOrders,
//
//     metadata:{
//        orderId : JSON.stringify(order?._id),
//     },
//
//     mode:'payment',
//     success_url:'http://localhost:7000/success',
//     cancel_url:'http://localhost:7000/cancel'
// });
//
// res.send({url: session.url});
//
//
//     // payment webhook
//
//
//
// });



    //make payment (stripe)
    //convert order items to have same structure that stripe need
    const convertedOrders = orderItems.map((item) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item?.name,
                    description: item?.description,
                },
                unit_amount: item?.price * 100,
            },
            quantity: item?.qty,
        };
    });
    const session = await stripe.checkout.sessions.create({
        line_items: convertedOrders,
        metadata: {
            orderId: JSON.stringify(order?._id),
        },
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
    });
    res.send({ url: session.url });
});



// @desc get all orders
// @route Get /api/v1/orders
// @private

export const getAllOrdersCtrl = asyncHandler(async (req,res)=>{
    // find all orders
    const orders = await Order.find().populate('user');
    res.json({
        success : true,
        message: "All orders",
        orders,
    })
});


// @desc get single orders
// @route Get /api/v1/orders/:id
// @private

export const getSingleOrderCtrl = asyncHandler(async (req,res)=>{
    //get the id from params
    const id  = req.params.id;
    const  order = await  Order.findById(id);


    //success response
    res.status(200).json({
        success : true,
        message: "single  order",
        order,
    });
});



// @desc update  orders
// @route Get /api/v1/orders/:id/update/:id
// @private


export const updateOrdersCtrl = asyncHandler(async (req,res)=>{
    // get the id from params
    const id = req.params.id;

    //update
    const updatedOrder = await Order.findByIdAndUpdate(id, {
        status:req.body.status,
    },
        {
            new:true,
        },

    );

    res.status(200).json({
        success:true,
        message:"order updated",
        updatedOrder,
    })

})


//@descget sales sum of orders
//@route GET /api/v1/orders/sales/sum
//@access private/admin

export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
    //get order stats
    const orders = await Order.aggregate([
        {
            $group: {
                _id: null,
                minimumSale: {
                    $min: "$totalPrice",
                },
                totalSales: {
                    $sum: "$totalPrice",
                },
                maxSale: {
                    $max: "$totalPrice",
                },
                avgSale: {
                    $avg: "$totalPrice",
                },
            },
        },
    ]);
    //get the date
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const saleToday = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: today,
                },
            },
        },
        {
            $group: {
                _id: null,
                totalSales: {
                    $sum: "$totalPrice",
                },
            },
        },
    ]);
    //send response
    res.status(200).json({
        success: true,
        message: "Sum of orders",
        orders,
        saleToday,
    });
});






//update the product qty
// const products =await Product.find({_id:{$in:orderItems}
// });
//
// orderItems?.map(async(order)=>{
//     const product = products?.find((product)=>{
//         return product?._id?.toString() === order?._id?.toString();
//     });
//     if(product) {
//         product.totalSold += order.qty;
//     }
//
//     await product.save();
// });


