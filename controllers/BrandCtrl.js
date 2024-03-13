import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";
import Product from "../model/Product.js";
import Brand from "../model/Brand.js";


// @desc Create new Brand
// @route POST /Api/v1/brand
// @access Private/Admin

export const createBrandCtrl = asyncHandler(async(req,res)=>{
    const {name,} =req.body;

    // brand exists
    const brandFound = await Brand.findOne({name})
    if(brandFound){
        throw new Error ('Brand Already Exits');
    }

    //Create
    const brand = await Brand.create({
        name:name.toUpperCase(),
        user: req.userAuthId,
    });


    res.json({
        status:"Success",
        message :"Brand created successfully",
        brand,
    });
});


// @desc get all  Brand
// @route GET /Api/brand
// @access public

export const getAlBrandsCtrl = asyncHandler(async(req,res)=>{

    const brands = await Brand.find();
    res.json({
        status:"Success",
        message :"All Brands  Fetched successfully",
        brands,
    });
});

// @desc get single Brand
// @route GET /Api/brand
// @access public

export const getSingleBrandCtrl = asyncHandler(async(req,res)=>{

    const brand = await Brand.findById(req.params.id);
    res.json({
        status:"Success",
        message :"brand Fetched successfully",
        brand,
    });
});

// @desc Update Brand
// @route GET /Api/brand
// @access public
export const updateBrandCtrl = asyncHandler (async (req, res)=>{

    const {name} =  req.body;


    // update
    const brand = await Brand.findByIdAndUpdate(req.params.id,
        {
            name,
        },
        {
            new: true,
        }
    );


    res.json({
        status:"success",
        message :"Brand updated  Successfully",
        brand,
    })
})



// @desc Delete Brand
// @route Delete /Api/brands
// @access public
export const deleteBrandCtrl = asyncHandler (async (req, res)=>{
    await Brand.findByIdAndDelete(req.params.id);

    res.json({
        status:"success",
        message :"Category deleted Successfully",

    })
})