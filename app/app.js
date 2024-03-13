import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import dbConnect from "../config/dbConnect.js";
import {globalErrHandler, notFound} from "../middlewares/globalErrHandler.js";
import userRoutes from "../routes/usersRoute.js";
import ProductsRoute from "../routes/productsRoute.js";
import productsRouter from "../routes/productsRoute.js";
import category from "../model/Category.js";
import categoriesRouter from "../routes/categoriesRouter.js";
import brandsRouter from "../routes/brandsRouter.js";
import colorsRouter from "../routes/colorsRouter.js";
import reviewRouter from "../routes/reviewRouter.js";
import ordersRouter from "../routes/ordersRouter.js";
import {Stripe} from "stripe";
import order from "../model/Order.js";
import Order from "../model/Order.js";
import couponsRouter from "../routes/couponsRouter.js";
// import OrderCtrl from "../controllers/OrderCtrl.js"
import cors from "cors";






//db connect
dbConnect();
const app = express();


//cors
app.use(cors())//

//============================================================================================
//Stripe WebHook

//Stripe  INstance
const stripe = new Stripe(process.env.STRIPE_KEY);


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_127930d092a1b366a25d18f475ca9018a56f5b5f7bb9914ce8255e72b347a038";

app.post('/webhook', express.raw({type: 'application/json'}),
     async  (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        console.log("event")
    } catch (err) {
        console.log('err', err.message)
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }


    if(event.type === 'checkout.session.completed'){
//update the order
        const session = event.data.object;
        const {orderId} = session.metadata;
        const paymentStatus = session.payment_status;
        const paymentMethod = session.payment_method_types[0];
        const totalAmount = session.amount_total;
        const currency = session.currency;

        // console.log({
        //     orderId,
        //     paymentStatus,
        //     paymentMethod,
        //     totalAmount,
        //     currency,
        // })

        //find the order

        const order = await Order.findByIdAndUpdate(
            JSON.parse(orderId),
            {
            totalPrice :totalAmount / 100,
            currency,
            paymentMethod,
            paymentStatus,
        },
            {
                new : true,
            }
            );
        console.log(order)
    }

    else{
        return;
    }


    // Handle the event
    // switch (event.type) {
    //     case 'payment_intent.succeeded':
    //         const paymentIntentSucceeded = event.data.object;
    //         // Then define and call a function to handle the event payment_intent.succeeded
    //         break;
    //     // ... handle other event types
    //     default:
    //         console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});

// app.listen(4242, () => console.log('Running on port 4242'));
//============================================================================================








//pass incomming data
app.use(express.json());

//routes
app.use("/api/v1/users/",userRoutes);
app.use("/api/v1/products/",productsRouter);
app.use("/api/v1/categories/",categoriesRouter);
app.use("/api/v1/brands/",brandsRouter);
app.use("/api/v1/colors/",colorsRouter);
app.use("/api/v1/reviews/",reviewRouter);
app.use("/api/v1/orders/",ordersRouter);
app.use("/api/v1/coupons/",couponsRouter);

//=============================================================================================================================



//err midleware
app.use(notFound);
app.use(globalErrHandler);
export default app;
