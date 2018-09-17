//通过id查找元素，返回id
function $(id) {
	return document.getElementById(id);
}
//读取cell里的信息置入listCellInfo
function getCellInfo(listCellInfo) {
	var cellInfo = document.getElementsByClassName("number");
	var info = "";
	for(var i = 0; i < cellInfo.length; i++) {
		info += cellInfo[i].index;
	}
	listCellInfo.push(info);
	//	console.log(listCellInfo);
}
//游戏运行主控函数
function runGame() {
	if(getCookie("gameData") != "") {
		recovery();
	} else {
		//产生2个随机位置数字
		for(var i = 0; i < 2; i++) {
			setNumber(2, randIndex(4));
		}
	}
	//读取游戏开始时cell里的信息置入listCellInfo
	//	getCellInfo();
	//读取最高分
	$("highScore").innerHTML = Number(getCookie("highScore"));
	//监听用户按键
	getKey();
	//排行榜按钮
	rankBtn();
	//返回按钮
	cancelBtn();
	//排行榜界面鼠标滚轮监听事件
	mouserWheelListener();
	//按设置监测当前数字中最大值是否已达标
	listenGameNumMax();
}

//按设置监测当前数字中最大值是否已达标
function listenGameNumMax() {
	var timer = setInterval(function() {
		//设置游戏结束条件
		var maxNum = Number(getCookie("gameSetting"));
		if(maxNum == "") {
			maxNum = 2048;
			//更改数据区游戏目标
			$("target").innerHTML = 2048;
		} else if(maxNum == -1) {
			//更改数据区游戏目标
			$("target").innerHTML = "∞";
		} else if(maxNum == 4096) {
			//更改数据区游戏目标
			$("target").innerHTML = 4096;
		} else if(maxNum == 2048) {
			//更改数据区游戏目标
			$("target").innerHTML = 2048;
		}
		//搜索格子中最大数
		var numList = document.getElementsByClassName("number");
		var max = 0;
		for(var i = 0; i < numList.length; i++) {
			if(numList[i].number > max) {
				max = numList[i].number;
			}
		}
		//		console.log(maxNum + "," + max);
		//判断游戏是否结束
		if(max >= maxNum && maxNum != -1) {
			clearInterval(timer);
			endGame(1);
		}
	}, 100);
}
//恢复现场的函数
function recovery() {
	//恢复分数
	$("score").innerHTML = Number(getCookie("score"));
	//恢复最高分
	$("highScore").innerHTML = Number(getCookie("highScore"));
	//取得游戏场景数据
	var gameData = getCookie("gameData");
	var list1 = gameData.split("|");
	list1.pop(); //去掉最后一个空项
	//	console.log(list1);
	var list2 = [];
	for(var i = 0; i < list1.length; i++) {
		var demo = {
			"index": -1,
			"number": -1
		};
		demo.index = list1[i].split(",")[0];
		demo.number = list1[i].split(",")[1];
		list2.push(demo);
	}
	//	console.log(list2);
	//恢复游戏场景
	for(var i = 0; i < list2.length; i++) {
		setNumber(Number(list2[i].number), Number(list2[i].index));
	}
	//删除相应cookie
	setCookie("score", "", 1);
	setCookie("gameData", "", 1);
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
//返回主菜单按钮点击事件
function cancelBtn() {
	$("cancel").onclick = function() {
		//保存现场：1.当前分数；2.盒子中各个位置上的数字
		var indexAndNumber = "";
		setCookie("score", $("score").innerHTML, 1);
		var numList = document.getElementsByClassName("number");
		for(var i = 0; i < numList.length; i++) {
			indexAndNumber += numList[i].index + "," + numList[i].number + "|";
		}
		setCookie("gameData", indexAndNumber, 1);
		//页面跳转
		window.location.href = "index.html?act=back"; //
	}
}
//清空盒子内容和分数等全局变量的函数
function resetGame() {
	var score = Number($("score").innerHTML);
	//设置最高分
	if(score > Number($("highScore").innerHTML) && score != 0) {
		$("highScore").innerHTML = score;
		setCookie("highScore", score, 7);
	}
	//每次重新开始游戏都将新的最高分存入排行榜
	var value = getCookie("scoreList");
	var highScore = $("score").innerHTML;
	if(value.indexOf(highScore) == -1) {
		value += highScore + ",";
		setCookie("scoreList", value, 7) //存七天
	}
	//清空分数
	$("score").innerHTML = 0;
	//遍历cell
	var cellList = document.getElementsByClassName("cell");
	for(var i = 0; i < cellList.length; i++) {
		//直接去掉cellList中所有对象
		cellList[i].innerHTML = "";
	}
	//删除相应cookie
	setCookie("score", "", 1);
	setCookie("gameData", "", 1);

	return true;
}
//重新开始按钮的点击事件
function restartBtn() {
	$("restart").onclick = function() {
		if(resetGame()) {
			clearTimer();
			runGame();
		}
	}
}
//检查某一行或某一列是否满了
function checkRowOrColFull() {
	var list = [];
	var flag = false; //默认是不满行或满列的
	//遍历数字对象
	var numList = document.getElementsByClassName("number");
	for(var i = 0; i < numList.length; i++) {
		//创建demo对象
		var demo = {
			"index": -1,
			"row": 0, //在第几行
			"col": 0 //在第几列
		};
		//为demo对象赋值
		demo.index = numList[i].index;
		if(demo.index >= 0 && demo.index <= 3) {
			demo.row = 1;
		} else if(demo.index >= 4 && demo.index <= 7) {
			demo.row = 2;
		} else if(demo.index >= 8 && demo.index <= 11) {
			demo.row = 3;
		} else if(demo.index >= 12 && demo.index <= 15) {
			demo.row = 4;
		}
		if(demo.index % 4 == 0) {
			demo.col = 1;
		} else if(demo.index % 4 == 1) {
			demo.col = 2;
		} else if(demo.index % 4 == 2) {
			demo.col = 3;
		} else if(demo.index % 4 == 3) {
			demo.col = 4;
		}
		//		console.log(demo.col + "," + demo.row);
		//加入list集合
		list.push(demo);
	}
	//	console.log(list);
	var rows1 = 0;
	var cols1 = 0;
	var rows2 = 0;
	var cols2 = 0;
	var rows3 = 0;
	var cols3 = 0;
	var rows4 = 0;
	var cols4 = 0;
	for(var i = 0; i < list.length; i++) { //让
		if(list[i].row == 1) {
			rows1++;
		}
		if(list[i].col == 1) {
			cols1++;
		}
		if(list[i].row == 2) {
			rows2++;
		}
		if(list[i].col == 2) {
			cols2++;
		}
		if(list[i].row == 3) {
			rows3++;
		}
		if(list[i].col == 3) {
			cols3++;
		}
		if(list[i].row == 4) {
			rows4++;
		}
		if(list[i].col == 4) {
			cols4++;
		}
	}
	//当任何一个行或列有4个数则说明行满或列满
	if(cols1 >= 4 || cols2 >= 4 || cols3 >= 4 || cols4 >= 4 || rows1 >= 4 || rows2 >= 4 || rows3 >= 4 || rows4 >= 4) {
		flag = true;
	}
	//	console.log(rows1 + "," + rows2 + "," + rows3 + "," + rows4);

	return flag;
}
//判断cell里是否还有相邻单元可以消除，是的话返回真，否则返回假
function checkCell() {
	var flag = false;
	//首先存放demo对象
	var list = [];
	//遍历数字对象
	var numList = document.getElementsByClassName("number");
	for(var i = 0; i < numList.length; i++) {
		//创建demo对象
		var demo = {
			"index": -1,
			"number": 0,
			"row": 0, //在第几行
			"col": 0 //在第几列
		};
		//为demo对象赋值
		demo.index = numList[i].index;
		demo.number = numList[i].number;
		if(demo.index >= 0 && demo.index <= 3) {
			demo.row = 1;
		} else if(demo.index >= 4 && demo.index <= 7) {
			demo.row = 2;
		} else if(demo.index >= 8 && demo.index <= 11) {
			demo.row = 3;
		} else if(demo.index >= 12 && demo.index <= 15) {
			demo.row = 4;
		}
		if(demo.index % 4 == 0) {
			demo.col = 1;
		} else if(demo.index % 4 == 1) {
			demo.col = 2;
		} else if(demo.index % 4 == 2) {
			demo.col = 3;
		} else if(demo.index % 4 == 3) {
			demo.col = 4;
		}
		//加入list集合
		list.push(demo);
	}
	//	console.log(list);
	//逐个判断每个对象相邻单元数字是否相等
	for(var i = 0; i < list.length; i++) {
		//i为当前焦点
		for(var j = i + 1; j < list.length; j++) {
			//j为i后面的对象
			//判断同行是否相邻
			if((list[i].row == list[j].row) && (list[i].index - 1 == list[j].index || list[i].index + 1 == list[j].index)) {
				if(list[i].number == list[j].number) {
					//					console.log("同行内相邻数字有相等的");
					flag = true;
				}
			}
			//判断同列是否相邻
			if((list[i].col == list[j].col) && (list[i].index - 4 == list[j].index || list[i].index + 4 == list[j].index)) {
				if(list[i].number == list[j].number) {
					//					console.log("同列内相邻数字有相等的");
					flag = true;
				}
			}
		}
	}

	return flag;
}
//结束游戏时调用的函数,结束游戏的时候保存最高分
function endGame(i) {
	//游戏结束的提示
	if(i == 1) {
		alert("Game Over,You win!");
	} else {
		alert("Game Over,You Die!");
	}
	//重置游戏
	window.location.href = "index.html";
	resetGame();
}
//监听排行榜按钮
function rankBtn() {
	$("rank").onclick = function() {
		scrollLeftOrRight($("box"), -1, 430);
		$("rank").onclick = "";
		closeBtn();
		autoRank();
	}
}
//排行榜close按钮点击事件
function closeBtn() {
	$("close").onclick = function() {
		scrollLeftOrRight($("box"), 1, 10);
		$("close").onclick = "";
		rankBtn();
		jq(".ranklist").css({
			"top": "0px"
		});
	}
}
//让盒子上或下滚动iTarget个像素
function scrollLeftOrRight(id, dir, iTarget) {
	var left = 0;
	var idLeft = id.offsetLeft;
	var timer = setInterval(function() {
		left += dir * 10;
		if(dir < 0) {
			if(id.offsetLeft <= 450 - iTarget) {
				clearInterval(timer);
			}
			id.style.left = idLeft + left + "px";
		} else {
			if(id.offsetLeft >= 450) {
				clearInterval(timer);
			}
			id.style.left = idLeft + left + "px";
		}

	}, 10);
}
//随机产生一个位置,位置不冲突；x_length即横轴数字个数
function randIndex(x_lenght) {
	var index = -1;
	//位置数组，用于指定取数区间
	var cellArr = [];
	for(var i = 0; i < Math.pow(x_lenght, 2); i++) {
		cellArr[i] = i;
	}
	//遍历cell
	var numList = document.getElementsByClassName("number");
	for(var i = 0; i < numList.length; i++) {
		//从cellArr中去掉已经存在的位置
		if(numList[i].number != null) {
			cellArr.splice(numList[i].index - i, 1);
		}
	}
	//在指定区间随机产生一个数
	if(cellArr.length > 0) {
		index = cellArr[Math.floor(Math.random() * cellArr.length)];
	}
	//返回产生的数
	return index;
}

//在制定位置加载指定颜色的指定数字
function setNumber(number, index) {
	var cellList = document.getElementsByClassName("cell");
	var numDiv = document.createElement("span");
	//写死的属性
	numDiv.className = "number";
	numDiv.style.width = "100px";
	numDiv.style.height = "100px";
	numDiv.style.lineHeight = "100px";
	numDiv.style.color = "#FFFFFF";
	numDiv.style.textAlign = "center";
	//设置numDiv的新属性
	numDiv.index = index;
	numDiv.number = number;
	//设置数字
	numDiv.innerHTML = number;
	//自动设置数字背景颜色
	function setColor(number) {
		switch(number) {
			case 2:
				numDiv.style.background = "rgba(28,245,247,0.5)";
				break;
			case 4:
				numDiv.style.background = "rgba(15,245,118,0.5)";
				break;
			case 8:
				numDiv.style.background = "rgba(80,240,21,0.5)";
				break;
			case 16:
				numDiv.style.background = "rgba(157,242,15,0.5)";
				break;
			case 32:
				numDiv.style.background = "rgba(255,248,0,0.5)";
				break;
			case 64:
				numDiv.style.background = "rgba(250,170,28,0.5)";
				break;
			case 128:
				numDiv.style.background = "rgba(245,72,8,0.5)";
				break;
			case 256:
				numDiv.style.background = "rgba(245,26,18,0.5)";
				break;
			case 512:
				numDiv.style.background = "rgba(245,5,198,0.5)";
				break;
			case 1024:
				numDiv.style.background = "rgba(116,3,242,0.5)";
				break;
			case 2048:
				numDiv.style.background = "rgba(5,5,108,0.5)";
				break;
			default:
				break;
		}

	}
	setColor(number);
	//自动设置字体大小
	if(number < 10) {
		numDiv.style.fontSize = "80px";
	} else if(number > 9 && number < 100) {
		numDiv.style.fontSize = "67px";
	} else if(number > 99 && number < 1000) {
		numDiv.style.fontSize = "54px";
	} else {
		numDiv.style.fontSize = "41px";
	}
	//设置数字位置
	cellList[index].appendChild(numDiv);

	return numDiv;
}
//监听用户输入的上下左右键
function getKey() {
	document.onkeydown = function(event) {
		var listCellInfo = [];
		getCellInfo(listCellInfo);

		var e = event || window.event || arguments.callee.caller.arguments[0];
		var cellList = document.getElementsByClassName("cell");
		var box = $("gameBox").getElementsByTagName("span");
		// 按  左键
		if(e && e.keyCode == 37) {
			pressLeftKey();
			var k = 1;
			var num = 4;
			for(var p = 1; p <= 4; p++) {
				for(; k < num; k++) {
					if(cellList[k - 1].hasChildNodes() && cellList[k].hasChildNodes() && cellList[k - 1].firstChild.number == cellList[k].firstChild.number) {
						var number = cellList[k - 1].firstChild.number + cellList[k].firstChild.number;
						var numDiv = setNumber(number, k - 1);
						cellList[k - 1].firstChild.remove();
						cellList[k].firstChild.remove();
						cellList[k - 1].appendChild(numDiv);
						//加分
						var score = Number($("score").innerHTML) * 1;
						score += number;
						$("score").innerHTML = score;
					}
				}
				k++;
				num += 4;
			}
			pressLeftKey();
		}
		// 按 上键
		if(e && e.keyCode == 38) {
			pressUpKey();
			var k = 4;
			for(var p = 1; p <= 4; p++) {

				for(; k < 16; k += 4) {
					if(cellList[k - 4].hasChildNodes() && cellList[k].hasChildNodes() && cellList[k - 4].firstChild.number == cellList[k].firstChild.number) {
						var number = cellList[k - 4].firstChild.number + cellList[k].firstChild.number;
						var numDiv = setNumber(number, k - 4);
						cellList[k - 4].firstChild.remove();
						cellList[k].firstChild.remove();
						cellList[k - 4].appendChild(numDiv);
						//加分
						var score = Number($("score").innerHTML) * 1;
						score += number;
						$("score").innerHTML = score;
					}
				}
				if(p != 4) {
					k = 4;
					k += p;
				}

			}
			pressUpKey();

		}
		//按右键
		if(e && e.keyCode == 39) {
			pressRightKey();
			var k = 3;
			var num = 0;
			for(var p = 1; p <= 4; p++) {

				for(; k > num; k--) {
					if(cellList[k - 1].hasChildNodes() && cellList[k].hasChildNodes() && cellList[k - 1].firstChild.number == cellList[k].firstChild.number) {
						var number = cellList[k - 1].firstChild.number + cellList[k].firstChild.number;
						var numDiv = setNumber(number, k);
						cellList[k - 1].firstChild.remove();
						cellList[k].firstChild.remove();
						cellList[k].appendChild(numDiv);
						//加分
						var score = Number($("score").innerHTML) * 1;
						score += number;
						$("score").innerHTML = score;
					}
				}
				k = 3;
				num += 4;
				k += num;
			}
			pressRightKey();

		}
		// 按下键
		if(e && e.keyCode == 40) {
			pressDownKey();
			var k = 15;
			for(var p = 1; p <= 4; p++) {
				for(; k >= 4; k -= 4) {
					if(cellList[k - 4].hasChildNodes() && cellList[k].hasChildNodes() && cellList[k - 4].firstChild.number == cellList[k].firstChild.number) {
						var number = cellList[k - 4].firstChild.number + cellList[k].firstChild.number;
						var numDiv = setNumber(number, k);
						cellList[k - 4].firstChild.remove();
						cellList[k].firstChild.remove();
						cellList[k].appendChild(numDiv);
						//加分
						var score = Number($("score").innerHTML) * 1;
						score += number;
						$("score").innerHTML = score;
					}
				}
				if(p != 4) {
					k = 15;
					k -= p;
				}

			}
			pressDownKey();
		}
		//检测游戏是否结束
		getCellInfo(listCellInfo);
		//		console.log(listCellInfo);
		if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
			var index = randIndex(4);
			if(index == -1) {
				//如果能判断出所有的cell内数字相邻单元不能消除，则视为游戏结束（待写）
				if(!checkCell()) {
					//游戏结束函数
					endGame(2);
				}
			} else {
				//当满行或满列，且元素不移动位置时，不产生新元素!checkRowOrColFull()
				if(!(listCellInfo[0] == listCellInfo[1] && checkRowOrColFull())) {
					setNumber(2, index);
					//					console.log(listCellInfo);
				}
			}
		}

	}
}

