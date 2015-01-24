var Slider = (function ($) {

	var startY = null;	// 开始移动Y值
	var moveY = null;	// 移动过程中Y值
	var endY = null;	// 移动结束Y值
	var page_n = 0;		// 当前在第几页
	var total_page = 0;	// 总页数
	var is_moving = false;	
	var moving_direct = "";	// 移动方向，up：向上；down：向下
	var pageHeight = $(window).height();
	var minDeltaY = 10;	// 触发翻页的最小高度
	var minAbortDeltaY = 50; // 如果滑动距离小于此值，则放弃翻页
	var is_abort = false;	// 是否放弃翻页
	
	// 初始化
	var init = function(e){
		total_page = $(".slide-page").size();
		page_n = $(".slide-page").index($(".slide-page.show"));
		changeOpen();
	};

	//绑定事件
	var changeOpen = function (e){
		$(".slide-page").on('mousedown touchstart',page_touchstart);
		$(".slide-page").on('mousemove touchmove',page_touchmove);
		$(".slide-page").on('mouseup touchend mouseout',page_touchend);
	};
	
	//取消绑定事件
	var changeClose = function (e){
		$(".slide-page").off('mousedown touchstart');
		$(".slide-page").off('mousemove touchmove');
		$(".slide-page").off('mouseup touchend mouseout');
	};

	function getPositionY(e){
		var y = 0;
		if (e.type.indexOf("mouse") !== -1) {
			y = e.y || e.pageY;
		} else {
			y = window.event.touches[0].pageY;
		}
		return y;
	};

	//触摸（鼠标按下）开始函数
	function page_touchstart(e){
		startY = getPositionY(e);
		console.log('page_touchstart', startY);
	};

	function page_touchmove(e){
		// prevent default scroll
		e.preventDefault();
		e.stopPropagation();

		moveY = getPositionY(e);
		deltaY = moveY - startY;
		if(is_moving){
			if(moving_direct == "down"){
				$(".slide-page.active").css("top",pageHeight+deltaY);
			}else{
				$(".slide-page.active").css("top",-pageHeight+deltaY);
			}
		}else{
			if (deltaY < -minDeltaY){
				if(page_n !== total_page-1){		// 尾页不能往下翻
					is_moving = true;
					moving_direct = "down";
					$(".slide-page").eq(page_n+1).addClass("active").css("top",pageHeight);
				}
			}else if(deltaY > minDeltaY){
				if(page_n !== 0){	// 首页不能往上翻
					is_moving = true;
					moving_direct = "up";
					$(".slide-page").eq(page_n-1).addClass("active").css("top",-pageHeight);
				}
			}
		}
	};

	function page_touchend(e){
		endY = moveY;
		deltaY = endY - startY;
		if(is_moving){
			if(moving_direct === "down" && deltaY > -minAbortDeltaY){
				is_abort = true;
				$(".slide-page").eq(page_n+1).removeClass("active").css("top",0);
			}else if(moving_direct === "up" && deltaY < minAbortDeltaY){
				is_abort = true;
				$(".slide-page").eq(page_n-1).removeClass("active").css("top",0);
			}
		}

		if(is_moving && !is_abort){
			if(moving_direct === "down"){
				$(".slide-page.active").css("top",0);
				$(".slide-page").eq(page_n).removeClass("show").addClass("hide");
				$(".slide-page").eq(page_n+1).removeClass("active hide").addClass("show");
				$('body').trigger('addscene', page_n+1);
				$('body').trigger('leavescene', page_n);
				page_n += 1;
			}else{
				$(".slide-page.active").css("top",0);
				$(".slide-page").eq(page_n).removeClass("show").addClass("hide");
				$(".slide-page").eq(page_n-1).removeClass("active hide").addClass("show");
				$('body').trigger('addscene', page_n-1);
				$('body').trigger('leavescene', page_n);
				page_n -= 1;
			}
		}
		// 恢复初始值
		is_moving = false;
		is_abort = false;
		moving_direct = "";
		console.log('page_touchend', endY, is_abort, deltaY, endY, startY);
	};

	return {
		init: init,
		changeOpen: changeOpen,
		changeClose: changeClose
	};
})(jQuery); 
