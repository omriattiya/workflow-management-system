let express = require('express');
let router = express.Router();
let usersAndRolesController = require('../controllers/usersControllers/usersAndRolesController');
let usersPermissionsController = require('../controllers/usersControllers/UsersPermissionsController');
/* GET home page. */

router.get('/', function (req, res)
{
    res.render('userViews/login');
});

router.get('/getTopBar', function (req, res)
{
    if (req.isAuthenticated()) {
        usersPermissionsController.getUserPermissions(req.user.emails[0].value,(err,permission)=>{
           if(err) {
               res.send(err);
           }
           else{
               let permissions = "style='display: none'";
               if(permission.permissionsManagementPermission){
                   permissions = "style='display: flex'";
               }
               usersAndRolesController.getRoleNameByUsername(req.user.emails[0].value, (err, roleName) =>
               {
                   if (err) {
                       res.render('topbar', {roleName: "RoleNotFound", userFullName: '',permissionsStyle:permissions});
                   }
                   else {
                       usersAndRolesController.getFullNameByEmail(req.user.emails[0].value,(err,fullName)=>{
                           if(err){
                               res.render('topbar', {roleName: roleName, userFullName: 'FullNameNotFound',permissionsStyle:permissions});
                           }
                           else{
                               res.render('topbar', {roleName: roleName, userFullName: fullName,permissionsStyle:permissions});
                           }
                       });
                   }
               });
           }
        });
    }
    else
    {
        res.redirect('/')
    }
});

router.get('/Home', function (req, res)
{
    if (req.isAuthenticated()) {
        res.render('index')
    }
    else
    {
        res.redirect('/')
    }
});


module.exports = router;