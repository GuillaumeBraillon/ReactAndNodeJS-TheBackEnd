var express = require('express');
var router = express.Router();
var connection = require('../lib/db');

/*GET all users*/
router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM users ORDER BY id desc', function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

/*GET user by ID*/
router.get('/(:id)', function (req, res, next) {
    var user = { id: req.params.id }
    //console.log({ 'user by id': user });
    connection.query('SELECT * FROM users  WHERE id = ' + req.params.id, user, function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

/* UPDATE user by ID*/
router.post('/update/(:id)', function (req, res, next) {
    var user = {
        id: req.params.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        weekAvailable: req.body.weekAvailable
    }
    //console.log({ 'user to update': user });
    connection.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function (error, result) {
        if (error) throw error;
        //console.log("Record Updated: " + user);
        res.redirect(303, '/users');
    });
});

/* DELETE user by ID*/
router.delete('/delete/(:id)', function (req, res, next) {
    var user = { id: req.params.id }
    //console.log({ 'user to delete': user });
    connection.query('DELETE FROM users WHERE id = ' + req.params.id, user, function (error, result) {
        if (error) throw error;
        //console.log("Record deleted: " + user);
        res.redirect(303, '/users');
    });
});

/* ADD NEW USER*/
router.post('/add', function (req, res, next) {
    var user = {
        firstName: req.sanitize('firstName').escape().trim(),
        lastName: req.sanitize('lastName').escape().trim(),
        email: req.sanitize('email').escape().trim(),
        phoneNumber: req.sanitize('phoneNumber').escape().trim(),
        weekAvailable: req.sanitize('weekAvailable').escape().trim()
    }
    connection.query('INSERT INTO users SET ?', user, function (error, result) {
        if (error) throw error;
        //console.log("User added: " + user.firstName + " " + user.lastName);
        res.redirect('/users');
    })
});
module.exports = router;