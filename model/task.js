var mongoose = require('mongoose');
const { data } = require('node-persist');

 var taskschema = new mongoose.Schema({
    task:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    start_date:{
        type:String
    },
    end_date:{
        type:String
    },
    total_day:{
        type:String
    },
    status:{
        type:String
    }
 })
 module.exports = mongoose.model('task',taskschema);