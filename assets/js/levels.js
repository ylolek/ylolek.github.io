
	var levels = (function(){
		//level descriptions
		var level = [];
		//intro. not an actual level.
		level[0] = {
					spritesSrc : 'assets/img/gamesprites011.png',
					bgColor : '#000',
					layout : [],
					rows : 31,
					cols : 28,
					cellWidth : 336 / 28,
					cellHeight : 372 / 31,
					playerProps : {
						name : 'PACMAN',
						usrControlled : true,
						startPos : {
							x : 157,
							y : 271
						},
						clip : {
							startX : 0,
							startY : 168,
							width : 24,
							height : 24
						},
						animations : [
						{
							name : 'UP',
							frames : 4, //playerAnim frames
							speed : 22, //frame/sec
							loop : true, //loop frames
							clipSX : 24, //sprite playerAnim start x
							clipSY : 72, //sprite playerAnim start y
							clipStep : 2, //if sprite playerAnims have clipStep distance between each other
							//frame position. if not set frames will be played on pictures x axis: clipSX + actual frame * (clip.width * clipStep)
							frame : [null, null, { x : 0, y : 168 }, { x : 72, y : 72 }]
						},
						{
							name : 'DOWN',
							frames : 4,
							speed : 22,
							loop : true,
							clipSX : 120,
							clipSY : 72,
							clipStep : 2,
							frame : [null, null, { x : 0, y : 168 }, { x : 168, y : 72 }]
						},
						{
							name : 'LEFT',
							frames : 4,
							speed : 22,
							loop : true,
							clipSX : 0,
							clipSY : 72,
							clipStep : 2,
							frame : [null, null, { x : 0, y : 168 }, { x : 48, y : 72 }]
						},
						{
							name : 'RIGHT',
							frames : 4,
							speed : 22,
							loop : true,
							clipSX : 96,
							clipSY : 72,
							clipStep : 2,
							frame : [null, null, { x : 0, y : 168 }, { x : 144, y : 72 }]
						},
						{
							name : 'HIT',
							frames : 12,
							speed : 6.5,
							loop : false,
							clipSX : 96,
							clipSY : 168,
							clipStep : 1
						},
						{
							name : '200',
							frames : 1,
							speed : 1,
							loop : false,
							clipSX : 192,
							clipSY : 144,
							clipStep : 1
						},
						{
							name : '400',
							frames : 1,
							speed : 1,
							loop : false,
							clipSX : 216,
							clipSY : 144,
							clipStep : 1
						},
						{
							name : '800',
							frames : 1,
							speed : 1,
							loop : false,
							clipSX : 240,
							clipSY : 144,
							clipStep : 1
						},
						{
							name : '1600',
							frames : 1,
							speed : 1,
							loop : false,
							clipSX : 264,
							clipSY : 144,
							clipStep : 1
						}],
						speed : 88, //pixels/second @ 60fps

						//SpeedFrameRateDependent
						//if true actual speed will be calculated depending on current frame rate, with speed value as maximum.
						//if false the speed is frame rate independent, alway using its value
						speedFRD : true
					},

					ghosts : [
					{
						//first always goes to top right portion of the maze
						name : 'OIKAKE', //red

						//when to exit the starting 'cage'
						//MS_millisecond = after 'millisecond'
						//DOT_num = after pacman collected 'num' number of dots
						appear : 'MS_0',

						//switch chase and wander mood/mode randomly between moodSwitchMin and moodSwitchMax milliseconds
						//both 0 || moodSwithcMax < moodSwithMin = always chase
						moodSwitchMin : 0,
						moodSwitchMax : 0,

						//-1 automatically calculated
						speed : -1,
						speedFRD : true,

						//percent: how accurately move to targets current position
						accuracy : 80,
						startPos : {
							x : 158,
							y : 127
						},
						clip : {
							startX : 48,
							startY : 144,
							width : 24,
							height : 24
						},
						animations : [
						{
							name : 'UP',
							frames : 2,
							speed : 10,
							loop : true,
							clipSX : 144,
							clipSY : 144,
							clipStep : 1
						},
						{
							name : 'DOWN',
							frames : 2,
							speed : 10,
							loop : true,
							clipSX : 48,
							clipSY : 144,
							clipStep : 1
						},
						{
							name : 'LEFT',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 96,
							clipSY : 144,
							clipStep : 1
						},
						{
							name : 'RIGHT',
							frames : 2,
							speed : 10,
							loop : true,
							clipSX : 0,
							clipSY : 144,
							clipStep : 1
						},
						{
							name : 'FREEZE',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 192,
							clipSY : 96,
							clipStep : 1
						},
						{
							name : 'FREEZE_ENDING',
							frames : 4,
							speed : 8,
							loop : true,
							clipSX : 144,
							clipSY : 96,
							clipStep : 1
						},
						{
							name : 'EATEN_UP',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 336,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'EATEN_DOWN',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 240,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'EATEN_LEFT',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 288,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'EATEN_RIGHT',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 192,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'ZZZ',
							frames : 2,
							speed : 1,
							loop : true,
							clipSX : 0,
							clipSY : 240,
							clipStep : 1
						}]
					},
					{
						//first always goes to top left portion of the maze
						name : 'MACHIBUSE', //pink
						appear : 'MS_0',
						moodSwitchMin : 1500,
						moodSwitchMax : 3000,
						speed : -1,
						speedFRD : true,
						accuracy : 100,
						startPos : {
							/*x : 158,
							y : 127*/
							x : 158,
							y : 166
						},
						clip : {
							startX : 48,
							startY : 192,
							width : 24,
							height : 24
						},
						animations : [
						{
							name : 'UP',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 144,
							clipSY : 192,
							clipStep : 1
						},
						{
							name : 'DOWN',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 48,
							clipSY : 192,
							clipStep : 1
						},
						{
							name : 'LEFT',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 96,
							clipSY : 192,
							clipStep : 1
						},
						{
							name : 'RIGHT',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 0,
							clipSY : 192,
							clipStep : 1
						},
						{
							name : 'FREEZE',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 192,
							clipSY : 96,
							clipStep : 1
						},
						{
							name : 'FREEZE_ENDING',
							frames : 4,
							speed : 8,
							loop : true,
							clipSX : 144,
							clipSY : 96,
							clipStep : 1
						},
						{
							name : 'EATEN_UP',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 336,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'EATEN_DOWN',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 240,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'EATEN_LEFT',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 288,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'EATEN_RIGHT',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 192,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'ZZZ',
							frames : 2,
							speed : 1,
							loop : true,
							clipSX : 48,
							clipSY : 240,
							clipStep : 1
						}]
					},
					{
						//first always goes to bottom right portion of the maze
						name : 'KIMAGURE', //cyan
						appear : 'DOT_30',
						moodSwitchMin : 4000,
						moodSwitchMax : 5000,
						speed : -1,
						speedFRD : true,
						accuracy : 60,
						startPos : {
							/*x : 158,
							y : 127*/
							x : 135,
							y : 160
						},
						clip : {
							startX : 240,
							startY : 192,
							width : 24,
							height : 24
						},
						animations : [
						{
							name : 'UP',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 336,
							clipSY : 192,
							clipStep : 1
						},
						{
							name : 'DOWN',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 240,
							clipSY : 192,
							clipStep : 1
						},
						{
							name : 'LEFT',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 288,
							clipSY : 192,
							clipStep : 1
						},
						{
							name : 'RIGHT',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 192,
							clipSY : 192,
							clipStep : 1
						},
						{
							name : 'FREEZE',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 192,
							clipSY : 96,
							clipStep : 1
						},
						{
							name : 'FREEZE_ENDING',
							frames : 4,
							speed : 8,
							loop : true,
							clipSX : 144,
							clipSY : 96,
							clipStep : 1
						},
						{
							name : 'EATEN_UP',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 336,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'EATEN_DOWN',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 240,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'EATEN_LEFT',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 288,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'EATEN_RIGHT',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 192,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'ZZZ',
							frames : 2,
							speed : 1,
							loop : true,
							clipSX : 96,
							clipSY : 240,
							clipStep : 1
						}]
					},
					{
						//first always goes to bottom left portion of the maze
						name : 'OTOBOKE', //orange
						appear : 'DOT_60',
						moodSwitchMin : 4000,
						moodSwitchMax : 5000,
						speed : -1,
						speedFRD : true,
						accuracy : 40,
						startPos : {
							x : 182,
							y : 160
							/*x : 158,
							y : 127*/
						},
						clip : {
							startX : 48,
							startY : 216,
							width : 24,
							height : 24
						},
						animations : [
						{
							name : 'UP',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 144,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'DOWN',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 48,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'LEFT',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 96,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'RIGHT',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 0,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'FREEZE',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 192,
							clipSY : 96,
							clipStep : 1
						},
						{
							name : 'FREEZE_ENDING',
							frames : 4,
							speed : 8,
							loop : true,
							clipSX : 144,
							clipSY : 96,
							clipStep : 1
						},
						{
							name : 'EATEN_UP',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 336,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'EATEN_DOWN',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 240,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'EATEN_LEFT',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 288,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'EATEN_RIGHT',
							frames : 2,
							speed : 8,
							loop : true,
							clipSX : 192,
							clipSY : 216,
							clipStep : 1
						},
						{
							name : 'ZZZ',
							frames : 2,
							speed : 1,
							loop : true,
							clipSX : 144,
							clipSY : 240,
							clipStep : 1
						}]
					}],
				collectables : [{
					name : 'POWERPILL',
					startPos : {
						x : 158,
						y : 166
					},
					clip : {
						startX : 240,
						startY : 0,
						width : 12,
						height : 12
					},
					animations : [{
						name : 'BLINK',
						frames : 2,
						speed : 6,
						loop : true,
						clipSX : 240,
						clipSY : 0,
						clipStep : 2
					}]
				}]
		};

		//level 1+
		level[1] = {
					spritesSrc : level[0].spritesSrc,
					bgColor : '#000',
					layout : layouts.getLayout(1),
					rows : 31,
					cols : 28,
					cellWidth : 336 / 28,
					cellHeight : 372 / 31,

					playerProps : level[0].playerProps,
					ghosts : level[0].ghosts,
					collectables : level[0].collectables
				};

		level[1].collectables.push(
				{
					name : 'CHERRY',
					startPos : {
						x : 156,
						y : 199
					},
					clip : {
						startX : 0,
						startY : 120,
						width : 24,
						height : 24
					}
				},
				{
					name : 'STRAWBERRY',
					startPos : {
						x : 156,
						y : 199
					},
					clip : {
						startX : 24,
						startY : 120,
						width : 24,
						height : 24
					}
				},
				{
					name : 'ORANGE',
					startPos : {
						x : 156,
						y : 199
					},
					clip : {
						startX : 48,
						startY : 120,
						width : 24,
						height : 24
					}
				},
				{
					name : 'APPLE',
					startPos : {
						x : 156,
						y : 199
					},
					clip : {
						startX : 96,
						startY : 120,
						width : 24,
						height : 24
					}
				},
				{
					name : 'GRAPE',
					startPos : {
						x : 156,
						y : 199
					},
					clip : {
						startX : 120,
						startY : 120,
						width : 24,
						height : 24
					}
				},
				{
					name : 'GALAXIAN-BOSS',
					startPos : {
						x : 156,
						y : 199
					},
					clip : {
						startX : 144,
						startY : 120,
						width : 24,
						height : 24
					}
				},
				{
					name : 'BELL',
					startPos : {
						x : 156,
						y : 199
					},
					clip : {
						startX : 72,
						startY : 120,
						width : 24,
						height : 24
					}
				},
				{
					name : 'KEY',
					startPos : {
						x : 156,
						y : 199
					},
					clip : {
						startX : 168,
						startY : 120,
						width : 24,
						height : 24
					}
				}
		);

		//get last declared level
		var _getLastLevel = function(){
			var lev = level[1];
			var levelIndex = 1;
			level.some(function(item, index){
				if (typeof item === 'object'){
					lev = item;
					levelIndex = index;
				}
			});

			return {
				level : lev,
				levelIndex : levelIndex
			};
		}

		return {
			getLevel : function(index){
				var retObj = {};
				if (typeof level[index] === 'object'){
					retObj.level = level[index];
					retObj.levelIndex = index;
				}else {
					retObj = _getLastLevel();
				}

				return retObj;
			}
		}
	}());

