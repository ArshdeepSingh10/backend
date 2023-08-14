const mongoose = require("mongoose");
const { Schema , model} = mongoose;
const  userSchema  = new Schema({
  name : String,
  email : {type:String , 
    validate : {
      validator : function(v){
        return /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi.test(v);
      },
      message : (props) => `${props.value} is not a valid Email !`,
    },
    unique : true ,
    required : true },
  password : {type : String , minLength : 6 , required : true },
  token : String 

});
const users= new model("users", userSchema);
module.exports = users;