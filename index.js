var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.send('<h1>Welcome Realtime Server</h1>');
});

//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;

io.on('connection', function(socket){
	console.log('a user connected');
		
	//监听新用户加入
	socket.on('login', function(obj){
		//将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
		socket.name = obj.userid;
		
		if(onlineCount<2)
		{
			socket.join('player');
			console.log('login');
			socket.emit('getuser',{isFirst:1-onlineCount});
			onlineCount++;
			var m ="a user enter!current user num is "+onlineCount;
			io.sockets.in('player').emit('message',{content:m});
			console.log(onlineCount);
		}
	});	
	socket.on('action', function(obj){
		socket.broadcast.to('player').emit('action',obj);
	});
	
	socket.on('disconnect', function() {
		
		if(onlineCount>0)onlineCount--;
		var m = "a user disconnect!";
		io.sockets.in('player').emit('message',{content:m});
		console.log("connection break!");
});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});