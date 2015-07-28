
/*
	layoutProps{
		layout : Array,
		pathways : Array of strings (eg.: ['xxxpwc', 'xxxpwe'])
	}
*/

function pathFinder(layoutProps){
	if (typeof layoutProps != 'object'){
		error.throw('InvalidLayoutProps', layoutProps + ' is not an object | pathfinder.js');
		return false;
	}

	this.layout = layoutProps.layout;
	this.pathways = layoutProps.pathways;

	this.cells = [];

	this.crawledCells = [];
	this.destPos = {};
	this.crawlPos = {};
	this.stalker = true;
	this.paused = false;
	this.lastDirection = '';

	this.maxVisitedCells = 0; //how many steps keep in visited state. 0 = all crawled cells stay visited

	//set up routes for layout
	this.layout.forEach(function(row, rowI){
		this.cells[rowI] = [];
		row.forEach(function(cell, colI){
			var dirs = {
				up : false,
				down : false,
				left : false,
				right : false
			}
			//get available directions from cell if cell matches this.pathways
			if (this.pathways.indexOf(cell.toLowerCase()) != -1){
				var colLeft = Math.max(0, colI - 1);
				var colRight = Math.min(row.length - 1, colI + 1);
				var rowUp = Math.max(0, rowI - 1);
				var rowDown = Math.min(this.layout.length - 1, rowI + 1);

				var up = this.pathways.indexOf(this.layout[rowUp][colI].toLowerCase()) != -1 ? true : false;
				var down = this.pathways.indexOf(this.layout[rowDown][colI].toLowerCase()) != -1 ? true : false;
				var left = this.pathways.indexOf(row[colLeft].toLowerCase()) != -1 ? true : false;
				var right = this.pathways.indexOf(row[colRight].toLowerCase()) != -1 ? true : false;

					dirs = {
					up : rowI == 0 ? false : up,
					down : rowI == this.layout.length - 1 ? false : down,
					left : colI == 0 ? false : left,
					right : colI == row.length - 1 ? false : right
				}
			}

			this.cells[rowI][colI] = {
				type : cell,
				row : rowI,
				col : colI,
				directions : dirs,
				visited : false
			};
		}, this);
	}, this);

	//empty the layout
	this.layout = [];
}

