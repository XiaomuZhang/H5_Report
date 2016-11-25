/*雷达图组件对象*/
var H5ComponentRadar = function (name, cfg) {
	//引入基本组件对象
	var component = H5ComponentBase(name, cfg);
	var width = cfg.width;
	var height = cfg.height;

	//创建canvas对象及绘图环境对象(背景层)
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	//画布尺寸
	canvas.width = ctx.width = width;
	canvas.height = ctx.height = height;
	component.append(canvas);

	//背景层基本样式
	ctx.lineWidth = 1;                 //线条宽度
	ctx.strokeStyle = "#ff7676";       //线条样式

	
	//计算多边形的顶点坐标
	//已知：圆心坐标（a,b)、半径r、角度deg；
	//deg = (2 * Math.PI/360) * (360 / step) * i;
	//x = a + Math.sin(deg) * r;
	//y = b + Math.cos(deg) * r;
	var r = width/2;
	var step = cfg.data.length;
	var isBlue = false;
	for (var c = 10; c > 0; c-- ) {

		ctx.beginPath();                   //重置路径 
		for (var i = 0; i < step; i++) {
			var deg = (2 * Math.PI / 360) * (360 / step) * i;
			var x = r + Math.sin(deg) * r * (c/10);
			var y = r + Math.cos(deg) * r * (c/10); 
			//ctx.arc(x, y, 5, 0, 2*Math.PI);
			ctx.lineTo(x, y);
		}
		ctx.closePath();
		ctx.fillStyle = (isBlue = !isBlue) ? '#99c0ff' : '#f1f9ff';
		ctx.fill();
	}

	//绘制伞骨
	ctx.beginPath();  
	for (var i = 0; i < step; i++) {
		var deg = (2 * Math.PI / 360) * (360 / step) * i;
		var x = r + Math.sin(deg) * r;
		var y = r + Math.cos(deg) * r; 
		//ctx.arc(x, y, 5, 0, 2*Math.PI);
		ctx.moveTo(r, r);
		ctx.lineTo(x, y);

		//输出项目名称
		var name = $('<div class="name" ></div>');
		name.text(cfg.data[i][0]);
		name.css({
			'transition': 'all 0.5s ' + i * 0.1 +'s',
			'opacity':0
		});
		
		//文字位置
		if (x > width/2) {
			name.css('left', x/2 + 5);
		}else{
			name.css('right', (width - x)/2 + 5);
		}
		if (y > height/2) {
			name.css('top', y/2 + 5);
		}else{
			name.css('bottom', (height - y)/2 + 5);
		}
		//文字颜色
		if (cfg.data[i][2]) {
			name.css('color', cfg.data[i][2])
		}

		component.append(name);
	}
	ctx.strokeStyle = '#e0e0e0';
	ctx.stroke();

	//创建canvas对象及绘图环境对象(数据层)
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	//画布尺寸
	canvas.width = ctx.width = width;
	canvas.height = ctx.height = height;
	component.append(canvas);

	//数据层基本样式
	ctx.lineWidth = 1;               //线条宽度
	ctx.strokeStyle = "#f00";       //线条样式
	ctx.fillStyle = '#ff7676';
	
	function draw (per) {
		//加载完折线（1秒），开始呈现项目名称
		if (per >= 1) {
			component.find('.name').css('opacity', 1)
		}
		if (per <= 0) {
			component.find('.name').css('opacity', 0)
		}

		ctx.clearRect(0, 0, width, height);

		//输出数据的折线
		for (var i = 0; i < step; i++) {

			var deg = (2 * Math.PI / 360) * (360 / step) * i;
			var position = cfg.data[i][1] * per;
			var x = r + Math.sin(deg) * r * position;
			var y = r + Math.cos(deg) * r * position;
			ctx.lineTo(x, y);
		}
		ctx.closePath();
		ctx.stroke();

		//输出数据的点
		for (var i = 0; i < step; i++) {

			var deg = (2 * Math.PI / 360) * (360 / step) * i;
			var position = cfg.data[i][1] * per;
			var x = r + Math.sin(deg) * r * position;
			var y = r + Math.cos(deg) * r * position;
			ctx.beginPath();
			ctx.arc(x, y, 5, 0, 2*Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	}

	component.on('onLoad', function() {
		var s = 0;
		for (var i = 0; i < 100; i++) {
			setTimeout(function() {
				s += 0.01;
				draw(s);
			},i *10);
		}
	});

	component.on('onLeave', function() {
		var s = 1;
		for (var i = 0; i < 100; i++) {
			setTimeout(function() {
				s -= 0.01;
				draw(s);
			},i *10);
		}
	});

	return component;
}