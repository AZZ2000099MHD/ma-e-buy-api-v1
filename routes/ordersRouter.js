import express from "express";
import {createOrderCtrl,
        getAllOrdersCtrl,
        getSingleOrderCtrl,
         updateOrdersCtrl,
        getOrderStatsCtrl,
        } from "../controllers/OrderCtrl.js";
import {isLoggedIn} from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";



const ordersRouter = express.Router();

ordersRouter.post("/",isLoggedIn,createOrderCtrl );
ordersRouter.get("/",isLoggedIn,getAllOrdersCtrl );
ordersRouter.put("/update/:id",isLoggedIn,isAdmin,updateOrdersCtrl);
ordersRouter.get("/:id",isLoggedIn,getSingleOrderCtrl);
ordersRouter.get("/sales/stats/",isLoggedIn,getOrderStatsCtrl);



export default ordersRouter;