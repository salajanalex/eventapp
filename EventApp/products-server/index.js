//pornim server cu nodemon server
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();


const SELECT_ALL_USER_QUERY = 'SELECT * FROM user';
const SELECT_ALL_TICKETS_QUERY = 'SELECT * FROM ticket';
const SELECT_ALL_EVENTS_QUERY = 'SELECT * FROM event';

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'eventdb'
})

connection.connect(err =>{
    if(err){
        return err;
    }
});



app.use(cors());

app.get('/',(req,res)=>{
res.send('go to /users to see users')
})

app.get('/users/add',(req,res)=>{
    const{ iduser,usertype,firstname,lastname,email,password} = req.query;
  const INSERT_USER_QUERY = `INSERT INTO user (iduser,usertype,firstname,lastname,email,password) VALUES ('${iduser}','${usertype}','${firstname}','${lastname}','${email}','${password}')`;
  connection.query(INSERT_USER_QUERY,(err,results)=>{
      if(err){
          return res.send(err)
      }
      else{
          return res.send('successfully added user')
      }
  })
})

app.get('/tickets/add',(req,res)=>{
    const{ idticket,type,price,idevent,iduser} = req.query;
  const INSERT_TICKET_QUERY = `INSERT INTO ticket (idticket,type,price,idevent,iduser) VALUES ('${idticket}','${type}','${price}','${idevent}','${iduser}')`;
  connection.query(INSERT_TICKET_QUERY,(err,results)=>{
      if(err){
          return res.send(err)
      }
      else{
          return res.send('successfully added user')
      }
  })
})

app.get('/events/add',(req,res)=>{
    const{ idevent,name,description,idvenue,idcategory} = req.query;
  const INSERT_EVENT_QUERY = `INSERT INTO event (idevent,name,description,idvenue,idcategory) VALUES ('${idevent}','${name}','${description}','${idvenue}','${idcategory}')`;
  connection.query(INSERT_EVENT_QUERY,(err,results)=>{
      if(err){
          return res.send(err)
      }
      else{
          return res.send('successfully added user')
      }
  })
})

app.get('/users',(req,res) =>{
    connection.query(SELECT_ALL_USER_QUERY,(err,results)=>{
        if(err){
            return res.send(err);
        }
        else{
            res.json({
                data: results
            })
        }
       })
})

app.get('/tickets',(req,res) =>{
    connection.query(SELECT_ALL_TICKETS_QUERY,(err,results)=>{
        if(err){
            return res.send(err);
        }
        else{
            res.json({
                data: results
            })
        }
       })
})


app.get('/events',(req,res) =>{
    connection.query(SELECT_ALL_EVENTS_QUERY,(err,results)=>{
        if(err){
            return res.send(err);
        }
        else{
            res.json({
                data: results
            })
        }
       })
})

app.listen(4000,()=>{

    console.log(`server listens on  port 4000`)
    
}) 