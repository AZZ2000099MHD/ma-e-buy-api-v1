import express from "express";
import {isLoggedIn} from "../middlewares/isLoggedIn.js";
import {createBrandCtrl,
        deleteBrandCtrl,
        getAlBrandsCtrl,
        getSingleBrandCtrl,
        updateBrandCtrl} from "../controllers/BrandCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";




const  brandsRouter = express.Router();

brandsRouter.post('/', isLoggedIn,isAdmin,createBrandCtrl)
brandsRouter.get('/', getAlBrandsCtrl)
brandsRouter.get('/:id', getSingleBrandCtrl)
brandsRouter.delete('/:id',isLoggedIn,isAdmin, deleteBrandCtrl)
brandsRouter.put('/:id',isLoggedIn,isAdmin, updateBrandCtrl)
export default  brandsRouter;