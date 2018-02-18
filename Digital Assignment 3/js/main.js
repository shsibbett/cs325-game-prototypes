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
    
        game.load.tilemap('DA3', 'assets/DA3.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('walls', 'assets/tileset12345.png');
        game.load.spritesheet('player', 'assets/dude.png', 32, 48);
        game.load.image('x', 'assets/red x.png', 16, 16);
        game.load.image('dot', 'assets/orb-green.png');
        game.load.image('door', 'assets/doorv2.png');
        game.load.image('chunk', 'assets/chunk.png');
        // game.load.audio('lost_woods', 'assets/lostwoods.mp3');
        // game.load.audio('cluck', 'assets/cluck.mp3');
        // game.load.audio('win', 'assets/win.mp3');
        // game.load.audio('game over', 'assets/game over.mp3');
    
    }
    
    var map;
    
    var walls;
    var door;
    var player;
    var bmd;

    var deaths = 0;
    var deathText;

    //var lost_woods;
    //var win;
    //var game_over;

    var checkpoint1 = false;
    var checkpoint2 = false;
    var checkpoint3 = false;
    var success = false;

    var facing = 'left';
    
    var cursors;
    
    var left;
    var right;
    
    
    function create() {
    
        game.physics.startSystem(Phaser.Physics.ARCADE);

        bmd = game.add.bitmapData(1000, 1000);
        bmd.context.fillStyle = '#ffffff';

        var bg = game.add.sprite(0, 0, bmd);
    
        game.stage.backgroundColor = '#0A0A0A';
    
        map = game.add.tilemap('DA3');
    
        map.addTilesetImage('ground_tileset', 'walls');
    
        walls = map.createLayer('Walls');
        walls.alpha = 0;
        

        map.setCollisionBetween(1, 3000, true, 'Walls');

        walls.resizeWorld();
    
        resetPlayer();  

        door = game.add.sprite(934, 700, 'door');
        game.physics.arcade.enable(door);

        game.physics.arcade.enable(walls);

        deathText = game.add.text(16, 16, 'Deaths: 0', { fontSize: '28px', fill: '#FFF' });
        deathText.fixedToCamera = true;
        
        //lost_woods = game.add.audio('lost_woods');
        //lost_woods.loop = true;
        //cluck = game.add.audio('cluck');
        //win = game.add.audio('win');
        //game_over = game.add.audio('game over');
    
        cursors = game.input.keyboard.createCursorKeys();
        
        //lost_woods.play();
    }
    
    function update() {
    
        bmd.context.fillRect(player.world.x+15, player.world.y+15, 2, 2);
        bmd.dirty = true;

        game.physics.arcade.collide(player, walls, die, null, this);
        game.physics.arcade.collide(player, door, escape, null, this);
    
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
    
        if (checkpoint1 === false && player.world.x < 445 && player.world.x > 385 && player.world.y < 45 && player.world.y > 0) {
            checkpoint();
            checkpoint1 = true;
        }
        
        if (checkpoint2 === false && player.world.x < 430 && player.world.x > 370 && player.world.y < 630 && player.world.y > 570) {
            checkpoint();
            checkpoint2 = true;
        }

        if (checkpoint3 === false && player.world.x < 930 && player.world.x > 900 && player.world.y < 32 && player.world.y > 2) {
            checkpoint();
            checkpoint3 = true;
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
        else if (cursors.up.isDown)
        {
            player.body.velocity.y = -200;
        }
        else if (cursors.down.isDown)
        {
            player.body.velocity.y = 200;
        }
        else
        {
             if (facing != 'idle')
             {
                 player.animations.stop();
             }
        }   
    }

    function resetPlayer() {
        if (checkpoint1 === false) {
            player = game.add.sprite(30, 715, 'player');
        }

        if (checkpoint1 === true && checkpoint2 === false) {
            player = game.add.sprite(415, 15, 'player');
        }

        if (checkpoint2 === true && checkpoint3 === false) {
            player = game.add.sprite(400, 600, 'player');
        }

        if (checkpoint3 === true) {
            player = game.add.sprite(915, 17, 'player');
        }

        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.setSize(24, 24, 5, 16);
    
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('turn', [4], 20, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
    
        game.camera.follow(player);
    }

    function die(player, walls) {
        var x; 
        
        if (cursors.up.isDown) {
            x = game.add.sprite(player.world.x, player.world.y-2, 'x');
        } else if (cursors.down.isDown) {
            x = game.add.sprite(player.world.x, player.world.y+2, 'x');
        } else if (cursors.left.isDown) {
            x = game.add.sprite(player.world.x-2, player.world.y, 'x');
        } else if (cursors.right.isDown) {
            x = game.add.sprite(player.world.x+2, player.world.y, 'x');
        }
        player.kill();

        resetPlayer();
        updateDeaths();
    }

    function checkpoint() {
        var message = game.add.text(500, 16, 'Checkpoint reached!', { fontSize: '28px', fill: '#FFF' });
        message.fixedToCamera = true;
        message.alpha = 1;
        
        //alpha text tween code from https://phaser.io/examples/v2/tweens/alpha-text
        var fadeIn = game.add.tween(message).to( { alpha: 1 }, 1000, "Linear", true);
        var fadeOut = game.add.tween(message).to( { alpha: 0 }, 1000, "Linear", true);
        
        //tween chain code from https://phaser.io/examples/v2/tweens/chained-tweens
        fadeIn.chain(fadeOut);
        fadeIn.start();
    }

    function escape(player, exit) {
        player.kill();

        //lost_woods.pause();

        var text = game.add.text(game.width / 2, game.height / 2, 'You escaped!');
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
            //win.play();
        }
        success = true;
        
    }

    function updateDeaths() {
        deaths++;

        deathText.text = 'Deaths: ' + deaths;
    }
    
    function render () {
        //game.debug.bodyInfo(player, 32, 32);
    }
};
