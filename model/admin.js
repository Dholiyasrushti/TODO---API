 var mongoose = require('mongoose');

 var adminschema = new mongoose.Schema({
    admin_name:{
        type:String
    },
    admin_email:{
        type:String
    },
    admin_pass:{
        type:String
    }
 })
 module.exports = mongoose.model('admin',adminschema);