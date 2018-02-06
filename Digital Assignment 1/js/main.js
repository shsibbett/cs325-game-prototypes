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


    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.tilemap('map', 'assets/tilemaps/maps/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
        game.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
        game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
        game.load.image('ship', 'assets/sprites/thrust_ship2.png');

    }

    var ship;
    var map;
    var layer;
    var cursors;

    function create() {

        game.physics.startSystem(Phaser.Physics.P2JS);

        game.stage.backgroundColor = '#2d2d2d';

        map = game.add.tilemap('map');

        map.addTilesetImage('ground_1x1');
        map.addTilesetImage('walls_1x2');
        map.addTilesetImage('tiles2');

        layer = map.createLayer('Tile Layer 2');

        layer.resizeWorld();

        //  Set the tiles for collision.
        //  Do this BEFORE generating the p2 bodies below.
        map.setCollisionBetween(1, 12);

        //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
        //  This call returns an array of body objects which you can perform addition actions on if
        //  required. There is also a parameter to control optimising the map build.
        game.physics.p2.convertTilemap(map, layer);

        ship = game.add.sprite(200, 200, 'ship');
        game.physics.p2.enable(ship);

        game.camera.follow(ship);

        //  By default the ship will collide with the World bounds,
        //  however because you have changed the size of the world (via layer.resizeWorld) to match the tilemap
        //  you need to rebuild the physics world boundary as well. The following
        //  line does that. The first 4 parameters control if you need a boundary on the left, right, top and bottom of your world.
        //  The final parameter (false) controls if the boundary should use its own collision group or not. In this case we don't require
        //  that, so it's set to false. But if you had custom collision groups set-up then you would need this set to true.
        game.physics.p2.setBoundsToWorld(true, true, true, true, false);

        //  Even after the world boundary is set-up you can still toggle if the ship collides or not with this:
        // ship.body.collideWorldBounds = false;

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

    }

    function render() {

    }
};

