var Game = 
{
	LENGTH : 5 ,
	oppositePos : null,//used to mark the current pos of opponent's
	current_player:true,
	score1 : 0,
	score2 : 0,
	lock : true,//forbid the user's touch
	first_player : true,
	socket : null,

	addScore : function(cur,getscore)
	{
		if(!getscore)return;
		if(cur)
		{
			Game.score1=Game.score1+getscore;
			$('#user1').text("玩家1："+Game.score1);
		}
		else
		{
			Game.score2=Game.score2+getscore;
			$('#user2').text("玩家2："+Game.score2);
		}
	},
	//check if it is a square
	checkBox : function(x,y,type,cur)
		{
			var changed=false;
			var getscore = 0;
			var color = cur?"#aeeeee":"#eeee00";
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
			Game.addScore(cur,getscore);
			changed = getscore?true:false;
			return changed;
		},
	
//connection fuction
	initConnect : function()
		{
			Game.socket = io.connect('ws://localhost:3000');
			Game.socket.emit('login', {});
			Game.socket.on('getuser',function(o){
				Game.first_player=o.isFirst;	
			});
			Game.socket.on('action', function(o){
				
				if(!o.notchange)
				{
					Game.lock = !Game.lock;
					Game.current_player=!o.cur;
					var m =(Game.first_player!=Game.current_player)?"对方回合":"你的回合";
					$('#cur_user').text(m);
				}
				if(Game.oppositePos)
				{
					$(Game.oppositePos).removeClass('color_current');
					Game.oppositePos=null;
				}
				Game.oppositePos = '#'+o.action+o.x+o.y;
				var role=o.cur?1:2;
				$(Game.oppositePos).removeClass('color_default')
					.addClass('color_click_'+role)
					.addClass('color_current')
					.attr("value",role);
				
				Game.checkBox(o.x,o.y,o.action,o.cur);
				Game.isGameOver();
			});
			Game.socket.on('message',function(m){				
				$('<div>')
					.addClass("message")
					.text(m.content)
					.prependTo('#message-box');
			});
			Game.socket.on('start',function(){
				if(Game.first_player)
					Game.lock =false;
				var m =(Game.first_player!=Game.current_player)?"对方回合":"你的回合";
				$('#cur_user').text(m);
				var str=Game.first_player?"你是玩家1":"你是玩家2";
				console.log(str);
				$('<div>')
					.addClass("message")
					.text(str)
					.prependTo('#message-box');
			});
		},
		
	initUI : function()
		{
			var containLen = $(document).width()-20;
			containLen = containLen>360?360:containLen;
			$('#container').css({
				'width':containLen,
				'height':containLen,
			});
			$('#score').css('width',containLen);
			$('#message').css('width',containLen);
			var lineLen = containLen/Game.LENGTH;
			$('#user1').text("玩家1：0");
			$('#user2').text("玩家2：0");
			for (var y= 0;y<Game.LENGTH+1;y++)
			{
				for(var x = 0;x<Game.LENGTH+1;x++)
				{
					if(x!=Game.LENGTH)
					{
						$('<div></div>')
							.addClass("color_default row")
							.css({"left":x*lineLen+"px",
								"top":y*lineLen +"px",
								"width":lineLen+"px"})
							.attr("id",'row'+x+y)
							.attr("value",0)
							.appendTo('#container');
					}
					if(y!=Game.LENGTH)
					{
						$('<div></div>')
							.addClass("color_default col")
							.css({"left":x*lineLen+"px",
								"top":y*lineLen +"px",
								"height":lineLen+"px"})
							.attr("id",'col'+x+y)
							.attr("value",0)
							.appendTo('#container');
					}
					if(y!=Game.LENGTH&&x!=Game.LENGTH)
					{
						$('<div></div>')
							.addClass("box")
							.css({"left":(x*lineLen+5)+"px",
								"top":(y*lineLen+5) +"px",
								"width":(lineLen-5)+"px",
								"height":(lineLen-5)+"px"
								})
							.attr("id",'box'+x+y)
							.appendTo('#container');
					}
					
				}
			}
		},
		
	isGameOver : function()
		{
			if(Game.score1+Game.score2==Game.LENGTH*Game.LENGTH)
			{
				alert("玩家"+(Game.score1>Game.score2?'1':'2')+'获胜');
			}
		},
		
	init : function()
	{
		Game.score1=0;
		Game.score2=0;
		Game.initConnect();
		Game.initUI();
		$('.row ,.col').bind('click',function(){
			if($(this).hasClass('color_default')&&!Game.lock)
			{
				if(Game.oppositePos)
				{
					$(Game.oppositePos).removeClass('color_current');
					Game.oppositePos=null;
				}
				$(this).removeClass('color_default');
				var count=Game.current_player?1:2;
				$(this).addClass('color_click_'+count);
				$(this).attr("value",count);
				xIndex=Number.parseInt($(this).attr('id').substring(3,4));
				yIndex=Number.parseInt($(this).attr('id').substring(4,5));
				var act=($(this).hasClass('row')?'row':'col');
				var continueGo=Game.checkBox(xIndex,yIndex,act,Game.current_player);
				
				// emit the action
				var param={
					x:xIndex,
					y:yIndex,
					action:act,
					notchange:continueGo,
					cur:Game.current_player
				};
				Game.socket.emit('action',param);
				
				if(!continueGo)
				{
					Game.lock = !Game.lock;
					Game.current_player = !Game.current_player;
					var m =(Game.first_player!=Game.current_player)?"对方回合":"你的回合";
					$('#cur_user').text(m);
				}
				Game.isGameOver();
			}
		});
	}
}
$(function(){
	Game.init();
});
