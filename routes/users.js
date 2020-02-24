var express = require('express');
var router = express.Router();
var connection = require('../lib/db');

/* GET users page. NodeJs 
router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM users ORDER BY id desc', function (error, results, fields) {
        if (error) {
            req.flash('error', error);
            res.render('users', { page_title: "Users - Node.js", data: '' });
        } else {
            res.render('users', { page_title: "Users - Node.js", data: results });
        }
    });
});*/


/* DELETE user. NodeJS
router.get('/delete/(:id)', function (req, res, next) {
    var user = { id: req.params.id }

    connection.query('DELETE FROM users WHERE id = ' + req.params.id, user, function (error, result) {
        //if(error) throw error
        if (error) {
            req.flash('error', error)
            // redirect to users list page
            res.redirect('/users')
        } else {
            req.flash('success', 'User deleted successfully! id = ' + req.params.id)
            // redirect to users list page
            res.redirect('/users')
        }
    })
})*/

/*GET users page. from frontend*/
router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM users ORDER BY id desc', function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

/* DELETE user. from frontend*/
router.delete('/delete/(:id)', function (req, res, next) {
    var user = { id: req.params.id }
    console.log({ user: user });
    console.log(req.body);
    connection.query('DELETE FROM users WHERE id = ' + req.params.id, user, function (error, result) {
        if (error) throw error;
        console.log("Record deleted: " + user);
        res.redirect(303, '/users');
    });
});

/* ADD NEW USER POST ACTION from frontend*/
router.post('/add', function (req, res, next) {
    var user = {
        firstname: req.sanitize('firstname').escape().trim(),
        lastname: req.sanitize('lastname').escape().trim(),
        email: req.sanitize('email').escape().trim(),
        phonenumber: req.sanitize('phone').escape().trim(),
        weekavailable: req.sanitize('weekavailable').escape().trim()
    }
    console.log(req.body)
    connection.query('INSERT INTO users SET ?', user, function (error, result) {
        if (error) throw error;
        console.log("User added: " + user.firstname + " " + user.lastname);
        res.redirect('/users');
    })
});


/* ADD NEW USER POST ACTION NodeJS
router.post('/add', function (req, res, next) {
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
    console.log(req.body)
    var errors = req.validationErrors()

    if (!errors) {   //No errors were found.  Passed Validation!
        var user = {
            name: req.sanitize('name').escape().trim(),
            email: req.sanitize('email').escape().trim()
        }
        connection.query('INSERT INTO users SET ?', user, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to views/user/add.ejs
                res.render('users/add', {
                    title: 'Add New User',
                    name: user.name,
                    email: user.email
                })
            } else {
                req.flash('success', 'Data added successfully!');
                res.redirect('/users');
            }
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */
/*
res.render('users/add', {
    title: 'Add New User',
    name: req.body.name,
    email: req.body.email
})
}
})*/

// SHOW ADD USER FORM
router.get('/add', function (req, res, next) {
    // render to views/user/add.ejs
    res.render('users/add', {
        title: 'Add New Users',
        name: '',
        email: ''
    })
})

// SHOW EDIT USER FORM
router.get('/edit/(:id)', function (req, res, next) {

    connection.query('SELECT * FROM users WHERE id = ' + req.params.id, function (err, rows, fields) {
        if (err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Users not found with id = ' + req.params.id)
            res.redirect('/users')
        }
        else { // if user found
            // render to views/user/edit.ejs template file
            res.render('users/edit', {
                title: 'Edit User',
                //data: rows[0],
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email
            })
        }
    })

})

// EDIT USER POST ACTION
router.post('/update/:id', function (req, res, next) {
    req.assert('name', 'Name is required').notEmpty()           //Validate nam           //Validate age
    req.assert('email', 'A valid email is required').isEmail()  //Validate email

    var errors = req.validationErrors()

    if (!errors) {

        var user = {
            name: req.sanitize('name').escape().trim(),
            email: req.sanitize('email').escape().trim()
        }

        connection.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to views/user/add.ejs
                res.render('users/edit', {
                    title: 'Edit User',
                    id: req.params.id,
                    name: req.body.name,
                    email: req.body.email
                })
            } else {
                req.flash('success', 'Data updated successfully!');
                res.redirect('/users');
            }
        })

    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */
        res.render('users/edit', {
            title: 'Edit User',
            id: req.params.id,
            name: req.body.name,
            email: req.body.email
        })
    }
})



module.exports = router;
