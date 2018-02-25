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
    
        game.load.tilemap('DA4', 'assets/DA4.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset1', 'assets/tons_of_tileset_8_10___ice_floe_tileset_by_phyromatical-d81x337.png');
        game.load.image('tileset2', 'assets/Ice_tiles.png');
        game.load.spritesheet('player', 'assets/Hikers_overworlds.png', 31.6, 32);
        game.load.image('flag', 'assets/b6fdc68bf6bdd78.png');
        // game.load.audio('lost_woods', 'assets/lostwoods.mp3');
        game.load.audio('music', 'assets/Pokemon- Heart Gold and Soul Silver- Ice PathCave- Music.mp3');
        //game.load.audio('exit', 'assets/exit.mp3');
    
    }
    
    var map;
    
    var rocks;
    var snow;
    var background;
    var ice;
    
    var player;
    var flag;

    var music;
    //var slide;
    //var win;
    //var exit;

    var success = false;
    var colliding = false;

    var facing = 'up';
    
    var cursors;
    
    var left;
    var right;
    
    
    function create() {
    
        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        //game.stage.backgroundColor = '#0A0A0A';
    
        createMap();
        createPlayer();  

        flag = game.add.sprite(656, 21, 'flag');
        flag.scale.setTo(0.15, 0.15);

        game.physics.arcade.enable(rocks);
        //game.physics.arcade.enable(snow);
        game.physics.arcade.enable(ice);
        
        //lost_woods = game.add.audio('lost_woods');
        //lost_woods.loop = true;
        music = game.add.audio('music');
        music.loop = true;
        //exit = game.add.audio('exit');
        //game_over = game.add.audio('game over');
    
        cursors = game.input.keyboard.createCursorKeys();
        
        music.play();
    }
    
    function update() {
        //colliding = false;
        game.physics.arcade.collide(player, rocks, collision, null, this);
        //!game.physics.arcade.collide(player, rocks, slide, null, this);

        game.input.enabled = true;
    
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (map.getTileWorldXY(player.x, player.y, map.tileWidth, map.tileHeight, ice) && !map.getTileWorldXY(player.x, player.y, map.tileWidth, map.tileHeight, snow)
            && colliding === false) {

                if (facing === 'left' && !player.body.blocked.left) {
                    player.body.velocity.x = -200;
                }

                else if (facing === 'right' && !player.body.blocked.right) {
                    player.body.velocity.x = 200;
                }

                else if (facing === 'up' && !player.body.blocked.up) {
                    player.body.velocity.y = -200;
                }

                else if (facing === 'down' && !player.body.blocked.down) {
                    player.body.velocity.y = 200;

                } else {
                    player.body.velocity.x = 0;
                    player.body.velocity.y = 0;

                    if (facing != 'idle')
                    {
                        player.animations.stop();
                    }
                }

        } else {
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

                if (facing != 'up')
                {
                    player.animations.play('up');
                    facing = 'up';
                }
            }
            else if (cursors.down.isDown)
            {
                player.body.velocity.y = 200;

                if (facing != 'down')
                {
                    player.animations.play('down');
                    facing = 'down';
                }
            }
            else
            {
                if (facing != 'idle')
                {
                    player.animations.stop();
                }
            }
        }
        
        if (map.getTileWorldXY(player.x, player.y, map.tileWidth, map.tileHeight, ice) && player.body.velocity.x === 0
            &&  player.body.velocity.y === 0) {
                colliding = false;
        }

        if (player.x > 636 && player.y < 70) {
            music.stop();

            var text = game.add.text(game.width / 2, game.height / 2, 'Success!');
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
    }

    function createMap() {
        map = game.add.tilemap('DA4');
    
        map.addTilesetImage('ice', 'tileset1');
        map.addTilesetImage('ice2', 'tileset2');

        ice = map.createLayer('Ice');
        background = map.createLayer('Background');
        rocks = map.createLayer('Rocks');
        snow = map.createLayer('Snow');
           
        map.setCollisionBetween(1, 3000, true, 'Rocks');

        background.resizeWorld();
    }

    function createPlayer() {
        player = game.add.sprite(30, 525, 'player');

        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.setSize(16, 16, 5, 16);
        player.scale.setTo(1.5, 1.5);
    
        player.animations.add('left', [3, 6, 9], 5, true);
        //player.animations.add('turn', [4], 20, true);
        player.animations.add('right', [1, 4, 7], 5, true);
        player.animations.add('up', [0, 2, 10], 5, true);
        player.animations.add('down', [5, 8, 11], 5, true);
    
        game.camera.follow(player);
    }

    function collision (player, rocks) {
        player.animations.stop();
        colliding = true;
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        game.input.enabled = true;
    }

    function slide (player, rocks) {
        colliding = false;
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
    }
    
    function render () {
        game.debug.bodyInfo(player, 32, 32);
    }
};
