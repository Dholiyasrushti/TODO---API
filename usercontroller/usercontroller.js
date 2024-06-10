const storage = require('node-persist');
storage.init( /* options... */)
const bcrypt= require('bcrypt');
const admin = require('../model/admin');
const user = require('../model/user');
const task = require('../model/task');

// =============================== admin ==========================================
exports.insert = async (req,res) =>{
    var b_pass = await bcrypt.hash(req.body.admin_pass,10);
    req.body.admin_pass=b_pass;
    var data = await admin.create(req.body);
    res.status(200).json({
        status:"Admin Insert",
        data
    })
}


exports.getdata = async (req,res) =>{
    var data = await admin.find();
    res.status(200).json({
        data
    })
}


exports.login_admin =async (req,res) =>{
    var  admin_status = await storage.getItem('login_admin');
    // 3
    if(admin_status == undefined){
        var data = await admin.find({"admin_email":req.body.admin_email});
        console.log(data.length);
        if(data === 1){
            bcrypt.compare(req.body.admin_pass,data[0].admin_pass,async function(err,result){
                console.log(result);
                if(result == true){
                    await storage.setItem('login_admin',data[0].id);
                    res.status(200).json({
                        status:"Login Success"
                    })
                }else{
                    res.status(200).json({
                        status:"Check Your admin name and password"
                    })
                }
            })  
        }else{
            res.status(200).json({
                status:"Check Your admin name and password"
            })
        }
    }else {
        res.status(200).json({
            status:"Admin is already login"
        })
    }
}


exports.delete_data = async (req,res)=>{
    var id = req.params.id;
    var data = await admin.findByIdAndDelete(id,req.body);
    res.status(200).json({
        status:"data delete",
    })
}
exports.logoutadmin = async(req,res)=>{
    await storage.clear('login_admin');
    res.status(200).json({
        status:" logout "
    })
}

// ======================== add task ================================================================================
exports.add_task = async (req, res) => {
    var startdate = new Date(req.body.start_date);
    var enddate = new Date(req.body.end_date); 
    
    var timeDifference = enddate.getTime() - startdate.getTime();
    var totalday = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    const admin_id = await storage.getItem('login_admin');
    if(admin_id){
        var data = await task.create({
            task:req.body.task,
            user:req.body.user,
            start_date: startdate,
            end_date: enddate,
            total_day: totalday, 
            status:"pending"
        });
        res.status(200).json({
            status: "data insert",
            data
        });
    } else {
        res.status(200).json({
            status: "only admin can add task"
        });
    }  
}
exports.delete_task = async (req,res) =>{
    const admin_id = await storage.getItem('login_admin');
    if(admin_id){
        var id = req.params.id;
        var data = await task.findByIdAndDelete(id,req.body);
        res.status(200).json({
            status:"user delete",
        })
    }else{
        res.status(200).json({
            status:"Only admin cand delete task"
        })
    }

}


exports.update_task = async (req,res) =>{
    const admin_id = await storage.getItem('login_admin');
    if(admin_id){

        var id = req.params.id;
        var startdate = new Date(req.body.start_date);
        var enddate = new Date(req.body.end_date); 
        
        var timeDifference = enddate.getTime() - startdate.getTime();
        var totalday = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        var data = await task.findByIdAndUpdate(id,{
            task:req.body.task,
                user:req.body.user,
                start_date: startdate,
                end_date: enddate,
                total_day: totalday, 
                status:"pending"
        }
        );
        res.status(200).json({
            status:"user delete",
            data
        })
    }else{
        res.status(200).json({
            status:"Only admin can update task"
        })
    }
}

exports.onetask = async (req,res)=>{
    var id = req.params.id;
    var data = await task.findById(id).populate("user");
    res.status(200).json({
        status: "single task view sucessfully",
        data
    })
}


exports.view_task = async (req,res) =>{
    const admin_id = await storage.getItem('login_admin');
    if(admin_id){
        var total_recode = await task.find().count();
        var page_no =req.query.page_no;
        if(page_no == undefined){
            page_no = 1
        }
        var limit = 2;
        var total_page=Math.ceil(total_recode/limit);
        var start =(page_no-1)*limit;
        var data=await task.find().populate({path:'user'}).skip(start).limit(limit);
        res.status(200).json({
            data,
            page_no,
            total_page
        })
    }else{
        res.status(200).json({
            status:"Only admin can view task"
        })
    }
    
}





