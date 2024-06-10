var mongoose = require('mongoose');

 var userschema = new mongoose.Schema({
    user_name:{
        type:String
    },
    user_email:{
        type:String
    },
    user_pass:{
        type:String
    }
 })
 module.exports = mongoose.model('user',userschema);