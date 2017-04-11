var current_player=true;
var score1=0,score2=0;
var socket=null;
var lock=true;
var first_player=true;
var currentpos = null;

function addScore(current_player,getscore)
{
	if(!getscore)return;
	if(current_player)
	{
		score1=score1+getscore;
		$('#user1').text("玩家1："+score1);
	}
	else
	{
		score2=score2+getscore;
		$('#user2').text("玩家2："+score2);
	}
}
//check if it is a square
function checkBox(x,y,type,current_player)
{
	var changed=false;
	var getscore = 0;
	var color = current_player?"#aeeeee":"#eeee00";
	if(type == "row")
	{
		
		if($('#row'+x+''+(y-1)).attr("value")&&$('#col'+x+''+(y-1)).attr("value")&&$('#col'+(x+1)+''+(y-1)).attr("value"))
		{
			$('#box'+x+''+(y-1)).css("background-color",color);
			getscore++;
		}
		if($('#row'+x+''+(y+1)).attr("value")&&$('#col'+x+''+y).attr("value")&&$('#col'+(x+1)+''+y).attr("value"))
		{
			
			$('#box'+x+''+''+y).css("background-color",color);
			getscore++;
		}
	}
	else if(type == "col")
	{
		if($('#row'+(x-1)+''+y).attr("value")&&$('#row'+(x-1)+''+(y+1)).attr("value")&&$('#col'+(x-1)+''+y).attr("value"))
		{
			$('#box'+(x-1)+''+y).css("background-color",color);
			getscore++;
		}
		if($('#row'+x+''+y).attr("value")&&$('#row'+x+''+(y+1)).attr("value")&&$('#col'+(x+1)+''+y).attr("value"))
		{
			$('#box'+x+''+''+y).css("background-color",color);
			getscore++;
		}
	}
	addScore(current_player,getscore);
	changed = getscore?true:false;
	return changed;
}
	
//connection fuction
function initconnect()
{
	socket = io.connect('ws://localhost:3000');
	var Uid=new Date().getTime()+""+Math.floor(Math.random()*899+100);
	socket.emit('login', {userid:Uid, username:22222});
	socket.on('getuser',function(o){
		first_player=o.isFirst;
		//lock = !first_player;	
	});
	socket.on('action', function(o){
		
		if(!o.notchange)
		{
			lock = !lock;
			current_player=!o.cur;
			var m =(first_player-current_player)?"对方回合":"你的回合";
			$('#cur_user').text(m);
		}
		if(currentpos)
		{
			$(currentpos).removeClass('color_current');
			currentpos=null;
		}
		currentpos = '#'+o.action+o.x+o.y;
		$(currentpos).removeClass('color_default');
		var count=o.cur?1:2;
		$(currentpos).addClass('color_click_'+count);
		$(currentpos).addClass('color_current');
		$(currentpos).attr("value",count);
		
		checkBox(o.x,o.y,o.action,o.cur);
		isGameOver();
	});
	socket.on('message',function(m){		
		var div = $('<div></div>');
		div.addClass("message");
		div.text(m.content);
		$('#message-box').prepend(div);
	});
	socket.on('start',function(m){
		if(first_player)
			lock =false;
		var div = $('<div></div>');
		div.addClass("message");
		div.text(m.content);
		$('#message-box').prepend(div);
		var m =(first_player-current_player)?"对方回合":"你的回合";
		$('#cur_user').text(m);
	});
}
function initcontainer()
{
	score1=0;score2=0;
	$('#user1').text("玩家1：0");
	$('#user2').text("玩家2：0");
	for (var y= 0;y<8;y++)
	{
		for(var x = 0;x<8;x++)
		{
			if(x!=7)
			{
				var temp1=$('<div></div>');
				temp1.addClass("color_default row");
				temp1.css("left",x*40+"px");
				temp1.css("top", y*40 +"px");
				temp1.attr("id",'row'+x+y);
				temp1.attr("value",0);
				$('#container').append(temp1);
			}
			if(y!=7)
			{
				var temp2=$('<div></div>');
				temp2.addClass("color_default col");
				temp2.css("left",x*40+"px");
				temp2.css("top", y*40 +"px");
				temp2.attr("id",'col'+x+y);
				temp2.attr("value",0);
				$('#container').append(temp2);
			}
			if(y!=7&&x!=7)
			{
				var temp=$('<div></div>');
				temp.addClass("box");
				temp.css("left",(x*40+5)+"px");
				temp.css("top", (y*40+5) +"px");
				temp.attr("id",'box'+x+y);
				$('#container').append(temp);
			}
			
		}
	}
}
		
function isGameOver()
{
	if(score1+score2==49)
	{
		alert("玩家"+(score1>score2?'1':'2')+'获胜');
	}
}
initconnect();
initcontainer();
$('.row ,.col').bind('click',function()
{
	if($(this).hasClass('color_default')&&!lock)
	{
		if(currentpos)
		{
			$(currentpos).removeClass('color_current');
			currentpos=null;
		}
		$(this).removeClass('color_default');
		var count=current_player?1:2;
		$(this).addClass('color_click_'+count);
		$(this).attr("value",count);
		xIndex=Number.parseInt($(this).attr('id').substring(3,4));
		yIndex=Number.parseInt($(this).attr('id').substring(4,5));
		var act=($(this).hasClass('row')?'row':'col');
		var continueGo=checkBox(xIndex,yIndex,act,current_player);
		
		// emit the action
		var param={x:xIndex,y:yIndex,action:act,notchange:continueGo,cur:current_player};
		socket.emit('action',param);
		
		if(!continueGo)
		{
			lock = !lock;
			current_player = !current_player;
			var m =(first_player-current_player)?"对方回合":"你的回合";
			$('#cur_user').text(m);
		}
		isGameOver();
	}
});
