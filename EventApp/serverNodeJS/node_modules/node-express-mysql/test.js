var app=require('express')()
app.use('/ourdb',require('./index.js')(require('./settings.json')))

require('http').createServer(app).listen(3351)

require('request').get('http://127.0.0.1:3351/ourdb/rows?query=update email from users',function(err,obj,body){
	console.log('RESPONSE:',body)
	process.exit();
})