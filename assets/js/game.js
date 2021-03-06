
document.addEventListener('DOMContentLoaded', function(event){

	var game = (function(containerId){
		var gameWidth = 336,
		gameHeight = 372,
		actLevel = {},
		paused = true,
		isWBlur = false,
		restartLevel = false,
		canReact = false,
		bonusLevel = false,
		isTouchDev = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0,
		maxLevels = 256,
		gameLevel = 1,
		levelStartTime,
		buildIndex = 0,
		gameImg,
		deltaT,
		vectrexS = location.hash.trim().toLowerCase() == '#vt' ? true : false,
		c19S = location.hash.trim().toLowerCase() == '#c19' ? true : false,
		lightsOutS = location.hash.trim().toLowerCase() == '#lo' ? true : false;
		lightsOutG = location.hash.trim().toLowerCase() == '#loga' ? true : false;

		var render;
		var player,
		playerCellType = '',
		playerAnim = '',
		playerDir = '',
		toDir = '';

		var theGhosts = [];
		var showGhosts = false;

		var powerpills = [];
		var collectables = [];
		var collHistory = [];
		var CLIndex  = 	[0, 1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8];
		var CLPts =	[0, 100, 300, 500, 500, 700, 700, 1000, 1000, 2000, 2000, 3000, 3000, 5000];

		var layoutCols = [[], [33, 33, 255, 255], [0, 214, 217, 255], [241, 110, 239, 255], [255, 0, 0, 255], [243, 163, 9, 255], [0, 255, 0, 255], [222, 222, 255, 255]];

		if (lightsOutS || lightsOutG) layoutCols.forEach(function(colorArr, index){
			layoutCols[index] = [0, 0, 0, 255];
		});

		var layColIndex = 0;

		var aF;
		var lastTime = performance.now() || Date.now();

		var playProps = {
			lives : 4,
			naxLives : 5,
			levelEntLives : 4,
			lastLifePts : 0,
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
			lastPlyrPos : { col : 0, row : 0}
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


		if (!isTouchDev){
			document.addEventListener('keydown', function(e){
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
		} else{
			document.addEventListener('touchend', function(){
				if (buildIndex == 0){
					game.playLevel(1);
				}
			});
		}

		//control for the player
		var _playerCtrl = function(){
			if (isTouchDev){
				var sX = 0, sY = 0;

				document.addEventListener('touchstart', function(event){
					if (!canReact){
						return false;
					}

					sX = event.touches[0].clientX;
					sY = event.touches[0].clientY;
				});

				document.addEventListener('touchmove', function(event){
					if (!canReact){
						return false;
					}

					var xD = sX - event.touches[0].clientX;
					var yD = sY - event.touches[0].clientY;

					if (Math.abs(xD) > Math.abs(yD)) {//swipe left or right
						if (xD > 0){//left
							paused = false;
							toDir = 'left';
						}else {//right
							paused = false;
							toDir = 'right';
						}
					}else {//swipe up or down
						if (yD > 0){//up
							paused = false;
							toDir = 'up';
						}else {//down
							paused = false;
							toDir = 'down';
						}
					}
				});

			}else{
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
		}

		//checks if there is pathway in the given direction
		var _isPathWay = function(direction){
			//XXXPWE, XXXPWC are the pathways
			var pways = ['xxxpwe', 'xxxpwc', 'xxpwc2', 'xxxpwp', 'xx1hts', 'xx2hts', 'xx3hts', 'xx5hts', 'xx7hts', 'xxxxhe', 'xxxxte'];
			var playerCell = renderer.XYToColRow(player.position.x + player.clip.width / 2, player.position.y + player.clip.height / 2);
			var layout = actLevel.layout;
			var isPathWay = false;

			switch (direction.toLowerCase()){
				case 'up' :
				var rowIndex = Math.max(0, playerCell.row - 1);
				var cellVal = layout[rowIndex][playerCell.col];
				isPathWay = pways.indexOf(cellVal.toLowerCase()) == -1 ? false : true;

				break;

				case 'down' :
				var rowIndex = Math.min(layout.length - 1, playerCell.row + 1);
				var cellVal = layout[rowIndex][playerCell.col];
				isPathWay = pways.indexOf(cellVal.toLowerCase()) == -1 ? false : true;

				break;

				case 'left' :
				var colIndex = Math.max(0, playerCell.col - 1);
				var cellVal = layout[playerCell.row][colIndex];
				isPathWay = pways.indexOf(cellVal.toLowerCase()) == -1 ? false : true;

				break;

				case 'right' :
				var colIndex = Math.min(layout[playerCell.row].length - 1, playerCell.col + 1);
				var cellVal = layout[playerCell.row][colIndex];
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

				//dot
				case 'xxpwc2' :
				case 'xxxpwc' :
					//add points
					playProps.score += playerCellType == 'xxxpwc' ? 10 : 20;
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
						var levelType = playProps.lives >= playProps.levelEntLives && !bonusLevel ? 'bonus' : '';

						_nextLevel(levelType);
					}

					break;
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
				//uncomment toDir = ''; to exact match for pathways and cursor keys.
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

			//player position correction to mach cells position
			if (player.needRepos){
				player.playAnim = true;

				var cell = renderer.ColRowToXY(playerCell.col, playerCell.row);
				var corX = cell.x - actLevel.cellWidth / 2 - player.position.x;
				var corY = cell.y - actLevel.cellHeight / 2 - player.position.y + 1;

				var reposT = player.props.speed < 92 ? .028 : .024;
				player.position.x += corX / (player.props.speed * reposT);
				player.position.y += corY / (player.props.speed * reposT);

				if (Math.round(corX) == 0 && Math.round(corY) == 0){
					player.needRepos = false;
					player.playAnim = isPathWay;
					return;
				}
			}

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
				if ((playerMidX > ghost.position.x && playerMidX < ghost.position.x + ghost.clip.width) && (playerMidY > ghost.position.y && playerMidY < ghost.position.y + ghost.clip.height)){
					if (ghost.actAnimation.name.toLowerCase() == 'freeze' || ghost.actAnimation.name.toLowerCase() == 'freeze_ending'){
						//console.log('freeze hit')

						canReact = false;
						player.playAnim = false;
						playProps.gEatPts = playProps.gEatPts == 0 ? 200 : 2 * playProps.gEatPts
						playProps.score += playProps.gEatPts;
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

					} else if (ghost.actAnimation.name.toLowerCase().indexOf('eaten') == -1){
						//more tolerant hit check with cell pos.
						var ghostCell = renderer.XYToColRow(ghost.position.x + ghost.clip.width / 2, ghost.position.y + ghost.clip.height / 2);
						if (ghostCell.row == playerCell.row && ghostCell.col == playerCell.col){
							ghosts.hangOn();

							sounds.pauseBg();

							canReact = false;
							player.playAnim = false;
							player.gotoAndStop(3);

							playProps.doMoodSwitch = false;
							playProps.lives--;

							var GCID = window.setTimeout(function(){
								window.clearTimeout(GCID);

								showGhosts = false;
								ghosts.erase();
							}, 1500);

							var PDAID = window.setTimeout(function(){
								window.clearTimeout(PDAID);

								sounds.play('death', true);

								player.playAnim = true;
								playerAnim = 'hit';
							}, 1700);

							var LRID = window.setTimeout(function(){
								window.clearTimeout(LRID);

								paused = true;
								if (playProps.lives <= 0){
									_gameOver();
								}else{
									if (bonusLevel){
										_nextLevel();
									} else {
										_restartLevel();
									}
								}
							}, 4500);
						}
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
			if (!restartLevel && !bonusLevel) collHistory.push(collectables[playProps.collectableIndex]);
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
			paused = true;

			window.cancelAnimationFrame(aF);
			window.clearInterval(aF);

			document.getElementById('game').classList.remove('flip');

			sounds.resetSfx();
			sounds.resetBgSfx();

			renderer.print('game over', gameImg, 114, 241, vectrexS ? [222, 222, 255, 255] : [222, 0, 0, 255]);

			var GOID = window.setTimeout(function(){
				window.clearTimeout(GOID);

				window.location.reload();
			}, 2000);
		}

		var _nextLevel = function(levelType){
			sounds.resetSfx();
			sounds.resetBgSfx();

			playProps.dots = 0;
			playProps.gEatPts = 0;

			canReact = false;
			ghosts.hangOn();
			if (!bonusLevel) player.gotoAndStop(3);
			playerAnim = '';
			paused = true;

			playProps.doMoodSwitch = false;

			var NLID = window.setTimeout(function(){
				window.clearTimeout(NLID);

				var toLevel = typeof levelType === 'string' && levelType.length ? 'bonus' : gameLevel + 1;
				game.playLevel(toLevel);
			}, 1500);
		}

		var _restartLevel = function(){
			restartLevel = true;
			game.playLevel(gameLevel);
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

					//*wake up* ghosts, if player enters *their* area
					if (bonusLevel && playerPos.row >= 11 && playerPos.row <= 16 && playerPos.col >= 9 && playerPos.col <= 18) ghosts.zzz = false;

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

					//bonus life at every 10K pts.
					if (playProps.score - 10000 >= playProps.lastLifePts && playProps.lives < playProps.naxLives){
						playProps.lives++;
						playProps.lastLifePts = playProps.score;

						_showLives();

						sounds.play('extra-life', true);
					}


					/***********************************************/
					//ghosts wander/stalker mood switch
					var maxVisCells = 2, stepBuffLen = 4;
					if (playProps.doMoodSwitch){
						playProps.secs = isNaN(playProps.secs) ? deltaT : playProps.secs + deltaT;
						playProps.reTrySec += deltaT;
						playProps.xReTrySec += deltaT;
					}

					if (playProps.secs >= playProps.ghostsWanderT && playProps.ghostsMood == 'wander'){//stalker on
						playProps.ghostsMood = 'stalker';
						playProps.secs = 0;

						ghosts.portalsOpen();

						//var speedLRatio = gameLevel >= 5 ? 4 : 2;
						var speedLRatio = 2;
						ghosts.setSpeed(playProps.ghostsSpeed + speedLRatio);

						ghosts.setSpeed(playProps.ghostsSpeed + 4 + playProps.ghostsSpeed * 5 / 100, 'oikake');

						var MBCol = playerDir == 'left' ? playerPos.col - 4 : playerPos.col + 4;
						var MBRow = playerDir == 'up' ? playerPos.row - 4 : playerPos.row + 4;

						//red
						ghosts.setTarget(playerPos.col, playerPos.row, 'oikake', true, stepBuffLen, maxVisCells);

						//cyam
						var KGCol = playerDir == 'left' ? playerPos.col - 2 : playerPos.col + 2;
						var KGRow = playerDir == 'up' ? playerPos.row - 2 : playerPos.row + 2;
						ghosts.setTarget(KGCol , KGRow, 'kimagure', true, stepBuffLen, maxVisCells);

						//pink
						ghosts.setTarget(MBCol, MBRow, 'machibuse', true, stepBuffLen, maxVisCells);

						//orange
						ghosts.setTarget(playerPos.col, playerPos.row, 'otoboke', true, 20, maxVisCells);

						playProps.reTrySec = 0;
						playProps.xReTrySec = 0;

						playProps.lastPlyrPos.col = 0;
						playProps.lastPlyrPos.row = 0;

						sounds.play('stalker-on', true);

						//console.log('stalker mode on.');

					}else if (playProps.secs >= playProps.ghostsStalkerT && playProps.ghostsMood == 'stalker'){//wander on
						playProps.ghostsMood = 'wander';
						playProps.secs = 0;
						//maxVisCells = 28;

						//ghost slow down
						ghosts.setSpeed(playProps.ghostsSpeed);

						ghosts.portalsClose();
						ghosts.spreadOut();

						playProps.lastPlyrPos.col = 0;
						playProps.lastPlyrPos.row = 0;

						//console.log('wander mode on.')
					}

					//stalker ghosts can see pm?
					/*if (playProps.ghostsMood == 'stalker'){
						theGhosts.some(function(ghost){
							var ghostCell = renderer.XYToColRow(ghost.position.x + ghost.clip.width / 2, ghost.position.y + ghost.clip.height / 2);

							if ((ghostCell.row == playerPos.row || ghostCell.col == playerPos.col) && (playerPos.col != playProps.lastPlyrPos.col || playerPos.row != playProps.lastPlyrPos.row)){
								//check if there is pathway to player
								var rowD = ghostCell.row - playerPos.row;
								var colD = ghostCell.col - playerPos.col;

								var isPWRow = true, isPWCol = true;
								if (ghostCell.col == playerPos.col){
									//check row
									isPWCol = false;
									if (rowD < 0){
										var fromRow = ghostCell.row;
										var toRow = playerPos.row;
									}else{
										var fromRow = playerPos.row;
										var toRow = ghostCell.row;
									}

									//console.log('fromRow: ' + fromRow + ' | toRow: ' + toRow);
									for (var i=fromRow; i<=toRow; i++){
										if (['xxxpwe', 'xxxpwc', 'xxxpwp', 'xx1hts', 'xx2hts', 'xx3hts', 'xx5hts', 'xx7hts', 'xxxxhe', 'xxxxte'].indexOf(actLevel.layout[i][ghostCell.col].toLowerCase()) == -1){
											isPWRow = false;
											break;
										}
									}
								} else if (ghostCell.row == playerPos.row){
									//check col
									isPWRow = false;
									if (colD < 0){
										var fromCol = ghostCell.col;
										var tocol = playerPos.col;
									}else{
										var fromCol = playerPos.col;
										var toCol = ghostCell.col;
									}

									//console.log('fromCol: ' + fromCol + ' | toCol: ' + toCol);
									for (var i=fromCol; i<=toCol; i++){
										if (['xxxpwe', 'xxxpwc', 'xxxpwp', 'xx1hts', 'xx2hts', 'xx3hts', 'xx5hts', 'xx7hts', 'xxxxhe', 'xxxxte'].indexOf(actLevel.layout[ghostCell.row][i].toLowerCase()) == -1){
											isPWCol = false;
											break;
										}
									}
								}

								//console.log(ghost.props.name + ' is in same row/coll as the player');
								//console.log('pathway row: ' + isPWRow + ' | pathway col: ' + isPWCol);

								//go there if row or col is pathway
								if ((isPWRow || isPWCol) && playProps.reTrySec >= .2){
									//ghost speed up
									var speedLRatio = 2;
									ghosts.setSpeed(playProps.ghostsSpeed + speedLRatio + playProps.ghostsSpeed * 5 / 100, 'oikake')

									//red
									ghosts.setTarget(playerPos.col, playerPos.row, 'oikake', true, stepBuffLen, maxVisCells);

									//cyan
									var OIKEnt = _getGhostByName('oikake');
									var OIKPos = renderer.XYToColRow(OIKEnt.position.x, OIKEnt.position.y);
									var OIKPRDist = Math.abs(OIKPos.row - playerPos.row);
									var OIKPCDist = Math.abs(OIKPos.col - playerPos.col);
									if (OIKPCDist <= 5 && OIKPRDist <=5){
										var KGCol = playerDir == 'left' ? playerPos.col - OIKPCDist  : playerPos.col + OIKPCDist * 2;
										var KGRow = playerDir == 'up' ? playerPos.row - OIKPRDist  : playerPos.row + OIKPRDist * 2;
									}else{
										var KGCol = playerDir == 'left' ? playerPos.col - 2 : playerPos.col + 2;
										var KGRow = playerDir == 'up' ? playerPos.row - 2 : playerPos.row + 2;
									}
									ghosts.setTarget(KGCol , KGRow, 'kimagure', true, stepBuffLen, maxVisCells);

									//pink
									var MBCol = playerDir == 'left' ? playerPos.col - 4 : playerPos.col + 4;
									var MBRow = playerDir == 'up' ? playerPos.row - 4 : playerPos.row + 4;
									ghosts.setTarget(MBCol, MBRow, 'machibuse', true, stepBuffLen, maxVisCells);


									playProps.reTrySec = 0;
								}

								playProps.lastPlyrPos.col = playerPos.col;
								playProps.lastPlyrPos.row = playerPos.row;
							}
						});
					}*/

					//stalker retry
					if (playProps.ghostsMood == 'stalker' && playProps.reTrySec >= .1){
						//ghost speed up
						//var speedLRatio = gameLevel >= 5 ? 4 : 2;
						var speedLRatio = 2;
						ghosts.setSpeed(playProps.ghostsSpeed + speedLRatio + playProps.ghostsSpeed * 5 / 100, 'oikake')

						//red
						ghosts.setTarget(playerPos.col, playerPos.row, 'oikake', true, stepBuffLen, maxVisCells);

						//cyan
						var OIKEnt = _getGhostByName('oikake');
						var OIKPos = renderer.XYToColRow(OIKEnt.position.x, OIKEnt.position.y);
						var OIKPRDist = Math.abs(OIKPos.row - playerPos.row);
						var OIKPCDist = Math.abs(OIKPos.col - playerPos.col);
						if (OIKPCDist <= 5 && OIKPRDist <=5){
							var KGCol = playerDir == 'left' ? playerPos.col - OIKPCDist  : playerPos.col + OIKPCDist * 2;
							var KGRow = playerDir == 'up' ? playerPos.row - OIKPRDist  : playerPos.row + OIKPRDist * 2;
						}else{
							var KGCol = playerDir == 'left' ? playerPos.col - 2 : playerPos.col + 2;
							var KGRow = playerDir == 'up' ? playerPos.row - 2 : playerPos.row + 2;
						}
						ghosts.setTarget(KGCol , KGRow, 'kimagure', true, stepBuffLen, maxVisCells);

						//pink
						var MBCol = playerDir == 'left' ? playerPos.col - 4 : playerPos.col + 4;
						var MBRow = playerDir == 'up' ? playerPos.row - 4 : playerPos.row + 4;
						ghosts.setTarget(MBCol, MBRow, 'machibuse', true, stepBuffLen, maxVisCells);

						playProps.reTrySec = 0;

						playProps.lastPlyrPos.col = playerPos.col;
						playProps.lastPlyrPos.row = playerPos.row;

						//console.log('stalker retry.');
						//console.log('pink target: ' + MBCol + ', ' + MBRow);
					}

					//extras
					if (playProps.ghostsMood == 'stalker' && playProps.xReTrySec >= .1){
						if (playerPos.col != playProps.lastPlyrPos.col){
							var OIKEnt = _getGhostByName('oikake');
							var OIKPos = renderer.XYToColRow(OIKEnt.position.x, OIKEnt.position.y);
							var OIKPRDist = Math.abs(OIKPos.row - playerPos.row);
							var OIKPCDist = Math.abs(OIKPos.col - playerPos.col);

							if (OIKPRDist <= 2 && OIKPCDist <= 10){
								ghosts.setTarget(playerPos.col, playerPos.row, 'oikake', true, 2, maxVisCells);

								//console.log('oikake closing in.');
							}

							playProps.lastPlyrPos.col = playerPos.col;
							playProps.lastPlyrPos.row = playerPos.row;
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

				if (lightsOutS || lightsOutG){
					if (playerPos.row != playProps.lastPlyrPos.row || playerPos.col != playProps.lastPlyrPos.col){
						renderer.clr(renderer.lightsOCtx, 0, 0, gameWidth, gameHeight);
						if (canReact) renderer.reDrawCells(gameImg, playerPos.col, playerPos.row, 3, 3, renderer.lightsOCtx, '#000000');
					}
				}

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

						if (lightsOutG){
							var ghostCR = renderer.XYToColRow(ghost.position.x, ghost.position.y);
							if (canReact) renderer.reDrawCells(gameImg, ghostCR.col, ghostCR.row, 2, 2, renderer.lightsOCtx, '#000000');
						}
					});
				}

				//sound ctrl
				sounds.check();
			}

			lastTime = now;
			aF = requestAnimFrame(_play);
		}

		var _loadResources = function(buildIndex){
			var gameSrc = actLevel.spritesSrc;
			if (vectrexS) {
				gameSrc = actLevel.spritesSrcVT;
			} else if (c19S) {
				gameSrc = actLevel.spritesSrcC19;
			}
	
			console.log('gameSrc', gameSrc);
			try{
				imageLoader.load([{
					src : gameSrc
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
					if (lightsOutS) renderer.clr(renderer.lightsOCtx, 0, 0, gameWidth, gameHeight);
					renderer.clr(render.game.context, 0, 0, gameWidth, gameHeight);
					renderer.clr(render.layout.context, 0, 0, gameWidth, gameHeight);
					renderer.clr(render.console.context, 0, 0, gameWidth, gameHeight + 80);

					//*display console* setup
					renderer.print('1up', gameImg, 36, 0);
					renderer.print('high score', gameImg, 108, 0, [222, 222, 222, 100]);
					renderer.print('2up', gameImg, 264, 0, [222, 222, 222, 100]);

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
						renderer.drawLayout(gameImg, layoutCols[layColIndex]);

						//create ghosts
						ghosts.zzz = bonusLevel ? true : false;
						theGhosts = [];
						theGhosts = ghosts.create(actLevel.ghosts, player.position, actLevel.layout, 336, 372, gameLevel);

						//ghosts speed
						ghosts.setSpeed(playProps.ghostsSpeed)

						//reverse ghosts orders, so the first draws lastly on top of others
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
							window.clearTimeout(ghostsShow);

							//clear 'player one' print
							renderer.clr(render.console.context, 0, 36, gameWidth, 200);

							showGhosts = true;
							ghosts.dontHangOn();

							if (bonusLevel) document.getElementById('game').classList.add('flip');
						}, (restartLevel ? 0 : 2000));

						//start player
						var playerStart = window.setTimeout(function(){
							if (paused){
								window.clearTimeout(playerStart);

								//clear console
								renderer.clr(render.console.context, 0, 36, gameWidth, gameHeight);

								paused = false;
								isWBlur = false;
								canReact = true;
								toDir = Math.round(Math.random()) ? 'left' : 'right';

								//level startTime
								levelStartTime = performance.now() || Date.now();

								//controll player
								_playerCtrl();

								canReact = true;
							}
						}, (restartLevel ? 2000 : 4200));

						//play intro music
						if (!restartLevel){
							sounds.play('start-music');
							renderer.print('player one', gameImg, 107, 169, vectrexS ? [222, 222, 255, 255] : [0, 222, 222, 255]);
						}

						_updateScores();
						renderer.print(bonusLevel ? 'bonus!' : 'ready!', gameImg, 133, 241, vectrexS ? [222, 222, 255, 255] : [255, 255, 33, 255]);
					}

					restartLevel = false;

					//start gameloop
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

				if (isNaN(levelIndex) && !bonusLevel){
					bonusLevel = true;
					levelIndex = gameLevel;
				} else {
					bonusLevel = false;
					if (levelIndex > maxLevels){
						gameLevel = levelIndex = 0;
					}else {
						gameLevel = levelIndex;
					}
				}

				//console.log(gameLevel)


				playerCellType = playerAnim = playerDir = toDir = '';

				//get level properties
				levelObj = levels.getLevel(levelIndex);
				buildIndex = levelObj.levelIndex;
				actLevel = levelObj.level;
				actLevel.layout = restartLevel || buildIndex == 0 ? actLevel.layout : layouts.getLayout(buildIndex);

				if (bonusLevel){
					actLevel.layout.forEach(function(row, rowIndex){
						row.forEach(function(cell, colIndex){
							if (cell.toLowerCase() == 'xxxpwc') actLevel.layout[rowIndex][colIndex] = 'XXPWC2';
						});
					});
				}

				layColIndex = !bonusLevel && !restartLevel && gameLevel > 0 ? layColIndex < layoutCols.length - 1 ? layColIndex + 1 : 1 : layColIndex;

				//clean up
				playProps.collectableIndex = gameLevel > 13 ? CLIndex[CLIndex.length - 1] : CLIndex[gameLevel];
				playProps.xCollShowSec = restartLevel ? playProps.xCollShowSec : 0;
				playProps.showCollectable = restartLevel && playProps.showCollectable ? true : false;

				playProps.doMoodSwitch = true;
				//playProps.secs = restartLevel ? playProps.secs : 0;
				playProps.secs = 0;
				playProps.reTrySec = 0;
				playProps.maxDots = buildIndex == 0 ? 0 : layouts.getCellsByType(buildIndex, ['xxxpwc', 'xxpwc2']).length,
				playProps.ghostsMood = 'wander';

				playProps.levelSRatio = gameLevel > 5 ? 4 : 2;
				playProps.ghostsSpeed = Math.min(100, 70 + gameLevel * playProps.levelSRatio);
				//console.log('ghostsSpeed: ' + playProps.ghostsSpeed)

				playProps.lastPlyrPos = { col : 0, row : 0};
				if (!restartLevel) playProps.levelEntLives = playProps.lives;

				document.getElementById('game').classList.remove('flip');


				_loadResources(buildIndex);

				//level settings
				showGhosts = false;
			}
		}
	}('game'));

	//setTimeout wins
	var initID = window.setTimeout(function(){
		window.clearTimeout(initID);

		//sounds.load(function(){
			//after sounds has loaded
			game.playLevel(0);
		//});
	}, 0);
});
