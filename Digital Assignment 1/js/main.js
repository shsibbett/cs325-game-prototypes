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

    }

    var ship;
    var map;
    var layer;
    var cursors;
    var diamond;
    var text;

    function create() {

        game.physics.startSystem(Phaser.Physics.P2JS);

        game.stage.backgroundColor = '#181818';

        map = game.add.tilemap('map');

        map.addTilesetImage('ground_1x1');
        map.addTilesetImage('walls_1x2');
        map.addTilesetImage('tiles2');

        layer = map.createLayer('Tile Layer 1');

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

        diamond = game.add.sprite(1200, 400, 'diamond');
        //        diamond.enableBody = true;
        game.physics.p2.enable(diamond);
        //diamond.body.onBeginContact.add(blockHit, this);

        game.camera.follow(ship);

        //  By default the ship will collide with the World bounds,
        //  however because you have changed the size of the world (via layer.resizeWorld) to match the tilemap
        //  you need to rebuild the physics world boundary as well. The following
        //  line does that. The first 4 parameters control if you need a boundary on the left, right, top and bottom of your world.
        //  The final parameter (false) controls if the boundary should use its own collision group or not. In this case we don't require
        //  that, so it's set to false. But if you had custom collision groups set-up then you would need this set to true.
        game.physics.p2.setBoundsToWorld(true, true, true, true, false);

        //  Even after the world boundary is set-up you can still toggle if the ship collides or not with this:
        //ship.body.collideWorldBounds = false;

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

        //if (ship.world.x = diamond.world.x - 20 || ship.world.x >= diamond.world.x + 20) {
        //    diamond.kill();
        //}

        
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
        }

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
    }

    //function blockHit(body, bodyB, shapeA, shapeB, equation) {

    //    //  The block hit something.
    //    //  
    //    //  This callback is sent 5 arguments:
    //    //  
    //    //  The Phaser.Physics.P2.Body it is in contact with. *This might be null* if the Body was created directly in the p2 world.
    //    //  The p2.Body this Body is in contact with.
    //    //  The Shape from this body that caused the contact.
    //    //  The Shape from the contact body.
    //    //  The Contact Equation data array.
    //    //  
    //    //  The first argument may be null or not have a sprite property, such as when you hit the world bounds.
    //    if (body) {
    //        bodyB.kill();
    //        this.kill();
    //    }
    //    else {
    //        body.kill();
    //        bodyB.kill();
    //        this.kill();
    //    }

    //}
   
    function render() {

    }
};

