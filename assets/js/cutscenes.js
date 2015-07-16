
var cutscenes = (function(){
	var secs = 0, gameWidth = 336;
	var paused = false;
	var sceneProps = [{
		isPaused : false,
		hitScore : 0,
		movingGhosts : [],
		powerPills : [],
		restart : true,
		payBack : false,
		comeBack : false,
		playerIP : {},
		ghostIP : {}
	}];

	//intro loop, plays the intro
	var _intro = function(deltaT, argsObj){

		var player = argsObj.player;
		var theGhosts = argsObj.theGhosts;
		var ghosts = argsObj.ghosts;
		var ctx = argsObj.ctx;
		var collectables = argsObj.collectables;
		var gameImg = argsObj.gameImg;

		secs += deltaT;
		if (!sceneProps[0].isPaused){
			//initial settings
			if (sceneProps[0].restart){
				sceneProps[0].hitScore = 0;
				sceneProps[0].restart = sceneProps[0].payBack = sceneProps[0].comeBack = false;
				sceneProps[0].movingGhosts = [];
				sceneProps[0].powerPills = [];
				sceneProps[0].printI = 0;

				sceneProps[0].playerIP.animation = sceneProps[0].ghostIP.animation = '';
				sceneProps[0].playerIP.direction = sceneProps[0].ghostIP.direction = '';
				sceneProps[0].playerIP.animAnchor = sceneProps[0].ghostIP.animAnchor = false;
				sceneProps[0].playerIP.moveAnchor = sceneProps[0].ghostIP.moveAnchor = false;
				sceneProps[0].playerIP.speed = sceneProps[0].ghostIP.speed = 88;

				player.position.x = gameWidth;
				player.position.y = 230;

				ghosts.forEach(function(ghost, index){
					var mGhost = new entity(ghost);
					mGhost.props.speed = player.props.speed;
					mGhost.position.x = gameWidth + player.clip.width + 14 + (mGhost.clip.width + 2) * index;
					mGhost.position.y = 230;
					sceneProps[0].movingGhosts.push(mGhost);
				});

				sceneProps[0].powerPills[0] = new entity(collectables[0]);
				sceneProps[0].powerPills[1] = new entity(collectables[0]);
				sceneProps[0].powerPills[2] = new entity(collectables[0]);


				ctx.clearRect(0, 40, gameWidth, 360);


			}

			ctx.clearRect(5, 55, 35, 150);
			ctx.clearRect(0, 200, gameWidth, 75);
			ctx.clearRect(104, 297, 25, 25);

			if (sceneProps[0].printI == 0){
				renderer.print('press space', gameImg, 8, 365, [4, 166, 121, 255]);
				sceneProps[0].printI++;
			}


			if (sceneProps[0].payBack || sceneProps[0].comeBack && player.position.x < gameWidth){
				theGhosts.forEach(function(ghost){
					ghost.animate('down', deltaT, true);
				});
			} else{
				theGhosts.forEach(function(ghost){
					ghost.animate('right', deltaT, true);
				});
			}

			if (secs >= 1 && sceneProps[0].printI == 1){
				renderer.print('character / nickname', gameImg, 46, 40);
				sceneProps[0].printI ++;
			}

			//oikake
			if (secs >= 1.5){
				renderer.render({
					img : gameImg,
					ctx : ctx,
					x : 10,
					y : 60,
					clipX : theGhosts[0].clip.x,
					clipY : theGhosts[0].clip.y,
					clipW : theGhosts[0].clip.width,
					clipH : theGhosts[0].clip.height

				});
			}

			if (secs >= 2.5 && sceneProps[0].printI == 2){
				renderer.print('oikake-----"akabei"', gameImg, 58, 68, [222, 0, 0, 255]);
				 sceneProps[0].printI++;
			}

			//machibuse
			if (secs >= 3){
				renderer.render({
					img : gameImg,
					ctx : ctx,
					x : 10,
					y : 98,
					clipX : theGhosts[1].clip.x,
					clipY : theGhosts[1].clip.y,
					clipW : theGhosts[1].clip.width,
					clipH : theGhosts[1].clip.height

				});
			}

			if (secs >= 4 && sceneProps[0].printI == 3){
				renderer.print('machibuse--"pinky"', gameImg, 58, 106, [255, 181, 255, 255]);
				sceneProps[0].printI++;
			}

			//kimagure
			if (secs >= 4.5){
				renderer.render({
					img : gameImg,
					ctx : ctx,
					x : 10,
					y : 136,
					clipX : theGhosts[2].clip.x,
					clipY : theGhosts[2].clip.y,
					clipW : theGhosts[2].clip.width,
					clipH : theGhosts[2].clip.height

				});
			}

			if (secs >= 5.5 && sceneProps[0].printI == 4){
				renderer.print('kimagure---"aosuke"', gameImg, 58, 144, [0, 222, 222, 255]);
				sceneProps[0].printI++;
			}

			//otoboke
			if (secs >= 6){
				renderer.render({
					img : gameImg,
					ctx : ctx,
					x : 10,
					y : 174,
					clipX : theGhosts[3].clip.x,
					clipY : theGhosts[3].clip.y,
					clipW : theGhosts[3].clip.width,
					clipH : theGhosts[3].clip.height

				});
			}

			if (secs >= 7 && sceneProps[0].printI == 5){
				renderer.print('otoboke----"guzuta"', gameImg, 58, 182, [255, 181, 33, 255]);
				sceneProps[0].printI++;
			}

			if (secs >= 8){
				renderer.render({
					img : gameImg,
					ctx : ctx,
					x : 112,
					y : 282,
					clipX : sceneProps[0].powerPills[2].clip.x,
					clipY : sceneProps[0].powerPills[2].clip.y,
					clipW : sceneProps[0].powerPills[2].clip.width,
					clipH : sceneProps[0].powerPills[2].clip.height,
					imgW : 6,
					imgH : 6

				});

				if (sceneProps[0].printI == 6){
					renderer.print('10 pts', gameImg, 136, 280);
				 	sceneProps[0].printI++;
				 }

				renderer.render({
					img : gameImg,
					ctx : ctx,
					x : 110,
					y : 304,
					clipX : sceneProps[0].powerPills[0].clip.x,
					clipY : sceneProps[0].powerPills[0].clip.y,
					clipW : sceneProps[0].powerPills[0].clip.width,
					clipH : sceneProps[0].powerPills[0].clip.height

				});

				if (sceneProps[0].printI == 7){
					renderer.print('50 pts', gameImg, 136, 305);
					sceneProps[0].printI++;
				}
			}

			if (secs >= 10){
				renderer.render({
					img : gameImg,
					ctx : ctx,
					x : 10,
					y : 235,
					clipX : sceneProps[0].powerPills[1].clip.x,
					clipY : sceneProps[0].powerPills[1].clip.y,
					clipW : sceneProps[0].powerPills[1].clip.width,
					clipH : sceneProps[0].powerPills[1].clip.height

				});

				sceneProps[0].powerPills[0].animate('blink', deltaT);
				if (!sceneProps[0].payBack && !sceneProps[0].comeBack) sceneProps[0].powerPills[1].animate('blink', deltaT);
			}

			//move in pm + ghosts
			if (secs >= 11.5 && !sceneProps[0].payBack){
				sceneProps[0].playerIP.animation = sceneProps[0].ghostIP.animation = 'left';
				sceneProps[0].playerIP.direction = sceneProps[0].ghostIP.direction = "left";
				sceneProps[0].playerIP.moveAnchor = true;
				sceneProps[0].playerIP.animAnchor = true;
			}


			if (player.position.x <= 22 && !sceneProps[0].comeBack){
				sceneProps[0].payBack = true;

				sceneProps[0].playerIP.speed = 120;
				sceneProps[0].powerPills[1].gotoAndStop(2);
			}

			if (player.position.x <= 8 && sceneProps[0].payBack){
				sceneProps[0].playerIP.animation = 'right';
				sceneProps[0].playerIP.animAnchor = true;
				sceneProps[0].playerIP.direction = 'right';
				sceneProps[0].playerIP.moveAnchor = true;

				sceneProps[0].ghostIP.speed = 70;
				sceneProps[0].ghostIP.animation = 'freeze';
				sceneProps[0].ghostIP.animAnchor = true;
				sceneProps[0].ghostIP.direction = 'right';
				sceneProps[0].ghostIP.moveAnchor = true;
			}


			if (sceneProps[0].payBack || sceneProps[0].comeBack){
				if (player.position.x > 390){
					sceneProps[0].payBack = false;
					sceneProps[0].comeBack = true;
					sceneProps[0].playerIP.animation = 'left';
					sceneProps[0].playerIP.direction = 'left';
					sceneProps[0].playerIP.moveAnchor = true;
					sceneProps[0].playerIP.animAnchor = true;
					sceneProps[0].playerIP.speed = 78;
				} else if (player.position.x < -80){
					sceneProps[0].restart = true;
					secs = 0;
				}


				sceneProps[0].movingGhosts.some(function(ghost, index){
					if (player.position.x + player.clip.width / 2 >= ghost.position.x){
						sceneProps[0].hitScore = sceneProps[0].hitScore == 0 ? 200 : 2 * sceneProps[0].hitScore;
						sceneProps[0].playerIP.animation = sceneProps[0].hitScore.toString();

						sceneProps[0].isPaused = true;
						var pauseID = window.setTimeout(function(){
							sceneProps[0].playerIP.animation = 'right';
							sceneProps[0].playerIP.moveAnchor = true;
							sceneProps[0].playerIP.animAnchor = true;

							sceneProps[0].isPaused = false;
						}, 1000);

						sceneProps[0].movingGhosts.splice(index, 1);
					}
				})
			}


			//animate + move ghosts
			sceneProps[0].movingGhosts.forEach(function(ghost){
				ghost.props.speed = sceneProps[0].ghostIP.speed;
				ghost.animate(sceneProps[0].ghostIP.animation, deltaT, sceneProps[0].ghostIP.animAnchor);
				ghost.move(sceneProps[0].ghostIP.direction, deltaT, sceneProps[0].ghostIP.moveAnchor);
			});

			//render ghosts
			sceneProps[0].movingGhosts.forEach(function(ghost){
				renderer.render({
					img : gameImg,
					ctx : ctx,
					x : ghost.position.x,
					y : ghost.position.y,
					clipX : ghost.clip.x,
					clipY : ghost.clip.y,
					clipW : ghost.clip.width,
					clipH : ghost.clip.height
				});
			});

			//animate + move player
			player.props.speed = sceneProps[0].playerIP.speed;
			player.animate(sceneProps[0].playerIP.animation, deltaT, sceneProps[0].playerIP.animAnchor);
			player.move(sceneProps[0].playerIP.direction, deltaT, sceneProps[0].playerIP.moveAnchor);

			//render player
			renderer.render({
				img : gameImg,
				ctx : ctx,
				x : player.position.x,
				y : player.position.y,
				clipX : player.clip.x,
				clipY : player.clip.y,
				clipW : player.clip.width,
				clipH : player.clip.height
			});
		}
	}

	return {
		play : function(index, deltaT, argsObj){
			if (paused) return false;

			switch (index){
				case 0 : //intro
					_intro(deltaT, argsObj);
					break;
			}
		},

		pause : function(){
			paused = !paused;
		},

		reset : function(){
			//clean up
			secs = 0;
			sceneProps = [{
				hitScore : 0,
				movingGhosts : [],
				powerPills : [],
				restart : true,
				payBack : false,
				comeBack : false,
				playerIP : {},
				ghostIP : {}
			}];
		}
	}
}());