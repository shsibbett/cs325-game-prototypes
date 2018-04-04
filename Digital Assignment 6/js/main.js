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
    
        game.load.tilemap('DA6', 'assets/DA6v2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset1', 'assets/dark_forest.png');
        game.load.image('tileset2', 'assets/light_forest.png');
        //game.load.image('tileset3', 'assets/!TS_WATER tp tile sheet.png');
        game.load.spritesheet('player', 'assets/Hikers_overworlds.png', 31.6, 32);
        game.load.spritesheet('enemy', 'assets/MainGuySpriteSheet.png', 41.3, 36);
        //game.load.image('flag', 'assets/b6fdc68bf6bdd78.png');
        //game.load.image('tent', 'assets/TentFF1.png');
        //game.load.audio('music', 'assets/Pokemon- Heart Gold and Soul Silver- Ice PathCave- Music.mp3');
        //game.load.audio('crack', 'assets/crack.mp3');
    
    }
    
    var map;
    
    var background;
    var grass;
    var trees;
    var rocks;

    var player;
    var enemy;

    //var music;

    var current_player;
    var person_turns;
    var monster_turns;
    var turnsLeft = 0;

    var personsTurn = true;
    //var monstersTurn = false;

    var facing = 'down';
    var facing2 = 'down2';
    
    var cursors;

    var w;
    var a;
    var s;
    var d;
    
    
    function create() {
    
        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        createMap();
        createPlayer();
        createEnemy();

        game.physics.arcade.enable(trees);
        game.physics.arcade.enable(rocks);
        
        //music = game.add.audio('music');
        //music.loop = true;
    
        cursors = game.input.keyboard.createCursorKeys();

        w = game.input.keyboard.addKey(Phaser.Keyboard.W);
        a = game.input.keyboard.addKey(Phaser.Keyboard.A);
        s = game.input.keyboard.addKey(Phaser.Keyboard.S);
        d = game.input.keyboard.addKey(Phaser.Keyboard.D);
        
        turnsLeft = game.rnd.integerInRange(1, 6);

        createTurnsText();
        //music.play();
    }
    
    function update() {
        game.physics.arcade.collide(player, trees);
        game.physics.arcade.collide(player, rocks);

        game.physics.arcade.collide(enemy, trees);
	    game.physics.arcade.collide(enemy, rocks);
        
        game.physics.arcade.collide(player, enemy);

        if (personsTurn) {
            person_turns.text = 'Turns: ' + turnsLeft;

            if (turnsLeft > 0) {

                if (cursors.left.isDown) {
                    cursors.left.isDown = false;

                    if (!map.getTileWorldXY(player.x - 32, player.y, map.tileWidth, map.tileHeight, trees)) {
                        if (map.getTileWorldXY(player.x - 32, player.y, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(player.x - 64, player.y, map.tileWidth, map.tileHeight, trees) && turnsLeft >= 2) {
                            var x = player.x;
                            player.x = x - 64;

                            if (facing != 'left') {
                                player.animations.play('left');
                                facing = 'left';
                            }

                            turnsLeft -= 2;
                            person_turns.text = 'Turns: ' + turnsLeft;
                        } else if (!map.getTileWorldXY(player.x - 32, player.y, map.tileWidth, map.tileHeight, rocks)){

                            var x = player.x;
                            player.x = x - 32;
                
                            if (facing != 'left') {
                                player.animations.play('left');
                                facing = 'left';
                            }

                            turnsLeft--;
                            person_turns.text = 'Turns: ' + turnsLeft;
                        }
                    }
                } else if (cursors.right.isDown) {
                    cursors.right.isDown = false;
                        
                    if (!map.getTileWorldXY(player.x + 32, player.y, map.tileWidth, map.tileHeight, trees)) {
                        if (map.getTileWorldXY(player.x + 32, player.y, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(player.x + 64, player.y, map.tileWidth, map.tileHeight, trees) && turnsLeft >= 2) {
                            var x = player.x;
                            player.x = x + 64;

                            if (facing != 'right') {
                                player.animations.play('right');
                                facing = 'right';
                            }

                            turnsLeft -= 2;
                            person_turns.text = 'Turns: ' + turnsLeft;
                        } else if (!map.getTileWorldXY(player.x + 32, player.y, map.tileWidth, map.tileHeight, rocks)) {
                            var x = player.x;
                            player.x = x + 32;
                
                            if (facing != 'right') {
                                player.animations.play('right');
                                facing = 'right';
                            }

                            turnsLeft--;
                            person_turns.text = 'Turns: ' + turnsLeft;
                        }
                    }
                } else if (cursors.up.isDown) {
                    cursors.up.isDown = false;

                    if (!map.getTileWorldXY(player.x, player.y - 32, map.tileWidth, map.tileHeight, trees)) {
                        if (map.getTileWorldXY(player.x, player.y - 32, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(player.x, player.y - 64, map.tileWidth, map.tileHeight, trees) && turnsLeft >= 2) {
                            var y = player.y;
                            player.y = y - 64;

                            if (facing != 'right') {
                                player.animations.play('right');
                                facing = 'right';
                            }

                            turnsLeft -= 2;
                            person_turns.text = 'Turns: ' + turnsLeft;
                        } else if (!map.getTileWorldXY(player.x, player.y - 32, map.tileWidth, map.tileHeight, rocks)) {
                            var y = player.y;
                            player.y = y - 32; 

                            if (facing != 'up') {
                                player.animations.play('up');
                                facing = 'up';
                            }

                            turnsLeft--;
                            person_turns.text = 'Turns: ' + turnsLeft;
                        }
                    }
                } else if (cursors.down.isDown) {
                    cursors.down.isDown = false;
                        
                    if (!map.getTileWorldXY(player.x, player.y + 32, map.tileWidth, map.tileHeight, trees)) {
                        if (map.getTileWorldXY(player.x, player.y + 32, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(player.x, player.y + 64, map.tileWidth, map.tileHeight, trees) && turnsLeft >= 2) {
                            var y = player.y;
                            player.y = y + 64;

                            if (facing != 'right') {
                                player.animations.play('right');
                                facing = 'right';
                            }

                            turnsLeft -= 2;
                            person_turns.text = 'Turns: ' + turnsLeft;
                        } else if (!map.getTileWorldXY(player.x, player.y + 32, map.tileWidth, map.tileHeight, rocks)) {
                            var y = player.y;
                            player.y = y + 32;

                            if (facing != 'down') {
                                player.animations.play('down');
                                facing = 'down';
                            }

                            turnsLeft--;
                            person_turns.text = 'Turns: ' + turnsLeft;
                        }
                    }
                } else {
                        if (facing != 'idle') {
                            player.animations.stop();
                        }
                    }

                } else {
                    player.animations.stop();
                    switchPlayers();
                }
            } else {
                monster_turns.text = 'Turns: ' + turnsLeft;

                if (turnsLeft > 0) {
                    if (a.isDown)
                    {
                        a.isDown = false;

                        if (!map.getTileWorldXY(enemy.x - 32, enemy.y, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(enemy.x - 32, enemy.y, map.tileWidth, map.tileHeight, trees)) {
                            var x = enemy.x;
                            enemy.x = x - 32;
                
                            if (facing2 != 'left2')
                            {
                                enemy.animations.play('left2');
                                facing2 = 'left2';
                            }
                            
                            turnsLeft--;
                            monster_turns.text = 'Turns: ' + turnsLeft;
                        }
                    }
                    else if (d.isDown)
                    {
                        d.isDown = false;
                        
                        if (!map.getTileWorldXY(enemy.x + 32, enemy.y, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(enemy.x + 32, enemy.y, map.tileWidth, map.tileHeight, trees)) {
                            var x = enemy.x;
                            enemy.x = x + 32;
                
                            if (facing2 != 'right2')
                            {
                                enemy.animations.play('right2');
                                facing2 = 'right2';
                            }

                            turnsLeft--;
                            monster_turns.text = 'Turns: ' + turnsLeft;
                        }
                    }
                    else if (w.isDown)
                    {
                        w.isDown = false;

                        if (!map.getTileWorldXY(enemy.x, enemy.y -32, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(enemy.x, enemy.y - 32, map.tileWidth, map.tileHeight, trees)) {
                            var y = enemy.y;
                            enemy.y = y - 32; 

                            if (facing2 != 'up2')
                            {
                                enemy.animations.play('up2');
                                facing2 = 'up2';
                            }

                            turnsLeft--;
                            monster_turns.text = 'Turns: ' + turnsLeft;
                        }
                    }
                    else if (s.isDown)
                    {
                        s.isDown = false;
                        
                        if (!map.getTileWorldXY(enemy.x, enemy.y + 32, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(enemy.x, enemy.y + 32, map.tileWidth, map.tileHeight, trees)) {
                            var y = enemy.y;
                            enemy.y = y + 32;

                            if (facing2 != 'down2')
                            {
                                enemy.animations.play('down2');
                                facing2 = 'down2';
                            }

                            turnsLeft--;
                            monster_turns.text = 'Turns: ' + turnsLeft;
                        }
                    }
                    else
                    {
                        if (facing2 != 'idle')
                        {
                            enemy.animations.stop();
                        }
                    }
                } else {
                    enemy.animations.stop();
                    switchPlayers();
                }
            }
        

        if (Math.abs(player.x - enemy.x) < 20 && Math.abs(player.y - enemy.y) < 20) {
            //music.stop();

            player.kill();

            var text = game.add.text(game.width / 2, game.height / 2, 'Monster wins!');
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
        map = game.add.tilemap('DA6');
    
        map.addTilesetImage('Picture1', 'tileset1');
        map.addTilesetImage('light_forest', 'tileset2');
        //map.addTilesetImage('water', 'tileset3');

        grass = map.createLayer('Grass');
        background = map.createLayer('Background');
        trees = map.createLayer('Trees');
        rocks = map.createLayer('Rocks');
        //snow = map.createLayer('Snow');
        //background = map.createLayer('Background 2');
        
        map.setCollisionBetween(1, 3000, true, 'Trees');
        map.setCollisionBetween(1, 3000, true, 'Rocks');

        grass.resizeWorld();
    }

    function createPlayer() {
        player = game.add.sprite(752, 32, 'player');

        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        //player.body.setSize(16, 16, 5, 16);
        player.scale.setTo(1.5, 1.5);
        player.anchor.setTo(0.5, 0.5);
    
        player.animations.add('left', [3, 6, 9], 5, true);
        //player.animations.add('turn', [4], 20, true);
        player.animations.add('right', [1, 4, 7], 5, true);
        player.animations.add('up', [0, 2, 10], 5, true);
        player.animations.add('down', [5, 8, 11], 5, true);
    }

    function createEnemy() {
        enemy = game.add.sprite(52, 35, 'enemy');
        game.physics.arcade.enable(enemy);
        enemy.body.collideWorldBounds = true;
        //enemy.body.setSize(24, 24, 5, 16);
        enemy.anchor.setTo(0.5, 0.5);
    
        enemy.animations.add('left2', [9, 10, 11], 5, true);
        //player.animations.add('turn', [4], 20, true);
        enemy.animations.add('right2', [3, 4, 5], 5, true);
        enemy.animations.add('up2', [6, 7, 8], 5, true);
        enemy.animations.add('down2', [0, 1, 2], 5, true);
    }

    function switchPlayers() {
        if (personsTurn) {
            var message = game.add.text(game.width / 2, game.height / 2, 'Monster' + 's turn!', { fontSize: '28px', fill: '#000' });
            message.fixedToCamera = true;
            message.anchor.setTo(0.5, 0.5);
            message.alpha = 1;

            message.font = 'Arial Black';
            message.fontWeight = 'bold';

            message.stroke = '#000000';
            message.strokeThickness = 6;
            message.fill = '#FFFFFF';
        
            //alpha text tween code from https://phaser.io/examples/v2/tweens/alpha-text
            var fadeIn = game.add.tween(message).to( { alpha: 1 }, 250, "Linear", true);
            var fadeOut = game.add.tween(message).to( { alpha: 0 }, 250, "Linear", true);
        
            //tween chain code from https://phaser.io/examples/v2/tweens/chained-tweens
            fadeIn.chain(fadeOut);
            fadeIn.start();

            personsTurn = false;
            turnsLeft = game.rnd.integerInRange(1, 6);
        } else {
            var message = game.add.text(game.width / 2, game.height / 2, 'Person' + 's turn!', { fontSize: '28px', fill: '#000' });
            message.fixedToCamera = true;
            message.anchor.setTo(0.5, 0.5);
            message.alpha = 1;

            message.font = 'Arial Black';
            message.fontWeight = 'bold';

            message.stroke = '#000000';
            message.strokeThickness = 6;
            message.fill = '#FFFFFF';
            
            //alpha text tween code from https://phaser.io/examples/v2/tweens/alpha-text
            var fadeIn = game.add.tween(message).to( { alpha: 1 }, 250, "Linear", true);
            var fadeOut = game.add.tween(message).to( { alpha: 0 }, 250, "Linear", true);
            
            //tween chain code from https://phaser.io/examples/v2/tweens/chained-tweens
            fadeIn.chain(fadeOut);
            fadeIn.start();

            personsTurn = true;
            turnsLeft = game.rnd.integerInRange(1, 6);
        }
    }

    function createTurnsText() {
        person_turns = game.add.text(725, 585, 'Turns: ' + turnsLeft, { fontSize: '24px', fill: '#000' });
        person_turns.fixedToCamera = true;
        person_turns.anchor.setTo(0.5, 0.5);

        person_turns.font = 'Arial Black';
        person_turns.fontWeight = 'bold';

        person_turns.stroke = '#000000';
        person_turns.strokeThickness = 6;
        person_turns.fill = '#FFFFFF';

        monster_turns = game.add.text(70, 585, 'Turns: ' + turnsLeft, { fontSize: '24px', fill: '#000' });
        monster_turns.fixedToCamera = true;
        monster_turns.anchor.setTo(0.5, 0.5);

        monster_turns.font = 'Arial Black';
        monster_turns.fontWeight = 'bold';

        monster_turns.stroke = '#000000';
        monster_turns.strokeThickness = 6;
        monster_turns.fill = '#FFFFFF';
    }
    
    function render () {

    }
};
