
document.addEventListener("DOMContentLoaded", function(event){
	var game = (function(containerId){
		var gameWidth = 336;
		var gameHeight = 372;
		var actLevel = {};
		var paused = true, isWBlur = false, restartLevel = false;
		var canReact = false;
		var maxLevels = 256;
		var gameLevel = 1;
		var levelStartTime;
		var buildIndex = 0;
		var gameImg;
		var deltaT;

		var render;

		var player;
		var playerCellType = '';
		var playerAnim = '';
		var playerDir = '';
		var toDir = '';

		var theGhosts = [];
		var showGhosts = false;

		var powerpills = [];
		var collectables = [];
		var collHistory = [];
		var CLIndex  = 	[0, 1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8];
		var CLPts =	[0, 100, 300, 500, 500, 700, 700, 1000, 1000, 2000, 2000, 3000, 3000, 5000]

		var aF;
		var lastTime = performance.now() || Date.now();

		var playProps = {
			lives : 4,
			secs : 0,
			reTrySec : 0,
			xReTrySec : 0,
			score : 0,
			gEatPts : 0,
			maxDots : 0,
			dots : 0,
			collectableIndex : 0,
			ghostsStalkerT : 20,
			levelSRatio : 0,
			ghostsWanderT : 5,
			collectableShowT : 10,
			xCollShowSec : 0,
			ghostsSpeed : 0,
			playerSpeed : 0,
			ghostsMood : 'wander',
			doMoodSwitch : true,
			showCollectable : false,
			extraLife : false
		}

		var playerPos = {
			col : 0,
			row : 0
		}

		window.addEventListener('blur', function(){
			isWBlur = true;
			toDir = '';
			cutscenes.pause();
			sounds.pause();
			sounds.pauseBg();
		})

		window.addEventListener('focus', function(){
			var WFID = window.setTimeout(function(){
				if (isWBlur){
					if (buildIndex > 0){
						toDir = playerDir;
						isWBlur = false;
						if (!paused){
							sounds.resume();
							sounds.resumeBg();
						}
					} else{
						cutscenes.pause();
					}
				}
				window.clearTimeout(WFID);
			}, 100);
		})

		window.addEventListener('keydown', function(e){
			if (!canReact){
				return false;
			}

			switch (e.keyCode){
				case 32 : //space
				case 13 : //enter
					if (buildIndex == 0){
						game.playLevel(1);
					}
					break;

				case 27 : //esc
					if (buildIndex > 0){
						paused = !paused;
						if (paused){
							paused = true;
							toDir = '';
							sounds.pause();
							sounds.pauseBg();
						}else{
							toDir = playerDir;
							paused = false;
							sounds.resume();
							sounds.resumeBg();
						}
					}
					break;
			}
		});

		//keyboard control for the player
		var _playerCtrl = function(){
			//keys down
			document.addEventListener('keydown', function(e){
				if (!canReact){
					return false;
				}

				switch (e.keyCode){
					//up
					case 38 : //up arrow
					case 87 : //w
						paused = false;
						toDir = 'up';
						break;

					//down
					case 40 : //down arrow
					case 83 : //s
						paused = false;
						toDir = 'down';
						break;

					//left
					case 37 : //left arrow
					case 65 : //a
						paused = false;
						toDir = 'left';
						break;

					//left
					case 39 : //right arrow
					case 68 : //d
						paused = false;
						toDir = 'right';
						break;
				}
			}, true);
		}

		//checks if there is pathway in the given direction
		var _isPathWay = function(direction){
			//XXXPWE, XXXPWC are the pathways
			var pways = ['xxxpwe', 'xxxpwc', 'xxxpwp', 'xx1hts', 'xx2hts', 'xx3hts', 'xx5hts', 'xx7hts', 'xxxxhe', 'xxxxte'];
			var playerMatrixPos = renderer.XYToColRow(player.position.x + player.clip.width / 2, player.position.y + player.clip.height / 2);
			var layout = actLevel.layout;
			var isPathWay = false;

			switch (direction.toLowerCase()){
				case 'up' :
					var rowIndex = Math.max(0, playerMatrixPos.row - 1);
					var cellVal = layout[rowIndex][playerMatrixPos.col];
					isPathWay = pways.indexOf(cellVal.toLowerCase()) == -1 ? false : true;

					break;

				case 'down' :
					var rowIndex = Math.min(layout.length - 1, playerMatrixPos.row + 1);
					var cellVal = layout[rowIndex][playerMatrixPos.col];
					isPathWay = pways.indexOf(cellVal.toLowerCase()) == -1 ? false : true;

					break;

				case 'left' :
					var colIndex = Math.max(0, playerMatrixPos.col - 1);
					var cellVal = layout[playerMatrixPos.row][colIndex];
					isPathWay = pways.indexOf(cellVal.toLowerCase()) == -1 ? false : true;

					break;

				case 'right' :
					var colIndex = Math.min(layout[playerMatrixPos.row].length - 1, playerMatrixPos.col + 1);
					var cellVal = layout[playerMatrixPos.row][colIndex];
					isPathWay = pways.indexOf(cellVal.toLowerCase()) == -1 ? false : true;

					break;
			}

			return isPathWay;
		}

		var needRepos = true;
		var dSndI = false;
		var _movePlayer = function(deltaT){
			if (!canReact){
				return false;
			}

			//check cell value
			var playerCell = renderer.XYToColRow(player.position.x + player.clip.width / 2, player.position.y + player.clip.height / 2);
			playerCellType = actLevel.layout[playerCell.row][playerCell.col].toLowerCase();

			playerPos.col = playerCell.col;
			playerPos.row = playerCell.row;

			//check step
			switch (playerCellType){
				case 'xxxpwp' : //portal
					//nobody knows what happens in a portal...

					break;

				case 'xxxpwc' : //dot
					//add points
					playProps.score += 10;
					playProps.dots += 1;

					_updateScores();

					var dotsPerc = Math.round(playProps.dots / playProps.maxDots * 100);
					var stalkerSec = dotsPerc * 5 / 100;
					playProps.ghostsStalkerT = Math.floor(stalkerSec * gameLevel + 20);

					//make it empty
					actLevel.layout[playerCell.row][playerCell.col] = 'XXXPWE';

					//redraw cell on layout canvas
					renderer.reDrawCells(gameImg, playerCell.col, playerCell.row, 0, 0, render.layout.context);

					//play sound
					dSndI = !dSndI;
					sounds.play(dSndI ? 'dot1' : 'dot2');

					//check for collectable show time
					if (playProps.dots == 80 || playProps.dots == 160){
						playProps.xCollShowSec = 0;
						playProps.showCollectable = true;
					}

					//all dots eaten
					if (playProps.dots >= playProps.maxDots){
						_nextLevel();
					}

					break;
			}

			//player position correction to mach cells position
			if (player.needRepos){
				var cell = renderer.ColRowToXY(playerCell.col, playerCell.row);
				var corX = cell.x - actLevel.cellWidth / 2 - player.position.x;
				var corY = cell.y - actLevel.cellHeight / 2 - player.position.y + 1;

				/*player.position.x += corX / (player.props.speed * deltaT);
				player.position.y += corY / (player.props.speed * deltaT);*/

				var reposSpeed = playProps.dots > playProps.maxDots / 2 && gameLevel >= 4 ? player.props.speed / 1.4 : player.props.speed * 1.1;
				player.position.x += corX / (reposSpeed * deltaT);
				player.position.y += corY / (reposSpeed * deltaT);

				if (Math.round(corX) == 0 && Math.round(corY) == 0){
					player.needRepos = false;
					return;
				}
			}

			var isPathWay = false;
			if (_isPathWay(toDir)){
				needRepos = true;
				//repos player on turn
				if (toDir != playerDir && playerDir.length){
					player.needRepos = true;
				}

				playerDir = toDir;
				isPathWay = true;
			}else{
				//uncomment toDir = '';, if you want exact match for pathways and cursor keys.
				//eg.:
				//	lets say the player is moving left. up arrow key pressed, but there isnt patway upwards in the moment of the keypress
				//	player will not turn up at the next upward pathway, will continue its way to left.

				//leave in comment if you dont.
				//eg.:
				//	lets say the player is moving left. up arrow key pressed, but there isnt patway upwards in the moment of the keypress
				//	player will still turn up at the next upward pathway

				//toDir = '';
				 if (_isPathWay(playerDir)){
					isPathWay = true;
				} else{
					isPathWay = false;
					//repos player on pathway end
					if (needRepos){
						needRepos = false;
					}
				}
			}

			player.playAnim = isPathWay;
			player.canMove = isPathWay;


			//check hit with powerpills
			powerpills.some(function(powerpill, index){
				var pPillCell = renderer.XYToColRow(powerpill.position.x + powerpill.clip.width / 2, powerpill.position.y + powerpill.clip.height / 2);
				if (playerCell.col == pPillCell.col && playerCell.row == pPillCell.row){

					playProps.score += 50;
					playProps.gEatPts = 0;
					_updateScores();

					//console.log('hit with powerpill: ' + index);
					powerpills.splice(index, 1);
					//console.log('powerpills: ' + powerpills);

					ghosts.freeze();
				}
			});

			//check for hit with ghosts
			theGhosts.some(function(ghost){
				var playerMidX = player.position.x + player.clip.width / 2;
				var playerMidY = player.position.y + player.clip.height / 2;
				if ( (playerMidX > ghost.position.x && playerMidX < ghost.position.x + ghost.clip.width) && (playerMidY > ghost.position.y && playerMidY < ghost.position.y + ghost.clip.height)){
					if (ghost.actAnimation.name.toLowerCase() == 'freeze' || ghost.actAnimation.name.toLowerCase() == 'freeze_ending'){
						//console.log('freeze hit')

						canReact = false;
						playProps.gEatPts = playProps.gEatPts == 0 ? 200 : 2 * playProps.gEatPts
						playProps.score += playProps.gEatPts;
						player.playAnim = false;
						playerAnim = playProps.gEatPts.toString();
						_updateScores();

						sounds.play('freeze-eaten', true);

						ghosts.eaten(ghost.props.name);


						var PEGID = window.setTimeout(function(){
							window.clearTimeout(PEGID);


							canReact = true;
							playerAnim = playerDir;
							player.playAnim = true;
						}, 1200);

					} else if (ghost.actAnimation.name.toLowerCase().indexOf('eaten') == -1) {
						ghosts.hangOn();

						sounds.pauseBg();

						player.gotoAndStop(3);
						player.playAnim = false;
						canReact = false;

						playProps.doMoodSwitch = false;
						playProps.lives--;

						var GCID = window.setTimeout(function(){
							showGhosts = false;
							ghosts.erase();

							window.clearTimeout(GCID);
						}, 1500);

						var PDAID = window.setTimeout(function(){
							sounds.play('death', true);

							player.playAnim = true;
							playerAnim = 'hit';

							window.clearTimeout(PDAID);
						}, 1700);

						var LRID = window.setTimeout(function(){
							paused = true;

							if (playProps.lives <= 0){
								_gameOver();
							}else{
								_restartLevel();
							}

							window.clearTimeout(LRID);
						}, 4500);
					}
				}
			});

			//check hit with collectable
			if (playProps.showCollectable){
				var collCel = renderer.XYToColRow(collectables[playProps.collectableIndex].position.x + collectables[playProps.collectableIndex].clip.width / 2, collectables[playProps.collectableIndex].position.y + collectables[playProps.collectableIndex].clip.height / 2);
				if (playerCell.col == collCel.col && playerCell.row == collCel.row){

					playProps.showCollectable = false;
					playProps.xCollShowSec = 0;

					var clptsI = Math.min(CLPts.length - 1, gameLevel);
					playProps.score += CLPts[clptsI];
					_updateScores();

					if (CLPts[clptsI] / 100 < 10){
						//coll. point is in hundreds
						actLevel.layout[17][collCel.col - 1] = 'XX' + (CLPts[clptsI] / 100) + 'HTS';
						renderer.drawCell(gameImg, collCel.col - 1, 17, '#000', render.layout.context);

						actLevel.layout[17][collCel.col] = 'XXXXHE';
						renderer.drawCell(gameImg, collCel.col, 17, '#000', render.layout.context);
					}else{
						//coll. points are in thousends
						actLevel.layout[17][collCel.col - 1] = 'XX' + (CLPts[clptsI] / 1000) + 'HTS';
						renderer.drawCell(gameImg, collCel.col - 1, 17, '#000', render.layout.context);

						actLevel.layout[17][collCel.col] = 'XXXXHE';
						renderer.drawCell(gameImg, collCel.col, 17, '#000', render.layout.context);

						actLevel.layout[17][collCel.col + 1] = 'XXXXTE';
						renderer.drawCell(gameImg, collCel.col + 1, 17, '#000', render.layout.context);
					}

					var CPID = window.setTimeout(function(){
						window.clearTimeout(CPID);

						for (var i=9; i<=18; i++){
							actLevel.layout[17][i] = 'XXXPWE';
							renderer.drawCell(gameImg, i, 17, '#000', render.layout.context);
						}
					}, 2000);

					sounds.play('collectable');
				}
			}

			if (!isPathWay || player.needRepos){
				player.needRepos = true;
				return;
			}

			//move player
			if (player.actAnimation.name.toLowerCase() != playerDir) playerAnim = playerDir;
			player.move(playerDir, deltaT);


			//check if player is out of screen
			if (player.position.x + player.clip.width < 0){//exited left
				player.position.x = gameWidth;
			}else if (player.position.x > gameWidth){//exited right
				player.position.x = -1 * player.clip.width;
			}
		}

		var _showLives = function(){
			var sX = 96;
			for (var i=1; i<playProps.lives; i++){
				var live = new entity(actLevel.playerProps);
				live.canMove = false;
				live.animate('left', 1);
				live.playAnim = false;

				renderer.render({
					img : gameImg,
					ctx : render.console.context,
					x : sX,
					y : 416,
					clipX : live.clip.x,
					clipY : live.clip.y,
					clipW : live.clip.width,
					clipH : live.clip.height
				});

				sX -= live.clip.width + 4;
			}
		}

		var _showCollHistory = function(){
			if (!restartLevel) collHistory.push(collectables[playProps.collectableIndex]);
			if (collHistory.length > 7) collHistory = collHistory.splice(1, collHistory.length - 1);
			var sX = 300;
			collHistory.forEach(function(coll){
				renderer.render({
					img : gameImg,
					ctx : render.console.context,
					x : sX,
					y : 416,
					clipX : coll.clip.x,
					clipY : coll.clip.y,
					clipW : coll.clip.width,
					clipH : coll.clip.height
				});

				sX -= coll.clip.width + 3;
			});
		}

		var _updateScores = function(){
			var fillStr = '';
			for (var i=0; i<Math.max(0, 5 - playProps.score.toString().length); i++){
				fillStr += ' ';
			}
			renderer.print(fillStr + playProps.score.toString(), gameImg, 24, 14);
		}

		var _gameOver = function(){
			window.cancelAnimationFrame(aF);
			window.clearInterval(aF);

			playProps = {
				lives : 10,
				secs : 0,
				reTrySec : 0,
				xReTrySec : 0,
				score : 0,
				gEatPts : 0,
				maxDots : 0,
				dots : 0,
				collectableIndex : 0,
				ghostsStalkerT : 20,
				levelSRatio : 0,
				ghostsWanderT : 5,
				collectableShowT : 10,
				xCollShowSec : 0,
				ghostsSpeed : 0,
				playerSpeed : 0,
				ghostsMood : 'wander',
				doMoodSwitch : true,
				showCollectable : false
			}

			render = {};
			player = {};
			actLevel = {};
			theGhosts = [];

			renderer.print('game over', gameImg, 114, 241, [222, 0, 0, 255]);
			var GOID = window.setTimeout(function(){
				window.location.reload();

				window.clearTimeout(GOID);
			}, 2000);
		}

		var _nextLevel = function(){
			sounds.resetSfx();
			sounds.resetBgSfx();

			playProps.dots = 0;
			playProps.gEatPts = 0;

			canReact = false;
			ghosts.hangOn();
			player.gotoAndStop(3);
			playerAnim = '';
			paused = true;

			playProps.doMoodSwitch = false;

			var NLID = window.setTimeout(function(){
				window.clearTimeout(NLID);

				game.playLevel(gameLevel + 1);
			}, 1500);
		}

		var _restartLevel = function(){
			restartLevel = true;
			game.playLevel(gameLevel);
		}

		var _showUpCCollectable = function(){

		}

		var _getGhostByName = function(name){
			var ghostEntity = null;
			theGhosts.some(function(ghost){
				if (ghost.props.name.toLowerCase() == name.toLowerCase()){
					ghostEntity = ghost;
				}
			});

			return ghostEntity;
		}

		var _playerInShelter = function(){
			var playerCell = renderer.XYToColRow(player.position.x + player.clip.width / 2, player.position.y + player.clip.height / 2)
			var inShelter = false;

			if (playerCell.row == 8 || playerCell.row == 20){
				if ( (playerCell.col >= 9 && playerCell.col <= 12) || (playerCell.col >= 15 && playerCell.col <= 18) ) inShelter = true
			}

			return inShelter;
		}

		var fpsUT = 1;
		//gameloop
		var _play = function(DOMHighResTimeStamp){
			var now = DOMHighResTimeStamp || performance.now() || Date.now();
			deltaT = Math.max(0, (now - lastTime) / 1000);

			if (buildIndex == 0){//intro
				canReact = true;
				cutscenes.play(0, deltaT, {
					player : player,
					theGhosts : theGhosts,
					ghosts : actLevel.ghosts,
					ctx : render.console.context,
					collectables : actLevel.collectables,
					gameImg : gameImg
				});

			}else{
				if (!paused && !isWBlur){
					//move player
					_movePlayer(deltaT);

					//animate player
					player.animate(playerAnim, deltaT);

					//powerpills anim
					powerpills.forEach(function(powerpill){
						powerpill.animate('blink', deltaT);
					});


					//move ghosts
					ghosts.gogogo(deltaT, playProps.dots, playProps.ghostsSpeed);

					//bonus life check
					if (playProps.score >= 10000 && !playProps.extraLife){
						playProps.lives++;
						_showLives();
						playProps.extraLife = true;

						sounds.play('extra-life', true);
					}


					/***********************************************/
					//ghosts wander/stalker mood switch
					var maxVisCells = 5;
					if (playProps.doMoodSwitch) playProps.secs = isNaN(playProps.secs) ? deltaT : playProps.secs + deltaT;
					if (playProps.secs >= playProps.ghostsWanderT && playProps.ghostsMood == 'wander'){//stalker on
						playProps.ghostsMood = 'stalker';
						playProps.secs = 0;

						ghosts.portalsOpen();

						var speedLRatio = gameLevel >= 5 ? 4 : 2;
						ghosts.setSpeed(playProps.ghostsSpeed + speedLRatio);

						ghosts.setSpeed(playProps.ghostsSpeed + 4 + playProps.ghostsSpeed * 5 / 100, 'oikake');

						var MBCol = playerDir == 'left' ? playerPos.col - 4 : playerPos.col + 4;
						var MBRow = playerDir == 'up' ? playerPos.row - 4 : playerPos.row + 4;

						//red
						ghosts.setTarget(playerPos.col, playerPos.row, 'oikake', true, 20, maxVisCells);

						//cyam
						var KGCol = playerDir == 'left' ? playerPos.col - 2 : playerPos.col + 2;
						var KGRow = playerDir == 'up' ? playerPos.row - 2 : playerPos.row + 2;
						ghosts.setTarget(KGCol , KGRow, 'kimagure', true, 20, maxVisCells);

						//pink
						ghosts.setTarget(MBCol, MBRow, 'machibuse', true, 20, maxVisCells);

						//orange
						ghosts.setTarget(playerPos.col, playerPos.row, 'otoboke', true, 20, 0);

						sounds.play('stalker-on', true);

					}else if (playProps.secs >= playProps.ghostsStalkerT && playProps.ghostsMood == 'stalker'){//wander on
						playProps.ghostsMood = 'wander';
						playProps.secs = 0;

						//ghost slow down
						ghosts.setSpeed(playProps.ghostsSpeed);

						ghosts.portalsClose();
						ghosts.spreadOut();
					}

					if (playProps.doMoodSwitch){
						playProps.reTrySec += deltaT;
						playProps.xReTrySec += deltaT;
					}

					//stalker retry
					if (playProps.ghostsMood == 'stalker' && playProps.reTrySec >= (gameLevel > 5 ? 1 : 2)){
						if (_playerInShelter() && playProps.ghostsMood != 'wander') {
							//console.log('shelter');
							playProps.ghostsMood = 'wander';
						}

						//ghost speed up
						var speedLRatio = gameLevel >= 5 ? 4 : 2;
						ghosts.setSpeed(playProps.ghostsSpeed + speedLRatio + playProps.ghostsSpeed * 5 / 100, 'oikake')

						//red
						ghosts.setTarget(playerPos.col, playerPos.row, 'oikake', true, 20, maxVisCells);

						//cyan
						var OIKEnt = _getGhostByName('oikake');
						var OIKPos = renderer.XYToColRow(OIKEnt.position.x, OIKEnt.position.y);
						var OIKPRDist = Math.abs(OIKPos.row - playerPos.row);
						var OIKPCDist = Math.abs(OIKPos.col - playerPos.col);
						if (OIKPCDist <= 5 && OIKPRDist <=5){
							//var KGCol = playerDir == 'left' ? playerPos.col - OIKPCDist * 2 : playerPos.col + OIKPCDist * 2;
							//var KGRow = playerDir == 'up' ? playerPos.row - OIKPRDist * 2 : playerPos.row + OIKPRDist * 2;

							var KGCol = playerDir == 'left' ? playerPos.col - OIKPCDist  : playerPos.col + OIKPCDist * 2;
							var KGRow = playerDir == 'up' ? playerPos.row - OIKPRDist  : playerPos.row + OIKPRDist * 2;
						}else{
							var KGCol = playerDir == 'left' ? playerPos.col - 2 : playerPos.col + 2;
							var KGRow = playerDir == 'up' ? playerPos.row - 2 : playerPos.row + 2;
						}
						ghosts.setTarget(KGCol , KGRow, 'kimagure', true, 20, maxVisCells);

						//pink
						var MBCol = playerDir == 'left' ? playerPos.col - 4 : playerPos.col + 4;
						var MBRow = playerDir == 'up' ? playerPos.row - 4 : playerPos.row + 4;
						ghosts.setTarget(MBCol, MBRow, 'machibuse', true, 20, maxVisCells);

						playProps.reTrySec = 0;
						playProps.xReTrySec = 0;
					}

					//extras
					if (playProps.ghostsMood == 'stalker' && playProps.xReTrySec >= .3){
						var OIKEnt = _getGhostByName('oikake');
						var OIKPos = renderer.XYToColRow(OIKEnt.position.x, OIKEnt.position.y);
						var OIKPRDist = Math.abs(OIKPos.row - playerPos.row);
						var OIKPCDist = Math.abs(OIKPos.col - playerPos.col);

						if (OIKPRDist <= 2 && OIKPCDist <= 5){
							//console.log('oikake closing in')
							ghosts.setTarget(playerPos.col, playerPos.row, 'oikake', true, 1, maxVisCells);
						}

						playProps.xReTrySec = 0;
					}

				}

				/***********************************************/


				render.game.context.clearRect(0, 0, render.game.canvas.width, render.game.canvas.height);

				//show collectable, when its time
				if (playProps.showCollectable){
					if (canReact) playProps.xCollShowSec += deltaT;

					renderer.render({
						img : gameImg,
						ctx : null,
						x : collectables[playProps.collectableIndex].position.x,
						y : collectables[playProps.collectableIndex].position.y,
						clipX : collectables[playProps.collectableIndex].clip.x,
						clipY : collectables[playProps.collectableIndex].clip.y,
						clipW : collectables[playProps.collectableIndex].clip.width,
						clipH : collectables[playProps.collectableIndex].clip.height
					});

					if (playProps.xCollShowSec >= playProps.collectableShowT){
						playProps.xCollShowSec = 0;
						playProps.showCollectable = false;
					}
				}

				//show power pills
				powerpills.forEach(function(collectable){
					renderer.render({
						img : gameImg,
						ctx : null,
						x : collectable.position.x,
						y : collectable.position.y,
						clipX : collectable.clip.x,
						clipY : collectable.clip.y,
						clipW : collectable.clip.width,
						clipH : collectable.clip.height
					});
				});

				//show player
				renderer.render({
					img : gameImg,
					ctx : null,
					x : player.position.x,
					y : player.position.y,
					clipX : player.clip.x,
					clipY : player.clip.y,
					clipW : player.clip.width,
					clipH : player.clip.height
				});

				//show ghosts
				if (showGhosts){
					theGhosts.forEach(function(ghost){
						renderer.render({
							img : gameImg,
							ctx : null,
							x : ghost.position.x,
							y : ghost.position.y,
							clipX : ghost.clip.x,
							clipY : ghost.clip.y,
							clipW : ghost.clip.width,
							clipH : ghost.clip.height
						});
					});
				}

				//sound ctrl
				sounds.check();
			}

			lastTime = now;
			aF = requestAnimFrame(_play);
		}

		var _loadResources = function(buildIndex){
			try{
				imageLoader.load([{
					src : actLevel.spritesSrc
				}],
				function(imgs){
					//all loaded
					gameImg = imgs[0];

					render = renderer.init({
						id : containerId,
						width : gameWidth,
						height : gameHeight,
						bgColor : actLevel.bgColor
					},
					{
						layout : actLevel.layout,
						levelIndex : buildIndex,
						gameLevel : gameLevel
					});

					//clean up
					renderer.clr(render.game.context, 0, 0, gameWidth, gameHeight);
					renderer.clr(render.layout.context, 0, 0, gameWidth, gameHeight);
					renderer.clr(render.console.context, 0, 0, gameWidth, gameHeight + 80);

					//*display console* setup
					renderer.print('1up', gameImg, 36, 0);
					renderer.print('high score', gameImg, 108, 0);
					renderer.print('2up', gameImg, 264, 0, [222, 222, 222, 55]);

					//create player
					player = new entity(actLevel.playerProps);
					player.props.speed = Math.min(100, 79 + gameLevel * playProps.levelSRatio);

					player.canMove = true;
					player.playAnim = true;

					//console.log('playerspeed: ' + player.props.speed);

					if (buildIndex == 0){//intro anim
						//we just need the ghost entities here
						cutscenes.reset();
						actLevel.ghosts.forEach(function(ghost){
							theGhosts.push(new entity(ghost));
						});
					}else{//every other level will use level 1 properties
						//draw layout
						renderer.drawLayout(gameImg);

						//create ghosts
						theGhosts = [];
						theGhosts = ghosts.create(actLevel.ghosts, player.position, actLevel.layout, 336, 372, gameLevel);

						//ghosts speed
						ghosts.setSpeed(playProps.ghostsSpeed)

						//reverse ghosts orders, so the first draws latly on top of others
						theGhosts.reverse();

						//collectables
						powerpills = [];
						collectables = [];
						var pPillsPos = [{x : 12, y : 36}, {x : 312, y : 36}, {x : 12, y : 276}, {x : 312, y : 276}];
						actLevel.collectables.forEach(function(collectable, index){
							if (collectable.name.toLowerCase() == 'powerpill'){
								pPillsPos.forEach(function(pPillPos){
									collectable.startPos.x = pPillPos.x;
									collectable.startPos.y = pPillPos.y;
									powerpills.push(new entity(collectable));
								});
							}

							collectables.push(new entity(collectable));
						});

						//show lives
						_showLives();

						//show collectables history
						_showCollHistory();

						//show ghosts
						var ghostsShow = window.setTimeout(function(){
							//clear 'player one' print
							renderer.clr(render.console.context, 0, 36, gameWidth, 200);

							showGhosts = true;
							ghosts.dontHangOn();

							window.clearTimeout(ghostsShow);
						}, (restartLevel ? 0 : 2000));

						//start player
						var playerStart = window.setTimeout(function(){
							if (paused){
								//clear console
								renderer.clr(render.console.context, 0, 36, gameWidth, gameHeight);

								paused = false;
								canReact = true;
								toDir = Math.round(Math.random()) ? 'left' : 'right';

								//level startTime
								levelStartTime = performance.now() || Date.now();

								//controll player
								_playerCtrl();

								canReact = true;

								window.clearTimeout(playerStart);
							}
						}, (restartLevel ? 2000 : 4200));

						//play intro music
						if (!restartLevel){
							sounds.play('start-music');
							renderer.print('player one', gameImg, 107, 169, [0, 222, 222, 255]);
						}

						_updateScores();
						renderer.print('ready!', gameImg, 133, 241, [255, 255, 33, 255]);
					}

					restartLevel = false;

					//start game loop
					_play();

				},
				function(errMsg, img){
					//load error
				});
			}catch(err){
				//console.log(err);
			}
		}


		return {
			reposEntity : function(entity, deltaT){
				_reposEntity(entity, deltaT);
			},

			playLevel : function(levelIndex){
				window.cancelAnimationFrame(aF);
				window.clearInterval(aF);

				canReact = false;

				sounds.resetSfx();
				sounds.resetBgSfx();

				//gameLevel = levelIndex > maxLevels ? 0 : levelIndex;
				if (levelIndex > maxLevels){
					gameLevel = levelIndex = 0;
				}else {
					gameLevel = levelIndex;
				}

				//console.log(gameLevel)


				playerCellType = playerAnim = playerDir = toDir = '';

				//get level properties
				levelObj = levels.getLevel(levelIndex);
				buildIndex = levelObj.levelIndex;
				actLevel = levelObj.level;
				actLevel.layout = restartLevel || buildIndex == 0 ? actLevel.layout : layouts.getLayout(buildIndex);

				//clean up
				playProps.collectableIndex = gameLevel > 13 ? CLIndex[CLIndex.length - 1] : CLIndex[gameLevel];
				playProps.xCollShowSec = restartLevel ? playProps.xCollShowSec : 0;
				playProps.showCollectable = restartLevel && playProps.showCollectable ? true : false;

				playProps.doMoodSwitch = true;
				playProps.secs = restartLevel ? playProps.secs : 0;
				playProps.reTrySec = 0;
				playProps.maxDots = buildIndex == 0 ? 0 : layouts.getCellsByType(buildIndex, ['xxxpwc']).length,
				playProps.ghostsMood = 'wander';

				playProps.levelSRatio = gameLevel > 5 ? 6 : 4;
				playProps.ghostsSpeed = Math.min(100, 70 + gameLevel * playProps.levelSRatio);
				//console.log('ghostsSpeed: ' + playProps.ghostsSpeed)

				_loadResources(buildIndex);

				//level settings
				showGhosts = false;
			}
		}
	}('game'));

	//setTimeout wins
	var initID = window.setTimeout(function(){
		sounds.load(function(){
			//after sounds has loaded
			game.playLevel(0);
		});

		window.clearTimeout(initID);
	}, 0);
});