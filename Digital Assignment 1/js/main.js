"use strict";

window.onload = function () {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".

    //code from phaser examples: https://phaser.io/examples/v2/p2-physics/tilemap

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.tilemap('map', 'assets/tilemaps/maps/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
        game.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
        game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
        game.load.image('ship', 'assets/sprites/thrust_ship2.png');
        game.load.image('diamond', 'assets/sprites/diamond.png');
        game.load.audio('explosion', 'assets/audio/SoundEffects/explosion.mp3');
        game.load.audio('pickup', 'assets/audio/SoundEffects/p-ping.mp3');
        game.load.audio('music', 'assets/audio/sd-ingame1.wav');

        // all assets from phaser

    }

    var ship;
    var map;
    var layer;
    var cursors;
    var diamond;

    var text;

    var explosion;
    var pickup;
    var music;

    var crashed;
    var won;

    function create() {

        game.physics.startSystem(Phaser.Physics.P2JS);
      

        game.stage.backgroundColor = '#181818';

        map = game.add.tilemap('map');

        map.addTilesetImage('ground_1x1');
        map.addTilesetImage('walls_1x2');
        map.addTilesetImage('tiles2');

        layer = map.createLayer('Tile Layer 1');

        layer.resizeWorld();

        map.setCollisionBetween(1, 12);

        game.physics.p2.convertTilemap(map, layer);

        ship = game.add.sprite(200, 200, 'ship');
        game.physics.p2.enable(ship);
        //ship.enableBody = true;

        diamond = game.add.sprite(1200, 400, 'diamond');
        diamond.enableBody = true;

        game.camera.follow(ship);

        game.physics.p2.setBoundsToWorld(true, true, true, true, false);

        //ship.body.collideWorldBounds = false;

        explosion = game.add.audio('explosion');
        pickup = game.add.audio('pickup');
        music = game.add.audio('music');
        music.play();

        crashed = 'false';
        won = 'false';

        cursors = game.input.keyboard.createCursorKeys();

    }

    function update() {

        if (cursors.left.isDown) {
            ship.body.rotateLeft(100);
        }
        else if (cursors.right.isDown) {
            ship.body.rotateRight(100);
        }
        else {
            ship.body.setZeroRotation();
        }

        if (cursors.up.isDown) {
            ship.body.thrust(400);
        }
        else if (cursors.down.isDown) {
            ship.body.reverse(400);
        }
        
        // from phaser examples: http://phaser.io/examples/v2/sprites/overlap-without-physics
        if (checkOverlap(ship, diamond)) {
            collectDiamond(ship, diamond);

            if (won === 'false') {
                pickup.play();
            }
            won = 'true';
        }

        
        if (ship.world.x <= 50 || ship.world.x >= 1545 || ship.world.y <= 50 || ship.world.y >= 525) {
            // from phaser examples: https://phaser.io/examples/v2/text/text-stroke
            text = game.add.text(game.width / 2, game.height / 2, 'You crashed!');
            text.align = 'center';
            text.fixedToCamera = true;
            text.anchor.setTo(0.5, 0.5);

            text.font = 'Arial Black';
            text.fontSize = 68;
            text.fontWeight = 'bold';

            text.stroke = '#000000';
            text.strokeThickness = 6;
            text.fill = '#FF0000';

            ship.kill();
            music.pause();

            if (crashed === 'false') {
                explosion.play();
            }
            crashed = 'true';
        }

    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    }

    function collectDiamond(ship, diamond) {
        diamond.kill();

        // from phaser examples: https://phaser.io/examples/v2/text/text-stroke
        text = game.add.text(game.width / 2, game.height / 2, 'You won!');
        text.align = 'center';
        text.fixedToCamera = true;
        text.anchor.setTo(0.5, 0.5);

        text.font = 'Arial Black';
        text.fontSize = 68;
        text.fontWeight = 'bold';

        text.stroke = '#000000';
        text.strokeThickness = 6;
        text.fill = '#FF0000';

        music.pause();
    }
   
    function render() {

    }
};

