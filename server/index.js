var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.send('<h1>Welcome Realtime Server</h1>');
});

//�����û�
var onlineUsers = {};
//��ǰ��������
var onlineCount = 0;

io.on('connection', function(socket){
	console.log('a user connected');
		
	//�������û�����
	socket.on('login', function(obj){
		//socket.name = obj.userid;
		
		if(onlineCount<2)
		{
			socket.join('player');
			socket.emit('getuser',{isFirst:1-onlineCount});
			onlineCount++;
			var m ="a user enter!current user num is "+onlineCount;
			io.sockets.in('player').emit('message',{content:m});
			if(onlineCount ==2)
				io.sockets.in('player').emit('start',{content:"game start!"});
			console.log("current_num"+onlineCount);
		}
		else
		{
			var m ="current users are too many!please wait...";
			socket.emit('message',{content:m});
		}
	});	
	socket.on('action', function(obj){
		socket.broadcast.to('player').emit('action',obj);
	});
	
	socket.on('disconnect', function() {
		
		if(onlineCount>0)onlineCount--;
		var m = "a user disconnect!";
		io.sockets.in('player').emit('message',{content:m});
		console.log("current_play:"+onlineCount);
		//console.log("connection break!");
});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});