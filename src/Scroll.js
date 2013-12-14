(function () {



	var noop = function () {
	};

	var ScrollObj = {};

	/******functions to be used define here**********************************/
	var isFunction = function(obj){
		return typeof(obj)==="function";
	};

	var isObject = function(obj){
		return typeof(obj)=== "object";
	};

	var isArray = function(obj){
		return Array.isArray(obj);
	};

	var isNumber = function(obj){
		return !isNaN(obj);
	};
	var isTag = function(obj){
		if(obj.indexOf("<") == 0 && obj.indexOf(">") == (obj.length - 1)){
			return true;
		}
		else{
			return false;
		}
	};
	var isExistOrDefine = function(obj){
		if(obj != null && obj != undefined){
			return true;
		}
		else{
			return false;
		}
	};


	/****define a object named Scroll ***********************************/
	var Scroll = function(){
		var theObj = arguments[0];
		ScrollObj.obj = new Array(1);
		if(theObj.indexOf(".") == 0){
			ScrollObj.obj = document.getElementsByClassName(theObj.substring(1));
		}
		else if(theObj.indexOf("#") == 0){
				ScrollObj.obj[0] = document.getElementById(theObj.substring(1));
			}
			else if(isTag(theObj)){
				ScrollObj.obj = document.getElementsByTagName(theObj.substring(1,theObj.length-1));
			}
		return ScrollObj;
	};
	Scroll.prototype = {
		constructor:Scroll,
		obj:[]
	};	

	Scroll.extend = function(){
		var deep,argsLength,parent,child,i;
		
		argsLength = arguments.length;
		if(typeof(arguments[0])==="boolean"){
			deep   = arguments[0];
			parent = arguments[1];
			i      = 2;
		}
		else{
			deep   = false;
			parent = arguments[0];
			i      = 1;
		}

		if(i == argsLength){
			--i;
			parent = this;
		}

		for(;i < argsLength ; ++i ){
			child = arguments[i];

			for(name in child){

				if(parent == child[name]||(isExistOrDefine(parent[name])&&parent[name] !== child[name])){
					continue;
				}

				if(deep&&(isObject(child[name])||isArray(child[name]))){
						parent[name] = isObject(child[name])?{}:[];
						Scroll.extend(deep,parent[name],child[name]);
						continue;
				}
				if(child[name] != undefined){
					parent[name] = child[name];
				}
			}
		}

	};
	
	/****Inherit the new Objects into Scroll*****************************/

	Scroll.extend({
		moveFromDot:function(degree,radius,time){
			var objLength     = this.obj.length;
			var countTime     = 1 ;
			var dotTop        = new Array();
			var dotLeft       = new Array();
			var theObj        = this.obj;
			var topGrowPerMS  = 0-radius/time*Math.sin(Math.PI*degree/180);
			var leftGrowPerMS = radius/time*Math.cos(Math.PI*degree/180);
			this.setAbsolute();
			for(var i = 0;i < objLength ; ++i ){
				dotTop[i]  = this.obj[i].offsetTop;
				dotLeft[i] = this.obj[i].offsetLeft;
			};
			//move the nodes
			var t = setInterval(function(){
				++countTime;
				for(var i = 0;i < objLength ; ++i ){
					theObj[i].style.top  = (dotTop[i]  +  countTime*topGrowPerMS) +"px";
					theObj[i].style.left = (dotLeft[i] +  countTime*leftGrowPerMS)+"px";
					console.log(countTime);
					if(countTime >= time){
						clearInterval(t);
					};
				};
			},1);
		},

		bounce:function(degree,yTop,decreasePercentage,time){
			var objLength  = this.obj.length;
			const gravity  = 10;
			const stopTime = 1;
			var dotTop     = new Array();
			var dotLeft    = new Array();
			var countTime  = new Array();
			var objBase    = new Array();
			var timeSpeed  = 2*Math.sqrt(2*yTop/gravity)/time;
			var Vy         = new Array();
			var Vx         = Vy/Math.tan(Math.PI*degree/180);
			this.setAbsolute();
			for(var i = 0;i < objLength ; ++i ){
				dotTop[i]    = this.obj[i].offsetTop;
				dotLeft[i]   = this.obj[i].offsetLeft;
				objBase[i] = dotTop[i] + parseFloat(this.obj[i].style.height);
				countTime[i] = 0;
				Vy[i] = Math.sqrt(2*gravity*yTop);
			};
			var theObj = this.obj;
			var t = setInterval(function(){
				//console.log(document.getElementsByClassName("hehe")[1].style.top);
				for(var i = 0;i < objLength ; ++i ){
					countTime[i] += timeSpeed;
					theObj[i].style.top  = (dotTop[i]  -  (countTime[i]*Vy[i] - 0.5*gravity*countTime[i]*countTime[i])) +"px";
					theObj[i].style.left = (dotLeft[i] +  countTime[i]*Vx)+"px";
					if((parseFloat(theObj[i].style.top) + parseFloat(theObj[i].style.height)) >= objBase[i]){
						console.log(i+":"+(countTime[i]*Vy[i] - 0.5*gravity*countTime[i]*countTime[i]));
						Vy[i] *= decreasePercentage;
						dotLeft[i] = theObj[i].offsetLeft;
						dotTop[i] = objBase[i] - parseFloat(theObj[i].style.height);
						if(countTime[i] <= stopTime){
							clearInterval(t);
						};
						countTime[i] = 0 ;
					};
				};
			},1);

		},

		changeWidth:function(theLength,time){
			var length             = theLength;
			var objLength          = this.obj.length;
			var objWidth           = new Array();
			var theObj             = this.obj;
			var countTime          = 0;
			var changeLengthPerSec = theLength/time;
			for(var i = 0;i < objLength ; ++i ){
				objWidth[i] =  parseInt(this.obj[i].style.width);
			};
			var t = setInterval(function(){
				++countTime;
				for(var i = 0;i < objLength ; ++i ){
					theObj[i].style.width  = (objWidth[i]  +  countTime*changeLengthPerSec) +"px";
					//console.log(countTime);
					if(countTime >= time){
						clearInterval(t);
					};
				};
			},1);
		},

		changeHeight:function(theLength,time){
			var length             = theLength;
			var objLength          = this.obj.length;
			var objHeight          = new Array();
			var theObj             = this.obj;
			var countTime          = 0;
			var changeLengthPerSec = theLength/time;
			for(var i = 0;i < objLength ; ++i ){
				objHeight[i] =  parseInt(this.obj[i].style.height);
			};
			var t = setInterval(function(){
				++countTime;
				for(var i = 0;i < objLength ; ++i ){
					theObj[i].style.height  = (objHeight[i]  +  countTime*changeLengthPerSec) +"px";
					//console.log(countTime);
					if(countTime >= time){
						clearInterval(t);
					};
				};
			},1);
		},



	});
	/**Inherit the new Objects into Scroll 
	 * in order to change property of the nodes
	 */
	Scroll.extend({
		expandWidth:function(theLength){
			var length    = theLength;
			var objLength = this.obj.length;
			var objWidth;
			var finalLength;
			for(var i = 0;i < objLength ; ++i ){
				objWidth =  parseInt(this.obj[i].style.width);
				finalLength = parseInt(objWidth +length);
				this.obj[i].style.width = finalLength+"px";
			}	
		},
		setAbsolute:function(){
			var objLength = this.obj.length;
			var countTime = 1 ;
			var dotTop;
			var dotLeft;
			for(var i = 0;i < objLength ; ++i ){
				dotTop  = this.obj[i].offsetTop;
				dotLeft = this.obj[i].offsetLeft;
				this.obj[i].style.top      = dotTop + "px";
				this.obj[i].style.left     = dotLeft + "px";
			};
			for(var i = 0;i < objLength ; ++i ){
				this.obj[i].style.position = "absolute";
			};
		},
	});

	/****End to inherit the new Objects into Scroll**********************/


	Scroll.extend(true,ScrollObj,Scroll);

	window.Scroll = Scroll;







})();