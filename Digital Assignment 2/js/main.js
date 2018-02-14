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
        game.load.image('egg', 'assets/egg.png');
        game.load.audio('cluck', 'assets/cluck.mp3');
        game.load.audio('game over', 'assets/game over.mp3');
    
    }

    //used starstruck for sprite/tilemap stuff http://phaser.io/examples/v2/games/starstruck#gv
    //used Tiled to make map http://www.mapeditor.org/
    //used https://opengameart.org/content/pixel-tileset-0 for tileset
    //chicken sprite: https://forums.rpgmakerweb.com/index.php?threads/whtdragons-animals-and-running-horses-now-with-more-dragons.53552/
    //egg sprite: http://photobucket.com/gallery/user/alana553/media/bWVkaWFJZDoxMjc4MTA4MTc=/?ref=1
    //cluck sound: https://www.youtube.com/watch?v=xuYsNML2QgU
    //crow sound: https://www.youtube.com/watch?v=rGIBE12-xKY
    //used phaser assets
    
    var map;
    
    var backgroundlayer;
    var grasslayer;
    var groundlayer;

    var player;
    var eggs;

    var eggsToCollect = 12;
    var timeLeft = 120;
    
    var eggsLeftText;
    var timeLeftText;
    var text;

    var cluck;
    var game_over;

    var timer;

    var failed = false;

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

        //group code from https://phaser.io/examples/v2/groups/create-group
        eggs = game.add.group();

        eggs.enableBody = true;
    
        for (var i = 0; i < 12; i++)
        {
            var egg = eggs.create(game.world.randomX - 30, game.world.randomY - 30, 'egg');
    
            egg.body.gravity.y = 300;
            egg.body.bounce.y = 0.3;
        }

        eggsLeftText = game.add.text(16, 16, 'Eggs left: 12', { fontSize: '28px', fill: '#000' });
        eggsLeftText.fixedToCamera = true;
        timeLeftText = game.add.text(16, 52, 'Time remaining: 120', { fontSize: '28px', fill: '#000' });
        timeLeftText.fixedToCamera = true;
        
        cluck = game.add.audio('cluck');
        game_over = game.add.audio('game over');

        //custom timer code from http://phaser.io/examples/v2/time/basic-looped-event
        game.time.events.loop(Phaser.Timer.SECOND, updateTimeLeft, this);
    
        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    }
    
    function update() {
    
        game.physics.arcade.collide(player, groundlayer);
        game.physics.arcade.collide(eggs, groundlayer);

        game.physics.arcade.overlap(player, eggs, collectEgg, null, this);
    
        player.body.velocity.x = 0;

        if (eggsToCollect === 0) {
            player.kill();

            text = game.add.text(game.width / 2, game.height / 2, 'You saved the eggs!');
            text.align = 'center';
            text.fixedToCamera = true;
            text.anchor.setTo(0.5, 0.5);

            text.font = 'Arial Black';
            text.fontSize = 68;
            text.fontWeight = 'bold';

            text.stroke = '#000000';
            text.strokeThickness = 6;
            text.fill = '#FFFFFF';
        }

        if (timeLeft === 0) {
            player.kill();

            text = game.add.text(game.width / 2, game.height / 2, 'You failed!');
            text.align = 'center';
            text.fixedToCamera = true;
            text.anchor.setTo(0.5, 0.5);

            text.font = 'Arial Black';
            text.fontSize = 68;
            text.fontWeight = 'bold';

            text.stroke = '#000000';
            text.strokeThickness = 6;
            text.fill = '#FFFFFF';

            if (failed === false) {
                game_over.play();
            }

            failed = true;
        }
    
        if (cursors.left.isDown)
        {
            player.body.velocity.x = -200;
    
            if (facing != 'left')
            {
                player.animations.play('left');
                facing = 'left';
            }
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 200;
    
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
             }
        }
        
        if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
        {
            player.body.velocity.y = -550;
            jumpTimer = game.time.now + 750;
        }
    
    }

    function collectEgg(player, egg) {
        egg.kill();
        cluck.play();
        eggsToCollect--;

        eggsLeftText.text = 'Eggs left: ' + eggsToCollect;
    }


    function updateTimeLeft() {
        if (eggsToCollect > 0 && timeLeft > 0) {
            timeLeft--;
        }
        timeLeftText.text = 'Time remaining: ' + timeLeft;
    }
    
    function render () {

    }
};
