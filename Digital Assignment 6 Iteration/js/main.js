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
        game.load.spritesheet('person', 'assets/Hikers_overworlds.png', 31.6, 32);
        game.load.spritesheet('monster', 'assets/werewolf.png', 49.3, 49.2);
        game.load.audio('music', 'assets/Castlevania NES Music_ Stalker.mp3');
        game.load.audio('growl', 'assets/Werewolf Growl.mp3');
    
    }
    
    var map;
    
    var background;
    var grass;
    var trees;
    var rocks;

    var person;
    var monster;

    var music;
    var growl;

    var current_player;
    var person_turns;
    var monster_turns;
    var timeLeftText;
    var personTimeText;

    var timeLeft = 60;
    var turnsLeft = 0;
    var time = 3;

    var personsTurn = true;
    var eaten = false;

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
        createPerson();
        createMonster();

        game.physics.arcade.enable(trees);
        game.physics.arcade.enable(rocks);
        
        music = game.add.audio('music');
        music.loop = true;

        growl = game.add.audio('growl');
    
        cursors = game.input.keyboard.createCursorKeys();

        w = game.input.keyboard.addKey(Phaser.Keyboard.W);
        a = game.input.keyboard.addKey(Phaser.Keyboard.A);
        s = game.input.keyboard.addKey(Phaser.Keyboard.S);
        d = game.input.keyboard.addKey(Phaser.Keyboard.D);
        
        turnsLeft = game.rnd.integerInRange(1, 6);

        createTimer();
        createTurnsText();

        music.play();
    }
    
    function update() {
        game.physics.arcade.collide(person, trees);
        game.physics.arcade.collide(person, rocks);

        game.physics.arcade.collide(monster, trees);
	    game.physics.arcade.collide(monster, rocks);
        
        game.physics.arcade.collide(person, monster);

        if (personsTurn) {

            person_turns.text = 'Moves: ' + turnsLeft;

            if (turnsLeft > 0 && time > 0) {

                if (cursors.left.isDown) {
                    cursors.left.isDown = false;

                    if (!map.getTileWorldXY(person.x - 32, person.y, map.tileWidth, map.tileHeight, trees)) {
                        if (map.getTileWorldXY(person.x - 32, person.y, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(person.x - 64, person.y, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(person.x - 64, person.y, map.tileWidth, map.tileHeight, trees) && turnsLeft >= 2) {
                            var x = person.x;
                            person.x = x - 64;

                            if (facing != 'left') {
                                person.animations.play('left');
                                facing = 'left';
                            }

                            turnsLeft -= 2;
                            person_turns.text = 'Moves: ' + turnsLeft;
                        } else if (map.getTileWorldXY(person.x - 32, person.y, map.tileWidth, map.tileHeight, rocks) && map.getTileWorldXY(person.x - 64, person.y, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(person.x - 96, person.y, map.tileWidth, map.tileHeight, trees) && turnsLeft >= 4) {
                            var x = person.x;
                            person.x = x - 96;

                            //if (facing != 'left') {
                                person.animations.play('left');
                                facing = 'left';
                            //}

                            turnsLeft -= 4;
                            person_turns.text = 'Moves: ' + turnsLeft;
                        } else if (!map.getTileWorldXY(person.x - 32, person.y, map.tileWidth, map.tileHeight, rocks)){

                            var x = person.x;
                            person.x = x - 32;
                
                            //if (facing != 'left') {
                                person.animations.play('left');
                                facing = 'left';
                            //}

                            turnsLeft--;
                            person_turns.text = 'Moves: ' + turnsLeft;
                        }
                    }
                } else if (cursors.right.isDown) {
                    cursors.right.isDown = false;
                        
                    if (!map.getTileWorldXY(person.x + 32, person.y, map.tileWidth, map.tileHeight, trees)) {
                        if (map.getTileWorldXY(person.x + 32, person.y, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(person.x + 64, person.y, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(person.x + 64, person.y, map.tileWidth, map.tileHeight, trees) && turnsLeft >= 2) {
                            var x = person.x;
                            person.x = x + 64;

                            //if (facing != 'right') {
                                person.animations.play('right');
                                facing = 'right';
                            //}

                            turnsLeft -= 2;
                            person_turns.text = 'Moves: ' + turnsLeft;
                        } else if (map.getTileWorldXY(person.x + 32, person.y, map.tileWidth, map.tileHeight, rocks) && map.getTileWorldXY(person.x + 64, person.y, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(person.x + 96, person.y, map.tileWidth, map.tileHeight, trees) && turnsLeft >= 4) {
                            var x = person.x;
                            person.x = x + 96;

                            //if (facing != 'right') {
                                person.animations.play('right');
                                facing = 'right';
                            //}

                            turnsLeft -= 4;
                            person_turns.text = 'Moves: ' + turnsLeft;
                        } else if (!map.getTileWorldXY(person.x + 32, person.y, map.tileWidth, map.tileHeight, rocks)){

                            var x = person.x;
                            person.x = x + 32;
                
                            //if (facing != 'right') {
                                person.animations.play('right');
                                facing = 'right';
                            //}

                            turnsLeft--;
                            person_turns.text = 'Moves: ' + turnsLeft;
                        }
                    }
                } else if (cursors.up.isDown) {
                    cursors.up.isDown = false;

                    if (!map.getTileWorldXY(person.x, person.y - 32, map.tileWidth, map.tileHeight, trees)) {
                        if (map.getTileWorldXY(person.x, person.y - 32, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(person.x, person.y - 64, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(person.x, person.y - 64, map.tileWidth, map.tileHeight, trees) && turnsLeft >= 2) {
                            var y = person.y;
                            person.y = y - 64;

                            //if (facing != 'up') {
                                person.animations.play('up');
                                facing = 'up';
                            //}

                            turnsLeft -= 2;
                            person_turns.text = 'Moves: ' + turnsLeft;
                        } else if (map.getTileWorldXY(person.x, person.y - 32, map.tileWidth, map.tileHeight, rocks) && map.getTileWorldXY(person.x, person.y - 64, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(person.x, person.y - 96, map.tileWidth, map.tileHeight, trees) && turnsLeft >= 4) {
                            var y = person.y;
                            person.y = y - 96;

                            //if (facing != 'up') {
                                person.animations.play('up');
                                facing = 'up';
                            //}

                            turnsLeft -= 4;
                            person_turns.text = 'Moves: ' + turnsLeft;
                        } else if (!map.getTileWorldXY(person.x, person.y - 32, map.tileWidth, map.tileHeight, rocks)){

                            var y = person.y;
                            person.y = y - 32;
                
                            //if (facing != 'up') {
                                person.animations.play('up');
                                facing = 'up';
                            //}

                            turnsLeft--;
                            person_turns.text = 'Moves: ' + turnsLeft;
                        }
                    }
                } else if (cursors.down.isDown) {
                    cursors.down.isDown = false;
                        
                    if (!map.getTileWorldXY(person.x, person.y + 32, map.tileWidth, map.tileHeight, trees)) {
                        if (map.getTileWorldXY(person.x, person.y + 32, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(person.x, person.y + 64, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(person.x, person.y + 64, map.tileWidth, map.tileHeight, trees) && turnsLeft >= 2) {
                            var y = person.y;
                            person.y = y + 64;

                            //if (facing != 'down') {
                                person.animations.play('down');
                                facing = 'down';
                            //}

                            turnsLeft -= 2;
                            person_turns.text = 'Moves: ' + turnsLeft;
                        } else if (map.getTileWorldXY(person.x, person.y + 32, map.tileWidth, map.tileHeight, rocks) && map.getTileWorldXY(person.x, person.y + 64, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(person.x, person.y + 96, map.tileWidth, map.tileHeight, trees) && turnsLeft >= 4) {
                            var y = person.y;
                            person.y = y + 96;

                            //if (facing != 'down') {
                                person.animations.play('down');
                                facing = 'down';
                            //}

                            turnsLeft -= 4;
                            person_turns.text = 'Moves: ' + turnsLeft;
                        } else if (!map.getTileWorldXY(person.x, person.y + 32, map.tileWidth, map.tileHeight, rocks)){

                            var y = person.y;
                            person.y = y + 32;
                
                            //if (facing != 'down') {
                                person.animations.play('down');
                                facing = 'down';
                            //}

                            turnsLeft--;
                            person_turns.text = 'Moves: ' + turnsLeft;
                        }
                    }
                } else {
                        if (facing != 'idle') {
                            person.animations.stop();
                        }
                    }

                } else {
                    person.animations.stop();
                    switchPlayers();
                }
            } else {
                monster_turns.text = 'Moves: ' + turnsLeft;

                if (turnsLeft > 0) {
                    if (a.isDown)
                    {
                        a.isDown = false;

                        if (!map.getTileWorldXY(monster.x - 32, monster.y, map.tileWidth, map.tileHeight, trees) && !map.getTileWorldXY(monster.x - 32, monster.y, map.tileWidth, map.tileHeight, rocks)) {
                            //if (map.getTileWorldXY(monster.x - 32, monster.y, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(monster.x - 64, monster.y, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(monster.x - 64, monster.y, map.tileWidth, map.tileHeight, trees) && turnsLeft >= 2) {
                                var x = monster.x;
                                monster.x = x - 32;
    
                                if (facing2 != 'left2') {
                                    monster.animations.play('left2');
                                    facing2 = 'left2';
                                }
    
                                turnsLeft -= 1;
                                monster_turns.text = 'Moves: ' + turnsLeft;
                        }
                    }
                    else if (d.isDown)
                    {
                        d.isDown = false;
                        
                        if (!map.getTileWorldXY(monster.x + 32, monster.y, map.tileWidth, map.tileHeight, trees) && !map.getTileWorldXY(monster.x + 32, monster.y, map.tileWidth, map.tileHeight, rocks)) {  
                                var x = monster.x;
                                monster.x = x + 32;
                    
                                //if (facing2 != 'right2') {
                                    monster.animations.play('right2');
                                    facing2 = 'right2';
                                //}
    
                                turnsLeft--;
                                monster_turns.text = 'Moves: ' + turnsLeft;
                        }
                    }
                    else if (w.isDown)
                    {
                        w.isDown = false;
                        if (!map.getTileWorldXY(monster.x, monster.y - 32, map.tileWidth, map.tileHeight, trees)) {
                            if (map.getTileWorldXY(monster.x, monster.y - 32, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(monster.x, monster.y - 64, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(monster.x, monster.y - 64, map.tileWidth, map.tileHeight, trees) && turnsLeft >= 2) {
                                var y = monster.y;
                                monster.y = y - 64;
    
                                //if (facing2 != 'up2') {
                                    monster.animations.play('up2');
                                    facing2 = 'up2';
                                //}
    
                                turnsLeft -= 2;
                                monster_turns.text = 'Moves: ' + turnsLeft;
                            } else if (map.getTileWorldXY(monster.x, monster.y - 32, map.tileWidth, map.tileHeight, rocks) && map.getTileWorldXY(monster.x, monster.y - 64, map.tileWidth, map.tileHeight, rocks) && !map.getTileWorldXY(monster.x, monster.y - 96, map.tileWidth, map.tileHeight, trees) && turnsLeft >= 4) {
                                var y = monster.y;
                                monster.y = y - 96;
    
                                //if (facing2 != 'up2') {
                                    monster.animations.play('up2');
                                    facing2 = 'up2';
                                //}
    
                                turnsLeft -= 4;
                                monster_turns.text = 'Moves: ' + turnsLeft;
                            } else if (!map.getTileWorldXY(monster.x, monster.y - 32, map.tileWidth, map.tileHeight, rocks)){
    
                                var y = monster.y;
                                monster.y = y - 32;
                    
                                //if (facing2 != 'up2') {
                                    monster.animations.play('up2');
                                    facing2 = 'up2';
                                //}
    
                                turnsLeft--;
                                monster_turns.text = 'Moves: ' + turnsLeft;
                            }
                        }
                    }
                    else if (s.isDown)
                    {
                        s.isDown = false;
                        
                        if (!map.getTileWorldXY(monster.x, monster.y + 32, map.tileWidth, map.tileHeight, trees) && !map.getTileWorldXY(monster.x, monster.y + 32, map.tileWidth, map.tileHeight, rocks)) {
                                var y = monster.y;
                                monster.y = y + 32;
                    
                                //if (facing2 != 'down2') {
                                    monster.animations.play('down2');
                                    facing2 = 'down2';
                                //}
    
                                turnsLeft--;
                                monster_turns.text = 'Moves: ' + turnsLeft;
                        }
                    }
                    else
                    {
                        if (facing2 != 'idle')
                        {
                            monster.animations.stop();
                        }
                    }
                } else {
                    monster.animations.stop();
                    switchPlayers();
                }
            }
        

        if (Math.abs(person.x - monster.x) < 20 && Math.abs(person.y - monster.y) < 20) {
            music.stop();

            if (!eaten) {
                growl.play();
            }
            
            person.kill();
            eaten = true;

            person_turns.kill();
            monster_turns.kill();
            timeLeftText.kill();

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

        if (timeLeft === 0) {
            music.stop();

            monster.kill();

            person_turns.kill();
            monster_turns.kill();
            timeLeftText.kill();

            var text = game.add.text(game.width / 2, game.height / 2, 'The Hunted wins!');
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

        grass = map.createLayer('Grass');
        background = map.createLayer('Background');
        trees = map.createLayer('Trees');
        rocks = map.createLayer('Rocks');
        
        map.setCollisionBetween(1, 3000, true, 'Trees');
        map.setCollisionBetween(1, 3000, true, 'Rocks');

        grass.resizeWorld();
    }

    function createPerson() {
        person = game.add.sprite(752, 32, 'person');

        game.physics.arcade.enable(person);
        person.body.collideWorldBounds = true;
        //person.body.setSize(16, 16, 5, 16);
        person.scale.setTo(1.5, 1.5);
        person.anchor.setTo(0.5, 0.5);
    
        person.animations.add('left', [3, 6, 9], 5, true);
        //person.animations.add('turn', [4], 20, true);
        person.animations.add('right', [1, 4, 7], 5, true);
        person.animations.add('up', [0, 2, 10], 5, true);
        person.animations.add('down', [5, 8, 11], 5, true);

        person.animations.play('down');
    }

    function createMonster() {
        monster = game.add.sprite(52, 35, 'monster');
        game.physics.arcade.enable(monster);
        monster.body.collideWorldBounds = true;
        //monster.body.setSize(24, 24, 5, 16);
        monster.anchor.setTo(0.5, 0.5);
    
        monster.animations.add('left2', [0, 7, 15, 24], 5, true);
        //person.animations.add('turn', [4], 20, true);
        monster.animations.add('right2', [2, 9, 17, 26], 5, true);
        monster.animations.add('up2', [3, 10, 18, 27], 5, true);
        monster.animations.add('down2', [1, 8, 16, 25], 5, true);

        monster.animations.play('down2');
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
            turnsLeft = game.rnd.integerInRange(2, 6);
        } else {
            var message = game.add.text(game.width / 2, game.height / 2, 'The Hunted' + 's turn!', { fontSize: '28px', fill: '#000' });
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

    function createTimer() {
        timeLeftText = game.add.text(game.width / 2, 20, 'Time remaining: 60');
        timeLeftText.align = 'center';
        timeLeftText.fixedToCamera = true;
        timeLeftText.anchor.setTo(0.5, 0.5);

        timeLeftText.font = 'Arial Black';
        timeLeftText.fontSize = 24;
        timeLeftText.fontWeight = 'bold';

        timeLeftText.stroke = '#000000';
        timeLeftText.strokeThickness = 6;
        timeLeftText.fill = '#FFFFFF';

        //custom timer code from http://phaser.io/examples/v2/time/basic-looped-event
        game.time.events.loop(Phaser.Timer.SECOND, updateTimeLeft, this);
    }

    function updateTimeLeft() {
        if (!eaten && !personsTurn) {
            timeLeft--;
        }
        timeLeftText.text = 'Time remaining: ' + timeLeft;
    }

    function createTurnsText() {
        person_turns = game.add.text(725, 585, 'Moves: ' + turnsLeft, { fontSize: '24px', fill: '#000' });
        person_turns.fixedToCamera = true;
        person_turns.anchor.setTo(0.5, 0.5);

        person_turns.font = 'Arial Black';
        person_turns.fontWeight = 'bold';

        person_turns.stroke = '#000000';
        person_turns.strokeThickness = 6;
        person_turns.fill = '#FFFFFF';

        monster_turns = game.add.text(70, 585, 'Moves: 0', { fontSize: '24px', fill: '#000' });
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
