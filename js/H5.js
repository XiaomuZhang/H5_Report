/*内容管理对象*/
var H5 = function() {
	this.id = ('h5_' + Math.random()).replace('.','_');
	this.element = $('<div class="h5" id="'+this.id+'"></div>').hide();
	this.page = [];
	$('body').append(this.element);

	/*
	*对象内设置添加页面方法
	*组件名称name，添加到className中
	*页面内默认文本 text
	*/
	this.addPage = function(name, text) {
		//创建jQuery对象
		var page = $('<div class="h5_page section" ></div>');
		if (name != undefined) {
			page.addClass('h5_page_' + name);
		}
		if (text != undefined) {
			page.text(text);
		}
		this.element.append(page);
		//将每个page对象存入空数组
		this.page.push(page);

		//每次页面加载完成，底部加入footer组件
		this.addComponent('slide-up',{
					height:39,
					bg:'imgs/footer.png',
					css:{width:'100%',opacity:0,left:0,bottom:-20,zIndex:900},
					animateIn:{opacity:1,bottom:-1},
					animateOut:{opacity:0,bottom:-20}
				})

		return this;
	};

	/*对象中设置添加组件方法*/
	this.addComponent = function(name, cfg) {
		//从数组中提取page对象（该cmponent所在的对象为数组中最后一个元素）
		var page = this.page[this.page.length-1];
		//var page = this.page.slice(-1)[0];

		var cfg = cfg || {};

		//重新定义组件类型
		cfg = $.extend({
			type:'base',
		},cfg);

		//component对象用于存储组件元素
		var component 
		switch (cfg.type) {
			//创建组件对象，并传入参数
			case 'base':
				component = H5ComponentBase(name, cfg);
			break;
			case 'polyline':
				component = H5ComponentPolyline(name, cfg);
				break;
			case 'pie':
				component = H5ComponentPie(name, cfg);
				break;
			case 'bar':
			component = H5ComponentBar(name, cfg);
				break;
			case 'bar_v':
				component = H5ComponentBar_v(name, cfg);
				break;
			case 'radar':
				component = H5ComponentRadar(name, cfg);
				break;
			case 'point':
				component = H5ComponentPoint(name, cfg);
				break;
			default:
		}

		page.append(component);
		return this;
	};

	/*h5对象呈现*/
	this.loader = function(images, firstPage) {

		var id = this.id;

		if (this._imgNum === undefined) { //第一次进入
			this._imgNum = (images || []).length;
			this._count = 0;
			//当前对象存储在全局对象window中,因为在下面调用loader函数时，this指向img
			window[id] = this;
		
			for (s in images ) {
				var item = images[s];
				var img = new Image();
				img.onload = function () {
					window[id].loader();
				};
				img.src = item;
			}
			//浏览器会将所有的src属性添加完以后，立即执行for循环外的不耗时语句，
			//再触发onload事件
			$('#rate').text('0%');
			return this;
			
		}else{
			//浏览器向缓冲加载完某一张图片,进入loader函数(H5_loading函数)，开始更新数据
			this._count ++;
			$('#rate').text( ((this._count/this._imgNum * 100 ) >> 0 )+ '%');

			//没有加载完图片就退出函数，不执行H5_loading函数后面的语句
			//也就是没有加载完图片，就不呈现之后的页面
			if (this._count < this._imgNum) {
				return this;
			}

			window[id] = null;
		}

		this.element.fullpage({
			onLeave: function(index,nextIndex,direction) {
				$(this).find('.h5_component').trigger('onLeave');
			},
			afterLoad: function(anchorLink,index) {
				$(this).find('.h5_component').trigger('onLoad');
			}
		});

		this.element.show();

		if (firstPage) {
			this.element.fullpage.moveTo(firstPage);
			/*$.fn.fullpage.moveTo(firstPage);*/
		}
	};

};