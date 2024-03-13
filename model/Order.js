import mongoose from "mongoose";

const Schema = mongoose.Schema;

//Genarate random numbers for order
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
const  randomNumbers = Math.floor(1000+ Math.random() * 9000)

const OrderSchema = new Schema (
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },

        orderItems:[
            {
               type:Object,
                required:true,


            }
        ],

        shippingAddress:{
            type:Object,
            required:true,

        },

        orderNumber:{
            type:String,
            default: randomTxt  + randomNumbers,
        },

        // for stripe payment


        paymentStatus:{
            type:String,
            default: "NOT paid",
        },

        paymentMethod:{
            type:String,
            required:true,
            default: "Not Specified",
        },

       totalPrice:{
            type:Number,
            // required:true,
            default: 0.00,
        },


        currency:{
            type:String,
            default: "NOT specified",
        },

        //============Admin==============
        status:{
            type:String,
            default: "pending",
            enum: ['pending', 'processing', 'shipped', 'delivered'],
        },

        deliveredAt:{
            type:Date,
        },
    },
    {timestamps:true}
);


// Compile to form Model
const Order = mongoose.model('Orders', OrderSchema);

export default Order;
// module.exports = Order;