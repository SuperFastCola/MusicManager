var MusicManager = (function(){

	//overwrite console to prevent errors
	if(!window.console) console = {log:function(){}};

	var my = new Object();
	my.mixidpattern = new RegExp(/[a-z0-9]{10}\|[0-9]{8}:[0-9]{6}/);
	my.ticker = null;
	my.count = 0;
	my.tickerFunction == null;

	my.soundsDirectory = "/sounds/";	

	my.soundsloaded = 0;
	my.loadingsounds = false;
	my.soundstotal = 0;
	my.sounds = null;
	my.basetrack = null;
	my.basetrackposition = 0;
	my.displayed = false;
	my.totalstops = 8;
	my.totalplayingtime = 0;
	my.currenttime = 0;
	my.framerate = 0;
	my.frameratecalculated = false;
	my.calculatingframerate = true;

	my.retrieveMix = false;

	my.isIE = false;

	my.buttonActionsAssigned = false;

	my.mixing_line_increment = null;
	my.mixing_line_positions = null;
	my.crab_increment = 0;
	my.crablocationtimeout = null;
	my.mixer_crabs_position_at_stop = null;
	my.mixer_crabs_position_recalc_at = 4;
	my.mixer_crabs_position_recalc = 0;

	my.counter_running = false;
	my.track_slot = 0;
	my.trackwidth = 0;
	my.track_increment_at = 0;
	my.track_increment_counter = 0;
	my.totalplayingsounds = 0;
	my.animationPrefix = "";
	my.animationSupported = false;

	my.recalculateTimer = null;

	my.tutorials = {
		current: 1,
		total: 4,
		selector: '.tut'
	}

	my.soundlibrary = {
		surf: {
			background:{
				file: "surf_rock_base_track_chop_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: true,
				basetrack_length: 5.5,
				basetrack_length_multiplier: 1,
				volume: 0.75,
				loaded: false
			},
			track1:{
				file:"slide_guitar_chop_2_short",
				sound: null,
				playtime: 0,
				playing: false,
				basetrack: false,
				volume: 1.0,
				loaded: false
			},
			track2:{
				file:"keyboard_synth_chop_short",
				sound: null,
				playtime: 0,
				playing: false,
				basetrack: false,
				volume: 1.0,
				loaded: false
			},
			track3:{
				file: "seagull_chop_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: false,
				volume: 1.0,
				loaded: false
			},
			track4:{
				file: "waves_crashing_chop_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: false,
				volume: 1.0,
				loaded: false
			}	
		},
		motorcycle: {
			background:{
				file: "motorcycle_riffs_base_track_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: true,
				basetrack_length: 4.3,
				basetrack_length_multiplier: 1,
				volume: 1.0,
				loaded: false
			},
			track1:{
				file: "lead_electric_guitar_chop_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: false,
				volume: 0.75,
				loaded: false
			},
			track2:{
				file: "honking_horn_chop_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: false,
				volume: 0.75,
				loaded: false
			},
			track3:{
				file:"record_scratch_chop_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: false,
				volume:  1.0,
				loaded: false
			},
			track4:{
				file:"engine_revving_chop_2_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: false,
				volume:  1.0,
				loaded: false
			}
		},
		summer: {
			background:{
				file: "summer_love_base_track_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: true,
				basetrack_length: 5.966,
				basetrack_length_multiplier: 1,
				volume: 1.0,
				loaded: false
			},
			track1:{
				file:"maracas_chop_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: false,
				volume: 1.0,
				loaded: false
			},
			track2:{
				file:"xylophone_chop_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: false,
				volume: 1.0,
				loaded: false
			},
			track3:{
				file: "dolphin_chop_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: false,
				volume: 0.75,
				loaded: false
			},
			track4:{
				file: "smooch_chop_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: false,
				volume: 1.0,
				loaded: false
			}	
		},
		doowop: {
			background:{
				file: "doo-wop__base_track_chop",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: true,
				basetrack_length: 6.0,
				basetrack_length_multiplier: 1,
				volume: 1.0,
				loaded: false
			},
			track1:{
				file: "saxophone_chop_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: false,
				volume: 1.0,
				loaded: false
			},
			track2:{
				file: "washboard_chop_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: false,
				volume: 1.0,
				loaded: false
			},
			track3:{
				file:"doowop_chop_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: false,
				volume: 1.0,
				loaded: false
			},
			track4:{
				file:"splash_chop_short",
				sound: null,
				playtime: 0,
				playing:false,
				basetrack: false,
				volume: 1.0,
				loaded: false
			}
		}
	};

	my.mixlibrary = {
		surf:new Array(my.totalstops),
		motorcycle:new Array(my.totalstops),
		summer:new Array(my.totalstops),
		doowop:new Array(my.totalstops)
	};

	//next and previous location for scenes
	my.scenes = new Array();
	for(var i in my.mixlibrary){
		my.scenes.push(i);
	}
	
	my.currentscenekey = 0;
	my.currentscene = my.previousscene = my.scenes[my.currentscenekey];

	my.mixdown = new Object();
	my.mixer = new Array(my.totalstops);
	my.mixer_crabs_position_at_stop = new Array(my.totalstops);


	my.detectIE = function(){
		//http://www.pinlady.net/PluginDetect/IE/

		var tmp = document.documentMode, e;

		// Try to force this property to be a string. 
		try{document.documentMode = "";}
		catch(e){ };

		// If document.documentMode is a number, then it is a read-only property, and so 
		// we have IE 8+.
		// Otherwise, if conditional compilation works, then we have IE < 11.
		// Otherwise, we have a non-IE browser. 
		my.isIE = typeof document.documentMode == "number" || new Function("return/*@cc_on!@*/!1")();

		// Switch back the value to be unobtrusive for non-IE browsers. 
		try{document.documentMode = tmp;}
		catch(e){ };
	}


	my.initializeTickers = function(repeaterFunction){
		window.ticker = (function(){
			    return  window.requestAnimationFrame       || 
			        window.webkitRequestAnimationFrame || 
			        window.mozRequestAnimationFrame    || 
			        window.oRequestAnimationFrame      || 
			        window.msRequestAnimationFrame     || 
			        function(/* function */ callback, /* DOMElement */ element){
			            return window.setTimeout(callback, 1000 / 60);
			        };
			})();

			window.stopTicker = (function(){
				return window.cancelAnimationFrame          ||
			        window.webkitCancelRequestAnimationFrame    ||
			        window.mozCancelRequestAnimationFrame       ||
			        window.oCancelRequestAnimationFrame     ||
			        window.msCancelRequestAnimationFrame        ||
			        clearTimeout
			})();

		window.ticker(repeaterFunction);
	}

	my.musicTrackingIntervalFunction = null;
	my.musicTrackingInterval = 0;

	my.playBaseTrack = function(){

		my.clearMusicTracker();
		my.musicTrackingInterval = (my.basetrack.basetrack_length * 1000)/8;

		if(!my.basetrack.playing){
			my.turnOffAllSounds();
			$(".start_background").removeClass("play").addClass("pause");
			$(".mixing_line").addClass("crawling");
			my.startCounter();
			my.basetrack.sound.play();
			my.totalplayingsounds++;
			my.basetrack.playing = true;
			my.MusicTracker();
			my.musicTrackingIntervalFunction = setInterval(my.MusicTracker,my.musicTrackingInterval);

		}
		else{
			$(".start_background").removeClass("pause").addClass("play");
			my.removeCrabAnimations();
			my.pauseSounds();
			my.basetrack.sound.stop();
			my.resetPlayingVariables();
			my.stopCounter();
			my.totalplayingsounds--;
			my.basetrack.playing = false;
		}
		
	}

	my.resetCrabPositions = function(){
		my.mixer_crabs_position_at_stop = null;
		my.mixer_crabs_position_at_stop = new Array(my.totalstops);
		my.mixer_crabs_position_recalc = 0;
	}

	my.calculateFrameRate = function(counter){
			clearTimeout(my.recalculateTimer);
			my.recalculateTimer = null;

			$(".start_background,.changer").addClass("hidden");

			my.recalculateTimer = setTimeout(function(){
				my.framerate = my.count;

				//get total playing time for increment count. 1 increment at each frame of current calculated frame rate
				my.totalplayingtime = Math.round(my.framerate * my.basetrack.basetrack_length);
				my.frameratecalculated = true;
				my.stopCounter();

				console.log("Frame Rate: " + my.framerate);

				$(".start_background,.changer").removeClass("hidden");


				if(!my.buttonActionsAssigned){
					my.buttonActionsAssigned = true;
					my.createButtons();
				}
				
				my.track_slot=0;	
				clearTimeout(my.recalculateTimer);
				my.recalculateTimer = null;
	
			},1000);
	}

	my.startFrameRateCalculation = function(){
	
		if(!my.frameratecalculated && my.calculatingframerate && my.framerate===0){
			my.calculateFrameRate();
			my.calculatingframerate = false;
		}
	}

	my.pauseSounds = function(){
		for(var x = my.totalplayingsounds; x>0; x--){
			for(var i in my.sounds){
				if(!my.sounds[i].basetrack){
					my.sounds[i].sound.stop();
				}
			}
		}
	}

	my.turnOffAllSounds = function(){
		for(var x = my.totalplayingsounds; x>0; x--){
			for(var i in my.sounds){
					my.sounds[i].sound.stop();
			}
		}
	}

	my.resetPlayingVariables = function(){
		my.currenttime = 0;
		my.count=0;
		my.track_slot = 0;
		my.track_increment_counter = 0;
		my.resetCrabLocation();
	}

	my.resetSounds = function(){

		if(!my.retrieveMix){
			my.clearMixer();
		}
		my.resetPlayingVariables();
		my.totalplayingtime = 0;
		my.track_increment_at = 0;
	}

	my.resetTrackIcons = function(){
		$(".sound_button").removeClass('selected');
	}


	my.resetFrameRateCalculation = function(){

			my.framerate = 0;
			my.frameratecalculated = false;
			my.calculatingframerate = true;

			my.killBaseTrack();
			my.resetCrabLocation();

			my.startFrameRateCalculation();
	}

	my.crabcount = 0;
	my.changeCrabPosition =function(){
		
		my.crabcount++;
		$(".mixing_line").removeClass("pos0 pos1 pos2 pos3 pos4 pos5 pos6 pos7 pos8").addClass("pos" + my.crabcount);

		if(my.crabcount==8){
			my.crabcount=0;
		}
	}

	my.clearMusicTracker =  function(){
		clearInterval(my.musicTrackingIntervalFunction);
		my.musicTrackingIntervalFunction = null; 
	}

	my.MusicTracker = function(){

			my.changeCrabPosition();
			my.playMusicAtStop(my.track_slot);
			my.track_slot++;

			if(my.track_slot == my.totalstops){
				my.track_slot=0;
			}
	}


	my.Counter = function(){
		my.count++;
		window.ticker(my.tickerFunction);
	}

	my.stopCounter = function(){

		if(my.counter_running){
			my.counter_running = false;
		}
		my.tickerFunction = my.stopCounter;
		window.stopTicker(my.tickerFunction);
	}

	my.startCounter = function(){

		if(!my.counter_running){
			
			my.counter_running = true;
			my.tickerFunction = my.Counter;
			window.ticker(my.tickerFunction);
		}
	}

	my.CheckForHowler = function(){


		if(typeof window.Howl != "undefined" && typeof window.jQuery != "undefined" ){
			my.tickerFunction = my.stopCounter;
			my.stopCounter();
			my.animationSupported = my.cssAnimationSupport();

			my.saveLoadEvents();
			my.getJukeBoxSceneData();
			my.startFrameRateCalculation();

			//my.loadSounds();
		}
		window.ticker(my.tickerFunction);
	}

	my.playMusicAtStop = function(stop){

		for(var i in my.mixer[stop]){
			if(my.mixer[stop][i]){
				my.sounds[i].sound.play();
			}
		}
	}

	my.killBaseTrack = function(){


		if(my.basetrack != null){

			my.basetrack.playing = false;
			my.basetrack.loaded = false;

			if(typeof my.basetrack.sound != 'undefined' && my.basetrack.sound != null){
				my.basetrack.sound.stop();
				my.basetrack.sound = null;
			}	
			
			my.basetrack = null;
		}
	}

	my.clearMixer = function(){

		for(var i = 0; i<my.mixer.length;i++){
			for(var track in my.mixer[i]){
				my.mixer[i][track] = false;
			}
		}

	}

	my.setUpMixerArray = function(){

		if(!my.retrieveMix){
			for(var x = 0; x<my.totalstops; x++){
				
				my.mixer[x] = new Object();

				for(var i in my.sounds){

					if(!my.sounds[i].basetrack){
						my.mixer[x][i] = false;
					}
				}
			}
		}
	}

	my.toggleMusicOnMixer = function(id,slot){
	

		slot -= 1;
		if(!my.sounds[id].basetrack){
			my.mixer[slot][id] = !my.mixer[slot][id];
	
		}
	}

	my.basetrackInitializer = function(butnid){

		// if(!my.frameratecalculated){			
			
			if(my.basetrack == null){
				my.basetrack = my.sounds["background"];
			}
			else{
				my.playBaseTrack();
			}
			
			my.count = 0;
			//my.startCounter();
		// }else{
		// 	my.playBaseTrack();
		// }
	}

	my.showTrackSelections = function(){


		$(".track_slots").each(function(){
			var butnid = $(this).attr("data-ref");
			var slotid = $(this).attr("data-ref-slot");
			
			if(my.mixer[Number(slotid)-1][butnid]){
			
				$(this).addClass("selected");
			}
		});

		my.retrieveMix = false;
	}

	my.createButtons = function(){
	
		$(".sound_button").each(function(){
		
			$(this).bind('click',function(e){

				var butnid = $(this).attr("data-ref");
				var slotid = $(this).attr("data-ref-slot");

				if(my.sounds == null){
					my.setUpMixerArray();
					my.sounds = my.soundlibrary[my.currentscene];
				}


				if(my.sounds[butnid].basetrack){
					my.basetrackInitializer("background");
				}
				else{
					if(!$(this).hasClass("selected")){

						$(this).addClass("selected");
						my.toggleMusicOnMixer(butnid,slotid);
						my.totalplayingsounds++;
						my.sounds[butnid].playing = true;
	
					}
					else{
						$(this).removeClass("selected");
						my.sounds[butnid].playing = false;
						my.toggleMusicOnMixer(butnid,slotid);
						my.totalplayingsounds--;
					}

					my.sounds[butnid].playing = !my.sounds[butnid].playing;

				}						
			});
		});

		$(".share_close,.make_own").bind('click',function(){
			$(".share_prompt,.share_content").addClass('hidden');
			$(".share_prompt").removeClass('friend_shared');
		});

		$("#reset_all,.make_own").bind('click',my.resetScene);

		$(".cntl_icons").each(function(){
			$(this).removeClass("hidden").bind('click',function(e){
				my.sounds[$(this).attr("data-ref")].sound.play();
			});
		});

		my.tutorialButtons();
	}

	my.showTrackLocation = function(slot){
		if(my.frameratecalculated){
			$(".track_slots").removeClass('selected');
			$(".track" + my.track_slot).addClass('selected');
		}
	}

	my.resetCrabLocation = function(){
		my.crabcount = 0;
		$(".mixing_line").removeClass("pos0 pos1 pos2 pos3 pos4 pos5 pos6 pos7 pos8");

	}

	my.createCrabAnimation = function(scene,duration){

		my.trackwidth =  ($(".track_buttons").outerWidth(true)*8) + "px";

		console.log("Crab Crawl Length " + my.trackwidth);
		var prefixes = ["-webkit-","-ms-",""];

		var styles = "";

		for(var i in prefixes){
			styles += "@" + prefixes[i] + "keyframes crawler {\n";
			styles += "\t0% {" + prefixes[i] + "transform: translate(0px,-20px);}\n";
			styles += "\t100% {" + prefixes[i] + "transform: translate(" +  my.trackwidth +  ",-20px);}\n";
			styles += "}\n\n";			
		}	

		styles += "\n.crawling{\n";

		for(var i in prefixes){
			styles += "\t" + prefixes[i] + "animation-name: crawler;\n";
  			styles += "\t" + prefixes[i] + "animation-duration: " + duration +  "s;\n";
  			styles += "\t" + prefixes[i] + "animation-delay: 0s;\n";
  			styles += "\t" + prefixes[i] + "animation-iteration-count: infinite;\n";
  			styles += "\t" + prefixes[i] + "animation-timing-function: linear;\n";
  			styles += "\t" + prefixes[i] + "animation-play-state: running;\n\n";
  		}

  		styles += "}\n\n";


			var head = document.head || document.getElementsByTagName("head")[0];
			
			var anistyle = document.createElement("style");
			anistyle.id = "crabanimation";
			anistyle.text = "text/css";
			anistyle.media = "screen";
			head.appendChild(anistyle);

			if(anistyle.styleSheet){
				anistyle.styleSheet.cssText = styles;
			}
			else{
				anistyle.appendChild(document.createTextNode(styles));
			}
	}

	my.removeCrabAnimations = function(){
		$(".mixing_line").removeClass('crawling');
	}
	

	//https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_animations/Detecting_CSS_animation_support
	my.cssAnimationSupport = function(){

		var elm = document.createElement("div");
		document.body.appendChild(elm);

		var animation = false,
		    animationstring = 'animation',
		    keyframeprefix = '',
		    domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
		    pfx  = '';

		if( elm.style.animationName !== undefined ) { animation = true; }    

		if( animation === false ) {
		  for( var i = 0; i < domPrefixes.length; i++ ) {
		    if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
		      pfx = domPrefixes[ i ];
		      animationstring = pfx + 'Animation';
		      keyframeprefix = '-' + pfx.toLowerCase() + '-';
		      my.animationPrefix = keyframeprefix;
		      animation = true;
		      break;
		    }
		  }
		}

		document.body.removeChild(elm);
		return animation;
	}


	my.countLoadedSounds = function(){
			my.soundsloaded++;

			if(my.soundsloaded>=my.soundstotal){
				my.startFrameRateCalculation();
			}
	}

	my.LoadSounds = function(){

		my.turnOffAllSounds();
		my.resetSounds();
		my.killBaseTrack();

		for(var i in my.sounds){
			var newsound = my.sounds[i];

			var filetype = ".mp3";

			if(newsound.basetrack){

				if(my.isIE){
					filetype = ".mp3";
				}
				else{
					filetype = ".wav";
				}
				
			}

			newsound.sound = new Howl({
				urls: [my.soundsDirectory + newsound.file + filetype, my.soundsDirectory + newsound.file + '.ogg'],
				loop: newsound.basetrack,
				volume: newsound.volume, 
				onload: my.countLoadedSounds
			});

		


			newsound.sound.id = i;
		}
	}

	my.getJukeBoxSceneData = function(e){

		my.loadScene(String($(".juke_box").attr("data-ref")));
		my.basetrackInitializer("background");
	}

	my.savedMusicLink = function(data){
		$(".share_prompt,.share_messaging").removeClass("hidden");
		$(".share_link").text($(".share_link").attr('data-url') + "/?mixid=" +  data.messages[0].saved_as);
		$(".fb-mix-share,.twitter-mix-share").attr("data-mix-id","/?mixid=" + data.messages[0].saved_as);

		var emailcopy = $(".email-share").attr("href");
		emailcopy += "%0A" + $(".share_link").text();
		$(".email-share").attr("href",emailcopy);
	}

	my.saveLoadEvents = function(){

		//$(".start_background").bind('click',my.getJukeBoxSceneData);
		my.changeSceneActions();

		$("#share_mix").bind("click",function(){

			$(".share_messaging,.share_content").addClass('hidden');

			if($("." + my.currentscene + " .track_buttons.selected").length>0){
				my.mixdown.mix = new Object();
				my.mixdown.mix.tracks = my.mixer;
				my.mixdown.mix.basetrack = my.basetrack.file;
				my.mixdown.mix.scene = my.currentscene;
				my.saveMix(my.mixdown,my.savedMusicLink);
			
			}
			else{
				$(".share_prompt,.share_alert").removeClass("hidden");
			}
		});
	}

	my.resetScene = function(){
		my.stopCounter();
		my.retrieveMix = false;
		my.turnOffAllSounds();
		my.clearMixer();
		my.resetTrackIcons();
		//my.startFrameRateCalculation();
		my.basetrack.playing = true;
		my.playBaseTrack();

		my.removeCrabAnimations();


	}

	my.changeScene = function(){
		var forward = Boolean(String($(this).attr('class')).match(/next/i));

		my.previousscene = my.scenes[my.currentscenekey];

		if(forward){
			my.currentscenekey++;
		}
		else{
			my.currentscenekey--;
		}

		if(my.currentscenekey>my.scenes.length-1){
			my.currentscenekey=0;
		}
		else if(my.currentscenekey<0){
			my.currentscenekey=my.scenes.length-1;
		}

		my.clearMusicTracker();

		my.currentscene = my.scenes[my.currentscenekey];

		$(".juke_box,.section-game").removeClass(my.previousscene).addClass(my.currentscene)
		$(".juke_box").attr("data-ref",my.currentscene);

		my.loadingsounds = false;
		my.turnOffAllSounds();
		my.resetSounds();
		my.resetTrackIcons();
		my.stopCounter();
		my.resetFrameRateCalculation();

		$(".start_background").removeClass('pause').addClass('play');

		my.soundsloaded = 0;
		my.soundstotal = 0;
		my.sounds = null;
		my.totalplayingsounds = 0;

		my.basetrack = null;

		my.removeCrabAnimations();
		$("#crabanimation").remove();

		my.loadScene(my.currentscene);
		my.basetrackInitializer("background");
	}

	my.changeSceneActions = function(){
		$(".next,.prev").bind('click',my.changeScene);
	}

	my.initializeFunctions = function(){
		my.tickerFunction = my.CheckForHowler;
		my.initializeTickers(my.tickerFunction);
	}

	my.getSceneKeyFromCurrentScene = function(){
		for(var i = 0; i<my.scenes.length; i++){
			if(my.scenes[i]==my.currentscene){
				my.currentscenekey = i;
			}
		}
	}

	my.loadMixFunction = function(data){
		my.mixerinfo = JSON.parse(data.messages);
		my.currentscene = my.mixerinfo.scene;

		my.getSceneKeyFromCurrentScene();
		
		my.mixer = my.mixerinfo.tracks;

		$(".juke_box").attr("data-ref",my.currentscene).addClass(my.currentscene);
		$(".section-game").addClass(my.currentscene);
		
		//$(".tutorial").addClass('hidden');
		
		$(".share_prompt,.share_friend").removeClass('hidden');
		$(".share_prompt").addClass('friend_shared');

		if(my.previousscene!=my.currentscene){
			$(".juke_box,.section-game").removeClass(my.previousscene);	
		}
		

		my.initializeFunctions();
	}

	my.init = function(mixid){

		if(typeof CDNRootPath != "undefined"){
			my.soundsDirectory = CDNRootPath + "sounds/";
		}


		my.detectIE();

		if(typeof mixid != "undefined"){
			my.retrieveMix = true;
			my.loadMix({"mixid":mixid},my.loadMixFunction);
		}
		else{
			my.initializeFunctions();
		}

		$(".section-game").removeClass("show_menu");

	}

	my.saveMix = function(entry,doneFunction){		
		if(typeof entry !="undefined"){
			sendEntryThroughAjax(entry,"save",doneFunction);
		}
	}

	my.showLoadFailedMessage = function(){
		$(".not_found_prompt,.share_not_found").removeClass("hidden");

		$(".not_found_close").bind('click',function(){
			$(".not_found_prompt").remove();
		});
		
	}

	my.LoadFailed = function(jqXHR, textStatus, errorThrown){
		if(typeof jqXHR.responseJSON.messages != "undefined"){
			if(jqXHR.responseJSON.messages[0].mixid==null){
				window.location.href="/?mixid=notfound";				
			}
		}
	}

	my.loadMix = function(entryid,doneFunction,failFunction){
		if(typeof entryid !="undefined"){
			sendEntryThroughAjax(entryid,"load",doneFunction,my.LoadFailed);
		}
	}

	function sendEntryThroughAjax(entry,path,doneFunction,failFunction){
		var entryObject = ((typeof entry !="undefined" && entry != null)?entry:$('.form').formParams());
		var results = false;

		$.ajax({
			url: 'api/' + path,
			type: 'post',
			dataType: 'json',
			data: JSON.stringify(entryObject),
			processData: false,
			contentType: 'application/json'
		}).done(function(data, textStatus, jqXHR){
			if(typeof doneFunction != "undefined"){
				doneFunction(data);
			}
			else{
				
			}
			// show success state
		}).fail(function(jqXHR, textStatus, errorThrown){
			if(typeof failFunction != "undefined" && typeof failFunction == "function"){
				failFunction(jqXHR, textStatus, errorThrown);
			}
		});
	}

	my.tutorialButtons = function(){
		$(".tut_next,.tut_back,.tut_close,.tut_final,.tut_help").bind('click',my.changeTutorials);
	}

	my.addTutClassToJukeBox = function(){
		$(".juke_box").addClass("tut" + my.tutorials.current);
	}

	my.changeTutorials = function(e){
		var action = String($(this).attr('class')).match(/next|close|back|final|help/i);
		action = String(action[0]).toLowerCase();

		$(".juke_box").removeClass("tut1 tut2 tut3 tut4");
		
		switch(action){
			case 'help':
				my.tutorials.current = 1;
				$(my.tutorials.selector + my.tutorials.current + ",.game-tutorials").removeClass("hidden");
				my.addTutClassToJukeBox();
			break;

			case 'next':
				$(my.tutorials.selector + my.tutorials.current).addClass("hidden");
				my.tutorials.current++;

				if(my.tutorials.current>my.tutorials.total){
					my.tutorials.current = 1;
				}
				$(my.tutorials.selector + my.tutorials.current).removeClass("hidden");
				my.addTutClassToJukeBox();
			break;

			case 'back':

				$(my.tutorials.selector + my.tutorials.current).addClass("hidden");

				my.tutorials.current--;
				if(my.tutorials.current<1){
					my.tutorials.current = my.tutorials.total;
				}

				$(my.tutorials.selector + my.tutorials.current).removeClass("hidden");				
				my.addTutClassToJukeBox();

			break;

			case 'close':
				$(".tutorial,.game-tutorials").addClass("hidden");
			break;

			case 'final':
				$(".tutorial,.game-tutorials").addClass("hidden");
			break;
		}
	}

	//initial constructor for game
	my.loadScene = function(scene){

		$(".start_background").unbind('click',my.getJukeBoxSceneData);

		if(typeof scene != "undefined"){
			my.currentscene = scene;
		}

		for(var i in my.sounds){
			my.sounds[i].sound = null;
			my.sounds[i] = null;
		}

		my.clearMusicTracker();
	
		if(my.sounds == null || my.currentscene!=my.previousscene){
			my.sounds = my.soundlibrary[my.currentscene];
			my.setUpMixerArray();
		}

		for(var i in my.sounds){
			my.soundstotal++;
		}

		if(!my.loadingsounds){
			my.LoadSounds();
			my.loadingsounds = true;	
		}

		if(my.retrieveMix){
			my.showTrackSelections();
		}


	}

	return my;

}());