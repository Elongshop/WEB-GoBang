var myWin = [];
var compWin = [];
var compover = false;
var count = 0;
var allWin = [];
var mystep = false;
var step = 0;
var maparr = [];
var newpos = document.getElementById('newpos');
var o = document.getElementById("canvas");
var showa = document.getElementById('showa');
var startbtn = document.getElementById('startbtn');
var canvas = document.querySelector("#canvas"); /*获取元素*/
var context = canvas.getContext("2d"); /*获取canvas绘制环境*/
var ChessColor = ["black", "#fafafa"];
canvas.addEventListener("click", function(e) {
			mycode(e);
		})
function startgobang() {
	init(function() {
		if (showid != null) {
			updatecall(null);
		}
		if (confirm('你是否先下子？')) {
			setmsg('到你下子');
			mystep = true;
			document.getElementById('canvas').style = "";
		} else {
			setmsg('对方下子');
			setTimeout(function() {
				toAIcode();
			}, 300);
		}
	});
	document.getElementById('chess').style = "";
	document.getElementById('startbtn').style = "display: none;";
}

function mycode(e) {
	if (!mystep) return;
	let h = o.offsetHeight; //高度
	let w = o.offsetWidth; //宽度
	var offsetX = e.offsetX / w * 480;
	var offsetY = e.offsetY / h * 480;
	var dx = Math.floor((offsetX + 15) / 30) * 30;
	var dy = Math.floor((offsetY + 15) / 30) * 30;
	if (dx == 0 || dy == 0 | dx == 480 || dy == 480) {
		return;
	}
	if (maparr[dx / 30][dy / 30] == 0 && !compover) {
		let size = 28 * w / 480;
		newpos.style = "width: " + size + "px;height: " + size + "px;top: calc(" + dy * h / 480 + "px - " + size / 2 +
			"px);left: calc(" + dx * w / 480 + "px - " + size / 2 + "px);";
		if (step % 2 == 1) {
			newpos.src = "asset/black.png";
		} else {
			newpos.src = "asset/white.png";
		}
		drawChess(dx, dy, ChessColor[step % 2]);
		maparr[dx / 30][dy / 30] = ChessColor[step % 2];
		console.log(maparr);
		step++;
		checkmy(dx / 30, dy / 30);
		updatecall([dx, dy, ChessColor[step % 2]]);
	}
}

function drawChess(x, y, color) {
	//传入一个颜色代码，绘制一个棋子
	context.fillStyle = color;
	context.strokeStyle = color;
	context.shadowBlur = 4;
	context.shadowColor = 'rgba(0,0,0,0.5)';
	context.beginPath(); /*停笔操作*/
	context.arc(x, y, 13, 0, Math.PI * 2, false); /*圆心坐标轴x,y,半径r,起始度数,两个π等于一个满圆,逆时针旋转*/
	context.fill(); /*填充*/
	context.stroke();
	context.closePath(); /*停笔操作*/
}

function checkmy(x, y) {
	for (var k = 0; k < count; k++) {
		if (allWin[x][y][k]) {
			myWin[k]++;
			compWin[k] = 6;
		}
		if (myWin[k] == 5) {
			setmsg('你赢了');
			startbtn.style = "";
			startbtn.innerText = "再来一局";
			compover = true;
		}
	}
	if (compover) {
		document.getElementById('canvas').style = "cursor: not-allowed;";
		return;
	}

	document.getElementById('canvas').style = "cursor: not-allowed;";
	mystep = false;
	setmsg('对方下子');
	setTimeout(function() {
		toAIcode();
	}, 1000);
}

function toAIcode(){
	AIcode(function(maxX, maxY) {
		let h = o.offsetHeight;
		let w = o.offsetWidth;
		let size = 28 * w / 480;
		newpos.style = "width: " + size + "px;height: " + size + "px;top: calc(" + maxY * 30 * h / 480 + "px - " + size /
			2 +
			"px);left: calc(" + maxX * 30 * w / 480 + "px - " + size / 2 + "px);";
		if (step % 2 == 1) {
			newpos.src = "asset/black.png";
		} else {
			newpos.src = "asset/white.png";
		}
		drawChess(maxX * 30, maxY * 30, ChessColor[step % 2]);
		maparr[maxX][maxY] = ChessColor[step % 2];
		step++;
		updatecall([maxX * 30, maxY * 30, ChessColor[step % 2]]);
		checkcom(maxX, maxY);
	});
}

function setmsg(msg) {
	document.getElementById('msg').innerText = msg;
}

