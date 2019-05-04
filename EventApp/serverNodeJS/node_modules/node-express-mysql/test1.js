var app=require('express')()

app.use('/ourdb',require('./index.js')(require('./settings.json')))

require('http').createServer(app).listen(3343)

// require('request').get('http://127.0.0.1:3342/ourdb/tables',function(err,obj,body){
// 	console.log('RESPONSE:',body)
// 	process.exit();
// })