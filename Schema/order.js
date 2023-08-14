const mongoose = require('mongoose');
const {Schema , model} = mongoose;
const orderSchema = new Schema({
    email:String,
    name : String ,
    mobile : Number ,
    address : String,
    country : String,
    date : String , 
    state : String,
    city : String,
    pincode:Number,
    delivery :String,
    billing :String,
    totalprice : Number,
    cart:[{}],
    shipping : String
})
const order = new model("orders", orderSchema);
module.exports = order;