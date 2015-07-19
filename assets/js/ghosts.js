
var ghosts = (function(){
	var theGhosts = [],
		playGround = {},
		pathways = [],
		lastSpeeds = [],
		targetPos = {};

	var startTime,
		gameWidth,
		gameHeight,
		cellWidth,
		cellHeight,
		actLevel,
		dotsEaten;

	var firstStep = true,
		canUsePortals = false,
		paused = false,
		freezed = false;

	var secs = 0,
		freezeSec = 0,
		freezeEndSec = 0,
		freezeCtrlSec = 0,
		freezeSpeed = inCageSpeed = 50,
		eatenSpeed = 220,
		actGhostsSpeed = 0,
		ghostsFreezed = 0;

	var _getCells = function(valueArr){
		var matchArr = [];
		playGround.forEach(function(row, rowIndex){
			row.forEach(function(cell, colIndex){
				if (valueArr.indexOf(cell.toLowerCase()) != -1){
					matchArr.push({
						type : cell.toLowerCase(),
						row : rowIndex,
						col : colIndex
					});
				}
			});
		});

		//console.log(matchArr)
		return matchArr;
	}

	var _getGhostByName = function(ghostName){
		var name = typeof ghostName === 'string' ? ghostName.trim().toLowerCase() : null;
		if (name == null || !name.length) return null;

		var theGhost = null;
		theGhosts.some(function(ghost){
			if (ghost.name.toLowerCase() == ghostName.trim().toLowerCase()) theGhost = ghost;
		});

		return theGhost;
	}

	//if ghostEntity is not passed, sets animStr for all ghosts
	var _setAnimation = function(animStr, deltaT, ghostEntity, anchor){
		var isAnchor = !anchor ? false : anchor;
		if (typeof ghostEntity == 'undefined' || ghostEntity == null){
			theGhosts.forEach(function(ghost){
				ghost.entity.animate(animStr, deltaT, isAnchor);
			});
		}else{
			ghostEntity.animate(animStr, deltaT, isAnchor);
		}
	}

	//if ghostName for that ghost, otherwise for all
	var _shelterAccess = function(isAccessible, ghostName){
		var isAccess = typeof isAccessible !== 'boolean' ? false : isAccessible;
		var __setCells = function(ghostRouter){
			ghostRouter.cells[10][12].directions.up = isAccess;
			ghostRouter.cells[10][12].directions.up = isAccess;
			ghostRouter.cells[11][12].directions.up = isAccess;
			ghostRouter.cells[11][12].directions.up = isAccess;

			ghostRouter.cells[10][15].directions.up = isAccess;
			ghostRouter.cells[10][15].directions.up = isAccess;
			ghostRouter.cells[11][15].directions.up = isAccess;
			ghostRouter.cells[11][15].directions.up = isAccess;

			ghostRouter.cells[22][12].directions.up = isAccess;
			ghostRouter.cells[22][12].directions.up = isAccess;
			ghostRouter.cells[23][12].directions.up = isAccess;
			ghostRouter.cells[23][12].directions.up = isAccess;

			ghostRouter.cells[22][15].directions.up = isAccess;
			ghostRouter.cells[22][15].directions.up = isAccess;
			ghostRouter.cells[23][15].directions.up = isAccess;
			ghostRouter.cells[23][15].directions.up = isAccess;
		}

		var theGhost = _getGhostByName(ghostName);
		if (theGhost != null){
			__setCells(theGhost.router);
		}else{
			theGhosts.forEach(function(ghost){
				__setCells(ghost.router);
			});
		}
	}

	var _openCage = function(openOrNot, ghostName){
		var OCState = typeof openOrNot !== 'boolean' ? false : openOrNot;
		var theGhost = _getGhostByName(ghostName);

		if (theGhost != null){
			for (var rowI=11; rowI<=13; rowI++){
				for (var colI=13; colI<=14; colI++){
					theGhost.router.cells[rowI][colI].directions.down = OCState;
				}
			}
		}
	}

	var _hereWeCome = function(deltaT){
		theGhosts.forEach(function(ghost){
			var cellPos = renderer.XYToColRow(ghost.entity.position.x + ghost.entity.clip.width / 2, ghost.entity.position.y + ghost.entity.clip.height / 2);

			//position correction. center ghost to cell, if needRepos
			if (ghost.needRepos){
				var cell = renderer.ColRowToXY(cellPos.col, cellPos.row);
				var corX = cell.x - cellWidth / 2 - ghost.entity.position.x;
				var corY = cell.y - cellHeight / 2 - ghost.entity.position.y + 1;


				if (ghost.eaten){
					ghost.entity.position.x += corX;
					ghost.entity.position.y += corY;

				}else{
					var reposT = actGhostsSpeed < 92 ? .028 : .018
					ghost.entity.position.x += ghost.inCage || ghost.freezed ? corX / (ghost.entity.props.speed * .08 ) : corX / (ghost.entity.props.speed * reposT );
					ghost.entity.position.y += ghost.inCage || ghost.freezed ? corY / (ghost.entity.props.speed * .08 ) : corY / (ghost.entity.props.speed * reposT );
				}

				if (Math.round(corX) == 0 && Math.round(corY) == 0){
					ghost.needRepos = false;
					return;
				}else{
					ghost.needRepos = true;
					return;
				}
			}

			//coming back on the other side
			if (ghost.teleporting){
				if (!ghost.inTeleport){
					if (ghost.teleportDirection == 'left'){
						ghost.entity.position.x = gameWidth;
						ghost.inTeleport = true;
					}else{
						ghost.entity.position.x = -1 * ghost.entity.clip.width;
						ghost.inTeleport = true;
					}

					return;
				} else {
					//wait til enters the screen, then get a new rout from there
					if (ghost.entity.position.x >= 0 && ghost.entity.position.x + ghost.entity.clip.width <= gameWidth){
						var reposCell = {
							row : cellPos.row,
							col : ghost.teleportDirection == 'left' ? playGround[0].length - 1 : 0
						};
						ghost.router.setRoute(reposCell, ghost.router.destPos, ghost.router.stalker);

						ghost.newRoute = true;
						ghost.teleportDirection = '';
						ghost.teleporting = false;
						ghost.inTeleport = false;
					}else {
						ghost.entity.animate(ghost.dirPreStr + ghost.teleportDirection, deltaT);
						ghost.entity.move(ghost.teleportDirection, deltaT);
						ghost.inTeleport = true;
					}

					return;
				}
			}

			//init route
			if (firstStep){
				ghost.nextCells = [];
				ghost.stepBuffLen = typeof ghost.stepBuffLen === 'undefined' ? 8 : ghost.stepBuffLen;
				ghost.actStep = 0;
				ghost.slowDown = false;
				ghost.inCage = typeof ghost.inCage != 'boolean' ? false : ghost.inCage;
				ghost.newRoute = false;
				ghost.teleporting = false;
				ghost.inTeleport = false;
				ghost.freezed = false;
				ghost.eaten = false;
				ghost.lastDirection = '';
				ghost.toNextStep = false;
				ghost.dirPreStr = '';
				ghost.teleportDirection = '';
			}

			//check if in cage
			//close cage in
			if (ghost.eaten){
				if ((cellPos.row >= 13 && cellPos.row <= 15) && (cellPos.col >= 11 && cellPos.col <= 16)){
					//arrived back in cage, move to start position
					ghost.inCage = true;
					ghost.entity.props.speed = inCageSpeed;

					renderer.rePaintCells(cellPos.col, cellPos.row, 1, 0, '#' + ((1<<24) * Math.random() | 0).toString(16));

					if (!ghost.toStartPos){
						ghost.toStartPos = true;
					}
				}

				if (ghost.inCage){
					if (ghost.nextCells.length && (ghost.nextCells[ghost.actStep].row <= 12 || ghost.nextCells[ghost.actStep].row >= 16)){
						_shelterAccess(false, ghost.name);
						ghost.eaten = false;
						ghost.inCage = false;
						ghost.toStartPos = false;
						ghost.dirPreStr = '';
						ghost.entity.props.speed = actGhostsSpeed;
						_openCage(false, ghost.name);

						ghost.router.setRoute(cellPos, ghost.router.destPos, ghost.router.stalker);
						ghost.nextCells = [];

						renderer.rePaintCells(14, 14, 2, 1, '#000');

						/*if (freezed) {
							sounds.resetBgSfx();
							if (sounds.curPlayingBg.name != 'freeze-eaten-btc') sounds.playBgLoop('power-pill', false);
						}else {
							sounds.resetBgSfx();
						}*/
					}
				}
			}

			//slow down in portal ways
			if (cellPos.row == 14 && (cellPos.col <= 5 || cellPos.col >= 22)){
				if (!ghost.slowDown){
					ghost.slowDown = true;
					ghost.lastSpeed = ghost.entity.props.speed;
					ghost.entity.props.speed /= 1.4;
				}
			}else if (ghost.slowDown){
				ghost.slowDown = false;
				ghost.entity.props.speed = ghost.freezed ? freezeSpeed : ghost.eaten ? eatenSpeed : ghost.lastSpeed;
			}

			//rebuffer steps
			var buffEnd = ghost.nextCells.length - 2 < 0 ? ghost.nextCells.length : ghost.nextCells.length - 2;
			if (!ghost.nextCells.length || ghost.actStep == buffEnd || ghost.newRoute){
				var newSteps = ghost.router.getNextSteps(ghost.stepBuffLen, false);
				if (ghost.newRoute){
					ghost.nextCells = newSteps;
				}else {
					ghost.nextCells.splice(0, ghost.actStep);
					var concArr = ghost.nextCells.concat(newSteps);
					ghost.nextCells = [];
					ghost.nextCells = concArr;
				}

				//let it out of the screen on portal
				ghost.nextCells.some(function(cell){
					if (cell.row == 14 && (cell.col <= 1 || cell.col >= 26)){
						cell.direction = cell.col <= 1 ? 'left' : 'right';
					}
				});

				ghost.toNextStep = false;
				ghost.newRoute = false;
				ghost.actStep = 0;

				//check if repos needed after new route
				var firstStepD = ghost.nextCells[ghost.actStep].direction.toLowerCase();
				if ( (firstStepD == 'up' || firstStepD == 'down') && (ghost.lastDirection == 'left' || ghost.lastDirection == 'right') ){
					ghost.needRepos = true;
				} else if ( (firstStepD == 'left' || firstStepD == 'right') && (ghost.lastDirection == 'up' || ghost.lastDirection == 'down') ){
					ghost.needRepos = true;
				}

				if (ghost.needRepos) ghost.lastDirection = firstStepD;

			//step
			}else{
				ghost.toNextStep = true;

				ghost.lastDirection = ghost.nextCells[ghost.actStep].direction.toLowerCase();
				ghost.lookToStep = Math.min(ghost.nextCells.length - 1, ghost.actStep + 1);

				if (cellPos.col == ghost.nextCells[ghost.actStep].col && cellPos.row == ghost.nextCells[ghost.actStep].row){
					//check if reposition needed (on turns)
					var nextDir = ghost.nextCells[ghost.lookToStep].direction.toLowerCase();
					var actDir = ghost.nextCells[ghost.actStep].direction.toLowerCase();
					if ( (nextDir == 'up' || nextDir == 'down') && (actDir == 'left' || actDir == 'right') ){
						ghost.needRepos = true;
					} else if ( (nextDir == 'left' || nextDir == 'right') && (actDir == 'up' || actDir == 'down') ){
						ghost.needRepos = true;
					}

					ghost.toNextStep = false;

					//next step
					ghost.actStep++;
				}

				//check if out of the screen
				if (ghost.entity.position.x + ghost.entity.clip.width < 0){//exited left
					ghost.teleportDirection = 'left';
					ghost.teleporting = true;
				}else if (ghost.entity.position.x > gameWidth){//exited right
					ghost.teleportDirection = 'right';
					ghost.teleporting = true;
				}

				//repos, teleport then come back
				if (ghost.needRepos || ghost.teleporting) return;

				//animate + move
				if (ghost.nextCells[ghost.lookToStep].row == 14){
					var lookTo = ghost.nextCells[ghost.lookToStep].col <= 2 ? 'left' : ghost.nextCells[ghost.lookToStep].col >= 25 ? 'right' : ghost.nextCells[ghost.lookToStep].direction.toLowerCase();
				}else{
					var lookTo = ghost.nextCells[ghost.lookToStep].direction.toLowerCase();
				}

				//ghost.entity.animate(ghost.nextCells[ghost.actStep + 1].direction.toLowerCase(), deltaT); //look one step fwd
				ghost.entity.animate(ghost.dirPreStr + lookTo, deltaT); //look one step fwd
				ghost.entity.move(ghost.nextCells[Math.min(ghost.actStep, ghost.nextCells.length - 1)].direction.toLowerCase(), deltaT);
			}
		});

		firstStep = false;
	}



	return {
		paused : paused,

		setAnimation : function(animStr, deltaT, ghostEntity, anchor){
			_setAnimation(animStr, deltaT, ghostEntity, anchor);
		},

		portalsClose : function(){
			theGhosts.forEach(function(ghost){
				//cloes pathways to protal entrances
				ghost.router.cells[14][6].directions.left = false; //left
				ghost.router.cells[14][21].directions.right = false; //right
			});
		},

		portalsOpen : function(){
			theGhosts.forEach(function(ghost){
				//cloes pathways to protal entrances
				ghost.router.cells[14][6].directions.left = true; //left
				ghost.router.cells[14][21].directions.right = true; //right
			});
		},

		setSpeed : function(speed, ghostName){
			var toSpeed = isNaN(speed) ? 1 : speed;
			var name = typeof ghostName === 'string' ? ghostName.trim().toLowerCase() : null;
			var theGhost = null;

			if (name != null){
				theGhost = _getGhostByName(name);
			}

			if (theGhost != null){
				if (!theGhost.slowDown && !theGhost.freezed && !theGhost.eaten) theGhost.entity.props.speed = theGhost.inCage ? inCageSpeed : toSpeed;
			}else if (name == null){//set for all
				theGhosts.forEach(function(ghost){
					if (!ghost.slowDown && !ghost.freezed && !ghost.eaten) ghost.entity.props.speed = ghost.inCage ? inCageSpeed : toSpeed;
				});
			}
		},

		setTarget : function(col, row, ghostName, stalker, buffSteps, maxVisitedCells){
			//console.log('setTarget')
			var name = typeof ghostName === 'string' ? ghostName.trim().toLowerCase() : null;
			var theGhost = null;
			var isStalker = typeof stalker === 'boolean' ? stalker : true;

			if (name != null){
				theGhost = _getGhostByName(name);
			}

			if (theGhost != null){
				if (theGhost.needRepos || theGhost.teleporting || theGhost.inTeleport || theGhost.freezed || theGhost.eaten || theGhost.inCage) return;
				theGhost.stepBuffLen = isNaN(buffSteps) ? 20 : buffSteps;
				var ghostCell = renderer.XYToColRow(theGhost.entity.position.x + theGhost.entity.clip.width / 2, theGhost.entity.position.y + theGhost.entity.clip.height / 2);
				theGhost.router.setRoute(ghostCell, {col : col, row : row}, isStalker);
				theGhost.router.maxVisitedCells = isNaN(maxVisitedCells) ? 0 : maxVisitedCells;

				theGhost.newRoute = true;
			} else if (name == null){//move all
				theGhosts.forEach(function(ghost){
					if (!ghost.needRepos && !ghost.teleporting && !ghost.inTeleport && !ghost.freezed && !ghost.eaten && !ghost.inCage){
						ghost.stepBuffLen = isNaN(buffSteps) ? 20 : buffSteps;
						var ghostCell = renderer.XYToColRow(ghost.entity.position.x + ghost.entity.clip.width / 2, ghost.entity.position.y + ghost.entity.clip.height / 2);
						ghost.router.maxVisitedCells = isNaN(maxVisitedCells) ? 0 : maxVisitedCells;
					}
				});
			} else {
				return false;
			}
		},

		spreadOut : function(stalker){
			theGhosts.forEach(function(ghost){
				if (!ghost.eaten && !ghost.freezed){
					//set first route
					var curPos = renderer.XYToColRow(ghost.entity.position.x + ghost.entity.clip.width / 2, ghost.entity.position.y + ghost.entity.clip.height / 2);

					/*var rndIndex = Math.round(Math.random() * (pathways.length - 1));
					var c = pathways[rndIndex].col;
					var r = pathways[rndIndex].row;*/

					switch (ghost.name.toLowerCase()){
						case 'oikake' : //red
							var r = -1 * (Math.round(Math.random() * 8)) + 4; //-4 - 4
							var c = Math.round(Math.random() * 20) + 15; //15+
							break;

						case 'machibuse' : //pink
							var r = -1 * (Math.round(Math.random() * 8)) + 4; //-4 - 4
							var c = -1 * (Math.round(Math.random() * 24)) + 12; //-12 - 12
							break;

						case 'kimagure' : //cyan
							var r = (Math.round(Math.random() * 8)) + 26; //26 - 34
							var c = Math.round(Math.random() * 20) + 15; //15+
							break;

						case 'otoboke' : //orange
							var r = (Math.round(Math.random() * 8)) + 26; //26 - 34
							var c = -1 * (Math.round(Math.random() * 24)) + 12; //-12 - 12
							break;
					}

					ghost.router.setRoute({ row : curPos.row, col : curPos.col}, { row : r, col : c}, stalker);

					ghost.stepBuffLen = 20;
					ghost.nextCells = [];
					ghost.router.maxVisitedCells = 0;
				}
			})
		},

		hangOn : function(){
			theGhosts.forEach(function(ghost){
				ghost.entity.canMove = false;
				ghost.entity.playAnim = false;
			});

			paused = true;
		},

		dontHangOn : function(){
			theGhosts.forEach(function(ghost){
				ghost.entity.canMove = true;
				ghost.entity.playAnim = true;
			});

			paused = false;
		},

		//clears canvas around ghost(s)
		erase : function(ghostName){
			var name = typeof ghostName === 'string' ? ghostName.trim().toLowerCase() : null;
			var theGhost = _getGhostByName(name);

			if (theGhost != null){
				renderer.clr(theGhost.entity.position.x, theGhost.entity.position.y, theGhost.entity.clip.width, theGhost.entity.clip.height);
			} else if (name == null){
				theGhosts.forEach(function(ghost){
					renderer.clr(ghost.entity.position.x, ghost.entity.position.y, ghost.entity.clip.width, ghost.entity.clip.height);
				});
			}
		},

		getGhostByName : function(name){
			_getGhostByName(name);
		},

		freeze : function(){

			ghostsFreezed = 0;
			this.spreadOut();

			theGhosts.forEach(function(ghost){
				if (!ghost.eaten){
					this.setSpeed(freezeSpeed, ghost.name);
					ghostsFreezed++;
					ghost.freezed = true;
				}
			}, this);

			freezed = true;
			freezeCtrlSec = 0;

			//sounds.playBgLoop('power-pill', false);
			//console.log('freeze start')
		},

		eaten : function(ghostName){
			ghosts.hangOn();

			var theGhost = _getGhostByName(ghostName);

			ghostsFreezed--;
			if (ghostsFreezed <= 0){
				freezed = false;
			}

			theGhost.eaten = true;
			theGhost.freezed = false;
			theGhost.entity.actAnimation.name = '';
			theGhost.entity.actAnimation.anchor = false;

			//transparent place on game image
			theGhost.entity.clip.x = 360;
			theGhost.entity.clip.y = 240;


			//open cage
			_openCage(true, theGhost.name);

			var ghostCellPos = renderer.XYToColRow(theGhost.entity.position.x + theGhost.entity.clip.width / 2, theGhost.entity.position.y + theGhost.entity.clip.height / 2);
			startCell = {col: 14, row: 12};
			theGhost.router.setRoute(ghostCellPos, startCell, true);
			theGhost.stepBuffLen = 20;
			theGhost.maxVisitedCells = 0;
			theGhost.nextCells = [];
			theGhost.newRoute = true;

			var GEID = window.setTimeout(function(){
				ghosts.dontHangOn();

				theGhost.entity.props.speed = eatenSpeed;
				theGhost.dirPreStr = 'eaten_';

				//sounds.resetBgSfx();
				//sounds.playBgLoop('freeze-eaten-btc', true);

				window.clearTimeout(GEID);
			}, 1000);
		},

		//call it in a loop
		gogogo : function(deltaT, dots, ghostsSpeed){
			if (paused) return;

			dotsEaten = isNaN(dots) ? 0 : dots;
			actGhostsSpeed = ghostsSpeed;
			secs += deltaT;

			//ghosts freezed
			if (freezed) {
				freezeCtrlSec += deltaT
				if (freezeCtrlSec <= freezeSec){
					theGhosts.forEach(function(ghost){
						if (ghost.freezed) {
							_shelterAccess(true, ghost.name);
							if (!ghost.eaten) this.setAnimation('freeze', deltaT, ghost.entity, true);
						}
					}, this);


				}else if (freezeCtrlSec <= freezeSec + freezeEndSec){
					theGhosts.forEach(function(ghost){
						if (ghost.freezed && !ghost.eaten){
							this.setAnimation('freeze_ending', deltaT, ghost.entity, true);
						}
					}, this);

				}else{
					//console.log('freezed end')
					theGhosts.forEach(function(ghost, index){
						if (ghost.entity.actAnimation.name.toLowerCase() == 'freeze_ending') ghost.entity.actAnimation.anchor = false;
						ghost.freezed = false;
						if (!ghost.eaten){
							_shelterAccess(false, ghost.name);
							ghost.entity.props.speed = ghost.inCage ? inCageSpeed : actGhostsSpeed;
						}
					});

					//if (sounds.curPlayingBg.name != 'freeze-eaten-btc') sounds.resetBgSfx();
					freezed = false;
					ghostsFreezed = 0;
					freezeCtrlSec = 0;
				}
			}

			//reopen pathways to portals
			if (secs >= 4 && !canUsePortals){
				this.portalsOpen();
				canUsePortals = true;
			}

			//let them out of the cage
			//kimagure
			if ((actLevel == 1 && dotsEaten >= 30) || actLevel > 1){
				var kimagure = _getGhostByName('kimagure');
				if (kimagure.inCage && !kimagure.eaten){
					kimagure.router.cells[13][11].directions.right = true;
					kimagure.router.cells[13][11].directions.down = false;
					kimagure.router.cells[13][12].directions.right = true;
					kimagure.router.cells[13][12].directions.down = false;
					kimagure.router.cells[13][13].directions.right = false;
					kimagure.router.cells[13][13].directions.down = false;

					if (kimagure.nextCells.length && (kimagure.nextCells[kimagure.actStep].row <= 12 || kimagure.nextCells[kimagure.actStep].row >= 16)){
						kimagure.inCage = false;
						kimagure.entity.props.speed = kimagure.freezed ? freezeSpeed : actGhostsSpeed;
					}
				}
			}

			//otoboke
			if (( (actLevel == 1 || actLevel == 2) && dotsEaten >= 80) || actLevel >= 3){
				var otoboke = _getGhostByName('otoboke');
				if (otoboke.inCage && !otoboke.eaten){
					otoboke.router.cells[13][16].directions.left = true;
					otoboke.router.cells[13][16].directions.down = false;
					otoboke.router.cells[13][15].directions.left = true;
					otoboke.router.cells[13][15].directions.down = false;
					otoboke.router.cells[13][14].directions.left = false;
					otoboke.router.cells[13][14].directions.down = false;

					if (otoboke.nextCells.length && (otoboke.nextCells[otoboke.actStep].row <= 12 || otoboke.nextCells[otoboke.actStep].row >= 16)){
						otoboke.inCage = false;
						otoboke.entity.props.speed = otoboke.freezed ? freezeSpeed : actGhostsSpeed;
					}
				}
			}

			//move ghosts to a destination
			_hereWeCome(deltaT);
		},

		create : function(ghostArr, targetPos, layout, gameW, gameH, gameLevel){
			if (ghostArr instanceof Array == false || typeof layout !== 'object'){
				error.throw('SomethingWentWrong', 'ghostArr and/or layout argument is not in correct type. check.');
				return false;
			}

			actLevel = isNaN(gameLevel) ? 1 : gameLevel;
			pathways = [];
			playGround = layout;
			theGhosts = [];
			startTime = 0;
			freezeCtrlSec = 0;
			ghostsFreezed = 0;
			freezed = false;
			freezeSec = Math.max(.8, 6 - gameLevel);
			freezeEndSec = Math.max(.4, 4 - gameLevel * .4);
			targetPos = targetPos;

			gameWidth = gameW || 336;
			gameHeight = gameH || 372;
			cellWidth = gameWidth / playGround[0].length;
			cellHeight = gameHeight / playGround.length;

			//get pathways
			pathways = _getCells(['xxxpwe', 'xxxpwc']);

			var ghostEntities = [];

			ghostArr.forEach(function(ghost, index){
				theGhosts.push(ghost)

				//create ghost entity
				theGhosts[index].entity = new entity(ghost);

				ghost.stepBuffLen = 20;
				ghost.actStep = 0;
				ghost.inTeleport = false;
				ghost.teleporting = false;
				ghost.freezed = false;
				ghost.eaten = false;
				ghost.inCage = false;
				ghost.lastDirection = '';
				ghost.toNextStep = false;
				ghost.dirPreStr = '';
				ghost.teleportDirection = '';

				if (ghost.name.toLowerCase() != 'oikake' && ghost.name.toLowerCase() != 'machibuse'){
					ghost.inCage = true;
				}

				//create ghosts router
				theGhosts[index].router = new pathFinder({layout : layout, pathways : ['xxxpwe', 'xxxpwc', 'xxxpwp', 'xx1hts', 'xx2hts', 'xx3hts', 'xx5hts', 'xx7hts', 'xxxxhe', 'xxxxte']});

				//setup cage
				for (var rowI=12; rowI<=13; rowI++){
					for (var colI=13; colI<=14; colI++){
						theGhosts[index].router.cells[rowI][colI].directions.up = true;
						theGhosts[index].router.cells[rowI][colI].directions.up = true;
					}
				}

				for (var rowI=13; rowI<=15; rowI++){
					for (var colI=11; colI<=16; colI++){
						theGhosts[index].router.cells[rowI][colI].directions.left = false;
						theGhosts[index].router.cells[rowI][colI].directions.right = false;
					}
				}

				/*shelter*/
				_shelterAccess(false, theGhosts[index].name);

				ghostEntities.push(theGhosts[index].entity);
			});

			//reset speed
			this.setSpeed(1);

			//close portals
			this.portalsClose();

			//spread out ghosts
			this.spreadOut(true);

			return ghostEntities;
		}
	}
}());