"use strict";

GameStates.makeMainMenu = function( game, shared ) {

    var playButton = null;
    var play;
    
    function startGame(pointer) {
        play.play();

        game.state.start('Game');

    }
    
    return {
    
        create: function () {
  

            game.stage.backgroundColor = '#000000';

            var menuText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Burger Breakout', { font: "40px Arial", fill: "#ffffff", align: "center" });
            menuText.anchor.setTo(0.5, 0.5);
    
            var bg = game.add.sprite(game.world.centerX, game.world.centerY, 'phase4');
            bg.anchor.setTo(0.5, 0.5);
            bg.scale.setTo(0.65, 0.65);
    
            playButton = game.add.button(game.world.centerX - 217, game.world.centerY + 100, 'playButton', startGame, null);
            playButton.scale.setTo(0.5, 0.5);

            play = game.add.audio('win');
    
        },
    
        update: function () {
    
        }
        
    };
};
