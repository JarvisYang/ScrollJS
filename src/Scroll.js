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
		expandWidth:function(theLength){
			//document.write(0);
			var length   = theLength;
			var objWidth;
			var finalLength;
			var objLength = this.obj.length;
			for(var i = 0;i < objLength ; ++i ){
				objWidth =  parseInt(this.obj[i].style.width);
				finalLength = parseInt(objWidth +length);
				//document.write(finalLength);
				this.obj[i].style.width = finalLength+"px";
			}	
		},

		movFromDot:function(degree,radius){
			var top = this.obj.style.
		},

	});

	/****End to inherit the new Objects into Scroll**********************/


	Scroll.extend(true,ScrollObj,Scroll);

	window.Scroll = Scroll;







})();