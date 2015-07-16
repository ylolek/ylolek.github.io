
var imageLoader = (function(){
	var imgsLoaded = 0;
	var imgs = [];

	var _reset = function(){
		imgsLoaded = 0;
		imgs = [];
	}

	var _loadImage = function (imgObjArr, onAllLoad, onError){
		if (imgObjArr instanceof Array == false){
			var errMsg = 'Error >> first argument must be an array. ' + typeof imgObjArr + ' given.';
			if (typeof onError === 'function'){
				onError(errMsg);
				return false;
			}

			error.throw('InvalidArgument', errMsg);
			return false;
		}

		//load images
		for (var i=0; i<imgObjArr.length; i++){
			var img = new Image();
			//image load event
			img.addEventListener('load', function(){
				//call act. image onLoad function
				if (typeof imgObjArr[this.index].onLoad === 'function'){
					imgObjArr[this.index].onLoad(this);
				}

				imgsLoaded++;
				//check if all loaded
				if (imgsLoaded == imgObjArr.length){
					if (typeof onAllLoad === 'function') onAllLoad(imgs);
					_reset();
				}
			}, false);

			//img error event
			img.addEventListener('error', function(){
				var errMsg = 'can\'t load image ';
				//call act. image onError function
				if (typeof imgObjArr[this.index].onError === 'function'){
					imgObjArr[this.index].onError(errMsg, this);
				}

				//than call main onError
				if (typeof onError === 'function'){
					onError(errMsg, this);
				}

				//throw an error
				error.throw('InvalidImage', errMsg + img.src);

				_reset();
			}, false);
			img.src = imgObjArr[i].src;
			img.index = i;

			imgs.push(img);
		}
	}

	return{
		/*
			imgObjArr array of objects:
			{
				src : path to image
				onLoad : function(img), when image loaded gets called with current image object as argument
				onError : function(errMsg, img), when image failed to load gets called
			}

		*/
		load : function(imgObjArr, onAllLoad, onError){
			_loadImage(imgObjArr, onAllLoad, onError);
		}
	}
}());