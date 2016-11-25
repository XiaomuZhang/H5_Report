/*柱状图组件对象*/
var H5ComponentBar = function(name, cfg) {
	var component = H5ComponentBase(name, cfg);

	$.each(cfg.data, function(index, item) {
		//创建柱状图子对象
		var line = $('<div class="line"></div>');
		var name = $('<div class="name"></div>');   //项目名称
		var rate = $('<div class="rate"></div>');	//进度条
		var per = $('<div class="per"></div>');	    //比例数据

		var bgStyle = '';
		if (item[2]) {
			bgstyle = 'style="background-color:'+item[2]+'"';
		}else{
			bgstyle='';
		}
		rate.html('<div class="background" '+bgstyle+'></div>');

		//提取柱状图对象的数据信息
		var width = item[1]*100+'%';
		name.text(item[0]);
		rate.css('width', width);
		per.text(width);

		line.append(name).append(rate).append(per);
		component.append(line);
	})

	return component;
}