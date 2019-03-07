let processStructureAccessor = require('../../models/accessors/processStructureAccessor');
let usersAndRolesController = require('../usersControllers/usersAndRolesController');
let onlineFormsController = require('../onlineFormsControllers/onlineFormController');
let ProcessStructure = require('../../domainObjects/processStructure');
let processStructureSankey = require('../../domainObjects/processStructureSankey');

module.exports.addProcessStructure = (structureName, sankeyContent, onlineFormsOfStage, callback) => {
    sankeyToStructure(sankeyContent, onlineFormsOfStage, (err, structure) => {
        if (err) {
            callback(err);
        } else {
            let newProcessStructure = new ProcessStructure(structureName, structure.initials, structure.stages, sankeyContent);
            if (newProcessStructure.checkNotDupStagesInStructure()) {
                if (newProcessStructure.checkInitialsExistInProcessStages()) {
                    if (newProcessStructure.checkPrevNextSymmetric()) {
                        if (newProcessStructure.checkNextPrevSymmetric()) {
                            processStructureAccessor.createProcessStructure(this.getProcessStructureForDB(newProcessStructure), callback);
                        } else
                            callback(new Error('Some stages have next stages that dont contain them for previous'));
                    } else
                        callback(new Error('Some stages have previous stages that dont contain them for next'));
                } else
                    callback(new Error('Some initial stages do not exist'));
            } else
                callback(new Error('There are two stages with the same number'));
        }
    });
};

module.exports.editProcessStructure = (structureName, sankeyContent, onlineFormsOfStage, callback) => {
    sankeyToStructure(sankeyContent, onlineFormsOfStage, (err, structure) => {
        if (err) {
            callback(err);
        } else {
            let newProcessStructure = new ProcessStructure(structureName, structure.initials, structure.stages, sankeyContent);
            if (newProcessStructure.checkNotDupStagesInStructure()) {
                if (newProcessStructure.checkInitialsExistInProcessStages()) {
                    if (newProcessStructure.checkPrevNextSymmetric()) {
                        if (newProcessStructure.checkNextPrevSymmetric()) {
                            processStructureAccessor.updateProcessStructure({structureName: structureName}, {
                                $set: {
                                    initials: structure.initials,
                                    stages: structure.stages,
                                    sankey: sankeyContent,
                                }
                            }, callback);
                        } else
                            callback(new Error('Some stages have next stages that dont contain them for previous'));
                    } else
                        callback(new Error('Some stages have previous stages that dont contain them for next'));
                } else
                    callback(new Error('Some initial stages do not exist'));
            } else
                callback(new Error('There are two stages with the same number'));
        }
    });
};

module.exports.removeProcessStructure = (structureName, callback) => {
    processStructureAccessor.deleteOneProcessStructure({structureName: structureName}, callback)
};

module.exports.getProcessStructure = (name, callback) => {
    processStructureAccessor.findProcessStructure({structureName: name}, callback);
};

module.exports.getAllProcessStructures = (callback) => {
    processStructureAccessor.findProcessStructures(callback)
};

module.exports.getProcessStructureForDB = function (originProcessStructure) {
    return {
        structureName: originProcessStructure.structureName,
        initials: originProcessStructure.initials,
        stages: this.getProcessStructureStagesForDB(originProcessStructure.stages),
        sankey: originProcessStructure.sankey
    };
};

module.exports.getProcessStructureStagesForDB = function (originStages) {
    let returnStages = [];
    for (let i = 0; i < originStages.length; i++) {
        returnStages.push({
            roleID: originStages[i].roleID,
            stageNum: originStages[i].stageNum,
            nextStages: originStages[i].nextStages,
            stagesToWaitFor: originStages[i].stagesToWaitFor,
            onlineForms: originStages[i].onlineForms,
            attachedFilesNames: originStages[i].attachedFilesNames
        });
    }
    return returnStages;
};


/*********************/
/* Private Functions */
/*********************/

let sankeyToStructure = function (sankeyContent, onlineFormsOfStage, callback) {
    let processStructureSankeyObject = new processStructureSankey(JSON.parse(sankeyContent));
    let initials = processStructureSankeyObject.getInitials();

    usersAndRolesController.getAllRoles((err, roles) => {
        if (err) {
            callback(err);
            return;
        }

        if (err) {
            callback(err);
            return;
        }
        onlineFormsController.getAllOnlineForms((err, formsObjects) => {
            if (err) callback(err);
            else {
                let rolesMap = {};
                let onlineFormsMap = {};
                let objectsMap = {};
                formsObjects.forEach((obj) => objectsMap[obj.formName] = obj);
                roles.forEach((role) => {
                    rolesMap[role.roleName] = role._id;
                    let formsArray = [];
                    let formIDsArray = [];
                    if (onlineFormsOfStage[role.roleName] !== undefined)
                        formsArray = onlineFormsOfStage[role.roleName];
                    formsArray.forEach((formName) => {
                        if (err) callback(err);
                        else {
                            formIDsArray.push(objectsMap[formName].formID);
                        }
                    });
                    onlineFormsMap[role._id] = formIDsArray
                });

                let stages = processStructureSankeyObject.getStages((roleName) => {
                    return rolesMap[roleName]
                }, (roleName) => {
                    return onlineFormsMap[rolesMap[roleName]]
                });
                callback(null, {initials: initials, stages: stages,});
            }
        });


    });

};