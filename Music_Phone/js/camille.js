+(function(w){
	w.camille = {};
	w.camille.css=function (node,type,val){
			if(typeof node ==="object" && typeof node["transform"] ==="undefined" ){
				node["transform"]={};
			}
			
			if(arguments.length>=3){
				//设置
				var text ="";
				node["transform"][type] = val;
				
				for( item in node["transform"]){
					if(node["transform"].hasOwnProperty(item)){
						switch (item){
							case "translateX":
							case "translateY":
								text +=  item+"("+node["transform"][item]+"px)";
								break;
							case "scale":
								text +=  item+"("+node["transform"][item]+")";
								break;
							case "rotate":
								text +=  item+"("+node["transform"][item]+"deg)";
								break;
						}
					}
				}
				node.style.transform = node.style.webkitTransform = text;
			}else if(arguments.length==2){
				//读取
				val =node["transform"][type];
				if(typeof val === "undefined"){
					switch (type){
						case "translateX":
						case "translateY":
						case "rotate":
							val =0;
							break;
						case "scale":
							val =1;
							break;
					}
				}
				return val;
			}
		}
	w.camille.carousel=function (arr){
				//布局
				var carouselWrap = document.querySelector(".carousel-wrap");
				if(carouselWrap){
					var pointslength = arr.length;
					
					//无缝
					var needCarousel = carouselWrap.getAttribute("needCarousel");
					needCarousel = needCarousel == null?false:true;
					if(needCarousel){
						arr=arr.concat(arr);
					}
					
					
					var ulNode = document.createElement("ul");
					var styleNode = document.createElement("style");
					ulNode.classList.add("list");
					for(var i=0;i<arr.length;i++){
						ulNode.innerHTML+='<li><a href="javascript:;"><img src="'+arr[i]+'"/></a></li>';
					}
					styleNode.innerHTML=".carousel-wrap > .list > li{width: "+(1/arr.length*100)+"%;}.carousel-wrap > .list{width: "+arr.length+"00%}";
					carouselWrap.appendChild(ulNode);
					document.head.appendChild(styleNode);
					
					var imgNodes = document.querySelector(".carousel-wrap > .list > li > a >img");
					setTimeout(function(){
						carouselWrap.style.height=imgNodes.offsetHeight+"px";
					},100)
					
					var pointsWrap = document.querySelector(".carousel-wrap > .points-wrap");
					if(pointsWrap){
						for(var i=0;i<pointslength;i++){
							if(i==0){
								pointsWrap.innerHTML+='<span class="active"></span>';
							}else{
								pointsWrap.innerHTML+='<span></span>';
							}
						}
						var pointsSpan = document.querySelectorAll(".carousel-wrap > .points-wrap > span");
					}
					
					
					
					/*滑屏
					 * 	1.拿到元素一开始的位置
					 * 	2.拿到手指一开始点击的位置
					 * 	3.拿到手指move的实时距离
					 * 	4.将手指移动的距离加给元素
					 * */
					var index =0;
					//手指一开始的位置
					var startX = 0;
					//元素一开始的位置
					var elementX = 0;
					var startY=0;
					var elementY =0;
					//var translateX =0;
					var isX=true
					var isFirst=true
					carouselWrap.addEventListener("touchstart",function(ev){
						ev=ev||event;
						var TouchC = ev.changedTouches[0];
						ulNode.style.transition="none";
						
						//无缝
						/*点击第一组的第一张时 瞬间跳到第二组的第一张
						点击第二组的最后一张时  瞬间跳到第一组的最后一张*/
						//index代表ul的位置
						if(needCarousel){
							var index = camille.css(ulNode,"translateX")/document.documentElement.clientWidth;
							if(-index === 0){
								index = -pointslength;
							}else if(-index ==(arr.length-1)){
								index = -(pointslength-1)
							}
							camille.css(ulNode,"translateX",index*document.documentElement.clientWidth)
						}
						
						
						
						startX=TouchC.clientX;
						startY=TouchC.clientY;
						//elementX=ulNode.offsetLeft;
						//elementX=translateX;
						elementX=camille.css(ulNode,"translateX");
						elementY=camille.css(ulNode,"translateY");
						
						//清楚定时器
						clearInterval(timer);
						
						isX=true
						isFirst=true
					})
					carouselWrap.addEventListener("touchmove",function(ev){
						if(!isX){
							return
						}
						ev=ev||event;
						var TouchC = ev.changedTouches[0];
						var nowX = TouchC.clientX;
						var nowY = TouchC.clientY;
					    var disX = nowX - startX;
					    var disY = nowY - startY;
					   
					    if(isFirst){
							isFirst=false
							if(Math.abs(disY)>Math.abs(disX)){
								isX=false
								return
							}
						}
						//ulNode.style.left = elementX+disX+"px";
						
						/*translateX = elementX+disX;
						ulNode.style.transform = 'translateX('+translateX+'px)';*/
						camille.css(ulNode,"translateX",elementX+disX);
					})
					carouselWrap.addEventListener("touchend",function(ev){
						ev=ev||event;
						//index抽象了ul的实时位置
						//var index = ulNode.offsetLeft/document.documentElement.clientWidth;
						//var index = translateX/document.documentElement.clientWidth;
					    index = camille.css(ulNode,"translateX")/document.documentElement.clientWidth;
						index = Math.round(index);
						
						//超出控制
						if(index>0){
							index=0;
						}else if(index<1-arr.length){
							index=1-arr.length;
						}
						
						xiaoyuandian(index);
						
						ulNode.style.transition=".5s transform";
						//ulNode.style.left = index*(document.documentElement.clientWidth)+"px";
						/*translateX=index*(document.documentElement.clientWidth);
						ulNode.style.transform ='translateX('+translateX+'px)';*/
						camille.css(ulNode,"translateX",index*(document.documentElement.clientWidth));
						
						//开启自动轮播
						if(needAuto){
							auto();
						}
					})
				
					//自动轮播
					var timer =0;
					var needAuto = carouselWrap.getAttribute("needAuto");
					needAuto = needAuto == null?false:true;
					if(needAuto){
						auto();
					}
					function auto(){
						clearInterval(timer);
						timer=setInterval(function(){
							if(index == 1-arr.length){
								ulNode.style.transition="none";
								index = 1-arr.length/2;
								camille.css(ulNode,"translateX",index*document.documentElement.clientWidth);
							}
							setTimeout(function(){
								index--;
								ulNode.style.transition="1s transform";
								xiaoyuandian(index);
								camille.css(ulNode,"translateX",index*document.documentElement.clientWidth);
							},50)
						},2000)
					}
					
					function xiaoyuandian(index){
						if(!pointsWrap){
							return;
						}
						for(var i=0;i<pointsSpan.length;i++){
							pointsSpan[i].classList.remove("active");
						}
						pointsSpan[-index%pointslength].classList.add("active");
					}
				}
			}
	w.camille.dragNav=function(){
				//滑屏区域
				var wrap = document.querySelector(".camille-drag-nav");
				//滑屏元素
				var item = document.querySelector(".camille-drag-nav .list");
				
				//元素一开始的位置  手指一开始的位置
				var startX=0;
				var elementX =0;
				var minX = wrap.clientWidth - item.offsetWidth;
				//快速滑屏的必要参数
				var lastTime =0;
				var lastPoint =0;
				var timeDis =1 ;
				var pointDis =0;
				
				wrap.addEventListener("touchstart",function(ev){
					ev=ev||event;
					var touchC = ev.changedTouches[0];
					
					startX = touchC.clientX;
					elementX = camille.css(item,"translateX");
					
					item.style.transition="none";
					
					lastTime = new Date().getTime();
					lastPoint = touchC.clientX;
					//lastPoint = camille.css(item,"translateX");
					
					//清除速度的残留
					pointDis=0;
					
				})
				
				wrap.addEventListener("touchmove",function(ev){
					
					ev=ev||event;
					var touchC = ev.changedTouches[0];
					var nowX = touchC.clientX;
					var disX = nowX - startX;
					var translateX = elementX+disX;
					
					var nowTime =new Date().getTime();
					var nowPoint = touchC.clientX;
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
					 * translateX = camille.css(item,"translateX") + pointDis*scale;!!!
					 * 
					 * */
					item.handMove = false;
					if(translateX>0){
						item.handMove = true;
						var scale = document.documentElement.clientWidth/((document.documentElement.clientWidth+translateX)*1.5);
						translateX = camille.css(item,"translateX") + pointDis*scale;
					}else if(translateX<minX){
						item.handMove = true;
						var over = minX - translateX;
						var scale = document.documentElement.clientWidth/((document.documentElement.clientWidth+over)*1.5);
						translateX = camille.css(item,"translateX") + pointDis*scale;
					}
					camille.css(item,"translateX",translateX);
				})
				
				wrap.addEventListener("touchend",function(ev){
					var translateX = camille.css(item,"translateX");
					if(!item.handMove){
						//快速滑屏
						//速度越大  位移越远
						var speed = pointDis/timeDis;
						speed = Math.abs(speed)<0.5?0:speed;
						var targetX = translateX + speed*200;
						var time = Math.abs(speed)*0.2;
						time = time<0.8?0.8:time;
						time = time>2?2:time;
						//快速滑屏的橡皮筋效果
						var bsr="";
						if(targetX>0){
							targetX=0;
							bsr = "cubic-bezier(.26,1.51,.68,1.54)";
						}else if(targetX<minX){
							targetX = minX;
							bsr = "cubic-bezier(.26,1.51,.68,1.54)";
						}
						item.style.transition=time+"s "+bsr+" transform";
						camille.css(item,"translateX",targetX);
						
					}else{
						//手动橡皮筋效果
						item.style.transition="1s transform";
						if(translateX>0){
							translateX=0;
							camille.css(item,"translateX",translateX);
						}else if(translateX<minX){
							translateX = minX;
							camille.css(item,"translateX",translateX);
						}			
					}
				})
			}
	w.camille.vMove=function(wrap,callBack){
		//滑屏区域
		//滑屏元素
		var item = wrap.children[0]
		camille.css(item,"translateZ",0.1)
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
			
			minY = wrap.clientHeight - item.offsetHeight;
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
				if(callBack&&typeof callBack["end"]==="function"){
					callBack["end"]()
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
				if(callBack&&typeof callBack["autoMove"]==="function"){
					callBack["autoMove"].call(item)
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
