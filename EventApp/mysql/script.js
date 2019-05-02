// pentru a rula serveru faceti git bash in folderul aplicatieti(EventApp/mysql) si scrieti "node script.js"
// deschideti pe localhost:4000

var express = require('express'); 
var mysql = require('mysql');
var app = express();

var connection = mysql.createPool({ //folosim createPool pt a reduce nr de requesturi de catre useri (setam o limita pt requesturile care intra pe server)
    //properties...
    connectionLimit: 50, // am setat numarul cu 50 de exemplu 
    host: 'localhost',
    user: 'root',
    password: 'MyNewPass',
    database: 'eventdb'

});

// Un get pt toti useri
app.get('', function (req,resp){
    //about mysql

    connection.getConnection(function(error, tempCont){
        if(error){
            tempCont.release();
            console.log('Error in the query');
        }
        else{
            console.log('Connected!');
            tempCont.query('SELECT * FROM user',function(error,rows,fields){
                tempCont.release();
                if(error){
                    console.log('Error in the query!');
                }
                else{
                    resp.json(rows);
                }
            });
        }
    });

})

app.listen('4000', () => {
    console.log('Server started on port 4000');
});