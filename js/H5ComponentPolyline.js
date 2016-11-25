/*折线图组件对象*/
var H5ComponentPolyline = function(name, cfg) {
	component = H5ComponentBase (name, cfg);
	var width = cfg.width;
	var height = cfg.height;

	//创建canvas对象及绘图环境对象(背景层)
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	//画布尺寸
	canvas.width = ctx.width = width;
	canvas.height = ctx.height = height;
	component.append(canvas);

	//网格线基本样式
	ctx.beginPath();                 //重置路径
	ctx.lineWidth = 1;               //线条宽度
	ctx.strokeStyle = "#808080";        //线条样式

	//水平网格线
	var gridX = 10;
	window.ctx = ctx;
	for (var i = 0; i <= gridX; i++ ) {
		var y = (height/gridX) * i;
		ctx.moveTo(0, y);
		ctx.lineTo(width, y);
	}

	//竖直网格线(根据项目个数去划分),项目名称
	var gridY = cfg.data.length + 1;
	var name_width = width/gridY >> 0;
	for (var i = 0; i <= gridY; i++) {
		var x = (width/gridY) * i;
		ctx.moveTo(x, 0);
		ctx.lineTo(x, height);

		if (cfg.data[i]) {
			var name = $('<div class="name"></div>');
			name.text(cfg.data[i][0]);
			name.css({
				left:x/2 + name_width/4,
				width:name_width/2
			});
			component.append(name);
		}
	}
	ctx.stroke();


	//创建canvas对象及绘图环境对象(数据层)
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	canvas.width = ctx.width = width;
	canvas.height = ctx.height = height;
	component.append(canvas);

	function draw (per) {
		//清空画布
		ctx.clearRect(0, 0, width, height);

		//折线基本样式
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#ff7676';

		//描点、连线
		var x = 0, y = 0;
		var pointX = cfg.data.length + 1;
		ctx.moveTo((width/pointX), height * (1 - cfg.data[0][1] * per)); //连线的起始点
		for (var i = 0; i <cfg.data.length; i++) {

			x = (width/pointX) * (i + 1);
			y = height * (1 - cfg.data[i][1] * per);
			ctx.lineTo(x, y);
			ctx.arc(x, y, 5, 0, 2*Math.PI);
		}
		ctx.stroke();

		//填充阴影
		ctx.lineWidth = 1;                             //重置边框线条宽度
		ctx.strokeStyle = 'rgba(255, 136, 120, 0.2)';  //重置边框线条样式
		ctx.lineTo(x, height);
		ctx.lineTo(width/pointX, height);
		ctx.fillStyle = 'rgba(255, 136, 120, 0.2)';
		ctx.fill();

		//写数据
		var pointX = cfg.data.length + 1;
		for (var i = 0; i <cfg.data.length; i++) {
			var x = (width/pointX) * (i + 1);
			var y = height * (1 - cfg.data[i][1] * per);
			ctx.moveTo(x, y);
			ctx.font="16px Arial";
			ctx.fillStyle = cfg.data[i][2] ? cfg.data[i][2] : 'black';
			ctx.fillText((cfg.data[i][1] * 100 >> 0) + '%', x-10, y-12);
		}
		ctx.stroke();
	}

	component.on('onLoad',function() {
		//折线图生长动画(500毫秒延迟)
		var s = 0;
		for (var i = 0; i < 100; i++) {
			setTimeout(function() {
				s += 0.01;
				draw(s);
			}, i * 10 + 500);
		}
	});

	component.on('onLeave',function() {
		//折线图退场动画
		var s = 1;
		for (var i = 0; i < 100; i++) {
			setTimeout(function() {
				s -= 0.01;
				draw(s);	
			}, i * 10);
		}
	});

	return component;
}