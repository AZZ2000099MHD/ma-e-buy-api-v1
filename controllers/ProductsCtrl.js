import Product from "../model/Product.js";
import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";



// @desc Cfreate new product
// @route POSt/api/v1/products
// @access Private/Admin

export const createProductCtrl = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, description, category, sizes, colors, price, totalQty, brand } =
        req.body;
     const convertedImgs = req.files.map((file) => file?.path);
    //Product exists
    const productExists = await Product.findOne({ name });
    if (productExists) {
        throw new Error("Product Already Exists");
    }
    //find the brand
    const brandFound = await Brand.findOne({
        name:brand,
    });

    if (!brandFound) {
        throw new Error(
            "Brand not found, please create brand first or check brand name"
        );
    }
    //find the category
    const categoryFound = await Category.findOne({
        name: category,
    });
    if (!categoryFound) {
        throw new Error(
            "Category not found, please create category first or check category name"
        );
    }
    //create the product
    const product = await Product.create({
        name,
        description,
        category,
        sizes,
        colors,
        user: req.userAuthId,
        price,
        totalQty,
        brand,
        images: convertedImgs,
    });
    //push the product into category
    categoryFound.products.push(product._id);
    //resave
    await categoryFound.save();
    //push the product into brand
    brandFound.products.push(product._id);
    //resave
    await brandFound.save();
    //send response
    res.json({
        status: "success",
        message: "Product created successfully",
        product,
    });
});

//  @desc Get All Products
// @route  Get/api/producrts
//  @access Public


export const getProductsCtrl = asyncHandler(async (req, res)=> {

    let productQuery = Product.find();


    //Seasrch by Name
    if (req.query.name) {
        productQuery = productQuery.find({
            name: {$regex: req.query.name, $options: "i"},
        })
    }


    // Filter By brand
    if (req.query.brand) {
        productQuery = productQuery.find({
            brand: {$regex: req.query.brand, $options: "i"},
        })
    }

    // Filter By category
    if (req.query.category) {
        productQuery = productQuery.find({
            category: {$regex: req.query.category, $options: "i"},
        })
    }

    // Filter By color
    if (req.query.color) {
        productQuery = productQuery.find({
            color: {$regex: req.query.color, $options: "i"},
        })
    }

    // Filter By size
    if (req.query.size) {
        productQuery = productQuery.find({
            size: {$regex: req.query.size, $options: "i"},
        })
    }


    // dilter by price range
    if (req.query.price) {
        const priceRange = req.query.price.split("-");
        productQuery = productQuery.find({
            price: {$gte: priceRange[0], $lte: priceRange[1]},
        })
    }


    // Pagination
    // Page
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

    //Limit
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 100;


    // StarIDX
    const startIndex = (page - 1) * limit;

    // endIdx
    const endIndex = page * limit;

    //Total
    const total = await Product.countDocuments()


    productQuery = productQuery.skip(startIndex).limit(limit);

    //PaginationResult
    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
        };
    }

    if (startIndex > 0) {
        pagination.prev= {
        page:page - 1,
            limit,
    }
}


    // Await the query
    const products = await productQuery.populate("reviews")

    res.json({
        status : "Success",
        total,
        results :products.length,
        pagination,
        message:"Products Fetched Successfully",
        products,
    });
});


//@ desc GetSingle Poduct
//@route GET/api/product:id
//@access Public


export const getProductCtrl = asyncHandler (async (req, res)=>{
    const product = await Product.findById(req.params.id).populate({
    path :'reviews',
        populate:{
        path :'user',
        select: 'fullname',
        }
    });
    if(!product){
        throw new Error('Product not Found');
    }
    res.json({
        status:"success",
        message :"Product fetched Successfully",
        product,
    })
})


//@ desc Update Poduct
//@route GET/api/product:id/update
//@access Private/Admin

export const updateProductCtrl = asyncHandler (async (req, res)=>{

    const {
        name,
        description,
        category,
        sizes,
        colours,
        user,
        price,
        totalQty,
        brand,

        } =  req.body;


    // update
    const product = await Product.findByIdAndUpdate(req.params.id,{
        name,
        description,
        category,
        sizes,
        colours,
        user,
        price,
        totalQty,
        brand,
    },
        {
            new: true,
        }
        );


    res.json({
        status:"success",
        message :"Product updated  Successfully",
        product,
    })
})


//@ desc Delete Poduct
//@route   Delete GET/api/product:id/Delete
//@access Private/Admin

export const deleteProductCtrl = asyncHandler (async (req, res)=>{
     await Product.findByIdAndDelete(req.params.id);

    res.json({
        status:"success",
        message :"Product deleted Successfully",

    })
})