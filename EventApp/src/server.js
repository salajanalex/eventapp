const express = require('express');  // used to setup the express framework. Equivalent for typescript " import express from 'express'; "  statement
const app = express();
var mysql = require('mysql');

var connection = mysql.createPool({
    //properties...
    connectionLimit: 50,
    host: 'localhost',
    user: 'root',
    password: 'megabas',
    database: 'eventdb'

});

app.listen(8000, () => {
    console.log('Server started!');
});

/**
 * CRUD FOR USER
 */

//structure needed to create new Users
var User = function (usertype, firstname, lastname, email, password) {
    this.usertype = usertype;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
}

/**
 * GET ALL USERS
 */
app.route('/api/users').get((req, res) => {
    connection.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error in the query');
        }
        else {
            console.log('Connected!');
            tempCont.query('SELECT * FROM user', function (error, rows, fields) {
                tempCont.release();
                if (error) {
                    console.log('Error in the query!');
                }
                else {
                    res.json(rows);
                }
            });
        }
    });
});

/**
 * SELECT USER WITH GIVEN ID AND SPECIFIC TYPE 
 * Id is given as Path param and type is hard-coded.
 */
app.route('/api/users/get/:id').get((req, res) => {
    const requestedID = req.params['id'];
    var userType = "admin";

    if (isNaN(requestedID)) {
        console.log("Given ID is not a valid number"); // console.log() does not log to browser console.
        return;
    }
    connection.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error in the query');
        }
        else {
            console.log('Connected!');
            tempCont.query("SELECT * FROM user WHERE iduser=? AND usertype=?;", [requestedID, userType], function (error, rows, fields) {
                tempCont.release();
                if (error) {
                    console.log('Error in the query!');
                }
                else {
                    res.json(rows);
                }
            });
        }
    });
});


/**
 * CREATE NEW USER
 */
app.route('/api/users/new').post((req, res) => {

    var user = new User("aaa", "aaa", "aaa", "aaa", "aaa");

    connection.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error in the query');
        }
        else {
            console.log('Connected!');
            tempCont.query("INSERT INTO user (usertype, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?);",
                [user.usertype, user.firstname, user.lastname, user.email, user.password], function (error, rows, fields) {
                    tempCont.release();
                    if (error) {
                        console.log('Error in the query!');
                    }
                    else {
                        res.json(rows);
                    }
                });
        }
    });
});


/**
 * UPDATE USER WITH GIVEN ID
 */
app.route('/api/users/update/:id').put((req, res) => {
    const requestedID = req.params['id'];

    if (isNaN(requestedID)) {
        console.log("Given ID is not a valid number"); // console.log() does not log to browser console.
        return;
    }

    var updatedUser = new User("bbb", "bbb", "bbb", "bbb", "bbb");

    connection.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error in the query');
        }
        else {
            console.log('Connected!');
            tempCont.query("UPDATE user SET usertype=?, firstname=?, lastname=?, email=?, password=? WHERE iduser=? ;",
                [updatedUser.usertype, updatedUser.firstname, updatedUser.lastname, updatedUser.email, updatedUser.password, requestedID], function (error, rows, fields) {
                    tempCont.release();
                    if (error) {
                        console.log('Error in the query!');
                    }
                    else {
                        res.json(rows);
                    }
                });
        }
    });
});

/**
 * DELETE USER BY ID
 */
app.route('/api/users/delete/:id').delete((req, res) => {
    const requestedID = req.params['id'];

    if (isNaN(requestedID)) {
        console.log("Given ID is not a valid number"); // console.log() does not log to browser console.
        return;
    }
    connection.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error in the query');
        }
        else {
            console.log('Connected!');
            tempCont.query("DELETE FROM user WHERE iduser=? ;", [requestedID], function (error, rows, fields) {
                tempCont.release();
                if (error) {
                    console.log('Error in the query!');
                }
                else {
                    res.json(rows);
                }
            });
        }
    });
});




/**___________________________________________________________________________________________________________
 * CRUD FOR TICKET
 */

/**
 * GET TICKET WITH GIVEN ID
 */
app.route('/api/ticket/:id').get((req, res) => {
    const requestedID = req.params['id'];

    if (isNaN(requestedID)) {
        console.log("Given ID is not a valid number"); // console.log() does not log to browser console.
        return;
    }
    connection.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error in the query');
        }
        else {
            console.log('Connected!');
            tempCont.query("SELECT * FROM ticket WHERE idticket=? ;", [requestedID], function (error, rows, fields) {
                tempCont.release();
                if (error) {
                    console.log('Error in the query!');
                }
                else {
                    res.json(rows);
                }
            });
        }
    });
});

/**
 * GET ALL TICKETS OF AN USER
 */



/**
 * GET ALL TICKETS OF AN EVENT
 */


