let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let fs = require('fs');
let UsersAndRolesTreeSankey = require('../../controllers/usersControllers/usersAndRolesController');
let sankeyContent = require('../inputs/trees/treesForActiveProcessTest/usersTree1sankey');
let emailsToFullName = require('../inputs/trees/treesForActiveProcessTest/usersTree1EmailsToFullNames');
let rolesToDereg = require('../inputs/trees/treesForActiveProcessTest/usersTree1RolesToDeregs');
let rolesToEmails = require('../inputs/trees/treesForActiveProcessTest/usersTree1RolesToEmails');
let userAccessor = require('../../models/accessors/usersAccessor');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let processStructureSankeyJSON = require('../inputs/processStructures/processStructuresForActiveProcessTest/processStructure1');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let processStructureAccessor = require('../../models/accessors/processStructureAccessor');
let filledOnlineFormsController = require('../../controllers/onlineFormsControllers/filledOnlineFormController');
let onlineFormsController = require('../../controllers/onlineFormsControllers/onlineFormController');
let notificationsController = require('../../controllers/notificationsControllers/notificationController');
let processReportController = require('../../controllers/processesControllers/processReportController');
let activeProcess = require('../../domainObjects/activeProcess');
let activeProcessStage = require('../../domainObjects/activeProcessStage');
let usersAndRolesController = require('../../controllers/usersControllers/usersAndRolesController');

//Graphics Inputs
let sankeyContentOfGraphics = require('../inputs/trees/GraphicsTree/sankeyTree');
let emailsToFullNameOfGraphics = require('../inputs/trees/GraphicsTree/emailsToFullName');
let rolesToDeregOfGraphics = require('../inputs/trees/GraphicsTree/rolesToDereg');
let rolesToEmailsOfGraphics = require('../inputs/trees/GraphicsTree/rolesToEmails');
let processStructureSankeyJSONOfGraphics = require('../inputs/processStructures/GraphicsProcessStructure/graphicsSankey');
//End Of Graphics Inputs

let beforeGlobal = async function () {
    this.enableTimeouts(false);
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
};

let beforeEachTest = function (done) {
    this.enableTimeouts(false);
    mongoose.connection.db.dropDatabase();
    userAccessor.createSankeyTree({sankey: JSON.stringify({content: {diagram: []}})}, (err, result) => {
        if (err) {
            done(err);
        }
        else {
            done();
        }
    });
};
let createTree1WithStructure1 = function (done) {
    UsersAndRolesTreeSankey.setUsersAndRolesTree('chairman@outlook.co.il', JSON.stringify(sankeyContent),
        rolesToEmails, emailsToFullName,
        rolesToDereg, (err) => {
            if (err) {
                done(err);
            }
            else {
                onlineFormsController.findOnlineFormsIDsByFormsNames(['frm'], (err, formIDsArray) => {
                    processStructureController.addProcessStructure('chairman@outlook.co.il', 'תהליך גרפיקה', JSON.stringify(processStructureSankeyJSON), formIDsArray, 0, "12", (err, needApproval) => {
                        if (err) {
                            done(err);
                        }
                        else {
                            done();
                        }
                    });
                });
            }
        });
};

let createTreeAndProcessStructureOfGrahics = function (done) {
    UsersAndRolesTreeSankey.setUsersAndRolesTree('chairman@outlook.co.il', JSON.stringify(sankeyContentOfGraphics),
        rolesToEmailsOfGraphics, emailsToFullNameOfGraphics,
        rolesToDeregOfGraphics, (err) => {
            if (err) {
                done(err);
            }
            else {
                onlineFormsController.findOnlineFormsIDsByFormsNames(['טופס קניות'], (err, formIDsArray) => {
                    processStructureController.addProcessStructure('chairman@outlook.co.il', 'תהליך גרפיקה', JSON.stringify(processStructureSankeyJSONOfGraphics), [], 0, "12", (err, needApproval) => {
                        if (err) {
                            done(err);
                        }
                        else {
                            done();
                        }
                    });
                });
            }
        });
};

let startProcess = function (done) {
    activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
        if (err) done(err);
        else {
            done();
        }
    });
};

let startProcessAndHandleTwice = function (done) {
    activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
        if (err) done(err);
        else {
            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                comments: 'הערות של סגן מנהל נגטיב',
                2: 'on',
                processName: 'גרפיקה להקרנת בכורה'
            }, [], 'files', (err) => {
                if (err) done(err);
                else {
                    activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                        comments: 'הערות של מנהל נגטיב',
                        0: 'on',
                        1: 'on',
                        4: 'on',
                        processName: 'גרפיקה להקרנת בכורה'
                    }, [], 'files', (err) => {
                        if (err) done(err);
                        else {
                            done();
                        }
                    });
                }
            });
        }
    });
};

let startProcessAndHandleTwiceWithGraphicsAndPublicity = function (done) {
    activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
        if (err) done(err);
        else {
            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                comments: 'הערות של סגן מנהל נגטיב',
                2: 'on',
                processName: 'גרפיקה להקרנת בכורה'
            }, [], 'files', (err) => {
                if (err) done(err);
                else {
                    activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                        comments: 'הערות של מנהל נגטיב',
                        1: 'on',
                        4: 'on',
                        processName: 'גרפיקה להקרנת בכורה'
                    }, [], 'files', (err) => {
                        if (err) done(err);
                        else {
                            done();
                        }
                    });
                }
            });
        }
    });
};

let afterGlobal = function () {
    mongoose.connection.close();
};

