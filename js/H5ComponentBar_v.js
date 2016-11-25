/* 垂直柱图组件对象 */

var H5ComponentBar_v = function ( name, cfg ) {

  var component = H5ComponentBar( name ,cfg );

  //  计算柱图中每个项目的宽度(占父元素的百分比)
  var width = ( 100 / cfg.data.length ) >> 0 ;
  component.find('.line').width( width + '%');

  //  把进度区的宽度重设为高度，并且取消原来的宽度
  $.each( component.find('.rate') ,function(){
      var w = $(this).css('width');
      $(this).height(w).width('');
  });

  //  重新调整 DOM 结构，把百分比数值(.per)添加到进度区 (.rate)中，
  // 和色块元素(.bg)同级。返回被选元素的前一个同级元素:$(this).prev() 
  $.each( component.find('.per'),function(){
      
      $(this).appendTo( $(this).prev() ) ;
  })

  return component;
}