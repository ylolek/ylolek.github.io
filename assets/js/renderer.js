
	var renderer = (function(){
		var gameContainer,
		layout, levelIndex, gameLevel, cols, rows,
		levelBgColor, cellWidth, cellHeight,
		isPlayGround = false;
		var chars = {
			char : [
					 ['||', '||', '||', '||', '.', '"', '"', '||', '||', '||', '||', '||', '||', '||', ' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/', '-'],
					 ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!']
					],
			clip : {
				startX : 12,
				startY : 12,
				width : 12,
				height : 12
			}
		}
		var lastMsg = '', printMsg = [];

		return {
			layoutCanvas : null,
			layoutCtx : null,
			gameCanvas : null,
			gameCtx : null,
			consoleCanvas : null,
			consoleCtx : null,

			init : function(contProps, levelProps){
				//check for 'propper' layout definition
				if (levelProps.layout instanceof Array == false){
					error.throw('InvalidLayout', levelProps.layout + ' is not in supported layout format.');
					return false;
				}

				layout = levelProps.layout;
				levelIndex = levelProps.levelIndex;
				gameLevel = levelProps.gameLevel;
				levelBgColor = contProps.bgColor;

				rows = layout.length ? layout.length : 0;
				cols = layout[0] instanceof Array ? layout[0].length ? layout[0].length : 0 : 0;

				//calc cell dimensions
				cellWidth = Math.round(contProps.width / cols);
				cellHeight = Math.round(contProps.height / rows);

				//setup container
				if (!isPlayGround){
					var isGameCont = typeof document.getElementById(contProps.id);
					gameContainer = isGameCont == null ? document.createElement('div') : document.getElementById(contProps.id);
					gameContainer.id = contProps.id;
					gameContainer.style.position = 'relative';
					gameContainer.style.maxWidth = '100%';
					gameContainer.style.margin = '0 auto 40px auto';
					gameContainer.style.width = contProps.width + 'px';
					gameContainer.style.height = contProps.height + 80 + 'px';
					if (isGameCont == null) document.body.appendChild(gameContainer);

					//layout canvas
					var layoutA = this.setCanvas('layoutCanvas', contProps.width, contProps.height, 'position: absolute; top: 36px; left: 0; max-width: 100%; z-index: 5;');
					this.layoutCanvas = layoutA.canvas;
					this.layoutCtx = layoutA.context;

					//game canvas
					var gameA = this.setCanvas('gameCanvas', contProps.width, contProps.height, 'position: absolute; top: 36px; left: 0; max-width: 100%; z-index: 6;');
					this.gameCanvas = gameA.canvas;
					this.gameCtx = gameA.context;

					//console canvas
					var consoleA = this.setCanvas('consoleCanvas', contProps.width, contProps.height + 80, 'position: absolute; top: 0; left: 0; max-width: 100%; z-index: 7;');
					this.consoleCanvas = consoleA.canvas;
					this.consoleCtx = consoleA.context;

					isPlayGround = true;
				}else {
					//clean up, we already have the playground created
					this.clr(this.layoutCtx, 0, 0, cellWidth * cols, cellHeight * rows);
					this.clr(this.gameCtx, 0, 0, cellWidth * cols, cellHeight * rows);
					this.clr(this.consoleCtx, 0, 0, cellWidth * cols, cellHeight * rows + 80);

					var layoutA = {canvas : this.layoutCanvas, context : this.layoutCtx};
					var gameA = {canvas : this.gameCanvas, context : this.gameCtx};
					var consoleA = {canvas : this.consoleCanvas, context : this.consoleCtx};
				}

				return { layout : layoutA, game : gameA, console : consoleA}
			},

			setCanvas : function(canvasId, w, h, styleStr){
				var canvas = document.createElement('canvas');
				canvas.id = canvasId;
				canvas.width = isNaN(w) ? 100 : w;
				canvas.height = isNaN(h) ? 100 : h;

				if (typeof styleStr === 'string' && styleStr.length){
					canvas.setAttribute('style', styleStr);
				}

				gameContainer.appendChild(canvas);

				var ctx = canvas.getContext("2d");
				return {canvas : canvas, context : ctx}
			},

			//coverts level matrix col, row index to canvas x, y coordinates
			ColRowToXY : function(col, row){
				var x = Math.max(0, Math.round(col * cellWidth));
				var y = Math.max(0, Math.round(row * cellHeight));

				return {
					x : Math.min((cols - 1) * cellWidth, x),
					y : Math.min((rows - 1) * cellHeight, y)
				}
			},


			//coverts canvas x, y coordinates to level matrix col, row index
			XYToColRow : function(x, y, canvas){
				var canvas = typeof canvas === 'object' ? canvas : this.gameCanvas;

				/*var xPerc = Math.max(0, (x + cellWidth / 2)) / canvas.width * 100;
				var yPerc = Math.max(0, (y + cellHeight / 2)) / canvas.height * 100;

				var col = Math.round(xPerc * cols / 100);
				var row = Math.round(yPerc * rows / 100);

				return {
					col : Math.min(cols - 1, col),
					row : Math.min(rows - 1, row)
				}*/

				var col = Math.floor(x / cellWidth);
				var row = Math.floor(y / cellHeight);

				return {
					col : col < 0 ? 0 : col > cols - 1 ? cols - 1 : col,
					row : row < 0 ? 0 : row > rows - 1 ? rows - 1 : row
				}
			},

			drawCell : function(img, col, row, bgColorStr, ctx){
				var ctx = typeof ctx === 'object' ? ctx : this.gameCtx;
				var bgColorStr = typeof bgColorStr === 'string' && bgColorStr.length ? bgColorStr : levelBgColor;
				var clipPos = layouts.getClipPos(levelIndex, layout[row][col]);

				ctx.save();
				ctx.translate(col * cellWidth, row * cellHeight);
				/*ctx.fillStyle = bgColorStr;
				ctx.fillStyle = '#' + ((1<<24) * Math.random() | 0).toString(16);*/
				ctx.fillStyle = gameLevel == 256 && col >= 14 ? '#' + ((1<<24) * Math.random() | 0).toString(16) : bgColorStr;
				ctx.fillRect(0, 0, cellWidth, cellHeight);
				ctx.drawImage(img, clipPos.x, clipPos.y, cellWidth, cellHeight, 0, 0, cellWidth, cellHeight);
				ctx.restore();
			},

			//redraws cells around col, row in +/- colD, rowD distance
			reDrawCells : function(img, col, row, colD, rowD, ctx, bgColor){
				var ctx = typeof ctx === 'object' ? ctx : this.gameCtx;
				var bgColorStr = typeof bgColor === 'string' && bgColor.length ? bgColor : levelBgColor;

				var rowMin = Math.max(0, row - rowD);
				var rowMax = Math.min((rows - 1), row + rowD);
				var colMin = Math.max(0, col - colD);
				var colMax = Math.min((cols - 1), col + colD);

				for (var i=rowMin; i<=rowMax; i++){
					for (var j=colMin; j<=colMax; j++){
						this.drawCell(img, j, i, bgColorStr, ctx);
					}
				}
			},

			paintCell : function(col, row, bgColorStr, ctx){
				var ctx = typeof ctx === 'object' ? ctx : this.gameCtx;
				var bgColorStr = typeof bgColorStr === 'string' && bgColorStr.length ? bgColorStr : levelBgColor;


				ctx.save();
				ctx.translate(col * cellWidth, row * cellHeight);
				ctx.fillStyle = bgColorStr;
				ctx.fillRect(0, 0, cellWidth, cellHeight);
				ctx.restore();
			},

			rePaintCells : function(col, row, colD, rowD, bgColor, ctx){
				var ctx = typeof ctx === 'object' ? ctx : this.layoutCtx;
				var bgColorStr = typeof bgColor === 'string' && bgColor.length ? bgColor : levelBgColor;

				var rowMin = Math.max(0, row - rowD);
				var rowMax = Math.min((rows - 1), row + rowD);
				var colMin = Math.max(0, col - colD);
				var colMax = Math.min((cols - 1), col + colD);

				for (var i=rowMin; i<=rowMax; i++){
					for (var j=colMin; j<=colMax; j++){
						this.paintCell(j, i, bgColorStr, ctx);
					}
				}
			},

			//clears ctx canvas in xD, yD pixels around x, y
			clrRect : function(x, y, xD, yD, ctx){
				var ctx = typeof ctx === 'object' ? ctx : this.gameCtx;
				ctx.clearRect(x - xD, y - yD, xD * 4, yD * 4);
			},

			drawLayout : function(img){
				//no canvas set
				if (typeof this.layoutCtx != 'object'){
					error.throw('InvalidLayoutCanvas', this.layoutCtx + ' is not an object. call renderer.init first.');
					return false;
				}

				//clean up
				this.layoutCtx.clearRect(0, 0, this.layoutCanvas.width, this.layoutCanvas.height);

				//draw levels layout
				layout.forEach(function(item, rowIndex){
					layout[rowIndex].forEach(function(item, colIndex){
						renderer.drawCell(img, colIndex, rowIndex, '#000', renderer.layoutCtx);
					});
				});
			},


			print : function(msgStr, img, x, y, rgbaArr, ctx){
				if (!msgStr.length){
					return;
				}
				var context = typeof ctx !== 'object' ? this.consoleCtx : ctx;

				var _getCharCell = function(chr){
					var pos = {	row : -1, col : -1 };
					chars.char.forEach(function(charArr, rowIndex){
						charArr.some(function(char, colIndex){
							if (chr.toLowerCase() == char.toLowerCase()){
								pos.row = rowIndex;
								pos.col = colIndex;
							}
						});
					});

					if (pos.col == -1 || pos.row == -1){
						return null;
					}else {
						return pos;
					}
				}

				if (lastMsg != msgStr){
					printMsg = [];
					//get letters
					msgStr.toLowerCase().split('').forEach(function(letter){
						var letterPos = _getCharCell(letter);
						printMsg.push(letterPos == null ? _getCharCell(' ') : letterPos);
					});

					lastMsg = msgStr;
				}

				var toX = x;
				//draw letters
				printMsg.forEach(function(char){
					var clipX = chars.clip.startX + (char.col) * chars.clip.width;
					var clipY = chars.clip.startY + (char.row) * chars.clip.height;
					context.clearRect(toX, y, chars.clip.width, chars.clip.height);
					this.render({
						img : img,
						ctx : context,
						x : toX,
						y : y,
						clipX : clipX,
						clipY : clipY,
						clipW : chars.clip.width,
						clipH : chars.clip.height
					});

					//recolor them, if rgbaArr
					if (rgbaArr instanceof Array && rgbaArr.length >= 4){
						var consImgLen = chars.clip.width * chars.clip.height;
						var consoleImg = new Image();
						consoleImg = context.getImageData(toX, y, chars.clip.width, chars.clip.height);

						//set rgba channels
						for (var i=0; i<consImgLen*4; i+=4){
							//leave transparent parts out
							if (consoleImg.data[i] != 0 || consoleImg.data[i + 1] != 0 || consoleImg.data[i + 2] != 0){
								//red
								consoleImg.data[i] = rgbaArr[0];
								//green
								consoleImg.data[i + 1] = rgbaArr[1];
								//blue
								consoleImg.data[i + 2] = rgbaArr[2];
								//alpha
								consoleImg.data[i + 3] = rgbaArr[3];
							}
						}

						context.putImageData(consoleImg, toX, y);

						consoleImg = null;
					}

					toX += chars.clip.width;
				}, this);
			},


			/*
				renderProps = {
						img :,
						ctx :,
						x :,
						y :,
						clipX :,
						clipY :,
						clipW :,
						clipH :,
						imgW :,
						imgH :
				}
			*/
			render : function(renderProps){
				if (typeof renderProps !== 'object'){
					error.throw('InvalidRenderProps', renderProps + ' is not an object.');
					return false;
				}

				var imgW = isNaN(renderProps.imgW) ? renderProps.clipW : renderProps.imgW;
				var imgH = isNaN(renderProps.imgH) ? renderProps.clipH : renderProps.imgH;
				var ctx = renderProps.ctx == null || typeof renderProps.ctx !== 'object' ? this.gameCtx : renderProps.ctx;

				ctx.save();
				ctx.translate(renderProps.x, renderProps.y);
				ctx.drawImage(renderProps.img, renderProps.clipX, renderProps.clipY, renderProps.clipW, renderProps.clipH, 0, 0, imgW, imgH);
				ctx.restore();
			},

			clr : function(ctx, x, y, width, height){
				var ctx = typeof ctx == 'object' ? ctx : this.gameCtx;
				ctx.clearRect(x, y, width, height);
			}
		}
	}());