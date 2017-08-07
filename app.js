var app = require('express')();
app.set('view engine','ejs');
var port = process.env.PORT || 3030;
var server = app.listen(port,function(){
	console.log('App is listening to port ',port);
});
var io = require('socket.io')(server);
app.use(require('express').static('assets'));

app.get('/chat',function(req,res){
	res.render('index');
		
});
app.get('/',function(req,res){
	res.send('Go to Chat Page <a href =/chat> Chat Here </a>');
});
var users=[];

io.of('/chat').on('connection', function(socket){
	console.log("A client connected")
	socket.on('new user',function(data){
		socket.username = data;
		users.push(socket.username);
		socket.broadcast.emit('read message',{'user':'<b style="color:#2e7d32"> CHAT BOT</b>','msg' : socket.username+' has joined the conversation'});
		update();

	});
	
	socket.on('new message',function(data){
		io.of('/chat').emit('read message',data);
		socket.broadcast.emit('sound','got');
	})
	function update(){
		io.of('/chat').emit('online',users);

	}
	socket.on('disconnect',function(){
		console.log("A user disconnected");
		if(socket.username){
			users.splice(users.indexOf(socket.username),1);
			socket.broadcast.emit('read message',{'user':'<b style="color:#2e7d32"> CHAT BOT</b>','msg' : socket.username+' has left the conversation'});
		}
		
		update()
	})
});

