var UsersAndRoles = require("../schemas/UsersAndRoles.js");
let UsersAndRolesTreeSankey = require('../schemas/UsersAndRolesTreeSankey.js');

module.exports.addNewRole = (newRoleName, fatherRoleName, callback) => {
    UsersAndRoles.create({roleName: newRoleName, userEmail: [], children: []}, (err) => {
        if (err) {
            callback(err);
        } else {
            if (fatherRoleName.localeCompare("") !== 0) {
                UsersAndRoles.find({roleName: fatherRoleName}, (err1, result1) => {
                    if (err1) {
                        console.log('Error In AddNewRole' + err1);
                    } else if (result1.length === 0) {
                        UsersAndRoles.deleteOne({roleName: newRoleName}, (err3,result3)=>{new Error (">>> ERROR: father name does not exists")});
                        callback(new Error(">>> ERROR: father name does not exists"));
                    } else {
                        let fatherID = result1[0]._doc._id;
                        UsersAndRoles.find({roleName: newRoleName}, (err2, result2) => {
                            if (err2) {
                                console.log('Error In AddNewRole' + err2);
                            } else {
                                let sonID = result2[0]._doc._id;
                                UsersAndRoles.updateOne({_id: fatherID}, {$push: {children: sonID}}, callback);
                            }
                        })
                    }
                })
            } else {
                callback(err);
            }
        }
    });
};

module.exports.deleteRole = (roleToDelete, callback) => {
    UsersAndRoles.find({roleName: roleToDelete}, (err1, result1) => {
        if (err1) {
            console.log('Error In deleteRole' + err1);
        } else {
            let toDeleteID = result1[0]._doc._id;
            let toDeleteChildren = result1[0]._doc.children;
            UsersAndRoles.find({children: toDeleteID}, (err2, result2) => {
                if (err2) {
                    console.log('Error In deleteRole' + err2);
                } else {
                    if (result2.length !== 0) {
                        let fatherID = result2[0]._doc._id;
                        UsersAndRoles.updateOne({_id: fatherID}, {$pull: {children: toDeleteID}}, (err3) => {
                                if (err3) {
                                    console.log('Error In deleteRole' + err3);
                                } else {
                                    UsersAndRoles.updateOne({_id: fatherID}, {$push: {children: {$each: toDeleteChildren}}}, (err4) => {
                                            if (err4) {
                                                console.log('Error In deleteRole' + err4);
                                            } else {
                                                UsersAndRoles.deleteOne({_id: toDeleteID}, callback)
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    } else {
                        UsersAndRoles.deleteOne({_id: toDeleteID}, callback);
                    }
                }
            });
        }
    })
};

module.exports.changeRoleName = (oldRoleName, newRoleName, callback) => {
    UsersAndRoles.find({roleName: oldRoleName}, (err1, result1) => {
        if (err1) {
            console.log('Error In deleteRole' + err1);
        } else {
            let toChangeID = result1[0]._doc._id;
            UsersAndRoles.updateOne({_id: toChangeID}, {roleName: newRoleName}, callback)
        }
    })
};

module.exports.addNewUserToRole = (userEmail, roleName, callback) => {
    UsersAndRoles.find({roleName: roleName}, (err1, result1) => {
        if (err1) {
            console.log('Error In Add New User To Role' + err1);
        } else {
            let toChangeID = result1[0]._doc._id;
            UsersAndRoles.updateOne({_id: toChangeID}, {$push: {userEmail: userEmail}}, callback);
        }
    })
};

module.exports.deleteUserFromRole = (userEmail, roleName, callback) => {
    UsersAndRoles.find({roleName: roleName}, (err1, result1) => {
        if (err1) {
            console.log('Error In Add New User To Role' + err1);
        } else {
            let toChangeID = result1[0]._doc._id;
            UsersAndRoles.updateOne({_id: toChangeID}, {$pull: {userEmail: userEmail}}, callback);
        }
    })
};

module.exports.changeUserEmailInRole = (roleName, oldUserEmail, newUserEmail, callback) => {
    UsersAndRoles.find({roleName: roleName}, (err1, result1) => {
        if (err1) {
            console.log('Error In Add New User To Role' + err1);
        } else {
            let toChangeID = result1[0]._doc._id;
            UsersAndRoles.updateOne({_id: toChangeID}, {$pull: {userEmail: oldUserEmail}}, (err2) => {
                    if (err2) {
                        console.log('Error In Add New User To Role' + err2);
                    } else {
                        UsersAndRoles.updateOne({_id: toChangeID}, {$push: {userEmail: newUserEmail}}, callback)
                    }
                }
            )
        }
    })
};

module.exports.getAllRoles = (callback) => {
    return UsersAndRoles.find({}, callback).select('roleName');
};

module.exports.getAllRolesObjects = (callback) => {
    return UsersAndRoles.find({}, callback);
};

module.exports.getUsersAndRolesTree = (callback)=>{
    UsersAndRolesTreeSankey.find({},(err,result)=>{
        if(err){
            callback(err);
        }
        else if(result.length === 0){
            UsersAndRolesTreeSankey.create({sankey:JSON.stringify({content:{diagram:[]}})},(err,result)=>{
                if(err){
                    callback(err);
                }
                else{
                    callback(null,result);
                }
            });
        }
        else{
            callback(null,result[0]);
        }
    });
};

module.exports.setUsersAndRolesTree = (sankey,callback)=>{
    UsersAndRolesTreeSankey.updateOne({},{sankey:sankey},(err)=>{
        if(err){
            callback(err);
        }
        else{
            callback(null);
        }
    })
};

module.exports.getAllUsersByRole = (roleName,callback)=>{
    UsersAndRoles.find({roleName:roleName},(err,result)=>{
        if(err){
            callback(err);
        }
        else{
            callback(null,result);
        }
    })
};

module.exports.getRoleByName = (name, callback) => {
    return UsersAndRoles.find({roleName: name}, callback);
};