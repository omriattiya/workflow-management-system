var express = require('express');
var router = express.Router();
var passportGoogle = require('../auth/google');

/* LOGIN ROUTER */
router.get('/login', function (req, res, next) {
    res.render('login', {title: 'Please Sign In with:'});
});

/* LOGOUT ROUTER */
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

/* GOOGLE ROUTER */
router.get('/google',
    passportGoogle.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.email']}));

router.get('/google/callback',
    passportGoogle.authenticate('google', {failureRedirect: '/NotAgudaEmployee'}),
    function (req, res) {
        res.redirect('/usersLogin');
    });

module.exports = router;
