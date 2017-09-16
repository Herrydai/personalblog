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
var FirstSocket = null;
var SecondSocket = null;
io.on('connection', function(socket){
	console.log('a user connected');
	console.log(socket.id);
	if(onlineCount==0)
		FirstSocket = socket;
	if(onlineCount==1)
		SecondSocket = socket;
	//监听新用户加入
	socket.on('login', function(obj){
		if(onlineCount<2)
		{
			socket.join('player');
			socket.emit('getuser',{isFirst:1-onlineCount});
			onlineCount++;
			var m ="一个用户进入房间！当前人数为 "+onlineCount;
			io.sockets.in('player').emit('message',{content:m});
			if(onlineCount ==2)
			{
				io.sockets.in('player').emit('start',{});
				io.sockets.in('player').emit('message',{content:"游戏开始!"});
			}
			console.log("current_num"+onlineCount);
		}
		else
		{
			var m ="当前玩家数太多!请等待...";
			socket.emit('message',{content:m});
		}
	});	
	socket.on('action', function(obj){
		socket.broadcast.to('player').emit('action',obj);
	});
	
	socket.on('disconnect', function() {
		
		if(onlineCount>0)onlineCount--;
		var m = "有玩家断开连接!";
		io.sockets.in('player').emit('message',{content:m});
		console.log("current_play:"+onlineCount);
		if(socket==FirstSocket&&onlineCount == 1)
		{
			FirstSocket = SecondSocket;
			SecondSocket = null;
			FirstSocket.emit('getuser',{isFirst:true});
		}
});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});