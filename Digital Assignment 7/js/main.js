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
    
    var game = new Phaser.Game(1634, 801, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

    function preload() {
    
        game.load.tilemap('DA7', 'assets/DA7.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset1', 'assets/light_forest.png');
        game.load.image('tileset2', 'assets/castle_greystone_exterior_02.png');
        game.load.image('tileset3', 'assets/pokemon.png');
        game.load.image('shrub', 'assets/shrub.png');
        game.load.image('corpse', 'assets/corpse.png');
        game.load.image('black_box', 'assets/BlackBox.jpg');
        game.load.audio('music', 'assets/Plants vs. Zombies (Main Theme).mp3');
        game.load.audio('digging', 'assets/digging.mp3');
        game.load.audio('build', 'assets/build.mp3');
        game.load.audio('zombie_attack', 'assets/zombies.mp3');
        game.load.audio('drag_corpse', 'assets/drag_corpse.mp3');
        game.load.audio('dead', 'assets/game_over.mp3');
    }
    
    var map;
    
    var grass;
    var ground;
    var walls;

    var cell_block_ruins;
    var guard_tower_ruins;
    var radio_station_ruins;
    var armory_ruins;
    var food_storage_ruins;
    var lookout_tower_ruins;

    var cell_block;
    var guard_tower;
    var radio_station;
    var armory;
    var food_storage;
    var lookout_tower;

    var shrubs;
    var corpses;
    var selectedCorpse;

    var guard_tower_shrubs = 1;
    var food_storage_shrubs = 2;
    var radio_station_shrubs = 2;
    var lookout_tower_shrubs = 3;
    var armory_shrubs = 3;
    var cell_block_shrubs = 8;

    var music;
    var dig;
    var build;
    var zombie_attack;
    var drag_corpse;
    var dead;

    var building = '';
    var description = '';
    var effect = '';
    var cost = '';
    var shrubs_to_remove = '';
    var facility_box;

    var survivors = 10;
    var hours;
    var resources_box;

    var armory_repaired = false;
    var food_storage_repaired = false;
    var guard_tower_repaired = false;
    var lookout_tower_repaired = false;
    var radio_station_repaired = false;
    var cell_block_repaired = false;
    var movingCorpses = false;
    var game_over = false;

    var zombies;
    var zLower = 25;
    var zUpper = 45;
    var ratio;
    var casualties;
    var guarding = false;
    
    var count = 0;
    var corpsesRemoved = 0;

    var guard_button;
    var guard;

    var cursors;

    var enter;    
    
    function create() {
    
        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        createMap();
        createShrubs();
        createCorpses();

        resources_box = new Phaser.Rectangle(25, 730, 200, 75);
        guard_button = new Phaser.Rectangle(25, 730, 200, 50);

        hours = game.rnd.integerInRange(7, 12);

        cursors = game.input.keyboard.createCursorKeys();

        enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        music = game.add.audio('music');
        music.loop = true;
        music.volume -= 0.9;

        dig = game.add.audio('digging');
        dig.volume -= 0.9;

        build = game.add.audio('build');
        build.volume -= 0.9;

        zombie_attack = game.add.audio('zombie_attack');
        zombie_attack.volume -= 0.9;

        drag_corpse = game.add.audio('drag_corpse');
        drag_corpse.volume -= 0.5;

        dead = game.add.audio('dead');
        dead.volume -= 0.9;

        music.play();
    }
    
    function update() {
        if (enter.isDown) {
            movingCorpses = false;
        }

        if (movingCorpses) {
            if (cursors.up.isDown) {
                drag_corpse.play();
                cursors.up.isDown = false;
                if ((!map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y - 64, map.tileWidth, map.tileHeight, guard_tower_ruins) && !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y - 64, map.tileWidth, map.tileHeight, guard_tower) &&
                    !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y - 64, map.tileWidth, map.tileHeight, lookout_tower_ruins) && !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y - 64, map.tileWidth, map.tileHeight, lookout_tower) &&
                    !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y - 64, map.tileWidth, map.tileHeight, food_storage_ruins) && !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y - 64, map.tileWidth, map.tileHeight, food_storage) &&
                    !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y - 64, map.tileWidth, map.tileHeight, armory_ruins) && !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y - 64, map.tileWidth, map.tileHeight, armory) && 
                    !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y - 64, map.tileWidth, map.tileHeight, radio_station_ruins) && !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y - 64, map.tileWidth, map.tileHeight, radio_station) && 
                    !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y - 64, map.tileWidth, map.tileHeight, cell_block_ruins) && !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y - 64, map.tileWidth, map.tileHeight, cell_block) &&
                    !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y - 30, map.tileWidth, map.tileHeight, walls))) {
                        hours -= 1;
                        selectedCorpse.y -= 64;
                } else if (map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y - 64, map.tileWidth, map.tileHeight, grass)) {
                    hours -= 1;
                    selectedCorpse.x -= 64;
                    corpses.remove(selectedCorpse);
                    movingCorpses = false;
                    corpsesRemoved++;
                }
    
            } else if (cursors.down.isDown) {
                drag_corpse.play();
                cursors.down.isDown = false;
                if ((!map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y + 48, map.tileWidth, map.tileHeight, guard_tower_ruins) && !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y + 48, map.tileWidth, map.tileHeight, guard_tower) &&
                    !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y + 48, map.tileWidth, map.tileHeight, lookout_tower_ruins) && !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y + 48, map.tileWidth, map.tileHeight, lookout_tower) &&
                    !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y + 48, map.tileWidth, map.tileHeight, food_storage_ruins) && !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y + 48, map.tileWidth, map.tileHeight, food_storage) && 
                    !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y + 48, map.tileWidth, map.tileHeight, armory_ruins) && !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y + 48, map.tileWidth, map.tileHeight, armory) && 
                    !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y + 48, map.tileWidth, map.tileHeight, radio_station_ruins) && !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y + 48, map.tileWidth, map.tileHeight, radio_station) &&
                    !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y + 48, map.tileWidth, map.tileHeight, cell_block_ruins) && !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y + 48, map.tileWidth, map.tileHeight, cell_block) && 
                    !map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y + 86, map.tileWidth, map.tileHeight, walls))) {
                        hours -= 1;
                        selectedCorpse.y += 64;
                } else if (map.getTileWorldXY(selectedCorpse.x, selectedCorpse.y + 64, map.tileWidth, map.tileHeight, grass)) {
                    hours -= 1;
                    selectedCorpse.y += 64;
                    corpses.remove(selectedCorpse);
                    movingCorpses = false;
                    corpsesRemoved++;
                }
    
            } else if (cursors.left.isDown) {
                drag_corpse.play();
                cursors.left.isDown = false;
                if ((!map.getTileWorldXY(selectedCorpse.x - 64, selectedCorpse.y, map.tileWidth, map.tileHeight, guard_tower_ruins) && !map.getTileWorldXY(selectedCorpse.x - 64, selectedCorpse.y, map.tileWidth, map.tileHeight, guard_tower) &&
                    !map.getTileWorldXY(selectedCorpse.x - 64, selectedCorpse.y, map.tileWidth, map.tileHeight, lookout_tower_ruins) && !map.getTileWorldXY(selectedCorpse.x - 64, selectedCorpse.y, map.tileWidth, map.tileHeight, lookout_tower) &&
                    !map.getTileWorldXY(selectedCorpse.x - 64, selectedCorpse.y, map.tileWidth, map.tileHeight, food_storage_ruins) && !map.getTileWorldXY(selectedCorpse.x - 64, selectedCorpse.y, map.tileWidth, map.tileHeight, food_storage) && 
                    !map.getTileWorldXY(selectedCorpse.x - 64, selectedCorpse.y, map.tileWidth, map.tileHeight, armory_ruins) && !map.getTileWorldXY(selectedCorpse.x - 64, selectedCorpse.y, map.tileWidth, map.tileHeight, armory) &&
                    !map.getTileWorldXY(selectedCorpse.x - 64, selectedCorpse.y, map.tileWidth, map.tileHeight, radio_station_ruins) && !map.getTileWorldXY(selectedCorpse.x - 64, selectedCorpse.y, map.tileWidth, map.tileHeight, radio_station) &&
                    !map.getTileWorldXY(selectedCorpse.x - 64, selectedCorpse.y, map.tileWidth, map.tileHeight, cell_block_ruins) && !map.getTileWorldXY(selectedCorpse.x - 64, selectedCorpse.y, map.tileWidth, map.tileHeight, cell_block))) {
                        hours -= 1;
                        selectedCorpse.x -= 64;
                } else if (map.getTileWorldXY(selectedCorpse.x - 64, selectedCorpse.y, map.tileWidth, map.tileHeight, grass)) {
                    hours -= 1;
                    selectedCorpse.x -= 64;
                    corpses.remove(selectedCorpse);
                    movingCorpses = false;
                    corpsesRemoved++;
                }
    
            } else if (cursors.right.isDown) {
                drag_corpse.play();
                cursors.right.isDown = false;
                if ((!map.getTileWorldXY(selectedCorpse.x + 64, selectedCorpse.y, map.tileWidth, map.tileHeight, guard_tower_ruins) && !map.getTileWorldXY(selectedCorpse.x + 64, selectedCorpse.y, map.tileWidth, map.tileHeight, guard_tower) && 
                    !map.getTileWorldXY(selectedCorpse.x + 64, selectedCorpse.y, map.tileWidth, map.tileHeight, lookout_tower_ruins) && !map.getTileWorldXY(selectedCorpse.x + 64, selectedCorpse.y, map.tileWidth, map.tileHeight, lookout_tower) &&
                    !map.getTileWorldXY(selectedCorpse.x + 64, selectedCorpse.y, map.tileWidth, map.tileHeight, food_storage_ruins) && !map.getTileWorldXY(selectedCorpse.x + 64, selectedCorpse.y, map.tileWidth, map.tileHeight, food_storage) &&
                    !map.getTileWorldXY(selectedCorpse.x + 64, selectedCorpse.y, map.tileWidth, map.tileHeight, armory_ruins) && !map.getTileWorldXY(selectedCorpse.x + 64, selectedCorpse.y, map.tileWidth, map.tileHeight, armory) &&
                    !map.getTileWorldXY(selectedCorpse.x + 64, selectedCorpse.y, map.tileWidth, map.tileHeight, radio_station_ruins) && !map.getTileWorldXY(selectedCorpse.x + 64, selectedCorpse.y, map.tileWidth, map.tileHeight, radio_station) &&
                    !map.getTileWorldXY(selectedCorpse.x + 64, selectedCorpse.y, map.tileWidth, map.tileHeight, cell_block_ruins) && !map.getTileWorldXY(selectedCorpse.x + 64, selectedCorpse.y, map.tileWidth, map.tileHeight, cell_block))) {
                        hours -= 1;
                        selectedCorpse.x += 64;
                } else if (map.getTileWorldXY(selectedCorpse.x + 64, selectedCorpse.y, map.tileWidth, map.tileHeight, grass)) {
                    hours -= 1;
                    selectedCorpse.x += 64;
                    corpses.remove(selectedCorpse);
                    movingCorpses = false;
                    corpsesRemoved++;
                }
            } else {
    
            }

        }
    

        if (hours > 0) {

            if (map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, armory) || map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, armory_ruins)) {
                building = 'Armory';
                description = 'Gain access to heavy weaponry!';
                effect = 'The zombie horde is permanently decreased by 10 every attack.';
                cost = '4 hours';
                shrubs_to_remove = armory_shrubs + ' shrubs';
                facility_box = new Phaser.Rectangle(25, 10, 840, 118);
            } else if (map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, food_storage) || map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, food_storage_ruins)) {
                building = 'Food Storage';
                description = 'You can hear the sounds of people from underneath the rubble.';
                effect = 'Gain a random number of new survivors.';
                cost = '3 hours';
                shrubs_to_remove = food_storage_shrubs + ' shrubs';
                facility_box = new Phaser.Rectangle(25, 10, 750, 118);
            } else if (map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, guard_tower) || map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, guard_tower_ruins)) {
                building = 'Guard Tower';
                description = 'Station guards before an attack.';
                effect = 'Gain the guard ability which prevents the loss one survivor during an attack at the expense of your remaining hours (need at least one hour).';
                cost = '2 hours';
                shrubs_to_remove = guard_tower_shrubs + ' shrubs';
                facility_box = new Phaser.Rectangle(25, 10, 1600, 118);
            } else if (map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, lookout_tower) || map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, lookout_tower_ruins)) {
                building = 'Lookout Tower';
                description = 'See the horde before it reaches you, allowing for more preparation.';
                effect = "You gain 2 extra hours each day before the horde attacks.";
                cost = '3 hours';
                shrubs_to_remove = lookout_tower_shrubs + ' shrubs';
                facility_box = new Phaser.Rectangle(25, 10, 800, 118);
            } else if (map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, radio_station) || map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, radio_station_ruins)) {
                building = 'Radio Station';
                description = 'A radio distress signal will be broadcast to the surrounding area.';
                effect = 'You gain a new survivor each turn.';
                cost = '4 hours';
                shrubs_to_remove = radio_station_shrubs + ' shrubs';
                facility_box = new Phaser.Rectangle(25, 10, 800, 118);
            } else if (map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, cell_block) || map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, cell_block_ruins)) {
                building = 'Cell Block';
                description = 'The sturidest facility in the prison, the survivors will be safe here.';
                effect = 'You and your group are now completely safe from any future zombie attacks...for now.';
                cost = '5 hours';
                shrubs_to_remove = cell_block_shrubs + ' shrubs';
                facility_box = new Phaser.Rectangle(25, 10, 1060, 118);
            } else if (map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, walls) || map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, ground) || map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, grass)){
                building = '';
                description = '';
                effect = '';
                cost = '';
                shrubs_to_remove = '';
                facility_box = new Phaser.Rectangle(25, 10, 250, 118);
            }
            
            if (game.input.mousePointer.isDown) {
                game.input.mousePointer.isDown = false;

                if (map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, armory_ruins) && armory_shrubs == 0) {
                    if (!armory_repaired && hours >= 4) {
                        build.play();
                        hours -= 4;
                        armory_ruins.destroy();
                        armory_ruins = map.createLayer('Armory');
                        armory_repaired = true;
                    }
                }
                
                if (map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, food_storage_ruins) && food_storage_shrubs == 0) {
                    if (!food_storage_repaired && hours >= 3) {
                        build.play();
                        hours -= 3;
                        food_storage_ruins.destroy();
                        food_storage = map.createLayer('Food Storage');
                        food_storage_repaired = true;
                    }
                }
                
                if (map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, guard_tower_ruins) && guard_tower_shrubs == 0) {
                    if (!guard_tower_repaired && hours >= 2) {
                        build.play();
                        hours -= 2;
                        guard_tower_ruins.destroy();
                        guard_tower = map.createLayer('Guard Tower');
                        guard_tower_repaired = true;

                        guard = game.add.button(1425, 730, 'black_box', guard, this, 2, 1, 0);
                        guard.scale.setTo(0.15, 0.08);
                        guard.alpha = 0.5;

                        var text = game.add.text(guard.centerX - 25, guard.centerY - 10, 'Guard', { font: "Courier", fontSize: '18px', fill: '#fff' });
                        text.fontWeight = 'bold';
                        text.stroke = '#000000';
                        text.strokeThickness = 2;
                    }
                }
                
                if (map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, lookout_tower_ruins) && lookout_tower_shrubs == 0) {
                    if (!lookout_tower_repaired && hours >= 3) {
                        build.play();
                        hours -= 3;
                        lookout_tower_ruins.destroy();
                        lookout_tower = map.createLayer('Lookout Tower');
                        lookout_tower_repaired = true;
                    }
                }
                
                if (map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, radio_station_ruins) && radio_station_shrubs == 0) {
                    if (!radio_station_repaired && hours >= 4) {
                        build.play();
                        hours -= 4;
                        radio_station_ruins.destroy();
                        radio_station = map.createLayer('Radio Station');
                        radio_station_repaired = true;
                    }
                } 
                
                if (map.getTileWorldXY(game.input.x, game.input.y, map.tileWidth, map.tileHeight, cell_block_ruins) && cell_block_shrubs == 0) {
                    if (!cell_block_repaired && hours >= 5) {
                        build.play();
                        hours -= 5;
                        cell_block_ruins.destroy();
                        cell_block = map.createLayer('Cell Block');
                        cell_block_repaired = true;
                    }
                }

            }
        } else {
            zombieAttack();
        }
        
    }

    function createMap() {
        map = game.add.tilemap('DA7');
    
        map.addTilesetImage('light_forest', 'tileset1');
        map.addTilesetImage('castle_greystone_exterior_02', 'tileset2');
        map.addTilesetImage('pokemon', 'tileset3');

        grass = map.createLayer('Grass');
        ground = map.createLayer('Ground');
        cell_block_ruins = map.createLayer('Cell Block Ruins');
        guard_tower_ruins = map.createLayer('Guard Tower Ruins');
        radio_station_ruins = map.createLayer('Radio Station Ruins');
        armory_ruins = map.createLayer('Armory Ruins');
        food_storage_ruins = map.createLayer('Food Storage Ruins');
        lookout_tower_ruins = map.createLayer('Lookout Tower Ruins');
        walls = map.createLayer('Walls');

        grass.resizeWorld();
    }

    function createShrubs() {
        shrubs = game.add.group();

        var shrub;
        var x;
        var y;

        //guard tower shrub
        shrub = shrubs.create(1475, 200, 'shrub');
        shrub.inputEnabled = true;
        shrub.events.onInputDown.add(removeGuardTowerShrub, this);

        //lookout tower shrubs
        for (var i = 0; i < 3; i++) {
            x = 80;
            y = 580;

            while (map.getTileWorldXY(x - 3, y + 30, map.tileWidth, map.tileHeight, lookout_tower_ruins)) {
                x = game.rnd.integerInRange(50, 130);
                y = game.rnd.integerInRange(480, 620);
            }

            shrub = shrubs.create(x, y, 'shrub');
            shrub.inputEnabled = true;
            shrub.events.onInputDown.add(removeLookoutTowerShrub, this);
        }

        //broadcast tower shrubs 
        for (var i = 0; i < 2; i++) {
            x = 1000;
            y = 280;

            while (map.getTileWorldXY(x + 5, y + 10, map.tileWidth, map.tileHeight, radio_station_ruins)) {
                x = game.rnd.integerInRange(910, 1120);
                y = game.rnd.integerInRange(180, 340);
            }

            shrub = shrubs.create(x, y, 'shrub');
            shrub.inputEnabled = true;
            shrub.events.onInputDown.add(removeRadioStationShrub, this);
        }

        //armory shrubs 
        for (var i = 0; i < 3; i++) {
            x = 1300;
            y = 620;

            while (map.getTileWorldXY(x + 5, y + 10, map.tileWidth, map.tileHeight, armory_ruins)) {
                x = game.rnd.integerInRange(1190, 1370);
                y = game.rnd.integerInRange(545, 680);
            }

            shrub = shrubs.create(x, y, 'shrub');
            shrub.inputEnabled = true;
            shrub.events.onInputDown.add(removeArmoryShrub, this);
        }
        
        //food storage shrubs 
        for (var i = 0; i < 2; i++) {
            x = 350;
            y = 190;

            while (map.getTileWorldXY(x + 5, y + 10, map.tileWidth, map.tileHeight, food_storage_ruins)) {
                x = game.rnd.integerInRange(280, 410);
                y = game.rnd.integerInRange(130, 230);
            }

            shrub = shrubs.create(x, y, 'shrub');
            shrub.inputEnabled = true;
            shrub.events.onInputDown.add(removeFoodStorageShrub, this);
        } 

        //cell block shrubs 
        for (var i = 0; i < 6; i++) {
            x = 650;
            y = 500;

            while (map.getTileWorldXY(x + 5, y + 15, map.tileWidth, map.tileHeight, cell_block_ruins)) {
                x = game.rnd.integerInRange(560, 715);
                y = game.rnd.integerInRange(420, 540);
            }

            shrub = shrubs.create(x, y, 'shrub');
            shrub.inputEnabled = true;
            shrub.events.onInputDown.add(removeCellBlockShrub, this);
        } 

    }

    function removeGuardTowerShrub(shrub) {
        if (hours >= 3) {
            dig.play();
            hours -= 3;
            shrubs.remove(shrub);
            guard_tower_shrubs--;
        }
    }

    function removeLookoutTowerShrub(shrub) {
        if (hours >= 3) {
            dig.play();
            hours -= 3;
            shrubs.remove(shrub);
            lookout_tower_shrubs--;
        }
    }

    function removeRadioStationShrub(shrub) {
        if (hours >= 3) {
            dig.play();
            hours -= 3;
            shrubs.remove(shrub);
            radio_station_shrubs--;
        }
    }

    function removeArmoryShrub(shrub) {
        if (hours >= 3) {
            dig.play();
            hours -= 3;
            shrubs.remove(shrub);
            armory_shrubs--;
        }
    }

    function removeFoodStorageShrub(shrub) {
        if (hours >= 3) {
            dig.play();
            hours -= 3;
            shrubs.remove(shrub);
            food_storage_shrubs--;
        }
    }

    function removeCellBlockShrub(shrub) {
        if (hours >= 3) {
            dig.play();
            hours -= 3;
            shrubs.remove(shrub);
            cell_block_shrubs--;
        }
    }
    
    function createCorpses() {
        corpses = game.add.group();
        var corpse;

        for (var i = 0; i < 18; i++) {
            var x = game.world.randomX;
            var y = game.world.randomY;

            while (map.getTileWorldXY(x + 40, y + 40, map.tileWidth, map.tileHeight, guard_tower_ruins) || map.getTileWorldXY(x - 40, y - 40, map.tileWidth, map.tileHeight, guard_tower_ruins) ||
                   map.getTileWorldXY(x + 30, y + 30, map.tileWidth, map.tileHeight, lookout_tower_ruins) || map.getTileWorldXY(x - 30, y - 30, map.tileWidth, map.tileHeight, lookout_tower_ruins) ||
                   map.getTileWorldXY(x + 40, y + 30, map.tileWidth, map.tileHeight, food_storage_ruins) || map.getTileWorldXY(x - 30, y - 30, map.tileWidth, map.tileHeight, food_storage_ruins) ||
                   map.getTileWorldXY(x + 30, y + 30, map.tileWidth, map.tileHeight, armory_ruins) || map.getTileWorldXY(x - 30, y - 30, map.tileWidth, map.tileHeight, armory_ruins) ||
                   map.getTileWorldXY(x + 30, y + 40, map.tileWidth, map.tileHeight, radio_station_ruins) || map.getTileWorldXY(x - 30, y - 30, map.tileWidth, map.tileHeight, radio_station_ruins) ||
                   map.getTileWorldXY(x + 30, y + 30, map.tileWidth, map.tileHeight, cell_block_ruins) || map.getTileWorldXY(x - 40, y - 30, map.tileWidth, map.tileHeight, cell_block_ruins) ||
                   map.getTileWorldXY(x + 30, y + 30, map.tileWidth, map.tileHeight, walls) || map.getTileWorldXY(x - 30, y - 30, map.tileWidth, map.tileHeight, walls) ||
                   map.getTileWorldXY(x, y, map.tileWidth, map.tileHeight, grass)) {
                x = game.world.randomX;
                y = game.world.randomY;
            }

            corpse = corpses.create(x, y, 'corpse');
            corpse.scale.setTo(0.5, 0.5);
            corpse.inputEnabled = true;
            corpse.events.onInputDown.add(moveCorpse, this);
        } 
    }

    function moveCorpse(corpse){
        movingCorpses = true;

        selectedCorpse = corpse;
    }

    function guard() {
        if (hours >= 1) {
            hours = 0;
            guarding = true;
        }
    }

    function zombieAttack() {
        zombie_attack.play();

        var black_box = game.add.sprite(game.width / 2, game.height / 2, 'black_box');
        //black_box.fixedToCamera = true;
        black_box.scale.setTo(5, 5);
        black_box.anchor.setTo(0.5, 0.5);
        black_box.alpha = 1;
        
        var fadeIn = game.add.tween(black_box).to( { alpha: 1 }, 2000, "Linear", true);
        var fadeOut = game.add.tween(black_box).to( { alpha: 0 }, 2000, "Linear", true);
        fadeIn.chain(fadeOut);
        fadeIn.start();
       
        // fadeIn = game.add.tween(black_box).to( { alpha: 1 }, 1000, "Linear", true);
        // fadeOut = game.add.tween(black_box).to( { alpha: 0 }, 1000, "Linear", true);
        // fadeIn.chain(fadeOut);
        // fadeIn.start();

        zombies = game.rnd.integerInRange(zLower, zUpper);

        if (armory_repaired) {
            zombies -= 10;
        }

        zombies -= corpsesRemoved;

        ratio = survivors / zombies;

        if (ratio > 0.50) {
            casualties = 0;
        } else if (ratio < 0.50 && ratio > 0.40) {
            casualties = 1;
        } else if (ratio < 0.40 && ratio > 0.30) {
            casualties = 2;
        } else if (ratio < 0.30 && ratio > 0.20) {
            casualties = 3;
        } else {
            casualties = 4;
        }

        if (guarding) {
            casualties -= 1;
        }

        survivors -= casualties;

        if (survivors <= 0) {
            survivors = 0;
            gameOver();
        }

        hours = game.rnd.integerInRange(7, 12);

        if (lookout_tower_repaired) {
            hours += 2;
        }

        count++;
            
        if (count == 3) {
            zLower += 5;
            zUpper += 5;
            count = 0;
        }
    }

    function gameOver() {
        music.stop();

        if (!game_over) {
            dead.play();
        }

        game_over = true;

        var black_box = game.add.sprite(game.width / 2, game.height / 2, 'black_box');
        //black_box.fixedToCamera = true;
        black_box.scale.setTo(5, 5);
        black_box.anchor.setTo(0.5, 0.5);
        black_box.alpha = 1;

        var text = game.add.text(game.width / 2, game.height / 2, 'Game Over', { fontSize: '48px', fill: '#000' });
        text.fixedToCamera = true;
        text.anchor.setTo(0.5, 0.5);

        text.font = 'Courier';
        text.fontWeight = 'bold';

        text.stroke = '#FFFFFF';
        text.strokeThickness = 3;
        text.fill = '#ff0000';
    }
    
    function render () {
        if (!game_over) {
            game.debug.geom(facility_box, 'rgba(0,0,0,0.5)' ) ;
            game.debug.text("Facility: " + building, 35, 30);
            game.debug.text("Description: " + description, 35, 52);
            game.debug.text("Effect once repaired: " + effect, 35, 74);
            game.debug.text("Shrubs to remove: " + shrubs_to_remove, 35, 96);
            game.debug.text("Time to repair: " + cost, 35, 118);

            game.debug.geom(resources_box, 'rgba(0,0,0,0.5)' ) ;
            game.debug.text("Survivors: " + survivors, 35, 750);
            game.debug.text("Hours: " + hours, 35, 772);
            game.debug.text("Corpses Removed: " + corpsesRemoved, 35, 794);

            if (movingCorpses) {
                var corpse_box = new Phaser.Rectangle(1450, 10, 150, 30);
                game.debug.geom(corpse_box, 'rgba(0,0,0,0.5)' ) ;
                game.debug.text('Moving corpse', 1460, 30);
            }
        }
    }
};
