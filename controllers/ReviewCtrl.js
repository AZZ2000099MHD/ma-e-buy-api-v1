import Review from "../model/Review.js";
import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";

// @desc Create new Review
// @route Post api/v1/reviews
// @access Private Admin

export const createReviewCtrl = asyncHandler(async (req,res)=>{

    const {product, message, rating} = req.body;

    // find the product
    const  {productID} = req.params;
    const productFound  = await Product.findById(productID).populate("reviews");
    if(!productFound){
        throw new Error ("Product Not Found");
    }



    //check if useer already reviewd this product
    const hasReviewed = productFound?.reviews?.find((review)=>{
        return review?.user.toString() === req?.userAuthId?.toString();
    })


    if(hasReviewed){
        throw new Error("you have already reviewd this product");
    }



    // create review
    const  review  = await  Review.create({
        message,
        rating, product: productFound?._id,
        user : req.userAuthId,
    })

    //push review into product found
    productFound.reviews.push(review?._id);

    //Resave
    await productFound.save();

    res.status(201).json({
        success:true,
        message:"Review Created Successfullly",
    })



})




















