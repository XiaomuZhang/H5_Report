/*饼状图基本组件对象*/
var H5ComponentPie = function (name, cfg) {
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
	$(canvas).css('zIndex', 1);
	component.append(canvas);
	var r = width/2;

	//背景层基本样式
	ctx.beginPath();
	ctx.lineWidth = 1;              //线条宽度
	ctx.strokeStyle = "#eee";       //线条样式
	ctx.fillStyle = '#eee';			//填充样式
	ctx.arc(r, r, r, 0, 2*Math.PI);
	ctx.stroke();
	ctx.fill();

	//数据层
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	//画布尺寸
	canvas.width = ctx.width = width;
	canvas.height = ctx.height = height;
	$(canvas).css('zIndex', 2);
	component.append(canvas);

	var colors =  ['green', 'red', 'blue', 'orange', 'pink'];
	var sAngle = 1.5 * Math.PI; //起始角度
	var eAngle = 0;
	var cAngle = 2 * Math.PI; //100%圆结束时的角度，2pi = 360度

	var step = cfg.data.length;
	for (var i = 0; i < step; i++) {

		var item = cfg.data[i];
		var color = item[2] || colors.pop();
		eAngle = sAngle + cAngle * item[1];

		ctx.beginPath();
		ctx.lineWidth = 0.1;              
		ctx.strokeStyle = color;       
		ctx.fillStyle = color;	
		ctx.moveTo(r, r);		
		ctx.arc(r, r, r, sAngle, eAngle);
		ctx.stroke();
		ctx.fill();
		sAngle = eAngle;

		//插入项目名称
		var name = $('<div class="name"></div');
		name.text(item[0]);
		var per =$('<div class="per" ></div>');
		per.text(item[1] * 100 +'%');
		name.append(per);

		var x = r + r * Math.sin(0.5*Math.PI - eAngle);
		var y = r + r * Math.cos(0.5*Math.PI - eAngle);

		if ( x > width/2) {
			name.css('left', x/2);
		}else{
			name.css('right', (width-x)/2);
		}
		if (y > height/2) {
			name.css('top', y/2);
		}else{
			name.css('bottom', (height-y)/2);
		}
		if (item[2]) {
			name.css('color', item[2]);
		}

		component.append(name);
	}

	//创建遮罩层
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	//画布尺寸
	canvas.width = ctx.width = width;
	canvas.height = ctx.height = height;
	$(canvas).css('zIndex', 3);
	component.append(canvas);
	//遮罩层基本样式
	ctx.lineWidth = 1;              	//线条宽度
	ctx.strokeStyle = "#e0e0e0";       //线条样式
	ctx.fillStyle = '#e0e0e0';			//填充样式
	ctx.arc(r, r, r+1, 0, 2*Math.PI);
	ctx.stroke();
	ctx.fill();

	function draw (per) {

		if (per >= 1) {
			component.find('.name').css('opacity', 1);
		}

		ctx.clearRect(0, 0, width, height);

		ctx.beginPath();
		ctx.moveTo(r, r);
		if (per <= 0) {
			ctx.arc(r, r, r+1, sAngle, sAngle +2*Math.PI);
			component.find('.name').css('opacity', 0);
		}else{
			ctx.arc(r, r, r+1, sAngle, sAngle +2*Math.PI *per, true);	
		}
		ctx.stroke();
		ctx.fill();

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