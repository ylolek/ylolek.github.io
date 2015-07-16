
var sounds = (function(){
	var sfxSrc = 'assets/sfx/pcm_all_sfx.ogg';
	var sfxData = [{
		name : 'start-music',
		startSec : 0,
		endSec : 4.31
	},
	{
		name : 'collectable',
		startSec : 9.310,
		endSec : 9.807
	},
	{
		name : 'death',
		startSec : 14.807,
		endSec : 16.531,
		speed : 1
	},
	{
		name : 'dot1',
		startSec : 21.531,
		endSec : 21.661,
		speed : 1
	},
	{
		name : 'dot2',
		startSec : 26.661,
		endSec : 26.792
	},
	{
		name : 'extra-life',
		startSec : 31.791,
		endSec : 33.882
	},
	{
		name : 'freeze-eaten',
		startSec : 38.882,
		endSec : 39.456
	},
	{
		name : 'freeze-eaten-btc',
		startSec : 44.530,
		endSec : 44.700
	},
	{
		name : 'power-pill',
		startSec : 50.200,
		endSec : 50.500
	},
	{
		name : 'sirene1',
		startSec : 55.867,
		endSec : 56.394
	},
	{
		name : 'sirene2',
		startSec : 61.390,
		endSec : 62.130
	},
	{
		name : 'sirene3',
		startSec : 67.130,
		endSec : 67.910
	},
	{
		name : 'sirene4',
		startSec : 72.910,
		endSec : 73.540
	}
	];

	var sfxCtrl = new Audio(), bgLoopSfx = new Audio();
	sfxPaused = false;
	sfxBgPaused = false;
	var curPlayingBg = {
		name : '',
		startSec : 0,
		endSec : 0,
		anchor : false,
		callBack : null
	}

	var curPlaying = {
		name : '',
		startSec : 0,
		endSec : 0,
		anchor : false,
		callBack : null
	};

	//var sfxQueue = [];

	var _getByName = function(name){
		var sound = null;
		sfxData.some(function(sfx){
			if (sfx.name.toLowerCase() == name.toLowerCase()){
				sound = sfx;
			}
		});

		return sound;
	}

	return {
		curPlaying : curPlaying,
		curPlayingBg : curPlayingBg,

		/*load : function(onLoaded){
			sfxCtrl.src = sfxSrc;
			sfxCtrl.type = 'audio/ogg';

			sfxCtrl.addEventListener('loadeddata', function(){
				bgLoopSfx.src = this.src; //should be cached at this point
				bgLoopSfx.type = 'audio/ogg';
			});

			bgLoopSfx.addEventListener('loadeddata', function(){
				console.log('audio loaded')
				if (typeof onLoaded === 'function') onLoaded();
			});

		},*/

		load : function(onLoaded){
			var xhr = new XMLHttpRequest();
			xhr.open('GET', sfxSrc, true);
			xhr.responseType = 'blob';
			xhr.addEventListener('load', function(){
				if (this.readyState == 4) { //done
					sfxCtrl.src = window.URL.createObjectURL(this.response);
					bgLoopSfx.src = sfxCtrl.src;
				}
			});
			xhr.send();

			bgLoopSfx.addEventListener('loadeddata', function(){
				if (typeof onLoaded === 'function') onLoaded();
			})
		},

		playBgLoop : function(name, anchor){
			if (typeof name !== 'string' || name.trim().length == 0	|| curPlayingBg.name.toLowerCase() == name.toLowerCase() || curPlayingBg.anchor){
				return false;
			}

			var sfx = _getByName(name);
			if (sfx == null){
				return false;
			}


			bgLoopSfx.currentTime = sfx.startSec;

			curPlayingBg.name = sfx.name;
			curPlayingBg.startSec = sfx.startSec;
			curPlayingBg.endSec = sfx.endSec;
			curPlayingBg.anchor = typeof anchor === 'boolean' ? anchor : false;
			curPlayingBg.callBack = typeof callBack === 'function' ? callBack : null;

			if (sfx.speed != null) bgLoopSfx.playbackRate = sfx.speed;
			bgLoopSfx.play();

		},

		//if anchored currently playing 'stops' and just the *name* sound will play until finishes
		play : function(name, anchor){
			if (typeof name !== 'string' || name.trim().length == 0	|| curPlaying.name.toLowerCase() == name.toLowerCase() || curPlaying.anchor){
				return false;
			}

			var sfx = _getByName(name);
			if (sfx == null){
				return false;
			}


			sfxCtrl.currentTime = sfx.startSec;

			curPlaying.name = sfx.name;
			curPlaying.startSec = sfx.startSec;
			curPlaying.endSec = sfx.endSec;
			curPlaying.anchor = typeof anchor === 'boolean' ? anchor : false;
			curPlaying.callBack = typeof callBack === 'function' ? callBack : null;

			if (sfx.speed != null) sfxCtrl.playbackRate = sfx.speed;
			sfxCtrl.play();
		},

		pause : function(){
			sfxPaused = true;
			sfxCtrl.pause();
		},

		pauseBg : function(){
			sfxBgPaused = true;
			bgLoopSfx.pause();
		},

		resume : function(){
			sfxPaused = false;
			if (curPlaying.name.length) sfxCtrl.play();
		},

		resumeBg : function(){
			sfxBgPaused = false;
			if (curPlayingBg.name.length) bgLoopSfx.play();
		},

		resetSfx : function(){
			sfxCtrl.pause();
			sfxCtrl.currentTime = 0;
			sfxPaused = false;

			curPlaying.name = '';
			curPlaying.startSec = 0;
			curPlaying.endSec = 0;
			curPlaying.anchor = false;
		},

		resetBgSfx : function(){
			bgLoopSfx.pause();
			bgLoopSfx.currentTime = 0;
			sfxBgPaused = false;

			curPlayingBg.name = '';
			curPlayingBg.startSec = 0;
			curPlayingBg.endSec = 0;
			curPlayingBg.anchor = false;
		},

		//call it in a loop
		check : function(){
			if (typeof curPlaying.endSec === 'undefined'){
				return false;
			}

			//console.log(sfxQueue)

			//console.log(sfxCtrl.currentTime.toPrecision(5) + ' ' + curPlaying.endSec.toPrecision(5));
			if (!sfxPaused && curPlaying.name.length && sfxCtrl.currentTime.toPrecision(5) >= curPlaying.endSec.toPrecision(5)){
				curPlaying.name = '';
				curPlaying.startSec = 0;
				curPlaying.endSec = 0;
				curPlaying.anchor = false;


				sfxCtrl.pause();
				sfxCtrl.playbackRate = 1;
				//sfxCtrl.currentTime = 0;

			}

			//check bgloop
			if (!sfxBgPaused && curPlayingBg.name.length && bgLoopSfx.currentTime.toPrecision(5) >= curPlayingBg.endSec.toPrecision(5)){
				bgLoopSfx.currentTime = curPlayingBg.startSec;
			}
		}
	}
}());