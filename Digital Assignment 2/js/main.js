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
        game.load.audio('lost_woods', 'assets/lostwoods.mp3');
        game.load.audio('cluck', 'assets/cluck.mp3');
        game.load.audio('win', 'assets/win.mp3');
        game.load.audio('game over', 'assets/game over.mp3');
    
    }
    
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

    var lost_woods;
    var cluck;
    var win;
    var game_over;

    var timer;

    var success = false;
    var failed = false;

    var inputArray = [];

    var facing = 'left';
    var jumpTimer = 0;

    var w;
    var a;
    var s;
    var d;
    var spacebar;
    var left;
    var right;
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
            var egg = eggs.create(game.world.randomX - 50, game.world.randomY - 30, 'egg');
            
            if (egg.world.x < 10) {
                egg.world.x += 20;
            }

            if (egg.world.y < 10) {
                egg.world.y += 20;
            }
            egg.body.gravity.y = 200;
            egg.body.bounce.y = 0.3;
        }

        eggsLeftText = game.add.text(16, 16, 'Eggs left: 12', { fontSize: '28px', fill: '#000' });
        eggsLeftText.fixedToCamera = true;
        timeLeftText = game.add.text(16, 52, 'Time remaining: 120', { fontSize: '28px', fill: '#000' });
        timeLeftText.fixedToCamera = true;
        
        lost_woods = game.add.audio('lost_woods');
        lost_woods.loop = true;
        cluck = game.add.audio('cluck');
        win = game.add.audio('win');
        game_over = game.add.audio('game over');
    
        //cursors = game.input.keyboard.createCursorKeys();
        w = game.input.keyboard.addKey(Phaser.Keyboard.W);
        a = game.input.keyboard.addKey(Phaser.Keyboard.A);
        s = game.input.keyboard.addKey(Phaser.Keyboard.S);
        d = game.input.keyboard.addKey(Phaser.Keyboard.D);
        spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        updateControls();

        //custom timer code from http://phaser.io/examples/v2/time/basic-looped-event
        game.time.events.loop(Phaser.Timer.SECOND, updateTimeLeft, this);

        if (success === false && failed === false) {
            game.time.events.loop(15000, updateControls, this);
        }
        
        lost_woods.play();
    }
    
    function update() {
    
        game.physics.arcade.collide(player, groundlayer);
        game.physics.arcade.collide(eggs, groundlayer);

        game.physics.arcade.overlap(player, eggs, collectEgg, null, this);
    
        player.body.velocity.x = 0;

        if (eggsToCollect === 0) {
            player.kill();
            lost_woods.pause();

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

            if (success === false) {
                win.play();
            }
            success = true;
        }

        if (timeLeft === 0) {
            player.kill();
            lost_woods.pause();

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
    
        if (left.isDown)
        {
            player.body.velocity.x = -200;
    
            if (facing != 'left')
            {
                player.animations.play('left');
                facing = 'left';
            }
        }
        else if (right.isDown)
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

    function updateControls() {
        populateArray();

        // code from https://stackoverflow.com/questions/12987719/javascript-how-to-randomly-sample-items-without-replacement
        var randomIndex = Math.floor(Math.random()*inputArray.length);
        left = inputArray[randomIndex];
        inputArray.splice(randomIndex, 1)[0];

        randomIndex = Math.floor(Math.random()*inputArray.length);
        right = inputArray[randomIndex];
        inputArray.splice(randomIndex, 1)[0];

        randomIndex = Math.floor(Math.random()*inputArray.length);
        jumpButton = inputArray[randomIndex];

        var message = game.add.text(500, 16, 'Controls swapped!', { fontSize: '28px', fill: '#000' });
        message.fixedToCamera = true;
        message.alpha = 1;
        
        //alpha text tween code from https://phaser.io/examples/v2/tweens/alpha-text
        var fadeIn = game.add.tween(message).to( { alpha: 1 }, 1000, "Linear", true);
        var fadeOut = game.add.tween(message).to( { alpha: 0 }, 1000, "Linear", true);
        
        //tween chain code from https://phaser.io/examples/v2/tweens/chained-tweens
        fadeIn.chain(fadeOut);
        fadeIn.start();
    }
    
    function populateArray() {
        inputArray[0] = w;
        inputArray[1] = a;
        inputArray[2] = s;
        inputArray[3] = d;
        inputArray[4] = spacebar;
    }
    
    function render () {

    }
};
