const mongoose = require("mongoose");
const { Schema ,model} = mongoose;
const allproduct = new Schema({
    name:{type:String , required:true},
    brand:{type:String , required:true},
    price:Number,
    size:String,
    discription:String,
    quantity:Number,
    category:String,
    image:[String],
    color:String,
    sku :String,
    discription : String ,
    status:String

});
const products = new model("products", allproduct);
module.exports = products;