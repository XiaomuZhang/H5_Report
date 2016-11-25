/*散点图表组件对象*/
var H5ComponentPoint = function(name, cfg) {
	var component = H5ComponentBase(name, cfg);
	var baseData = cfg.data[0][1];

	//each提取散点图数据
	$.each(cfg.data, function(index, item) {
		//创建散点图子对象
		var point = $('<div class="point point_'+index+'"></div>');
		var name = $('<div class="name">'+item[0]+'</div>');
		var per = $('<div class="per">'+(item[1]*100)+'%</div>');
		name.append(per);
		point.append(name);

		//设置散点图的比例大小
		var ration = (item[1]/baseData)*100 + '%';
		point.css({width:ration,height:ration});

		//设置颜色
		if (item[2]) {
			point.css('background-color',item[2]);
		}

		//存储散点图位置
		if (item[3] !== undefined && item[4] !== undefined) {
			/*point.css({'left':item[3],'top':item[4]});*/
			point.data('left',item[3]).data('top',item[4]);
		}

		//初始化散点图位置
		point.css('zIndex', 100-index);
		point.css({'left':0,'top':0});
		//过渡动画
		point.css('transition','all 1s '+index*0.5+'s');
		//散点图对象插入组件对象中
		component.append(point);
	});

	component.on('onLoad', function() {
		component.find('.point').each(function(index, item) {
			$(item).css({'left':$(item).data('left'),
					'top':$(item).data('top')
				});
		});
	});
	component.on('onLeave', function() {
		component.find('.point').each(function(index, item) {
			$(item).css({'left':0,'top':0});
		});
	});

	return component;
}