describe('1. Active Process Controller', function () {
    before(beforeGlobal);
    beforeEach(beforeEachTest);
    after(afterGlobal);
    describe('1.1 start process', function () {
        beforeEach(createTree1WithStructure1);
        it('1.1.1 start process userEmail not in tree', function (done) {
            activeProcessController.startProcessByUsername('chairman@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                assert.deepEqual(true, err !== null);
                assert.deepEqual(err.message, '>>> ERROR: username chairman@outlook.co.il don\'t have the proper role to start the process תהליך גרפיקה');
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(true, process === null);
                        done();
                    }
                });
            });
        }).timeout(30000);

        it('1.1.2 start process process structure doesn\'t exist', function (done) {
            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גלפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                assert.deepEqual(true, err !== null);
                assert.deepEqual(err.message, 'This process structure is currently unavailable due to changes in roles');
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(true, process === null);
                        done();
                    }
                });
            });
        }).timeout(30000);

        it('1.1.3 start process correct', function (done) {
            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                if (err) done(err);
                else {
                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                        if (err) done(err);
                        else {
                            assert.deepEqual(true, process !== null);
                            processReportController.processReport('גרפיקה להקרנת בכורה', (err, report) => {
                                if (err) done(err);
                                else {
                                    assert.deepEqual(report[1].length, 0);
                                    assert.deepEqual(report[0].processName, 'גרפיקה להקרנת בכורה');
                                    assert.deepEqual(report[0].status, 'פעיל');
                                    assert.deepEqual(report[0].urgency, 3);
                                    assert.deepEqual(report[0].filledOnlineForms, []);
                                    notificationsController.getUserNotifications('negativevicemanager@outlook.co.il', (err, results) => {
                                        if (err) done(err);
                                        else {
                                            assert.deepEqual(results.length, 1);
                                            assert.deepEqual(results[0].description, 'גרפיקה להקרנת בכורה מסוג תהליך גרפיקה מחכה לטיפולך.');
                                            assert.deepEqual(results[0].notificationType, 'תהליך בהמתנה');
                                            done();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);

        it('1.1.4 start process user cant start process', function (done) {
            activeProcessController.startProcessByUsername('chairman@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                assert.deepEqual(true, err !== null);
                assert.deepEqual(err.message, '>>> ERROR: username chairman@outlook.co.il don\'t have the proper role to start the process תהליך גרפיקה');
                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                    if (err) done(err);
                    else {
                        assert.deepEqual(true, process === null);
                        done();
                    }
                });
            });
        }).timeout(30000);

        it('1.1.5 start process process structure is unavailable', function (done) {
            processStructureAccessor.updateProcessStructure({structureName: 'תהליך גרפיקה'}, {$set: {available: false}}, (err) => {
                if (err) done(err);
                else {
                    activeProcessController.startProcessByUsername('chairman@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                        assert.deepEqual(true, err !== null);
                        assert.deepEqual(err.message, 'This process structure is currently unavailable due to changes in roles');
                        activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(true, process === null);
                                done();
                            }
                        });
                    });
                }
            });

        }).timeout(30000);

        it('1.1.6 start process same name', function (done) {
            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                if (err) done(err);
                else {
                    activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                        assert.deepEqual(true, err !== null);
                        activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(true, process !== null);
                                done();
                            }
                        });
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.2 uploadFilesAndHandleProcess', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcess);
        afterEach((done) => {
            fs.rename('test/fileTests/outputFiles/גרפיקה להקרנת בכורה/a.txt', 'test/fileTests/inputFiles/a.txt', function (err) {
                if (err) done(err);
                else {
                    fs.rename('test/fileTests/outputFiles/גרפיקה להקרנת בכורה/b.txt', 'test/fileTests/inputFiles/b.txt', function (err) {
                        if (err) done(err);
                        else {
                            fs.rmdirSync('test/fileTests/outputFiles/גרפיקה להקרנת בכורה');
                            fs.rmdirSync('test/fileTests/outputFiles');
                            done();
                        }
                    });
                }
            });
        });
        it('1.2.1 uploadFilesAndHandleProcess', function (done) {
            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                comments: 'הערות של סגן מנהל נגטיב',
                2: 'on',
                processName: 'גרפיקה להקרנת בכורה'
            }, {
                "a": {name: 'a.txt', path: 'test/fileTests/inputFiles/a.txt'},
                "b": {name: 'b.txt', path: 'test/fileTests/inputFiles/b.txt'}
            }, 'test/fileTests/outputFiles', (err) => {
                if (err) done(err);
                else {
                    assert.deepEqual(fs.existsSync('test/fileTests/outputFiles/גרפיקה להקרנת בכורה/a.txt'), true);
                    assert.deepEqual(fs.existsSync('test/fileTests/outputFiles/גרפיקה להקרנת בכורה/b.txt'), true);
                    done();
                }
            });
        }).timeout(30000);
    });


    describe('1.2 assign single users', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcessAndHandleTwice);
        it('1.2.1 assign single users', function (done) {
            activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                if (err) done(err);
                else {
                    activeProcessController.assignSingleUsersToStages(process, [0, 1, 4], (err, result) => {
                        if (err) done(err);
                        else {
                            activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                                if (err) done(err);
                                else {
                                    assert.deepEqual(null, process.getStageByStageNum(0).userEmail);
                                    assert.deepEqual(null, process.getStageByStageNum(1).userEmail);
                                    assert.deepEqual('publicitydepartmenthead@outlook.co.il', process.getStageByStageNum(4).userEmail);
                                    done();
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.3 cancel process', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcess);
        it('1.3.1 cancel process', function (done) {
            activeProcessController.cancelProcess('negativevicemanager@outlook.co.il', 'גרפיקה להקרנת בכורה', 'הערות לביטול', (err) => {
                if (err) done(err);
                else {
                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                        if (err) done(err);
                        else {
                            assert.deepEqual(true, process === null);
                            done()
                        }
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.4 incrementStageCycle', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcess);
        it('1.4.1 incrementStageCycle', function (done) {
            activeProcessController.incrementStageCycle('גרפיקה להקרנת בכורה', [0, 1, 4], (err) => {
                if (err) done(err);
                else {
                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                        if (err) done(err);
                        else {
                            assert.deepEqual(2, process.getStageByStageNum(0).notificationsCycle);
                            assert.deepEqual(2, process.getStageByStageNum(1).notificationsCycle);
                            assert.deepEqual(2, process.getStageByStageNum(4).notificationsCycle);
                            assert.deepEqual(1, process.getStageByStageNum(2).notificationsCycle);
                            assert.deepEqual(1, process.getStageByStageNum(3).notificationsCycle);
                            activeProcessController.incrementStageCycle('גרפיקה להקרנת בכורה', [2, 1, 4], (err) => {
                                if (err) done(err);
                                else {
                                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                                        if (err) done(err);
                                        else {
                                            assert.deepEqual(2, process.getStageByStageNum(0).notificationsCycle);
                                            assert.deepEqual(3, process.getStageByStageNum(1).notificationsCycle);
                                            assert.deepEqual(3, process.getStageByStageNum(4).notificationsCycle);
                                            assert.deepEqual(2, process.getStageByStageNum(2).notificationsCycle);
                                            assert.deepEqual(1, process.getStageByStageNum(3).notificationsCycle);
                                            done();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.5 handleProcess', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcess);
        it('1.5.1 handleProcess without finishing next stages is empty', function (done) {
            activeProcessController.handleProcess('negativevicemanager@outlook.co.il', 'גרפיקה להקרנת בכורה', {
                comments: 'הערות של סגן מנהל נגטיב',
                fileNames: ['קובץ 2', 'קובץ1'],
                nextStageRoles: []
            }, (err) => {
                assert.deepEqual(true, err !== null);
                assert.deepEqual(err.message, 'HandleProcess: next stages are empty and process cannot be finished');
                done();
            });
        }).timeout(30000);

        it('1.5.2 handleProcess without finishing correct', function (done) {
            activeProcessController.handleProcess('negativevicemanager@outlook.co.il', 'גרפיקה להקרנת בכורה', {
                comments: 'הערות של סגן מנהל נגטיב',
                fileNames: ['קובץ 2', 'קובץ1'],
                nextStageRoles: [2]
            }, (err) => {
                if (err) done(err);
                else {
                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                        if (err) done(err);
                        else {
                            assert.deepEqual(true, process !== null);
                            assert.deepEqual(process.currentStages, [2]);
                            done();
                        }
                    });
                }
            });
        }).timeout(30000);

        it('1.5.3 handleProcess with finishing correct', function (done) {
            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                comments: 'הערות של סגן מנהל נגטיב',
                2: 'on',
                processName: 'גרפיקה להקרנת בכורה'
            }, [], 'files', (err) => {
                if (err) done(err);
                else {
                    activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                        comments: 'הערות של מנהל נגטיב',
                        4: 'on',
                        processName: 'גרפיקה להקרנת בכורה'
                    }, [], 'files', (err) => {
                        if (err) done(err);
                        else {
                            activeProcessController.handleProcess('publicitydepartmenthead@outlook.co.il', 'גרפיקה להקרנת בכורה', {
                                comments: '',
                                fileNames: ['קובץ 2', 'קובץ1'],
                                nextStageRoles: []
                            }, (err) => {
                                if (err) done(err);
                                else {
                                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                                        if (err) done(err);
                                        else {
                                            assert.deepEqual(true, process === null);
                                            done()
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);
        it('1.5.4 handleProcess without finishing wrong user', function (done) {
            activeProcessController.handleProcess('negativemanager@outlook.co.il', 'גרפיקה להקרנת בכורה', {
                comments: 'הערות של סגן מנהל נגטיב',
                fileNames: ['קובץ 2', 'קובץ1'],
                nextStageRoles: [2]
            }, (err) => {
                assert.deepEqual(true, err !== null);
                assert.deepEqual(err.message, 'HandleProcess: user not found in current stages');
                done();
            });
        }).timeout(30000);

        it('1.5.5 handleProcess without finishing wrong next stages', function (done) {
            activeProcessController.handleProcess('negativevicemanager@outlook.co.il', 'גרפיקה להקרנת בכורה', {
                comments: 'הערות של סגן מנהל נגטיב',
                fileNames: ['קובץ 2', 'קובץ1'],
                nextStageRoles: [2, 4]
            }, (err) => {
                assert.deepEqual(true, err !== null);
                assert.deepEqual(err.message, 'HandleProcess: next stages are wrong');
                done();
            });
        }).timeout(30000);

        it('1.5.6 handleProcess with finishing wrong next stages', function (done) {
            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                comments: 'הערות של סגן מנהל נגטיב',
                2: 'on',
                processName: 'גרפיקה להקרנת בכורה'
            }, [], 'files', (err) => {
                if (err) done(err);
                else {
                    activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                        comments: 'הערות של מנהל נגטיב',
                        4: 'on',
                        processName: 'גרפיקה להקרנת בכורה'
                    }, [], 'files', (err) => {
                        if (err) done(err);
                        else {
                            activeProcessController.handleProcess('publicitydepartmenthead@outlook.co.il', 'גרפיקה להקרנת בכורה', {
                                comments: '',
                                fileNames: ['קובץ 2', 'קובץ1'],
                                nextStageRoles: [1]
                            }, (err) => {
                                assert.deepEqual(true, err !== null);
                                assert.deepEqual(err.message, 'HandleProcess: next stages are wrong');
                                done();
                            });
                        }
                    });
                }
            });
        }).timeout(30000);
    });

    describe('1.6 advance process', function () {
        beforeEach(createTree1WithStructure1);
        beforeEach(startProcess);
        it('1.6.1 advanceProcess', function (done) {
            activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                if (err) done(err);
                else {
                    process.handleStage({stageNum: 3});
                    activeProcessController.advanceProcess(process, 3, [2], (err) => {
                        if (err) done(err);
                        else {
                            activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                                if (err) done(err);
                                else {
                                    assert.deepEqual(process.currentStages, [2]);
                                    done();
                                }
                            });
                        }
                    });
                }
            });
        }).timeout(30000);
        });

        describe('1.7 takePartInProcess', function () {
            beforeEach(createTree1WithStructure1);
            beforeEach(startProcessAndHandleTwiceWithGraphicsAndPublicity);
            it('1.7.1 takePartInProcess', function (done) {
                activeProcessController.takePartInActiveProcess('גרפיקה להקרנת בכורה', 'graphicartist@outlook.co.il', (err) => {
                    if (err) done(err);
                    else {
                        activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual('graphicartist@outlook.co.il', process.getStageByStageNum(1).userEmail);
                                done();
                            }
                        });
                    }
                });
            }).timeout(30000);
        });

        describe('1.8 unTakePartInProcess', function () {
            beforeEach(createTree1WithStructure1);
            beforeEach(startProcessAndHandleTwiceWithGraphicsAndPublicity);
            it('1.8.1 unTakePartInProcess', function (done) {
                activeProcessController.unTakePartInActiveProcess('גרפיקה להקרנת בכורה', 'publicitydepartmenthead@outlook.co.il', (err) => {
                    if (err) done(err);
                    else {
                        activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(null, process.getStageByStageNum(4).userEmail);
                                done();
                            }
                        });
                    }
                });
            }).timeout(30000);
        });

        describe('1.9 returnToCreator', function () {
            beforeEach(createTree1WithStructure1);
            beforeEach(startProcessAndHandleTwiceWithGraphicsAndPublicity);
            it('1.9.1 returnToCreator correct', function (done) {
                activeProcessController.returnToCreator('publicitydepartmenthead@outlook.co.il', 'גרפיקה להקרנת בכורה', 'הערות חזרה', (err) => {
                    if (err) done(err);
                    else {
                        activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual([3], process.currentStages);
                                done();
                            }
                        });
                    }
                });
            }).timeout(30000);

            it('1.9.2 returnToCreator wrong user', function (done) {
                activeProcessController.returnToCreator('publicitydepartmenthead1@outlook.co.il', 'גרפיקה להקרנת בכורה', 'הערות חזרה', (err) => {
                    assert.deepEqual(true, err !== null);
                    assert.deepEqual(err.message, 'Return To Creator: wrong userEmail');
                    activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                        if (err) done(err);
                        else {
                            assert.deepEqual([1, 4], process.currentStages.sort());
                            done();
                        }
                    });
                });
            }).timeout(30000);
        });

        describe('1.10 addFilledOnlineFormToProcess', function () {
            beforeEach((done) => {
                onlineFormsController.createOnlineFrom('frm', 'frmsrc', (err, res) => {
                    if (err) done(err);
                    else {
                        done();
                    }
                });
            });
            beforeEach(createTree1WithStructure1);
            beforeEach(startProcessAndHandleTwiceWithGraphicsAndPublicity);
            it('1.10.1 addFilledOnlineFormToProcess', function (done) {
                filledOnlineFormsController.createFilledOnlineFrom('frm', [{'name': 'blah'}], (err, dbForm) => {
                    if (err) done(err);
                    else {
                        activeProcessController.addFilledOnlineFormToProcess('גרפיקה להקרנת בכורה', dbForm._id, (err) => {
                            if (err) done(err);
                            else {
                                activeProcessController.getActiveProcessByProcessName('גרפיקה להקרנת בכורה', (err, process) => {
                                    if (err) done(err);
                                    else {
                                        assert.deepEqual(process.filledOnlineForms, [dbForm._id]);
                                        done();
                                    }
                                });
                            }
                        });
                    }
                });
            }).timeout(30000);
        });

        describe('1.11 getNextStagesRolesAndOnlineForms', function () {
            beforeEach(createTree1WithStructure1);
            beforeEach(startProcess);
            it('1.11.1 getNextStagesRolesAndOnlineForms correct', function (done) {
                activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                    comments: 'הערות של סגן מנהל נגטיב',
                    2: 'on',
                    processName: 'גרפיקה להקרנת בכורה'
                }, [], 'files', (err) => {
                    if (err) done(err);
                    else {
                        activeProcessController.getNextStagesRolesAndOnlineForms('גרפיקה להקרנת בכורה', 'negativemanager@outlook.co.il', (err, result) => {
                            if (err) done(err);
                            else {
                                let sortedResult = result[0].sort((x, y) => {
                                    if (x[1] < y[1]) return -1;
                                    if (x[1] > y[1]) return 1;
                                    return 0;
                                });
                                assert.deepEqual(result[0].length, 3);
                                assert.deepEqual(sortedResult[0], ['דובר', 0]);
                                assert.deepEqual(sortedResult[1], ['גרפיקאי', 1]);
                                assert.deepEqual(sortedResult[2], ['רמד הסברה', 4]);
                                done();
                            }
                        })
                    }
                });
            }).timeout(30000);

            it('1.11.2 getNextStagesRolesAndOnlineForms user is wrong', function (done) {
                activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                    comments: 'הערות של סגן מנהל נגטיב',
                    2: 'on',
                    processName: 'גרפיקה להקרנת בכורה'
                }, [], 'files', (err) => {
                    if (err) done(err);
                    else {
                        activeProcessController.getNextStagesRolesAndOnlineForms('גרפיקה להקרנת בכורה', 'negativevicemanager1@outlook.co.il', (err, result) => {
                            assert.deepEqual(true, err !== null);
                            assert.deepEqual(err.message, 'GetNextStagesRolesAndOnlineForms: user not found in current stages');
                            done();
                        })
                    }
                });
            }).timeout(30000);
        });

        describe('1.12 getRoleIDsOfDeregStages', function () {
            beforeEach(createTreeAndProcessStructureOfGrahics);
            it('1.12.1 getRoleIDsOfDeregStages', function (done) {
                activeProcessController.getRoleIDsOfDeregStages([{kind: 'ByDereg', dereg: "2"}, {
                    kind: 'ByDereg',
                    dereg: "3"
                }, {kind: 'ByDereg', dereg: "4"}, {
                    kind: 'ByDereg',
                    dereg: "5"
                }], 'negativevicemanager@outlook.co.il', (err, map) => {
                    if (err) done(err);
                    else {
                        usersAndRolesController.getRoleNameByRoleID(map["2"], (err, roleName) => {
                            if (err) done(err);
                            else {
                                assert.deepEqual(roleName, 'מנהל נגטיב');
                                usersAndRolesController.getRoleNameByRoleID(map["3"], (err, roleName) => {
                                    if (err) done(err);
                                    else {
                                        assert.deepEqual(roleName, null);
                                        usersAndRolesController.getRoleNameByRoleID(map["4"], (err, roleName) => {
                                            if (err) done(err);
                                            else {
                                                assert.deepEqual(roleName, 'סגן יושב ראש אגודה');
                                                usersAndRolesController.getRoleNameByRoleID(map["5"], (err, roleName) => {
                                                    if (err) done(err);
                                                    else {
                                                        assert.deepEqual(roleName, 'יושב ראש אגודה');
                                                        done();
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }).timeout(30000);
        });

        describe('1.13 getNewActiveProcess', function () {
            beforeEach(createTreeAndProcessStructureOfGrahics);
            it('1.13.1 getNewActiveProcess', function (done) {
                let dateToCompare = new Date();
                processStructureController.getProcessStructure('תהליך גרפיקה', (err, processStructure) => {
                    if (err) done(err);
                    else {
                        usersAndRolesController.getRoleByUsername('negativevicemanager@outlook.co.il', (err, role) => {
                            if (err) done(err);
                            else {
                                activeProcessController.getNewActiveProcess(processStructure, role, 0, 'negativevicemanager@outlook.co.il', 'תהליך גרפיקה להקרנת בכורה', dateToCompare, 3, 24, (err, activeProcess) => {
                                    if (err) done(err);
                                    else {
                                        assert.deepEqual(activeProcess.stages.length, 13);
                                        assert.deepEqual(activeProcess.getStageByStageNum(0).userEmail, 'negativevicemanager@outlook.co.il');
                                        assert.deepEqual(activeProcess.getStageByStageNum(1).nextStages, [6]);
                                        assert.deepEqual(activeProcess.getStageByStageNum(9).userEmail, 'negativevicemanager@outlook.co.il');
                                        assert.deepEqual(activeProcess.getStageByStageNum(14).userEmail, 'negativevicemanager@outlook.co.il');
                                        assert.deepEqual(activeProcess.getStageByStageNum(9).roleID.id, role.roleID.id);
                                        assert.deepEqual(activeProcess.getStageByStageNum(14).roleID.id, role.roleID.id);
                                        usersAndRolesController.getRoleByUsername('negativemanager@outlook.co.il', (err, role) => {
                                            if (err) done(err);
                                            else {
                                                assert.deepEqual(activeProcess.getStageByStageNum(1).roleID.id, role.roleID.id);
                                                assert.deepEqual(activeProcess.getStageByStageNum(10).roleID.id, role.roleID.id);
                                                done();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }).timeout(30000);
        });

        describe('1.12 getAvailableActiveProcessesByUser', function () {
            beforeEach(createTree1WithStructure1);
            it('1.1.1 The process is not available for anyone.', function (done) {
                activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה 1', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err1, result) => {
                    if (err1) {
                        done(err1);
                    }
                    else {
                        activeProcessController.getAvailableActiveProcessesByUser('negativevicemanager@outlook.co.il', (err2, availableProcesses) => {
                            if (err2) {
                                done(err2);
                            }
                            else {
                                assert.deepEqual(availableProcesses.length, 0);
                                done();
                            }
                        });
                    }
                });
            }).timeout(30000);
            it('1.1.2 The process is available for several people.', function (done) {
                activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה להקרנת בכורה 2', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err1, result) => {
                        if (err1) {
                            done(err1);
                        }
                        else {
                            activeProcessController.getAvailableActiveProcessesByUser('graphicartist@outlook.co.il', (err2, availableProcesses1) => {
                                    if (err2) {
                                        done(err2);
                                    }
                                    else {
                                        assert.deepEqual(availableProcesses1.length, 0);
                                        activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                                            comments: 'הערות של סגן מנהל נגטיב',
                                            2: 'on',
                                            processName: 'גרפיקה להקרנת בכורה 2'
                                        }, [], 'files', (err3) => {
                                            if (err3) {
                                                done(err3);
                                            }
                                            else {
                                                activeProcessController.getAvailableActiveProcessesByUser('negativemanager@outlook.co.il', (err4, availableProcesses2) => {
                                                    if (err2) {
                                                        done(err2);
                                                    }
                                                    else {
                                                        assert.deepEqual(availableProcesses2.length, 0);
                                                        activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                                                            comments: 'הערות של מנהל נגטיב',
                                                            1: 'on',
                                                            processName: 'גרפיקה להקרנת בכורה 2'
                                                        }, [], 'files', (err5) => {
                                                            if (err5) {
                                                                done(err5);
                                                            }
                                                            else {
                                                                activeProcessController.getAvailableActiveProcessesByUser('graphicartist@outlook.co.il', (err6, availableProcesses3) => {
                                                                    if (err6) {
                                                                        done(err6);
                                                                    }
                                                                    else {
                                                                        assert.deepEqual(availableProcesses3.length, 1);
                                                                        let availableProcess = availableProcesses3[0];
                                                                        assert.deepEqual(availableProcess.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                        assert.deepEqual(availableProcess.processName, 'גרפיקה להקרנת בכורה 2');
                                                                        assert.deepEqual(availableProcess.processUrgency, 3);
                                                                        done();
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            )
                        }
                    }
                )
            }).timeout(30000);
        });
        describe('1.13 getWaitingActiveProcessesByUser', function () {
            beforeEach(createTree1WithStructure1);
            it('1.2.1 Waiting processes for people.', function (done) {
                activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה ליום הסטודנט 1', new Date(2018, 11, 24, 10, 33, 30, 0), 2, (err1, result) => {
                    if (err1) {
                        done(err1);
                    }
                    else {
                        activeProcessController.getWaitingActiveProcessesByUser('graphicartist@outlook.co.il', (err2, waitingProcesses1) => {
                                if (err2) {
                                    done(err2);
                                }
                                else {
                                    assert.deepEqual(waitingProcesses1.length, 0);
                                    activeProcessController.getWaitingActiveProcessesByUser('negativevicemanager@outlook.co.il', (err3, waitingProcesses2) => {
                                            if (err3) {
                                                done(err3);
                                            }
                                            else {
                                                assert.deepEqual(waitingProcesses2.length, 1);
                                                let waitingProcess = waitingProcesses2[0];
                                                assert.deepEqual(waitingProcess.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                assert.deepEqual(waitingProcess.processName, 'גרפיקה ליום הסטודנט 1');
                                                assert.deepEqual(waitingProcess.processUrgency, 2);
                                                activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה ליום הסטודנט 2', new Date(2018, 11, 24, 10, 33, 30, 0), 3, (err, result) => {
                                                    if (err) done(err);
                                                    else {
                                                        activeProcessController.getWaitingActiveProcessesByUser('negativevicemanager@outlook.co.il', (err4, waitingProcesses3) => {
                                                            if (err4) {
                                                                done(err4);
                                                            }
                                                            else {
                                                                assert.deepEqual(waitingProcesses3.length, 2);
                                                                let waitingProcess1 = waitingProcesses3[0];
                                                                assert.deepEqual(waitingProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                assert.deepEqual(waitingProcess1.processName, 'גרפיקה ליום הסטודנט 1');
                                                                assert.deepEqual(waitingProcess1.processUrgency, 2);
                                                                let waitingProcess2 = waitingProcesses3[1];
                                                                assert.deepEqual(waitingProcess2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                assert.deepEqual(waitingProcess2.processName, 'גרפיקה ליום הסטודנט 2');
                                                                assert.deepEqual(waitingProcess2.processUrgency, 3);
                                                                activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                                                                    comments: 'הערות של סגן מנהל נגטיב',
                                                                    2: 'on',
                                                                    processName: 'גרפיקה ליום הסטודנט 1'
                                                                }, [], 'files', (err5) => {
                                                                    if (err5) {
                                                                        done(err5);
                                                                    }
                                                                    else {
                                                                        activeProcessController.getWaitingActiveProcessesByUser('negativemanager@outlook.co.il', (err6, waitingProcesses4) => {
                                                                            if (err6) {
                                                                                done(err6);
                                                                            }
                                                                            else {
                                                                                assert.deepEqual(waitingProcesses4.length, 1);
                                                                                let waitingProcess = waitingProcesses2[0];
                                                                                assert.deepEqual(waitingProcess.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                assert.deepEqual(waitingProcess.processName, 'גרפיקה ליום הסטודנט 1');
                                                                                assert.deepEqual(waitingProcess.processUrgency, 2);
                                                                                activeProcessController.getWaitingActiveProcessesByUser('negativevicemanager@outlook.co.il', (err7, waitingProcesses5) => {
                                                                                    if (err7) {
                                                                                        done(err7);
                                                                                    }
                                                                                    else {
                                                                                        assert.deepEqual(waitingProcesses5.length, 1);
                                                                                        let waitingProcess = waitingProcesses2[0];
                                                                                        assert.deepEqual(waitingProcess.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                        assert.deepEqual(waitingProcess.processName, 'גרפיקה ליום הסטודנט 1');
                                                                                        assert.deepEqual(waitingProcess.processUrgency, 2);
                                                                                        activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                                                                                            comments: 'הערות של מנהל נגטיב',
                                                                                            1: 'on',
                                                                                            processName: 'גרפיקה ליום הסטודנט 1'
                                                                                        }, [], 'files', (err8) => {
                                                                                            if (err8) {
                                                                                                done(err8);
                                                                                            }
                                                                                            else {
                                                                                                activeProcessController.getWaitingActiveProcessesByUser('negativemanager@outlook.co.il', (err9, waitingProcesses6) => {
                                                                                                    if (err9) {
                                                                                                        done(err9);
                                                                                                    }
                                                                                                    else {
                                                                                                        assert.deepEqual(waitingProcesses6.length, 0);
                                                                                                        done();
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        })
                                                    }
                                                });
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    }
                });
            }).timeout(30000);
        });
        describe('1.14 getAllActiveProcesses', function () {
            beforeEach(createTree1WithStructure1);
            it('1.3.1 Active processes of everyone.', function (done) {
                activeProcessController.getAllActiveProcesses((err, activeProcesses1) => {
                    if (err) {
                        done(err);
                    }
                    else {
                        assert.deepEqual(activeProcesses1.length, 0);
                        activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה ליום פרוייקטים 1', new Date(2018, 11, 24, 10, 33, 30, 0), 1, (err1, result1) => {
                            if (err1) {
                                done(err1);
                            }
                            else {
                                activeProcessController.getAllActiveProcesses((err2, activeProcesses2) => {
                                        if (err2) {
                                            done(err2);
                                        }
                                        else {
                                            assert.deepEqual(activeProcesses2.length, 1);
                                            let activeProcess1 = activeProcesses2[0];
                                            assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                            assert.deepEqual(activeProcess1.processName, 'גרפיקה ליום פרוייקטים 1');
                                            assert.deepEqual(activeProcess1.processUrgency, 1);
                                            assert.deepEqual(activeProcess1.currentStages, [3]);
                                            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה ליום פרוייקטים 2', new Date(2018, 11, 24, 10, 33, 30, 0), 2, (err3, result3) => {
                                                if (err3) done(err3);
                                                else {
                                                    activeProcessController.getAllActiveProcesses((err4, activeProcesses3) => {
                                                        if (err4) {
                                                            done(err4);
                                                        }
                                                        else {
                                                            assert.deepEqual(activeProcesses3.length, 2);
                                                            let activeProcess1 = activeProcesses3[0];
                                                            assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                            assert.deepEqual(activeProcess1.processName, 'גרפיקה ליום פרוייקטים 1');
                                                            assert.deepEqual(activeProcess1.processUrgency, 1);
                                                            assert.deepEqual(activeProcess1.currentStages, [3]);
                                                            let activeProcess2 = activeProcesses3[1];
                                                            assert.deepEqual(activeProcess2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                            assert.deepEqual(activeProcess2.processName, 'גרפיקה ליום פרוייקטים 2');
                                                            assert.deepEqual(activeProcess2.processUrgency, 2);
                                                            assert.deepEqual(activeProcess2.currentStages, [3]);
                                                            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                                                                comments: 'הערות של סגן מנהל נגטיב',
                                                                2: 'on',
                                                                processName: 'גרפיקה ליום פרוייקטים 1'
                                                            }, [], 'files', (err5) => {
                                                                if (err5) {
                                                                    done(err5);
                                                                }
                                                                else {
                                                                    activeProcessController.getAllActiveProcesses((err6, activeProcesses4) => {
                                                                        if (err6) {
                                                                            done(err6);
                                                                        }
                                                                        else {
                                                                            assert.deepEqual(activeProcesses4.length, 2);
                                                                            let activeProcess1 = activeProcesses4[0];
                                                                            assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                            assert.deepEqual(activeProcess1.processName, 'גרפיקה ליום פרוייקטים 1');
                                                                            assert.deepEqual(activeProcess1.processUrgency, 1);
                                                                            assert.deepEqual(activeProcess1.currentStages, [2]);
                                                                            let activeProcess2 = activeProcesses4[1];
                                                                            assert.deepEqual(activeProcess2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                            assert.deepEqual(activeProcess2.processName, 'גרפיקה ליום פרוייקטים 2');
                                                                            assert.deepEqual(activeProcess2.processUrgency, 2);
                                                                            assert.deepEqual(activeProcess2.currentStages, [3]);
                                                                            activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                                                                                comments: 'הערות של מנהל נגטיב',
                                                                                4: 'on',
                                                                                processName: 'גרפיקה ליום פרוייקטים 1'
                                                                            }, [], 'files', (err7) => {
                                                                                if (err7) {
                                                                                    done(err7);
                                                                                }
                                                                                else {
                                                                                    activeProcessController.getAllActiveProcesses((err8, activeProcesses5) => {
                                                                                        if (err8) {
                                                                                            done(err8);
                                                                                        }
                                                                                        else {
                                                                                            assert.deepEqual(activeProcesses5.length, 2);
                                                                                            let activeProcess1 = activeProcesses5[0];
                                                                                            assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                            assert.deepEqual(activeProcess1.processName, 'גרפיקה ליום פרוייקטים 1');
                                                                                            assert.deepEqual(activeProcess1.processUrgency, 1);
                                                                                            assert.deepEqual(activeProcess1.currentStages, [4]);
                                                                                            let activeProcess2 = activeProcesses5[1];
                                                                                            assert.deepEqual(activeProcess2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                            assert.deepEqual(activeProcess2.processName, 'גרפיקה ליום פרוייקטים 2');
                                                                                            assert.deepEqual(activeProcess2.processUrgency, 2);
                                                                                            assert.deepEqual(activeProcess2.currentStages, [3]);
                                                                                            activeProcessController.uploadFilesAndHandleProcess('publicitydepartmenthead@outlook.co.il', {
                                                                                                comments: 'הערות של רמד הסברה',
                                                                                                processName: 'גרפיקה ליום פרוייקטים 1'
                                                                                            }, [], 'files', (err9) => {
                                                                                                if (err9) {
                                                                                                    done(err9);
                                                                                                }
                                                                                                else {
                                                                                                    activeProcessController.getAllActiveProcesses((err10, activeProcesses6) => {
                                                                                                        if (err10) {
                                                                                                            done(err10);
                                                                                                        }
                                                                                                        else {
                                                                                                            assert.deepEqual(activeProcesses6.length, 1);
                                                                                                            let activeProcess1 = activeProcesses6[0];
                                                                                                            assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                                            assert.deepEqual(activeProcess1.processName, 'גרפיקה ליום פרוייקטים 2');
                                                                                                            assert.deepEqual(activeProcess1.processUrgency, 2);
                                                                                                            assert.deepEqual(activeProcess1.currentStages, [3]);
                                                                                                            done();
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    })
                                                }
                                            });
                                        }
                                    }
                                )
                            }
                        });
                    }
                });
            }).timeout(30000);
        });
        describe('1.15 getAllActiveProcessesByUser', function () {
            beforeEach(createTree1WithStructure1);
            it('1.4.1 Active processes of specific users.', function (done) {
                activeProcessController.getAllActiveProcessesByUser('negativevicemanager@outlook.co.il', (err, activeProcesses1) => {
                    if (err) {
                        done(err);
                    }
                    else {
                        assert.deepEqual(activeProcesses1.length, 0);
                        activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה לכבוד סיום התואר 1', new Date(2018, 11, 24, 10, 33, 30, 0), 1, (err1, result1) => {
                            if (err1) {
                                done(err1);
                            }
                            else {
                                activeProcessController.getAllActiveProcessesByUser('negativevicemanager@outlook.co.il', (err2, activeProcesses2) => {
                                        if (err2) {
                                            done(err2);
                                        }
                                        else {
                                            assert.deepEqual(activeProcesses2.length, 1);
                                            let activeProcess1 = activeProcesses2[0];
                                            assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                            assert.deepEqual(activeProcess1.processName, 'גרפיקה לכבוד סיום התואר 1');
                                            assert.deepEqual(activeProcess1.processUrgency, 1);
                                            assert.deepEqual(activeProcess1.currentStages, [3]);
                                            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה לכבוד סיום התואר 2', new Date(2018, 11, 24, 10, 33, 30, 0), 2, (err3, result3) => {
                                                if (err3) done(err3);
                                                else {
                                                    activeProcessController.getAllActiveProcessesByUser('negativevicemanager@outlook.co.il', (err4, activeProcesses3) => {
                                                        if (err4) {
                                                            done(err4);
                                                        }
                                                        else {
                                                            assert.deepEqual(activeProcesses3.length, 2);
                                                            let activeProcess1 = activeProcesses3[0];
                                                            assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                            assert.deepEqual(activeProcess1.processName, 'גרפיקה לכבוד סיום התואר 1');
                                                            assert.deepEqual(activeProcess1.processUrgency, 1);
                                                            assert.deepEqual(activeProcess1.currentStages, [3]);
                                                            let activeProcess2 = activeProcesses3[1];
                                                            assert.deepEqual(activeProcess2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                            assert.deepEqual(activeProcess2.processName, 'גרפיקה לכבוד סיום התואר 2');
                                                            assert.deepEqual(activeProcess2.processUrgency, 2);
                                                            assert.deepEqual(activeProcess2.currentStages, [3]);
                                                            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                                                                comments: 'הערות של סגן מנהל נגטיב',
                                                                2: 'on',
                                                                processName: 'גרפיקה לכבוד סיום התואר 1'
                                                            }, [], 'files', (err5) => {
                                                                if (err5) {
                                                                    done(err5);
                                                                }
                                                                else {
                                                                    activeProcessController.getAllActiveProcessesByUser('negativevicemanager@outlook.co.il', (err6, activeProcesses4) => {
                                                                        if (err6) {
                                                                            done(err6);
                                                                        }
                                                                        else {
                                                                            assert.deepEqual(activeProcesses4.length, 2);
                                                                            let activeProcess1 = activeProcesses4[0];
                                                                            assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                            assert.deepEqual(activeProcess1.processName, 'גרפיקה לכבוד סיום התואר 1');
                                                                            assert.deepEqual(activeProcess1.processUrgency, 1);
                                                                            assert.deepEqual(activeProcess1.currentStages, [2]);
                                                                            let activeProcess2 = activeProcesses4[1];
                                                                            assert.deepEqual(activeProcess2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                            assert.deepEqual(activeProcess2.processName, 'גרפיקה לכבוד סיום התואר 2');
                                                                            assert.deepEqual(activeProcess2.processUrgency, 2);
                                                                            assert.deepEqual(activeProcess2.currentStages, [3]);
                                                                            activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                                                                                comments: 'הערות של מנהל נגטיב',
                                                                                4: 'on',
                                                                                processName: 'גרפיקה לכבוד סיום התואר 1'
                                                                            }, [], 'files', (err7) => {
                                                                                if (err7) {
                                                                                    done(err7);
                                                                                }
                                                                                else {
                                                                                    activeProcessController.getAllActiveProcessesByUser('negativevicemanager@outlook.co.il', (err8, activeProcesses5) => {
                                                                                        if (err8) {
                                                                                            done(err8);
                                                                                        }
                                                                                        else {
                                                                                            assert.deepEqual(activeProcesses5.length, 2);
                                                                                            let activeProcess1 = activeProcesses5[0];
                                                                                            assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                            assert.deepEqual(activeProcess1.processName, 'גרפיקה לכבוד סיום התואר 1');
                                                                                            assert.deepEqual(activeProcess1.processUrgency, 1);
                                                                                            assert.deepEqual(activeProcess1.currentStages, [4]);
                                                                                            let activeProcess2 = activeProcesses5[1];
                                                                                            assert.deepEqual(activeProcess2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                            assert.deepEqual(activeProcess2.processName, 'גרפיקה לכבוד סיום התואר 2');
                                                                                            assert.deepEqual(activeProcess2.processUrgency, 2);
                                                                                            assert.deepEqual(activeProcess2.currentStages, [3]);
                                                                                            activeProcessController.uploadFilesAndHandleProcess('publicitydepartmenthead@outlook.co.il', {
                                                                                                comments: 'הערות של רמד הסברה',
                                                                                                processName: 'גרפיקה לכבוד סיום התואר 1'
                                                                                            }, [], 'files', (err9) => {
                                                                                                if (err9) {
                                                                                                    done(err9);
                                                                                                }
                                                                                                else {
                                                                                                    activeProcessController.getAllActiveProcessesByUser('negativevicemanager@outlook.co.il', (err10, activeProcesses6) => {
                                                                                                        if (err10) {
                                                                                                            done(err10);
                                                                                                        }
                                                                                                        else {
                                                                                                            assert.deepEqual(activeProcesses6.length, 1);
                                                                                                            let activeProcess1 = activeProcesses6[0];
                                                                                                            assert.deepEqual(activeProcess1.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                                            assert.deepEqual(activeProcess1.processName, 'גרפיקה לכבוד סיום התואר 2');
                                                                                                            assert.deepEqual(activeProcess1.processUrgency, 2);
                                                                                                            assert.deepEqual(activeProcess1.currentStages, [3]);
                                                                                                            done();
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    })
                                                }
                                            });
                                        }
                                    }
                                )
                            }
                        });
                    }
                });
            }).timeout(30000);
        });
        describe('1.16 getActiveProcessByProcessName', function () {
            beforeEach(createTree1WithStructure1);
            it('1.5.1 Active processes of specific process.', function (done) {
                activeProcessController.getActiveProcessByProcessName('אין תהליך כזה', (err, activeProcesses1) => {
                    if (err) {
                        done(err);
                    }
                    else {
                        assert.deepEqual(activeProcesses1, null);
                        activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה לכבוד סיום התואר הראשון 1', new Date(2018, 11, 24, 10, 33, 30, 0), 1, (err1, result1) => {
                            if (err1) {
                                done(err1);
                            }
                            else {
                                activeProcessController.getActiveProcessByProcessName('גרפיקה לכבוד סיום התואר הראשון 1', (err2, activeProcesses2) => {
                                        if (err2) {
                                            done(err2);
                                        }
                                        else {
                                            assert.deepEqual(activeProcesses2.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                            assert.deepEqual(activeProcesses2.processName, 'גרפיקה לכבוד סיום התואר הראשון 1');
                                            assert.deepEqual(activeProcesses2.processUrgency, 1);
                                            assert.deepEqual(activeProcesses2.currentStages, [3]);
                                            activeProcessController.startProcessByUsername('negativevicemanager@outlook.co.il', 'תהליך גרפיקה', 'גרפיקה לכבוד סיום התואר הראשון 2', new Date(2018, 11, 24, 10, 33, 30, 0), 2, (err3, result3) => {
                                                if (err3) done(err3);
                                                else {
                                                    activeProcessController.getActiveProcessByProcessName('גרפיקה לכבוד סיום התואר הראשון 2', (err4, activeProcesses3) => {
                                                        if (err4) {
                                                            done(err4);
                                                        }
                                                        else {
                                                            assert.deepEqual(activeProcesses3.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                            assert.deepEqual(activeProcesses3.processName, 'גרפיקה לכבוד סיום התואר הראשון 2');
                                                            assert.deepEqual(activeProcesses3.processUrgency, 2);
                                                            assert.deepEqual(activeProcesses3.currentStages, [3]);
                                                            activeProcessController.uploadFilesAndHandleProcess('negativevicemanager@outlook.co.il', {
                                                                comments: 'הערות של סגן מנהל נגטיב',
                                                                2: 'on',
                                                                processName: 'גרפיקה לכבוד סיום התואר הראשון 1'
                                                            }, [], 'files', (err5) => {
                                                                if (err5) {
                                                                    done(err5);
                                                                }
                                                                else {
                                                                    activeProcessController.getActiveProcessByProcessName('גרפיקה לכבוד סיום התואר הראשון 1', (err6, activeProcesses4) => {
                                                                        if (err6) {
                                                                            done(err6);
                                                                        }
                                                                        else {
                                                                            assert.deepEqual(activeProcesses4.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                            assert.deepEqual(activeProcesses4.processName, 'גרפיקה לכבוד סיום התואר הראשון 1');
                                                                            assert.deepEqual(activeProcesses4.processUrgency, 1);
                                                                            assert.deepEqual(activeProcesses4.currentStages, [2]);
                                                                            activeProcessController.uploadFilesAndHandleProcess('negativemanager@outlook.co.il', {
                                                                                comments: 'הערות של מנהל נגטיב',
                                                                                4: 'on',
                                                                                processName: 'גרפיקה לכבוד סיום התואר הראשון 1'
                                                                            }, [], 'files', (err7) => {
                                                                                if (err7) {
                                                                                    done(err7);
                                                                                }
                                                                                else {
                                                                                    activeProcessController.getActiveProcessByProcessName('גרפיקה לכבוד סיום התואר הראשון 1', (err8, activeProcesses5) => {
                                                                                        if (err8) {
                                                                                            done(err8);
                                                                                        }
                                                                                        else {
                                                                                            assert.deepEqual(activeProcesses5.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                            assert.deepEqual(activeProcesses5.processName, 'גרפיקה לכבוד סיום התואר הראשון 1');
                                                                                            assert.deepEqual(activeProcesses5.processUrgency, 1);
                                                                                            assert.deepEqual(activeProcesses5.currentStages, [4]);
                                                                                            activeProcessController.uploadFilesAndHandleProcess('publicitydepartmenthead@outlook.co.il', {
                                                                                                comments: 'הערות של רמד הסברה',
                                                                                                processName: 'גרפיקה לכבוד סיום התואר הראשון 1'
                                                                                            }, [], 'files', (err9) => {
                                                                                                if (err9) {
                                                                                                    done(err9);
                                                                                                }
                                                                                                else {
                                                                                                    activeProcessController.getActiveProcessByProcessName('גרפיקה לכבוד סיום התואר הראשון 2', (err10, activeProcesses6) => {
                                                                                                        if (err10) {
                                                                                                            done(err10);
                                                                                                        }
                                                                                                        else {
                                                                                                            assert.deepEqual(activeProcesses6.creatorUserEmail, 'negativevicemanager@outlook.co.il');
                                                                                                            assert.deepEqual(activeProcesses6.processName, 'גרפיקה לכבוד סיום התואר הראשון 2');
                                                                                                            assert.deepEqual(activeProcesses6.processUrgency, 2);
                                                                                                            assert.deepEqual(activeProcesses6.currentStages, [3]);
                                                                                                            done();
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    })
                                                }
                                            });
                                        }
                                    }
                                )
                            }
                        });
                    }
                });
            }).timeout(30000);

        });
        describe('1.17 replaceRoleIDWithRoleNameAndUserEmailWithUserName', function () {
            beforeEach(createTree1WithStructure1);
            it('1.6.1 Active processes of specific users.', function (done) {
                userAccessor.findRoleIDByRoleName('דובר', (err1, roleID1) => {
                    if (err1) {
                        done(err1);
                    }
                    else {
                        userAccessor.findRoleIDByRoleName('מנהל נגטיב', (err2, roleID2) => {
                            if (err2) {
                                done(err2);
                            }
                            else {
                                let processStages = [];
                                let activeProcessStage1 = new activeProcessStage({
                                    roleID: roleID1[0].id, kind: undefined, dereg: undefined,
                                    stageNum: undefined, nextStages: undefined,
                                    stagesToWaitFor: undefined,
                                    originStagesToWaitFor: undefined,
                                    userEmail: 'spokesperson@outlook.co.il',
                                    approvalTime: undefined, assignmentTime: undefined, notificationsCycle: undefined
                                });
                                let activeProcessStage2 = new activeProcessStage({
                                    roleID: roleID2[0].id, kind: undefined, dereg: undefined,
                                    stageNum: undefined, nextStages: undefined,
                                    stagesToWaitFor: undefined,
                                    originStagesToWaitFor: undefined,
                                    userEmail: 'negativemanager@outlook.co.il',
                                    approvalTime: undefined, assignmentTime: undefined, notificationsCycle: undefined
                                });
                                processStages.push(activeProcessStage1);
                                processStages.push(activeProcessStage2);
                                let activeProcess1 = new activeProcess({
                                    processName: 'ערב פוקר שבועי', creatorUserEmail: 'tomerlev1000@gmail.com',
                                    processDate: new Date(), processUrgency: 3, creationTime: new Date(),
                                    notificationTime: 12, automaticAdvanceTime: 12, currentStages: [3], onlineForms: [],
                                    filledOnlineForms: [], lastApproached: new Date(), stageToReturnTo: [1]
                                }, processStages);
                                activeProcessController.replaceRoleIDWithRoleNameAndUserEmailWithUserName([activeProcess1], (err, activeProcesses) => {
                                    if (err) {
                                        done(err);
                                    }
                                    else {
                                        assert.deepEqual(activeProcesses.length, 1);
                                        let firstStage = activeProcesses[0].stages[0];
                                        assert.deepEqual(firstStage.roleName, 'דובר');
                                        assert.deepEqual(firstStage.userName, 'דובר1');
                                        let secondStage = activeProcesses[0].stages[1];
                                        assert.deepEqual(secondStage.roleName, 'מנהל נגטיב');
                                        assert.deepEqual(secondStage.userName, 'מנהל נגטיב');
                                        done();
                                    }
                                });
                            }
                        });
                    }
                });
            }).timeout(30000);
        });
        describe('1.18 convertDate', function () {
            beforeEach(createTree1WithStructure1);
            it('1.7.1 Change the date conversion.', function (done) {
                let activeProcess1 = new activeProcess({
                    processName: 'ערב פוקר שבועי 1',
                    creatorUserEmail: undefined,
                    processDate: undefined,
                    processUrgency: undefined,
                    creationTime: new Date(2017, 10, 20, 10, 30, 30, 0),
                    notificationTime: undefined,
                    automaticAdvanceTime: undefined,
                    currentStages: undefined,
                    onlineForms: undefined,
                    filledOnlineForms: undefined,
                    lastApproached: new Date(2017, 10, 20, 10, 30, 30, 0),
                    stageToReturnTo: [1]
                }, []);
                let activeProcess2 = new activeProcess({
                    processName: 'ערב פוקר שבועי 2',
                    creatorUserEmail: undefined,
                    processDate: undefined,
                    processUrgency: undefined,
                    creationTime: new Date(2018, 11, 21, 11, 40, 30, 0),
                    notificationTime: undefined,
                    automaticAdvanceTime: undefined,
                    currentStages: undefined,
                    onlineForms: undefined,
                    filledOnlineForms: undefined,
                    lastApproached: new Date(2018, 11, 21, 11, 40, 30, 0),
                    stageToReturnTo: undefined
                }, []);
                let activeProcess3 = new activeProcess({
                    processName: 'ערב פוקר שבועי 3',
                    creatorUserEmail: undefined,
                    processDate: undefined,
                    processUrgency: undefined,
                    creationTime: new Date(2019, 12, 22, 12, 50, 30, 0),
                    notificationTime: undefined,
                    automaticAdvanceTime: undefined,
                    currentStages: undefined,
                    onlineForms: undefined,
                    filledOnlineForms: undefined,
                    lastApproached: new Date(2019, 12, 22, 12, 50, 30, 0),
                    stageToReturnTo: undefined
                }, []);
                let array = [activeProcess1, activeProcess2, activeProcess3];
                activeProcessController.convertDate(array);
                assert.deepEqual(array.length, 3);
                assert.deepEqual(array[0].creationTime, '20/11/2017 10:30:30');
                assert.deepEqual(array[0].lastApproached, '20/11/2017 10:30:30');
                assert.deepEqual(array[1].creationTime, '21/12/2018 11:40:30');
                assert.deepEqual(array[1].lastApproached, '21/12/2018 11:40:30');
                assert.deepEqual(array[2].creationTime, '22/01/2020 12:50:30');
                assert.deepEqual(array[2].lastApproached, '22/01/2020 12:50:30');
                done();
            });
        }).timeout(30000);
    });