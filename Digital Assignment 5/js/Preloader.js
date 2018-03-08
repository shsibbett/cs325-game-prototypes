"use strict";

GameStates.makePreloader = function( game ) {

	//var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
    
       
            preloadBar = game.add.sprite(300, 400, 'preloaderBar');
            game.load.setPreloadSprite(preloadBar);
            game.load.image('playButton', 'assets/start_button.png');

            game.load.audio('hit', 'assets/pistol.wav');
            game.load.audio('catch', 'assets/battery.wav');
            game.load.audio('bounce', 'assets/lazer.wav');
            game.load.audio('drop', 'assets/numkey_wrong.wav');
            game.load.audio('win', 'assets/shot1.wav');
            game.load.audio('game_over', 'assets/spaceman.wav');
            game.load.audio('wall', 'assets/wall.wav');
   
            game.load.atlas('breakout', 'assets/breakout.png', 'assets/breakout.json');
            game.load.image('bottom_bun', 'assets/bottom_bun.png' );
            game.load.image('hamburger', 'assets/hamburger.png');
            game.load.image('cheese', 'assets/cheese.png');
            game.load.image('tomato', 'assets/tomato.png');
            game.load.image('top_bun', 'assets/top_bun.png');
            game.load.image('seed', 'assets/seed.png');
            game.load.image('phase1', 'assets/phase1.png');
            game.load.image('phase2', 'assets/phase2.png');
            game.load.image('phase3', 'assets/phase3.png');
            game.load.image('phase4', 'assets/burger.png');
        },
    
        create: function () {

            preloadBar.cropEnabled = false;

        },
    
        update: function () {
    
            game.state.start('MainMenu');
    
        }
    
    };
};
