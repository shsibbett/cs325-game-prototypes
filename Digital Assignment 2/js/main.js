"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

    function preload() {
    
        game.load.tilemap('DA2', 'assets/DA2v2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/tileset12345.png');
        game.load.image('sky', 'assets/sky4.png');
        game.load.spritesheet('chicken', 'assets/jODGJn4.png', 48, 48);
      //  game.load.image('background', 'assets/background2.png');
    
    }

    //used starstruck for sprite/tilemap stuff http://phaser.io/examples/v2/games/starstruck#gv
    //used Tiled to make map http://www.mapeditor.org/
    //used https://opengameart.org/content/pixel-tileset-0 for tileset
    //chicken sprite: https://forums.rpgmakerweb.com/index.php?threads/whtdragons-animals-and-running-horses-now-with-more-dragons.53552/
    //used phaser assets
    
    var map;
    var tileset;

    var backgroundlayer;
    var grasslayer;
    var groundlayer;

    var player;
    var facing = 'left';
    var jumpTimer = 0;
    var cursors;
    var jumpButton;
    
    function create() {
    
        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        game.stage.backgroundColor = '#000000';
    
        map = game.add.tilemap('DA2');
    
        map.addTilesetImage('ground_tileset', 'tiles');
        map.addTilesetImage('sky', 'sky');
    
        backgroundlayer = map.createLayer('BackgroundLayer');
        grasslayer = map.createLayer('GrassLayer');
        groundlayer = map.createLayer('GroundLayer');

        map.setCollisionBetween(1, 3000, true, 'GroundLayer');

        groundlayer.resizeWorld();
    
        game.physics.arcade.gravity.y = 150;
    
        player = game.add.sprite(1, 3100, 'chicken');
        //player.frame = 3;
        game.physics.arcade.enable(player);
        player.body.gravity.y = 350;
    
        player.body.bounce.y = 0.2;
        player.body.collideWorldBounds = true;
        player.body.setSize(20, 32, 5, 16);
    
        player.animations.add('left', [12, 13, 14], 10, true);
        player.animations.add('turn', [1], 20, true);
        player.animations.add('right', [24, 25, 26], 10, true);
    
        game.camera.follow(player);
    
        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    }
    
    function update() {
    
        game.physics.arcade.collide(player, groundlayer);
    
        player.body.velocity.x = 0;
    
        if (cursors.left.isDown)
        {
            player.body.velocity.x = -150;
    
            if (facing != 'left')
            {
                player.animations.play('left');
                facing = 'left';
            }
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 150;
    
            if (facing != 'right')
            {
                player.animations.play('right');
                facing = 'right';
            }
        }
        else
        {
             if (facing != 'idle')
             {
                 player.animations.stop();
    
        //         if (facing == 'left')
        //         {
        //             player.frame = 0;
        //         }
        //         else
        //         {
        //             player.frame = 5;
        //         }
    
        //         facing = 'idle';
             }
        }
        
        if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
        {
            player.body.velocity.y = -550;
            jumpTimer = game.time.now + 750;
        }
    
    }
    
    function render () {
    
        // game.debug.text(game.time.physicsElapsed, 32, 32);
        // game.debug.body(player);
        // game.debug.bodyInfo(player, 16, 24);
    
    }
};
