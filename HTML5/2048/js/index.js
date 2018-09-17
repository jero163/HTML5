//var jq = jQuery.noConflict();
//获取元素id
function $(id) {
	return document.getElementById(id);
}
//鼠标放到帮助和设置图标上时
function mouseOverImg() {
	$("imgSet").onmouseover = function() {
		this.src = "img/set_blue.png";
	}
	$("imgHelp").onmouseover = function() {
		this.src = "img/help_blue.png";
	}
	$("imgSet").onmouseout = function() {
		this.src = "img/set.png";
	}
	$("imgHelp").onmouseout = function() {
		this.src = "img/help.png";
	}
}
//检测地址栏
function listenURL() {
	var gamedata = getCookie("gameData");
	//	console.log(url);
	if(gamedata != "") {
		$("start").innerHTML = "继续游戏";
	} else {
		$("start").innerHTML = "开始游戏";
	}
}
//“开始游戏”按钮监听事件
function startGame() {
	$("start").onclick = function() {
		window.location.href = "game.html";
	}
}
//“游戏设置”按钮监听事件
function setGame() {
	$("set").onclick = function() {
		scrollUp($("set_"), 478);
		//禁止重复点击
		this.onclick = "";
		$("imgSet").onclick = "";
		setClose();
	}
	$("imgSet").onclick = function() {
		scrollUp($("set_"), 478);
		//禁止重复点击
		this.onclick = "";
		$("imgHelp").onclick = "";
		$("set").onclick = "";
		setClose();
	}
}
//“游戏帮助”按钮监听事件
function helpGame() {
	$("help").onclick = function() {
		scrollUp($("help_"), 478);
		//禁止重复点击
		this.onclick = "";
		$("imgHelp").onclick = "";
		setClose();
	}
	$("imgHelp").onclick = function() {
		scrollUp($("help_"), 478);
		//禁止重复点击
		this.onclick = "";
		$("imgSet").onclick = "";
		$("help").onclick = "";
		setClose();
	}
}
//“退出游戏”按钮监听事件
function quitGame() {
	$("quit").onclick = function() {
		scrollUp($("quit_"), 478);
		//禁止重复点击
		this.onclick = "";
		setClose();
	}
}
//设置所有的弹窗里的x键点击事件
function setClose() {
	$("closeSet").onclick = function() {
		scrollDown($("set_"), 478);
		$("closeSet").onclick = "";
		setGame();
		helpGame();
	}
	$("closeHelp").onclick = function() {
		scrollDown($("help_"), 478);
		$("closeHelp").onclick = "";
		setGame();
		helpGame();
	}
	$("closeQuit").onclick = function() {
		scrollDown($("quit_"), 478);
		$("closeQuit").onclick = "";
		quitGame();
	}
}
//设置游戏设置里三个设置按钮的点击事件
function setBtnListener() {
	$("num2048").onclick = function() {
		scrollDown($("set_"), 478);
		setGame();
		setCookie("gameSetting", 2048, 7);
	}
	$("num4096").onclick = function() {
		scrollDown($("set_"), 478);
		setGame();
		setCookie("gameSetting", 4096, 7);
	}
	$("numLarge").onclick = function() {
		scrollDown($("set_"), 478);
		setGame();
		setCookie("gameSetting", -1, 7);
	}
}
//设置退出游戏弹窗里用户点击的按钮的点击事件
function quitGameOrNot() {
	$("yes").onclick = function() {
		window.location.href = "about:blank";
	}
	$("no").onclick = function() {
		scrollDown($("quit_"), 478);
		quitGame();
	}
}

//让盒子上滚动iTarget个像素
function scrollUp(id, iTarget) {
	var top = 0;
	var idTop = id.offsetTop;
	var timer = setInterval(function() {
		top += -10;
		if(id.offsetTop <= 656 - iTarget) {
			clearInterval(timer);
		}
		id.style.top = idTop + top + "px";
	}, 10);
}

//让盒子下滚动iTarget个像素
function scrollDown(id, iTarget) {
	var top = 0;
	var idTop = id.offsetTop;
	var timer = setInterval(function() {
		top += 10;
		if(id.offsetTop >= 656) {
			clearInterval(timer);
		}
		id.style.top = idTop + top + "px";
	}, 10);
}

//清除所有计时器
function clearTimer() {
	var timer = setTimeout(function() {
		for(var i = 0; i < timer; i++) {
			clearInterval(i);
		}
	}, 0);
}

//设置cookie
function setCookie(c_name, value, expiresDays) {
	//设置时间
	if(expiresDays > 0) {
		var date = new Date();
		date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000);
	}
	//设置cookie
	document.cookie = c_name + "=" + encodeURIComponent(value) + ";expires = " + date.toGMTString();
}
//获取cookie
function getCookie(c_name) {
	var search = c_name + "=";
	var returnValue = "";
	if(document.cookie.length > 0) {
		var sd = document.cookie.indexOf(search);
		if(sd != -1) {
			sd += search.length;
			var end = document.cookie.indexOf(";", sd);
			if(end == -1) {
				end = document.cookie.length;
			}

			returnValue = unescape(document.cookie.substring(sd, end));
		}
	}

	return returnValue;
}