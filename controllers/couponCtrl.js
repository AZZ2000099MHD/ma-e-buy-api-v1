import Coupon from "../model/Coupon.js";
import asyncHandler from "express-async-handler";
import user from "../model/User.js";


// @desc crate new coupon
// @desc  POST/API/V1/coupons
// @access private/admin

export const createCouponCtrl = asyncHandler(async (req,res)=>{
   // check if Admin
    //check if coupon already exits
    const {code,startDate,endDate,discount}  = req.body;

    const couponsExists = await Coupon.findOne({
        code,
    })

    if(couponsExists){
        throw new Error("Coupoin already Exists");
    }

    if(isNaN(discount)){
        throw new Error("discounft value must be number");
    }

    //create coupons
    const coupon = await Coupon.create({
        code:code?.toUpperCase(),
        startDate,
        endDate,
        discount,
        user: req.userAuthId,
    });

    res.status(201).json({
        status :"Success",
        message:"Coupon created Successfully",
        coupon,
    })
});



// @desc Get all coupon
// @desc  get/API/V1/coupons
// @access private/admin

export const getAllCouponsCtrl = asyncHandler(async (req,res)=>{
    const coupons = await Coupon.find();
    res.status(200).json({
        status :"Success",
        message :"All Coupons",
        coupons
    })
})


// @desc Get SINGLE coupon
// @desc  get/API/V1/coupons/:id
// @access public/admin

export const getSingleCouponCtrl = asyncHandler(async (req,res)=>{
            const coupon = await Coupon.findOne({code:req.body.code});

            // check if is not found
            if(coupon === null){
                throw new Error("coupon not found");
            }

            //check  if expired
            if(coupon.isExpired){
                throw new Error("coupon expired");
            }



    res.json({
                status:"success",
                message:"Single coupon fetched",
                coupon,
            })
})


// @desc update coupon
// @desc  get/API/V1/coupons/:id
// @access public/admin
export const updateCouponCtrl = asyncHandler(async (req,res)=>{
    const {code,startDate,endDate,discount}  = req.body;
   const coupon =  await Coupon.findByIdAndUpdate(req.params.id,{
        code: code?.toUpperCase(),
        discount,
        startDate,
        endDate,
    },
        {
          new:true,
        });

    res.json({
        status:"success",
        message :"coupon updated",
        coupon,
    })

})



// @desc delete coupon
// @desc  get/API/V1/coupons/:id
// @access public/admin
export const deleteCouponCtrl = asyncHandler(async (req,res)=>{
    const {code,startDate,endDate,discount}  = req.body;
    const coupon =  await Coupon.findByIdAndDelete(req.params.id);


    res.json({
        status:"success",
        message :"coupon Deleted",
        coupon,
    })

})