// =================================================== User =================================================


exports.user =  async (req,res) =>{
    var b_pass = await bcrypt.hash(req.body.user_pass,10);
    req.body.user_pass=b_pass;
    var data = await user.create(req.body);
    res.status(200).json({
        status:"User Insert",
        data
    }) 
}


exports.user_login = async (req,res) =>{
    const user_id = await storage.getItem('login-user');

    if(!user_id)
    {
        var data = await user.find({"user_email":req.body.user_email});


        if (data.length === 1 ) {
            bcrypt.compare(req.body.user_pass,data[0].user_pass,async function(err,result){
                console.log(result);
                if(result == true){
                    await storage.setItem('login-user',data[0].id);
                    res.status(200).json({
                        status:"Login Success"
                    })
                }else{
                    res.status(200).json({
                        status:"Check Your user email and password"
                    })
                }
            })
        }
        else {
            res.status(200).json({
                status: "check email and password"
            })
        }
    }else{
        res.status(200).json({
            status:201,
            message:"all ready login"
        })

    }
}

exports.delete_user = async (req,res) =>{
    var id = req.params.id;
    var data = await user.findByIdAndDelete(id,req.body);
    res.status(200).json({
        status:"user delete",
    })
}

exports.update_user = async (req,res)=>{
    var id = req.params.id;
    var data = await user.findByIdAndUpdate(id,req.body);
    res.status(200).json({
        status:" update user",
        data
    })
}


exports.view_user =async(req,res) =>{
    const admin_id = await storage.getItem('login_admin');
    if(admin_id){
        var total_recode = await user.find().count();
        var page_no =req.query.page_no;
        if(page_no == undefined){
                page_no = 1
        }
        var limit = 2;
        var total_page=Math.ceil(total_recode/limit);
        var start =(page_no-1)*limit;
        var data=await user.find().skip(start).limit(limit);
        res.status(200).json({
            data,
            page_no,
            total_page
        })  
    } else{
        res.status(200).json({
            status: "only admin can add task"
        });
    }
}

exports.logoutuser = async(req,res)=>{
    await storage.clear('login-user');
    res.status(200).json({
        status:" logout "
    })
}

exports.oneuser = async(req,res) =>{
    var id = req.params.id;
    var data = await user.findById(id);
    res.status(200).json({
        status:"one user show",
        data
    })
}


exports.viewtaskstaff = async(req,res)=>{
    const user_status = await storage.getItem('login-user');
    if(user_status != undefined)
    {
        const data = await task.find({user :user_status._id}).populate('user');
        if(data != undefined)
        {
            res.status(200).json({
                status:"task view successfully",
                data
            })
        }else{
            res.status(200).json({
                status:"task not found",
            })
        }
    }
    else{
        res.status(200).json({
            status:"user plz login !",
        })
    }
}

exports.status  = async(req,res)=>{
    const user_status = await storage.getItem('login-user');
   if(user_status != undefined)
   {
       var id = req.params.id;
       req.body.status = "accept";
       const data = await task.findByIdAndUpdate(id,req.body);
       if(data != undefined)
       {
           res.status(200).json({
               status:"task accepted successfuly",
               data
           })
       }
       else{
           res.status(201).json({
               status:"task not found",
           })
       }
   }
}


exports.decline_task  = async(req,res)=>{
    const user_status = await storage.getItem('login-user');
   if(user_status != undefined)
   {
       var id = req.params.id;
       req.body.status = "Decline";
       const data = await task.findByIdAndUpdate(id,req.body);
       if(data != undefined)
       {
           res.status(200).json({
               status:200,
               message:"task Decline"
           })
       }
       else{
           res.status(201).json({
               status:201,
               message:"task not found"
           })
       }
   }
}

exports.complate_task = async(req,res)=>{
    const check = await storage.getItem('login');
   if(check != undefined)
   {
       var id = req.params.id;
       req.body.status = "complated";
       const data = await task.findByIdAndUpdate(id,req.body);
       if(data != undefined)
       {
           res.status(200).json({
               status:200,
               message:"task complate "
           })
       }
       else{
           res.status(201).json({
               status:201,
               message:"task not found"
           })
       }
   }
};