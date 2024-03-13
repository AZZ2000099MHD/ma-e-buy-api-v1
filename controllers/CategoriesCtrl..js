import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";
import Product from "../model/Product.js";
import category from "../model/Category.js";

// @desc Create new category
// @route POST /Api/v1/category
// @access Private/Admin

export const createCategoryCtrl = asyncHandler(async(req,res)=>{
    const {name,} =req.body;

    // category exists
    const categoryFound = await Category.findOne({name})
    if(categoryFound){
        throw new Error ('category Already Exits');
    }

    //Create
    const category = await Category.create({
        name:name.toUpperCase(),
        user: req.userAuthId,
        image : req.file.path,

    });


    res.json({
        status:"Success",
        message :"Category created successfully",
        category,
    });
});


// @desc get all  category
// @route GET /Api/categories
// @access public

export const getAllCategoriesCtrl = asyncHandler(async(req,res)=>{

    const categories = await Category.find();
    res.json({
        status:"Success",
        message :"All Categories  Fetched successfully",
        categories,
    });
});

// @desc get all  category
// @route GET /Api/categories
// @access public

export const getSingleCategoryCtrl = asyncHandler(async(req,res)=>{

    const category = await Category.findById(req.params.id);
    res.json({
        status:"Success",
        message :"Category Fetched successfully",
        category,
    });
});

// @desc Update category
// @route GET /Api/categories
// @access public
export const updateCategoryCtrl = asyncHandler (async (req, res)=>{

    const {name} =  req.body;


    // update
    const category = await Category.findByIdAndUpdate(req.params.id,
        {
            name
        },
        {
            new: true,
        }
    );


    res.json({
        status:"success",
        message :"Category updated  Successfully",
        category,
    })
})



// @desc Delete category
// @route Delete /Api/categories
// @access public
export const deleteCategoryCtrl = asyncHandler (async (req, res)=>{
    await Category.findByIdAndDelete(req.params.id);

    res.json({
        status:"success",
        message :"Category deleted Successfully",

    })
})