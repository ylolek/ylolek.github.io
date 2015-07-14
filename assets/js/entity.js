
	function entity(entityObj){
		this.deltaT = 0;
		this.actAnimProps = {};
		this.requestedAnim = '';
		this.actAnimation = {
			name : '',
			frame : 1,
			anchor : false
		}
		this.actMove = {
			direction : '',
			anchor : false
		}
		this.playAnim = true;
		this.canMove = true;
		this.props = entityObj;

		this.position = {
			x : entityObj.startPos.x,
			y : entityObj.startPos.y
		}

		this.clip = {
			x : entityObj.clip.startX,
			y : entityObj.clip.startY,
			width : entityObj.clip.width,
			height : entityObj.clip.height
		}
	}

	entity.prototype = {
		getAnimProps : function(){
			if (this.props.animations instanceof Array == false) return false;

			var retObj = null;
			this.props.animations.some(function(animation){
				if (animation.name.toLowerCase() == this.actAnimation.name){
					retObj = animation;
				}
			}, this);


			return retObj;
		},

		doAnim : function(){
			if (this.requestedAnim != this.actAnimation.name){
				this.actAnimation.name = this.requestedAnim;
				this.actAnimation.frame = 1;
				this.actAnimProps = this.getAnimProps();

				this.clip.x = this.actAnimProps.clipSX;
				this.clip.y = this.actAnimProps.clipSY;
			}

			if (this.actAnimProps == null || !this.playAnim){
				return false;
			}

			if (Math.floor(this.actAnimation.frame) > this.actAnimProps.frames){
				if (this.actAnimProps.loop){
					this.actAnimation.frame = 1;
					var _frame = 1;
				}else{
					this.actAnimation.frame = this.actAnimProps.frames;
					var _frame = this.actAnimProps.frames;
				}
			}else{
				this.actAnimation.frame += this.actAnimProps.speed * this.deltaT;
				var _frame = Math.min(this.actAnimProps.frames, Math.floor(this.actAnimation.frame));
			}

			/*this.clip.x = this.actAnimProps.clipSX + (_frame - 1) * (this.clip.width * this.actAnimProps.clipStep);
			this.clip.y = this.actAnimProps.clipSY;*/

			if (this.actAnimProps.frame instanceof Array && this.actAnimProps.frame[_frame - 1] != null){
				var clipX = this.actAnimProps.frame[_frame - 1].x;
				var clipY = this.actAnimProps.frame[_frame - 1].y;
			}else{
				var clipX = this.actAnimProps.clipSX + (_frame - 1) * (this.clip.width * this.actAnimProps.clipStep);
				var clipY = this.actAnimProps.clipSY;
			}

			this.clip.x = clipX;
			this.clip.y = clipY;
		},

		//goes to current animation *frame* and stops
		gotoAndStop : function(frame){
			if (isNaN(frame)){
				return false;
			}

			this.playAnim = false;

			if (this.actAnimProps.frame instanceof Array){
				var clipX = this.actAnimProps.frame[frame - 1].x;
				var clipY = this.actAnimProps.frame[frame - 1].y;
			} else {
				var clipX = this.actAnimProps.clipSX + Math.round(frame - 1) * (this.clip.width * this.actAnimProps.clipStep);
				var clipY = this.actAnimProps.clipSY;
			}

			this.clip.x = clipX;
			this.clip.y = clipY;
		},

		//call it in a lopp
		animate : function(animStr, deltaT, anchor){
			if (!animStr.length || (this.actAnimation.anchor && !anchor)){
				return false;
			}

			var isAnchor = anchor ? anchor : false;
			if (isAnchor || !this.actAnimation.anchor){
				this.requestedAnim = animStr.toLowerCase();
			} else{
				this.requestedAnim = this.actAnimation.name;
			}

			//this.playAnim = true;
			this.deltaT = deltaT;
			this.actAnimation.anchor = isAnchor;

			this.doAnim();
		},

		//call it in a loop
		move : function(direction, deltaT, anchor){
			if (!this.canMove || (this.actMove.anchor && !anchor)){
				return false;
			}

			var isAnchor = anchor ? anchor : false;
			if (isAnchor || !this.actMove.anchor){
				var dir = direction;
			} else{
				var dir = this.actMove.direction;
			}

			this.actMove.direction = dir;
			this.actMove.anchor = isAnchor;

			//check if speed is frame rate dependent
			if (this.props.speedFRD){
				//speed calculation, assuming a maximum of 60 fps
				var curFPS = 1 / deltaT;
				//var FPSPerc = curFPS / 60 * 100;
				var FPSPerc = Math.min(60, curFPS) / 60 * 100;
				//min 5 pixels
				var speed = Math.max(5, Math.min(this.props.speed, (this.props.speed * FPSPerc / 100)));
				//var speed = Math.min(this.props.speed, (this.props.speed * FPSPerc / 100));
			}else {
				var speed = this.props.speed;
			}

			switch (dir.toLowerCase()){
				case 'up' :
					this.position.y -= speed * deltaT;
					break;

				case 'down' :
					this.position.y += speed * deltaT;
					break;

				case 'left' :
					this.position.x -= speed * deltaT;
					break;

				case 'right' :
					this.position.x += speed * deltaT;
					break;
			}

			return { x : this.position.x, y : this.position.y}
		}
	}