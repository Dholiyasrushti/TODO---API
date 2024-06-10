var express = require('express');
var router = express.Router();
var user =require('../usercontroller/usercontroller');


router.post('/register',user.insert);
router.get('/',user.getdata);

router.post('/admin_login',user.login_admin);
router.get('/logout',user.logoutadmin);

router.post('/task',user.add_task);
router.post('/delete_task/:id',user.delete_task);
router.post('/update_task/:id',user.update_task);
router.get('/view_task',user.view_task);
router.get('/onetask/:id',user.onetask);

router.post('/user' ,user.user);
router.post('/user_login',user.user_login);
router.post('/delete_user/:id',user.delete_user);
router.post('/update_user/:id',user.update_user);
router.get('/view_user',user.view_user);
router.get('/logout_user',user.logoutuser);
router.get('/oneuser',user.oneuser);

router.get('/staffview_task',user.viewtaskstaff);
router.get('/accept_task/:id',user.status);
router.get('/complate_task/:id',user.complate_task);
router.get('/decline_task/:id',user.decline_task);





module.exports = router;
