import express from "express";
import {createCouponCtrl,
        getAllCouponsCtrl,
        deleteCouponCtrl,
        updateCouponCtrl,
        getSingleCouponCtrl,
     } from "../controllers/couponCtrl.js";
import {isLoggedIn} from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";


const couponsRouter = express.Router();

couponsRouter.post("/",isLoggedIn,isAdmin, createCouponCtrl);
couponsRouter.get("/",getAllCouponsCtrl);
couponsRouter.get("/single", getSingleCouponCtrl);
couponsRouter.put("/update/:id", isLoggedIn,isAdmin, updateCouponCtrl);
couponsRouter.delete("/delete/:id", isLoggedIn, isAdmin,deleteCouponCtrl);



export default couponsRouter;