pathFinder.prototype = {
	/*
		stalker : boolean
			true = chooses next step in the direction of the destination, if can
			false = chooses next step randomly, until destination reached
	*/
	setRoute : function(from, to, stalker){
		this.setAllUnVisited();

		this.crawledCells = [];

		this.crawlPos.row = from.row;
		this.crawlPos.col = from.col;

		this.destPos.row = to.row;
		this.destPos.col = to.col;

		this.lastDirection = '';

		this.stalker = typeof stalker === 'undefined' ? true : stalker;
	},

	//get routes next step
	getNextSteps : function(steps, stopWhenReached){
		SWR = typeof stopWhenReached !== 'boolean' ? false : stopWhenReached;
		var actStep = 0;
		var stepsArr = [];
		var actStepObj = {};
		if (SWR){
			while (actStepObj != null && actStep < steps){
				actStepObj = this.nextStep(this.crawlPos, SWR);
				stepsArr.push(actStepObj);
				actStep++;
			}
		}else{
			while (actStep < steps){
				actStepObj = this.nextStep(this.crawlPos, SWR);
				stepsArr.push(actStepObj);
				actStep++;
			}
		}

		if (stepsArr[stepsArr.length - 1] == null) stepsArr.pop();

		//console.log(stepsArr);
		return stepsArr;
	},

	//	returns:
	//		- when stopWhenReached true, return null if destPos reached or not but the whole maze was crawled
	//		- object with direction choosen, and how the direction was choosen.
	//			eg: {row : rowIndex,
	//				 col : colIndex,
	//				 direction : 'up' || 'down' || 'left' || 'right',
	//				 directionBy : string}
	nextStep : function(cellPos, stopWhenReached){
		if (this.paused){
			return false;
		}

		var _rndDirection = function(dirArr){
			var rndIndex = Math.round(Math.random() * (dirArr.length - 1));
			return dirArr[rndIndex];
		}

		var cell = this.cells[cellPos.row][cellPos.col];

		//set current cell as visited
		this.cells[cellPos.row][cellPos.col].visited = true;

		//get available directions from current cell
		var availDirs = [];
		var dirs = ['up', 'down', 'left', 'right'];
		dirs.forEach(function(dir){
			if (cell.directions[dir]){
				availDirs.push(dir);
			}
		});

		//destination reached, or not but the whole maze was crawled
		if (this.allCrawled() || (cellPos.row == this.destPos.row && cellPos.col == this.destPos.col)){
			if (stopWhenReached){
				return null;
			}else{
				//destPos reached. go whereevr

				/*var toCell = {
					row :  Math.round(Math.random() * this.cells.length - 1),
					col : Math.round(Math.random() * this.cells[0].length - 1)
				}

				this.setRoute({
					row : this.crawlPos.row,
					col : this.crawlPos.col
				}, toCell);*/
			}
		}

		var _stepBack = function(scope){
			//step back
			if (scope.crawledCells.length > 1){

				//pop last step form crawled cells
				scope.crawledCells.pop();

				//get cell direction
				//if everything went well we should only get one direction in the return array here
				var toDirStr = scope.cellDirection(scope.crawledCells[scope.crawledCells.length - 1], scope.crawlPos);

				//set as current cell
				scope.crawlPos.row = scope.crawledCells[scope.crawledCells.length - 1].row;
				scope.crawlPos.col = scope.crawledCells[scope.crawledCells.length - 1].col;

				//update visited cells
				//scope.updateCellVisState();

				//return what we just did
				return {
					row : scope.crawlPos.row,
					col : scope.crawlPos.col,
					direction : toDirStr.directions[0],
					directionBy : 'step back - no unvisited cell around'
				};
			}else{
				//back at startPos, destPos not reached

				//set all cells univisited
				scope.setAllUnVisited();

				//empty crawled cells
				scope.crawledCells = [];

				//choose a random directon to continue
				var toCell = scope.isCellVisited(_rndDirection(availDirs));
				return scope.stepToCell(toCell, 'restart - random from startPos');
			}
		}

		if (this.stalker){
			//try step to destPos direction
			var canGoDir = [];

			//check destPos direction
			//try to step to closer direction, or two futher one
			var destDirection = this.cellDirection(this.destPos, cell);

			/*var destStepDir = typeof destDirection.further === 'undefined' ? destDirection.closer : destDirection.further;

			//can step closer
			if (availDirs.indexOf(destStepDir) != -1 && !this.isCellVisited(destStepDir).visited){
				var toCell = this.isCellVisited(destStepDir);
				this.lastDirection = toCell.direction;
				return this.stepToCell(toCell, 'next step - getting closer futher || closer: ' + toCell.direction);
			}else{*/
				//try getting closer to a random direction to destPos
				//console.log(destDirection)
				destDirection.directions.forEach(function(destDir){
					if (availDirs.indexOf(destDir) != -1 && !this.isCellVisited(destDir).visited){
						canGoDir.push(destDir)
					}
				}, this);

				if (canGoDir.length > 0){
					//step closer

					//if we can go to both directions, step to closer one
					//var toCell = canGoDir.length == 2 ? this.isCellVisited(destDirection.closer) : this.isCellVisited(canGoDir[0]);

					//get a random direction to destPos
					var toCell = this.isCellVisited(_rndDirection(canGoDir));
					this.lastDirection = toCell.direction;
					return this.stepToCell(toCell, 'next step - getting closer rndom to avail dirs: ' + toCell.direction);
				}else{
					//cant step closer, step to a random direction from avails.
					var rndAvailDir = [];
					availDirs.forEach(function(availDir){
						if (!this.isCellVisited(availDir).visited){
							rndAvailDir.push(availDir);
						}
					}, this);

					if (rndAvailDir.length > 0){
						//step on a not visited cell
						var toCell = this.isCellVisited(_rndDirection(rndAvailDir));
						this.lastDirection = toCell.direction;
						return this.stepToCell(toCell, 'next step - random not visited: ' + toCell.direction);
					} else{
						//cant step on unvisted cell
						//step back
						return _stepBack(this);
					}
				}
			//}

		}else{//not stalker mode
			//choose a random direction
			var rndAvailDir = [];
			availDirs.forEach(function(availDir){
				if (!this.isCellVisited(availDir).visited){
					rndAvailDir.push(availDir);
				}
			}, this);

			if (rndAvailDir.length > 0){
				//can go in direction not visited
				var toCell = this.isCellVisited(_rndDirection(rndAvailDir));
				this.lastDirection = toCell.direction;
				return this.stepToCell(toCell, 'next step - random to not visited');
			} else{
				//cant step on unvisted cell
				//step back
				return _stepBack(this);
			}
		}
	},

	//checks if cell to directionStr is pathway
	isPathway : function(directionStr){
		switch (directionStr){
			case 'up' :
				return this.pathways.indexOf(this.cells[Math.max(0, this.crawlPos.row - 1)][this.crawlPos.col].type.toLowerCase()) != -1 ? true : false;
				break;
			case 'down' :
				return this.pathways.indexOf(this.cells[Math.min(this.cells.length - 1, this.crawlPos.row + 1)][this.crawlPos.col].type.toLowerCase()) != -1 ? true : false;
				break;
			case 'left' :
				return this.pathways.indexOf(this.cells[this.crawlPos.row][Math.max(0, this.crawlPos.col - 1)].type.toLowerCase()) != -1 ? true : false;
				break;
			case 'right' :
				return this.pathways.indexOf(this.cells[this.crawlPos.row][Math.min(this.cells[0].length - 1, this.crawlPos.col + 1)].type.toLowerCase()) != -1 ? true : false;
				break;
		}
	},

	//checks if cell to directionStr is visited
	//return visited state + cell indexes, and direction
	isCellVisited : function(directionStr){
		switch (directionStr){
			case 'up' :
				return {
					visited : this.cells[Math.max(0, this.crawlPos.row - 1)][this.crawlPos.col].visited,
					row : this.crawlPos.row - 1,
					col : this.crawlPos.col,
					direction : 'up'
				};
				break;
			case 'down' :
				return {
					visited : this.cells[Math.min(this.cells.length - 1, this.crawlPos.row + 1)][this.crawlPos.col].visited,
					row : this.crawlPos.row + 1,
					col : this.crawlPos.col,
					direction : 'down'
				};
				break;
			case 'left' :
				return {
					visited : this.cells[this.crawlPos.row][Math.max(0, this.crawlPos.col - 1)].visited,
					row : this.crawlPos.row,
					col : this.crawlPos.col - 1,
					direction : 'left'
				};
				break;
			case 'right' :
				return {
					visited : this.cells[this.crawlPos.row][Math.min(this.cells[0].length - 1, this.crawlPos.col + 1)].visited,
					row : this.crawlPos.row,
					col : this.crawlPos.col + 1,
					direction : 'right'
				};
				break;
		}
	},

	allCrawled : function(){
		var isDone = true;
		this.cells.forEach(function(row){
			row.some(function(cell){
				if (!cell.visited){
					isDone = false;
				}
			});
		});

		return isDone;
	},

	setAllUnVisited : function(){
		this.cells.forEach(function(row){
			row.forEach(function(cell){
				cell.visited = false;
			});
		});
	},

	/*
		return cell direction from compCell
	*/
	cellDirection : function(cell, compCell){
		var dirs = [];
		var closerDir = '', furtherDir = '';
		var rowDif = cell.row - compCell.row;
		var colDif = cell.col - compCell.col;

		if (rowDif < 0){
			dirs.push('up');
		}else if (rowDif > 0){
			dirs.push('down')
		}

		if (colDif < 0){
			dirs.push('left');
		}else if (colDif > 0){
			dirs.push('right')
		}

		if (dirs.length == 0){
			dirs[0] = '';
			closerDir = '';
			furtherDir = '';
		}else{
			closerDir = rowDif < colDif ? dirs[0] : dirs[1];
			furtherDir = rowDif < colDif ? dirs[1] : dirs[0];
		}

		//console.log('closer: ' + closerDir + ' | further: ' + furtherDir);
		return {
			directions : dirs,
			closer : closerDir,
			further : furtherDir
		};
	},

	stepToCell : function(cell, howMsg){
		//set as current cell
		this.crawlPos.row = cell.row;
		this.crawlPos.col = cell.col;

		//push to crawled cells
		this.crawledCells.push(this.cells[cell.row][cell.col]);

		//update visited cells
		this.updateCellVisState();

		//console.log('step to cell: col: ' + cell.col + ', row: ' + cell.row + ' | direction: ' + cell.direction + ' | dirBy: ' + howMsg);

		//return what we just did
		return {
			row : cell.row,
			col : cell.col,
			direction : cell.direction || '',
			directionBy : howMsg || ''
		};
	},

	updateCellVisState : function(){
		if (this.maxVisitedCells > 0 && this.crawledCells.length - 1 >= this.maxVisitedCells){
			this.setAllUnVisited();

			for (var i=this.crawledCells.length - 1 - this.maxVisitedCells; i<this.crawledCells.length; i++){
				this.cells[this.crawledCells[i].row][this.crawledCells[i].col].visited = true;
			}

			//console.log(this.crawledCells)
			//console.log(this.cells)
		}
	}
}