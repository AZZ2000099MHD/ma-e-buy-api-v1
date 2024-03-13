import User from "../model/User.js";
import asyncHandler from 'express-async-handler';
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import {getTokenFromHeader} from "../utils/getTokenFromHeader.js";
import {verifyToken} from "../utils/verifyToken.js";



export const registerUserCtrl = asyncHandler(async (req, res)=>{
    const {fullName,email,password} =req.body;

    //check user exkists
    const userExists = await User.findOne({email});
    if(userExists){

        //throw


        throw new Error("User already exists");
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //create the user

    const user = await User.create({
        fullName,
        email,
        password:hashedPassword,
    });

    res.status(201).json({
        status:'success',
        message:"USer Registered Successfully",
        data:user,
    });
});


// @desc Login User
// @route POST/api/v1/users/login
// @access Public

export const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //Find the user in db by email only
    const userFound = await User.findOne({
        email,
    });
    if (userFound && (await bcrypt.compare(password, userFound?.password))) {
        res.json({
            status: "success",
            message: "User logged in successfully",
            userFound,
            token: generateToken(userFound?._id),
        });
    } else {
        throw new Error("Invalid login credentials");
    }
});

// desk get user profile
// route get/api/v1/users/profile
// access private

export const getUserProfileCtrl = asyncHandler(async (req, res)=>{


    // const user = await User.findById(req.userAuthId).populate("orders");
    // console.log(user);


    // find the user
    const user = await User.findById(req.userAuthId).populate("orders");
    res.json({
        status:'success',
        message:'user profile fetched successfully',
        user,
    });
});



// Update user shipping address
// route PUT/api/v1/users/update/shipping
// access private


export const updateShippingAddressCtrl = asyncHandler(async(req,res)=>{
    const { firstName, lastName, address,   city, postalCode, province, country, phone } = req.body

    const user = await User.findByIdAndUpdate(req.userAuthId,{
        shippingAddress:{
            firstName,
            lastName,
            address,
            city,
            postalCode,
            province,
            country,
            phone
        },

        hasShippingAddress : true,

    },{
        new: true,
    });

    res.json({
        status : "success",
        message: "user shipping address updated successfully",
        user,
    })

});
