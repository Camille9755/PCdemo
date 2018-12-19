;(function(w){
	w.cam={}
	w.cam.vMove=function vMove(wrap,callBack){
	//滑屏区域
//	var wrap = document.querySelector(".camille-drag-nav");
	//滑屏元素
	var item = wrap.children[0];
	
	//元素一开始的位置  手指一开始的位置
	var start={};
	var element={};
	var minY = wrap.clientHeight - item.offsetHeight;
	//快速滑屏的必要参数
	var lastTime =0;
	var lastPoint =0;
	var timeDis =1 ;
	var pointDis =0;
	
	var isY = true
	var isFirst = true
	var kuaitime=0
	var Tween = {
		Linear: function(t,b,c,d){ return c*t/d + b; },
		back: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    	}
	}
	wrap.addEventListener("touchstart",function(ev){
		
		ev=ev||event;
		var touchC = ev.changedTouches[0];
		
		start ={clientX:touchC.clientX,clientY:touchC.clientY} ;
		element.y = camille.css(item,"translateY");
		item.style.transition="none";
		
		lastTime = new Date().getTime();
		lastPoint = touchC.clientY;
		//lastPoint = camille.css(item,"translateY");
		
		//清除速度的残留
		pointDis=0;
		isY = true
		isFirst = true
		clearInterval(kuaitime)
		
		if(callBack&&typeof callBack["start"]==="function"){
			callBack["start"].call(item)
		}
	})
	
	wrap.addEventListener("touchmove",function(ev){
		if(!isY){
			return
		}
		ev=ev||event;
		var touchC = ev.changedTouches[0];
		var now ={clientX:touchC.clientX,clientY:touchC.clientY} ;
		var disY = now.clientY - start.clientY;
		var disX = now.clientX - start.clientX;
		var translateY = element.y+disY;
		
		if(isFirst){
			isFirst = false
			if(Math.abs(disX)>Math.abs(disY)){
				isY = false
				return
			}
		}
		
		var nowTime =new Date().getTime();
		var nowPoint = touchC.clientY;
		timeDis = nowTime - lastTime;
		pointDis = nowPoint - lastPoint;
		
		lastTime = nowTime;
		lastPoint = nowPoint;
		
		/*手动橡皮筋效果
		 * 
		 * 在move的过程中，每一次手指touchmove真正的有效距离慢慢变小，元素的滑动距离还是在变大
		 * 
		 * pointDis：整个手指touchmove真正的有效距
		 * 
		 * translateY = camille.css(item,"translateY") + pointDis*scale;!!!
		 * 
		 * */
		item.handMove = false;
		if(translateY>0){
			item.handMove = true;
			var scale = document.documentElement.clientHeight/((document.documentElement.clientHeight+translateY)*1.5);
			translateY = camille.css(item,"translateY") + pointDis*scale;
		}else if(translateY<minY){
			item.handMove = true;
			var over = minY - translateY;
			var scale = document.documentElement.clientHeight/((document.documentElement.clientHeight+over)*1.5);
			translateY = camille.css(item,"translateY") + pointDis*scale;
		}
		camille.css(item,"translateY",translateY);
		
		if(callBack&&typeof callBack["move"] === "function"){
			callBack["move"].call(item);
		}
	})
	
	wrap.addEventListener("touchend",function(ev){
		var translateY = camille.css(item,"translateY");
		if(!item.handMove){
			//快速滑屏
			//速度越大  位移越远
			var speed = pointDis/timeDis;
			speed = Math.abs(speed)<0.5?0:speed;
			var targetY = translateY + speed*200;
			var time = Math.abs(speed)*0.2;
			time = time<0.8?0.8:time;
			time = time>2?2:time;
			//快速滑屏的橡皮筋效果
			var type="Linear";
			if(targetY>0){
				targetY=0;
				type="back";
				//bsr = "cubic-bezier(.26,1.51,.68,1.54)";
			}else if(targetY<minY){
				targetY = minY;
				type="back";
				//bsr = "cubic-bezier(.26,1.51,.68,1.54)";
			}
			item.style.transition=time+"s "+bsr+" transform";
			//camille.css(item,"translateY",targetY);
			bsr(type,targetY,time)
		}else{
			//手动橡皮筋效果
			item.style.transition="1s transform";
			if(translateY>0){
				translateY=0;
				camille.css(item,"translateY",translateY);
			}else if(translateY<minY){
				translateY = minY;
				camille.css(item,"translateY",translateY);
			}			
		}
		
		
	})
	function bsr(type,targetY,time){
		clearInterval(kuaitime)
		var frq=1000/60
		var t = 0
		var b = camille.css(item,"translateY")
		var c = targetY - b
		var d = time*1000/frq
		
		kuaitime=setInterval(function(){
			t++
			if(callBack&&typeof callBack["move"]==="function"){
				callBack["move"].call(item)
			}
			if(t>d){
				clearInterval(kuaitime)
				if(callBack&&typeof callBack["end"]==="function"){
					callBack["end"]()
				}
			}
			
			var point = Tween[type](t,b,c,d)
			camille.css(item,"translateY",point)
		},frq)
	}
}
})(window)
