var nowmaparr = [];
var nowstep = 0;
var o = document.getElementById("canvas");
var canvas = document.querySelector("#canvas");
var newpos = document.getElementById('newpos');
var context = canvas.getContext("2d");
var ChessColor = ["black", "#fafafa"];
init();

function init() {
	context.lineWidth = 1;
	context.strokeStyle = '#67563c';
	context.shadowBlur = 0;
	context.shadowColor = 'rgba(0,0,0,0)';
	context.clearRect(0, 0, 480, 480);
	for (var i = 0; i < 15; i++) {
		var fix1px = (context.lineWidth % 2 === 0) ? 0 : 0.5;
		context.moveTo(30 * (i + 1) + fix1px, 30 + fix1px);
		context.lineTo(30 * (i + 1) + fix1px, 450 + fix1px);
		context.moveTo(30 + fix1px, 30 * (i + 1) + fix1px);
		context.lineTo(450 + fix1px, 30 * (i + 1) + fix1px);
	}
	context.stroke();
}

function downChess(dx, dy, color, step) {
	let h = o.offsetHeight;
	let w = o.offsetWidth;
	let size = 28 * w / 480;
	newpos.style = "width: " + size + "px;height: " + size + "px;top: calc(" + step[1] * h / 480 + "px - " + size / 2 +
		"px);left: calc(" + step[0] * w / 480 + "px - " + size / 2 + "px);";
	newpos.src = (step[2] == '#fafafa' ? 'asset/white' : 'asset/'+step[2]) + ".png";
	drawChess(dx, dy, color);
}

function drawChess(x, y, color) {
	context.fillStyle = color;
	context.strokeStyle = color;
	context.shadowBlur = 4;
	context.shadowColor = 'rgba(0,0,0,0.5)';
	context.beginPath();
	context.arc(x, y, 13, 0, Math.PI * 2, false);
	context.fill();
	context.stroke();
	context.closePath();
}

function getQueryString() {
	var qs = location.search.substr(1),
		args = {},
		items = qs.length ? qs.split("&") : [],
		item = null,
		len = items.length;
	for (var i = 0; i < len; i++) {
		item = items[i].split("=");
		var name = decodeURIComponent(item[0]),
			value = decodeURIComponent(item[1]);
		if (name) {
			args[name] = value;
		}
	}
	return args;
}

function downcode(snapshot) {
	let maparr = snapshot.docs[0].maparr;
	if (nowstep > snapshot.docs[0].step) {
		init();
		nowstep = snapshot.docs[0].step;
		nowmaparr = maparr;
	} else {
		for (let i = 1; i < maparr.length; i++) {
			for (let j = 1; j < maparr[i].length; j++) {
				if (maparr[i][j] != 0) {
					if (nowmaparr.length == 0 || (nowmaparr.length != 0 && nowmaparr[i][j] != maparr[i][j])) {
						downChess(i * 30, j * 30, maparr[i][j], snapshot.docs[0].newstep);
					}
				}
			}
		}
		nowstep = snapshot.docs[0].step;
		nowmaparr = maparr;
	}
}