function checkcom(x, y) {
	for (var k = 0; k < count; k++) {
		if (allWin[x][y][k]) {
			compWin[k]++;
			myWin[k] = 6;
		}
		if (compWin[k] == 5) {
			setmsg('你输了');
			startbtn.style = "";
			startbtn.innerText = "再来一局";
			compover = true;
		}
	}
	if (compover) {
		document.getElementById('canvas').style = "cursor: not-allowed;";
		return;
	}
	document.getElementById('canvas').style = "";
	mystep = true;
	setmsg('到你下子');
}

function AIcode(success) {
	if (compover) return;
	var myScore = [];
	var compScore = [];
	for (var i = 1; i < 16; i++) {
		myScore[i] = [];
		compScore[i] = [];
		for (var j = 1; j < 16; j++) {
			myScore[i][j] = 0;
			compScore[i][j] = 0;
		}
	}
	var max = 0;
	var maxX = 7;
	var maxY = 7;
	for (var i = 1; i < 16; i++) {
		for (var j = 1; j < 16; j++) {
			if (maparr[i][j] == 0) {
				for (var k = 0; k < count; k++) {
					if (allWin[i][j][k]) {
						if (myWin[k] == 1) {
							myScore[i][j] += 200;
						} else if (myWin[k] == 2) {
							myScore[i][j] += 500;
						} else if (myWin[k] == 3) {
							myScore[i][j] += 2000;
						} else if (myWin[k] == 4) {
							myScore[i][j] += 50000;
						}
						if (compWin[k] == 1) {
							compScore[i][j] += 300;
						} else if (compWin[k] == 2) {
							compScore[i][j] += 800;
						} else if (compWin[k] == 3) {
							compScore[i][j] += 20000;
						} else if (compWin[k] == 4) {
							compScore[i][j] += 500000;
						}
					}
				}
				if (myScore[i][j] > max) {
					max = myScore[i][j];
					maxX = i;
					maxY = j;
				}
				if (compScore[i][j] > max) {
					max = compScore[i][j];
					maxX = i;
					maxY = j;
				}
			}
		}
	}
	console.log(maxX, maxY)
	success ? success(maxX, maxY) : null;
};

function init(success) {
	myWin = [];
	compWin = [];
	compover = false;
	count = 0;
	allWin = [];
	mystep = false;
	step = 0;
	maparr = [];
	newpos.style = "display:none";
	context.clearRect(0, 0, 480, 480);
	for (var i = 1; i < 16; i++) {
		maparr[i] = [];
		for (var j = 1; j < 16; j++) {
			maparr[i][j] = 0;
		}
	}

	context.lineWidth = 1;
	context.strokeStyle = '#67563c';
	context.shadowBlur = 0;
	context.shadowColor = 'rgba(0,0,0,0)';
	for (var i = 0; i < 15; i++) {
		var fix1px = (context.lineWidth % 2 === 0) ? 0 : 0.5;
		context.moveTo(30 * (i + 1) + fix1px, 30 + fix1px);
		context.lineTo(30 * (i + 1) + fix1px, 450 + fix1px);
		context.moveTo(30 + fix1px, 30 * (i + 1) + fix1px);
		context.lineTo(450 + fix1px, 30 * (i + 1) + fix1px);
	}
	context.stroke();
	for (var i = 1; i <= 15; i++) {
		allWin[i] = [];
		for (var j = 1; j <= 15; j++) {
			allWin[i][j] = [];
		}
	}
	for (var i = 1; i <= 15; i++) {
		for (var j = 1; j <= 11; j++) {
			for (var k = 0; k < 5; k++) {
				allWin[j + k][i][count] = true;
			}
			count++;
		}
	}
	for (var i = 1; i <= 15; i++) {
		for (var j = 1; j <= 11; j++) {
			for (var k = 0; k < 5; k++) {
				allWin[i][j + k][count] = true;
			}
			count++;
		}
	}
	for (var i = 1; i <= 11; i++) {
		for (var j = 1; j <= 11; j++) {
			for (var k = 0; k < 5; k++) {
				allWin[i + k][j + k][count] = true;
			}
			count++;
		}
	}
	for (var i = 14; i > 4; i--) {
		for (var j = 1; j <= 11; j++) {
			for (var k = 0; k < 5; k++) {
				allWin[i - k][j + k][count] = true;
			}
			count++;
		}
	}
	console.log(count); //572
	for (var i = 0; i < count; i++) {
		myWin[i] = 0;
		compWin[i] = 0;
	}
	success();
}
