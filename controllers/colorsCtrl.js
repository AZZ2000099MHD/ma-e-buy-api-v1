import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";
import Product from "../model/Product.js";
import Brand from "../model/Brand.js";
import Color from "../model/Color.js";



// @desc Create new Color
// @route POST /Api/v1/colors
// @access Private/Admin

export const createColorCtrl = asyncHandler(async(req,res)=>{
    const {name,} =req.body;

    // brand exists
    const colorFound = await Color.findOne({name})
    if(colorFound){
        throw new Error ('Color Already Exits');
    }

    //Create
    const color = await Color.create({
        name:name.toLowerCase(),
        user: req.userAuthId,
    });


    res.json({
        status:"Success",
        message :"color created successfully",
        color,
    });
});


// @desc get all Color
// @route GET /Api/color
// @access public

export const getAllColorsCtrl = asyncHandler(async(req,res)=>{

    const colors = await Color.find();
    res.json({
        status:"Success",
        message :"All Colors  Fetched successfully",
        colors,
    });
});



// @desc get single Color
// @route GET /Api/color
// @access public

export const getSingleColorCtrl = asyncHandler(async(req,res)=>{

    const color = await Color.findById(req.params.id);
    res.json({
        status:"Success",
        message :"color Fetched successfully",
        color,
    });
});

// @desc Update Color
// @route GET /Api/color
// @access public
export const updateColorCtrl = asyncHandler (async (req, res)=>{

    const {name} =  req.body;


    // update
    const brand = await Color.findByIdAndUpdate(req.params.id,
        {
            name,
        },
        {
            new: true,
        }
    );


    res.json({
        status:"success",
        message :"color updated  Successfully",
        color,
    })
})



// @desc Delete Color
// @route Delete /Api/color
// @access public
export const deleteColorCtrl = asyncHandler (async (req, res)=>{
    await Color.findByIdAndDelete(req.params.id);

    res.json({
        status:"success",
        message :"Color deleted Successfully",

    })
})