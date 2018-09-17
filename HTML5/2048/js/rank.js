var jq = jQuery.noConflict();
//自动获取cookie中存储的历史最高分数，然后排行
function autoRank(){
	var scoreStr = getCookie("scoreList");	
	var list =  scoreStr.split(",");
//	console.log(list);
	for (var i = 0; i < list.length-1 ; i++) {
		addRank(list[i]);
	}
}
//监听鼠标滚轮的事件
function mouserWheelListener(){
	//鼠标滚轮控制列表滚动
	jq('body').mousewheel(function(event, delta) {
		var dir = delta > 0 ? 'Up' : 'Down';
		if(dir == 'Up') {
			//			console.log(1);
			scroll(jq(".ranklist"), 1);
		} else {
			//			console.log(2);
			scroll(jq(".ranklist"), -1)
		}
	});
}
//排行榜列表滚动效果
function scroll(id, dir) {
	var top = 0;
	var time = 0;
	var timer = setInterval(function() {
		var idTop = Number(id.css("top").split("px")[0]);
		top += dir;
		time++;
		if(time >= 6) {
			clearInterval(timer);
		}
		//防止上溢出
		if(dir < 0 && 400 - idTop > id.innerHeight()) {
			clearInterval(timer);
		}
		//防止下溢出
		else if(dir > 0 && idTop > 0) {
			clearInterval(timer);
		} else {
			id.css({
				"top": idTop + top + "px"
			});
		}
	}, 20);
}
//向排行榜列表添加一个新分数
function addRank(score) {
	//遍历已有的列表，重新排序
	var rankList = jq(".ranklist").children("li");
	//如果列表中没有内容则直接添加
	if(rankList.length == 0) {
		//创建两个span元素并赋类名
		var spanRank = document.createElement("span");
		spanRank.className = "rank";
		var spanScore = document.createElement("span");
		spanScore.className = "score";
		spanRank.innerHTML = 1;
		spanScore.innerHTML = score;
		//创建li标签存放两个span
		var li = document.createElement("li");
		li.appendChild(spanRank);
		li.appendChild(spanScore);
		//加入li标签
		jq(".ranklist").append(li);
	} else {
		//存放分数的数组
		var list = [];
		//遍历所有列表项，取出其中值
		for(var i = 0; i < rankList.length; i++) {
			var child = rankList[i].getElementsByTagName("span");
			list.push(child[1].innerHTML);
		}
		//如果新分数不在list中，则存放新分数
		if(list.indexOf(score) == -1) {
			list.push(score);
			//按大到小重新排序
			for(var i = 0; i < list.length - 1; i++) {
				for(var j = 0; j < list.length - i - 1; j++) {
					var temp = 0;
					if(Number(list[j]) < Number(list[j + 1])) {
						temp = Number(list[j]);
						list[j] = Number(list[j + 1]);
						list[j + 1] = temp;
					}
				}
			}
			//重新设置列表
			var new_scorelist = "";
			jq(".ranklist").html(""); //清空原列表
			for(var i = 0; i < list.length; i++) {
				//创建两个span元素并赋类名
				var spanRank = document.createElement("span");
				spanRank.className = "rank";
				var spanScore = document.createElement("span");
				spanScore.className = "score";
				spanRank.innerHTML = i+1;
				spanScore.innerHTML = list[i];
				//创建li标签存放两个span
				var li = document.createElement("li");
				li.appendChild(spanRank);
				li.appendChild(spanScore);
				//加入li标签,限定长度为10
				if (i < 10) {
					new_scorelist +=  list[i] + ",";
					jq(".ranklist").append(li);
				}
			}
			setCookie("scoreList",new_scorelist,7);
//			console.log(getCookie("scoreList"));
		}
	}
}