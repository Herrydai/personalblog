var current_player=true;
var score1=0,score2=0;
function initcontainer()
{
	score1=0;score2=0;
	$('#user1').text("玩家1：0");
	$('#user2').text("玩家2：0");
	for (var y= 0;y<10;y++)
	{
		for(var x = 0;x<10;x++)
		{
			if(x!=9)
			{
				var temp1=$('<div></div>');
				temp1.addClass("color_default row");
				temp1.css("left",x*40+"px");
				temp1.css("top", y*40 +"px");
				temp1.attr("id",'row'+x+y);
				temp1.attr("value",0);
				$('#container').append(temp1);
			}
			if(y!=9)
			{
				var temp2=$('<div></div>');
				temp2.addClass("color_default col");
				temp2.css("left",x*40+"px");
				temp2.css("top", y*40 +"px");
				temp2.attr("id",'col'+x+y);
				temp2.attr("value",0);
				$('#container').append(temp2);
			}
			if(y!=9&&x!=9)
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
function checkBox(x,y,type,current_player)
{
	var changed=false;
	if(type == "row")
	{
		
		if($('#row'+x+''+(y-1)).attr("value")&&$('#col'+x+''+(y-1)).attr("value")&&$('#col'+(x+1)+''+(y-1)).attr("value"))
		{
			if(current_player)
			{
				$('#box'+x+''+(y-1)).css("background-color","#aeeeee");
				score1=score1+1;
				$('#user1').text("玩家1："+score1);
			}
			else
			{
				$('#box'+x+''+(y-1)).css("background-color","#eeee00");
				score2=score2+1;
				$('#user2').text("玩家2："+score2);
			}
			changed=true;
		}
		if($('#row'+x+''+(y+1)).attr("value")&&$('#col'+x+''+y).attr("value")&&$('#col'+(x+1)+''+y).attr("value"))
		{
			if(current_player)
			{
				$('#box'+x+''+''+y).css("background-color","#aeeeee");
				score1=score1+1;
				$('#user1').text("玩家1："+score1);
			}
			else
			{
				$('#box'+x+''+''+y).css("background-color","#eeee00");
				score2=score2+1;
				$('#user2').text("玩家2："+score2);
			}
			changed=true;
		}
	}
	else if(type == "col")
	{
		if($('#row'+(x-1)+''+y).attr("value")&&$('#row'+(x-1)+''+(y+1)).attr("value")&&$('#col'+(x-1)+''+y).attr("value"))
		{
			if(current_player)
			{
				$('#box'+(x-1)+''+y).css("background-color","#aeeeee");
				score1=score1+1;
				$('#user1').text("玩家1："+score1);
			}
			else
			{
				$('#box'+(x-1)+''+y).css("background-color","#eeee00");
				score2=score2+1;
				$('#user2').text("玩家2："+score2);
			}
			changed=true;
		}
		if($('#row'+x+''+y).attr("value")&&$('#row'+x+''+(y+1)).attr("value")&&$('#col'+(x+1)+''+y).attr("value"))
		{
			if(current_player)
			{
				$('#box'+x+''+''+y).css("background-color","#aeeeee");
				score1=score1+1;
				$('#user1').text("玩家1："+score1);
			}
			else
			{
				$('#box'+x+''+''+y).css("background-color","#eeee00");
				score2=score2+1;
				$('#user2').text("玩家2："+score2);
			}
			changed=true;
		}
	}
	return changed;
}
			
function isGameOver()
{
	if(score1+score2==81)
	{
		alert("玩家"+(score1>score2?'1':'2'));
	}
}

initcontainer();
$('.row ,.col').bind('click',function()
{
	if($(this).hasClass('color_default'))
	{
		$(this).removeClass('color_default');
		if(current_player)
		{
			$(this).addClass('color_click_1');
			$(this).attr("value",1);
			
		}
		else 
		{
			$(this).attr("value",2);
			$(this).addClass('color_click_2');
		}
		xIndex=Number.parseInt($(this).attr('id').substring(3,4));
		yIndex=Number.parseInt($(this).attr('id').substring(4,5));
		var continueGo=false;
		if($(this).hasClass('row'))
		{
			continueGo=checkBox(xIndex,yIndex,"row",current_player);
		}
		if($(this).hasClass('col'))
		{
			continueGo=checkBox(xIndex,yIndex,"col",current_player);
		}
		if(!continueGo)
		{
			current_player = !current_player;
			$('#cur_user').text('当前：玩家'+(2-current_player));
		}
		isGameOver();
	}
});
