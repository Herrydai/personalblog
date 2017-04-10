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
		//���¼����û���Ψһ��ʶ����socket�����ƣ������˳���ʱ����õ�
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