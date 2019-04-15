const express = require('express');  // used to setup the express framework. Equivalent for typescript " import express from 'express'; "  statement
const app = express();
var mysql = require('mysql');

// needed so we can get the body of the request
// run $ npm install --save body-parser       command if it does not work
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

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
//for new user
var User = function (usertype, firstname, lastname, email, password) {
    this.usertype = usertype;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
}

// for Update user
var UserWithID = function (iduser, usertype, firstname, lastname, email, password) {
    this.iduser = iduser;
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
 * body of request must contain the JSON of the object
 */
app.route('/api/users/new').post((req, res) => {

    var body = req.body;
    var user = new User(body.usertype, body.firstname, body.lastname, body.email, body.password);

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
 * UPDATE USER
 * body of request must contain the JSON of the object, including id
 */
app.route('/api/users/update').put((req, res) => {
    // const requestedID = req.params['id'];

    var body = req.body;
    var updatedUser = new UserWithID(body.iduser, body.usertype, body.firstname, body.lastname, body.email, body.password);

    connection.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error in the query');
        }
        else {
            console.log('Connected!');
            tempCont.query("UPDATE user SET usertype=?, firstname=?, lastname=?, email=?, password=? WHERE iduser=? ;",
                [updatedUser.usertype, updatedUser.firstname, updatedUser.lastname, updatedUser.email, updatedUser.password, updatedUser.iduser], function (error, rows, fields) {
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

/**
 * More to add:  
 * Get Users of a specific type
 * 
 */


/**___________________________________________________________________________________________________________
 * CRUD FOR TICKET
 */

 /**
  * structure needed for ticket objects
  * for new ticket
  */
 var Ticket = function (type, price, idevent, iduser) {
    this.type = type;
    this.price = price;
    this.idevent = idevent;
    this.iduser = iduser;
}

// For update Ticket
var TicketWithID = function (idticket, type, price, idevent, iduser) {
    this.idticket = idticket;
    this.type = type;
    this.price = price;
    this.idevent = idevent;
    this.iduser = iduser;
}

/**
 * GET TICKET WITH GIVEN ID
 */
app.route('/api/tickets/:id').get((req, res) => {
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
 * ADD NEW TICKET
 * body of request must contain the JSON of the object
 */

 app.route('/api/tickets/new').post((req, res) => {

    var body = req.body;
    var ticket = new Ticket(body.type, body.price, body.idevent, body.iduser);

    connection.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error in the query');
        }
        else {
            console.log('Connected!');
            tempCont.query("INSERT INTO ticket (type, price, idevent, iduser) VALUES (?, ?, ?, ?);",
                [ticket.type, ticket.price, ticket.idevent, ticket.iduser], function (error, rows, fields) {
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
 * UPDATE TICKET
 * body of request must contain the JSON of the object including ID
 */
app.route('/api/tickets/update').put((req, res) => {

    var body = req.body;
    var updatedTicket  = new TicketWithID(body.idticket, body.type, body.price, body.idevent, body.iduser);
    

    connection.getConnection(function (error, tempCont) {
        if (error) {
            tempCont.release();
            console.log('Error in the query');
        }
        else {
            console.log('Connected!');
            tempCont.query("UPDATE ticket SET type=?, price=?, idevent=?, iduser=? WHERE idticket=? ;",
                [updatedTicket.type, updatedTicket.price, updatedTicket.idevent, updatedTicket.iduser, updatedTicket.idticket], function (error, rows, fields) {
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
 * DELETE TICKET BY ID
 */
app.route('/api/tickets/delete/:id').delete((req, res) => {
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
            tempCont.query("DELETE FROM ticket WHERE idticket=? ;", [requestedID], function (error, rows, fields) {
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