//向左移动位置
function pressLeftKey() {
	var cellList = document.getElementsByClassName("cell");
	var box = $("gameBox").getElementsByTagName("span");
	for(var i = 0; i < box.length; i++) {
		if(box[i].index <= 3) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 0; j < 4; j++) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}
		if(box[i].index > 3 && box[i].index <= 7) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 4; j < 8; j++) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}

		if(box[i].index > 8 && box[i].index <= 11) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 8; j < 12; j++) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}

		if(box[i].index > 11 && box[i].index <= 15) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 12; j < 16; j++) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}
	}
}

//向右移动位置
function pressRightKey() {
	var cellList = document.getElementsByClassName("cell");
	var box = $("gameBox").getElementsByTagName("span");
	for(var i = box.length - 1; i >= 0; i--) {
		if(box[i].index <= 3) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 3; j > -1; j--) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}
		if(box[i].index > 3 && box[i].index <= 7) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 7; j > 3; j--) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}

		if(box[i].index > 7 && box[i].index <= 11) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 11; j > 7; j--) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}

		if(box[i].index > 11 && box[i].index <= 15) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 15; j > 11; j--) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}
	}
}

//向上移动位置
function pressUpKey() {
	var cellList = document.getElementsByClassName("cell");
	var box = $("gameBox").getElementsByTagName("span");
	for(var i = 0; i < box.length; i++) {
		if(box[i].index % 4 == 0) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 0; j < 16; j += 4) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}
		if(box[i].index % 4 == 1) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 1; j < 16; j += 4) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}

		if(box[i].index % 4 == 2) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 2; j < 16; j += 4) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}

		if(box[i].index % 4 == 3) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 3; j < 16; j += 4) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}
	}
}

//向下移动位置
function pressDownKey() {
	var cellList = document.getElementsByClassName("cell");
	var box = $("gameBox").getElementsByTagName("span");
	for(var i = box.length - 1; i >= 0; i--) {
		if(box[i].index % 4 == 0) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 12; j >= 0; j -= 4) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}
		if(box[i].index % 4 == 1) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 13; j >= 1; j -= 4) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}

		if(box[i].index % 4 == 2) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 14; j >= 2; j -= 4) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}

		if(box[i].index % 4 == 3) {
			var number = box[i].number;
			box[i].remove();

			for(var j = 15; j >= 3; j -= 4) {
				if(!cellList[j].hasChildNodes()) {
					var numDiv = setNumber(number, j);
					cellList[j].appendChild(numDiv);
					break;
				}
			}

		}
	}
}
//清除所有计时器
function clearTimer() {
	var timer = setTimeout(function() {
		for(var i = 0; i < timer; i++) {
			clearInterval(i);
		}
	}, 0);
}