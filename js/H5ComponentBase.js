/*基本组件对象*/
var H5ComponentBase = function(name,cfg) {
	var cfg = cfg || {};
	var id = ('h5_c_'+Math.random()).replace('.','_');

	//把当前组件类型添加到样式名中进行标记
	var cls = ' h5_component_name_'+name+' h5_component_'+cfg.type;
	//创建jQuery对象
	var  component = $('<div class="h5_component'+cls+'" id="'+id+'"></div>');

	cfg.text && component.text(cfg.text);
	cfg.width && component.width(cfg.width/2);
	cfg.height && component.height(cfg.height/2);
	cfg.bg && component.css('backgroundImage','url('+cfg.bg+')');
	cfg.css && component.css(cfg.css);

	//组件居中
	if(cfg.center === true) {
		component.css({
			'margin-left':(cfg.width/4) * -1 + 'px',
			'left':'50%'
		});
	}

	//自定义参数
	if (typeof cfg.onclick === 'function') {
		component.on('click', cfg.onclick);
	}
	component.on('onLoad', function() {
		setTimeout(function(){
			component.removeClass(cls + '_leave').addClass(cls + '_load');
			cfg.animateIn && component.animate(cfg.animateIn );
		},cfg.delay || 0);
		return false;	
	});

	component.on('onLeave', function() {
		component.removeClass(cls + '_load').addClass(cls + '_leave');
		cfg.animateOut && component.animate(cfg.animateOut );
		return false;
	});

	return component;
}