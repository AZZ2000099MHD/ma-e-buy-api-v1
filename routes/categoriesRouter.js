import express from "express";
import {createCategoryCtrl,
    updateCategoryCtrl,
    deleteCategoryCtrl,
    getAllCategoriesCtrl,
    getSingleCategoryCtrl} from "../controllers/CategoriesCtrl..js";
import {isLoggedIn} from "../middlewares/isLoggedIn.js";
import categoryUpload from "../config/categoryUpload.js";
import isAdmin from "../middlewares/isAdmin.js";


const  categoriesRouter = express.Router();

categoriesRouter.post(
    "/",
    isLoggedIn,isAdmin,
    categoryUpload.single("file"),
    createCategoryCtrl
);

categoriesRouter.get('/', getAllCategoriesCtrl)
categoriesRouter.get('/:id', getSingleCategoryCtrl)
categoriesRouter.delete('/:id',isLoggedIn,isAdmin, deleteCategoryCtrl)
categoriesRouter.put('/:id',isLoggedIn,isAdmin, updateCategoryCtrl)
export default  categoriesRouter;