let express = require('express');
let processStructure = require('../../controllers/processesControllers/processStructureController');
let userAndRoles = require('../../controllers/usersControllers/usersAndRolesController');
let onlineFormsController = require('../../controllers/onlineFormsControllers/onlineFormController');

let router = express.Router();

/*
  _____   ____   _____ _______
 |  __ \ / __ \ / ____|__   __|
 | |__) | |  | | (___    | |
 |  ___/| |  | |\___ \   | |
 | |    | |__| |____) |  | |
 |_|     \____/|_____/   |_|

 */

router.post('/removeProcessStructure', function (req, res) {
    let structureName = req.body.structureName;
    processStructure.removeProcessStructure(structureName, (result) => res.send(result));
});

/*
   _____ ______ _______
  / ____|  ____|__   __|
 | |  __| |__     | |
 | | |_ |  __|    | |
 | |__| | |____   | |
  \_____|______|  |_|

 */

router.get('/addProcessStructure', function (req, res) {
    if (req.query.name) {
        res.render('processesStructureViews/ProcessStructure', {
            processStructureName: req.query.name,
            pageContext: 'addProcessStructure'
        });
    } else {
        res.send("Missing structure name.")
    }
});

router.get('/editProcessStructure', function (req, res) {
    if (req.query.name) {
        res.render('processesStructureViews/ProcessStructure', {
            processStructureName: req.query.name,
            pageContext: 'editProcessStructure'
        })
    } else {
        res.send("Missing structure name.")
    }
});

router.get('/getAllProcessStructures', function (req, res) {
    processStructure.getAllProcessStructures((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});

router.get('/getFormsToStages', function (req, res) {
    processStructure.getProcessStructure(req.query.processStructureName, (err, processStructure) => {
        if (err) res.send(err);
        else if (processStructure !== null) {
            onlineFormsController.getAllOnlineForms((err, onlineFormsObjects) => {
                if (err) res.send(err);
                else {
                    let formsToStages = {};
                    let formsIDsOfStages = processStructure.getFormsOfStage();
                    let formsOfStages = {};
                    onlineFormsObjects.forEach((form) => formsOfStages[form.formID] = form.formName);
                    let count = Object.keys(formsIDsOfStages).length;
                    Object.keys(formsIDsOfStages).forEach((key) => {
                        userAndRoles.getRoleNameByRoleID(key, (err, roleName) => {
                            //formsToStages[roleName] = formsIDsOfStages[key];
                            formsToStages[roleName] = [];
                            formsIDsOfStages[key].forEach((formID) => formsToStages[roleName].push(formsOfStages[formID]));
                            count--;
                            if (count === 0)
                                res.send(formsToStages);
                        });
                    });
                }
            });

        } else res.send({});
    })
});

module.exports = router;
