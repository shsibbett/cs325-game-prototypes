"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var bun;
    var seed;
    var bricks;

    var hamburger;
    var tomato;
    var cheese;
    var top_bun;

    var phase1 = false;
    var phase2 = false;
    var phase3 = false;
    var phase4 = false;

    var seedOnBun = true;
    
    var lives = 3;
    var score = 0;

    var scoreText;
    var livesText;
    var introText;

    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //  We check bounds collisions against all walls other than the bottom one
            game.physics.arcade.checkCollision.down = false;
        
            //s = game.add.tileSprite(0, 0, 800, 600, 'starfield');
        
            bricks = game.add.group();
            bricks.enableBody = true;
            bricks.physicsBodyType = Phaser.Physics.ARCADE;
        
            var brick;
        
            for (var y = 0; y < 4; y++)
            {
                for (var x = 0; x < 15; x++)
                {
                    brick = bricks.create(120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y+1) + '_1.png');
                    brick.body.bounce.set(1);
                    brick.body.immovable = true;
                }
            }

            hamburger = game.add.sprite(500, 250,'hamburger');
            hamburger.anchor.setTo(0.5, 0.5);
            hamburger.scale.setTo(0.15, 0.15);

            game.physics.arcade.enable(hamburger);
            hamburger.body.gravity.y = 200;

            hamburger.body.collideWorldBounds = true;

            cheese = game.add.sprite(150, 200, 'cheese');
            cheese.anchor.setTo(0.5, 0.5);
            cheese.scale.setTo(0.15, 0.15);

            game.physics.arcade.enable(cheese);
            cheese.body.gravity.y = 200;

            cheese.body.collideWorldBounds = true;

            tomato = game.add.sprite(300, 145, 'tomato');
            tomato.anchor.setTo(0.5, 0.5);
            tomato.scale.setTo(0.15, 0.15);

            game.physics.arcade.enable(tomato);
            tomato.body.gravity.y = 200;

            tomato.body.collideWorldBounds = true;

            top_bun = game.add.sprite(400, 90, 'top_bun');
            top_bun.anchor.setTo(0.5, 0.5);
            top_bun.scale.setTo(0.15, 0.15);

            game.physics.arcade.enable(top_bun);
            top_bun.body.gravity.y = 200;

            top_bun.body.collideWorldBounds = true;
        
            bun = game.add.sprite(game.world.centerX, 500, 'bottom_bun');
            bun.anchor.setTo(0.5, 0.5);
            bun.scale.setTo(0.15, 0.15);
        
            game.physics.arcade.enable(bun);
        
            bun.body.collideWorldBounds = true;
            bun.body.bounce.set(1);
            bun.body.immovable = true;
        
            seed = game.add.sprite(game.world.centerX, bun.y - 16, 'seed');
            seed.anchor.set(0.5, 0.5);
            seed.scale.setTo(0.25, 0.25);
            seed.checkWorldBounds = true;
        
            game.physics.arcade.enable(seed);
        
            seed.body.collideWorldBounds = true;
            seed.body.bounce.set(1);
        
            //seed.animations.add('spin', [ 'ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png' ], 50, true, false);
        
            seed.events.onOutOfBounds.add(this.seedLost, this);
        
            scoreText = game.add.text(32, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
            livesText = game.add.text(680, 550, 'lives: 3', { font: "20px Arial", fill: "#ffffff", align: "left" });
            introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
            introText.anchor.setTo(0.5, 0.5);
        
            game.input.onDown.add(this.releaseSeed, this);
        },
    
        update: function () {
            bun.x = game.input.x;

            if (bun.x < 24)
            {
                bun.x = 24;
            }
            else if (bun.x > game.width - 24)
            {
                bun.x = game.width - 24;
            }
        
            if (seedOnBun)
            {
                seed.body.x = bun.x - 5;

                // if (phase1) {
                //     seed.body.y = bun.y - 35;
                // }
            }
            else
            {
                game.physics.arcade.collide(seed, bun, this.seedHitBun, null, this);
                game.physics.arcade.collide(seed, bricks, this.seedHitBrick, null, this);
            }

            game.physics.arcade.collide(hamburger, bricks);
            game.physics.arcade.collide(hamburger, bun, this.burgerHitBun, null, this);
            game.physics.arcade.collide(cheese, bricks);
            game.physics.arcade.collide(cheese, bun, this.cheeseHitBun, null, this);
            game.physics.arcade.collide(tomato, bricks);
            game.physics.arcade.collide(tomato, bun, this.tomatoHitBun, null, this);
            game.physics.arcade.collide(top_bun, bricks);
            game.physics.arcade.collide(top_bun, bun, this.top_bunHitBun, null, this);
        },
        
        releaseSeed: function () {
        
            if (seedOnBun)
            {
                seedOnBun = false;
                seed.body.velocity.y = -300;
                seed.body.velocity.x = -75;
                seed.animations.play('spin');
                introText.visible = false;
            }
        
        },
        
        seedLost: function () {
        
            lives--;
            livesText.text = 'lives: ' + lives;
        
            if (lives === 0)
            {
                this.gameOver();
            }
            else
            {
                seedOnBun = true;
        
                seed.reset(bun.body.x + 16, bun.y - 16);
                
                //seed.animations.stop();
            }
        
        },
        
        gameOver: function () {
        
            seed.body.velocity.setTo(0, 0);
            
            introText.text = 'Game Over!';
            introText.visible = true;
        
        },
        
        seedHitBrick: function (_seed, _brick) {
        
            _brick.kill();
        
            score += 10;
        
            scoreText.text = 'score: ' + score;
        
            //  Are they any bricks left?
            if (bricks.countLiving() == 0)
            {
                //  New level starts
                score += 1000;
                scoreText.text = 'score: ' + score;
                introText.text = '- Next Level -';
        
                seedOnBun = true;
                seed.body.velocity.set(0);
                seed.x = bun.x + 16;
                seed.y = bun.y - 16;
                //seed.animations.stop();
        
                //  And bring the bricks back from the dead :)
                bricks.callAll('revive');
            }
        
        },
        
        seedHitBun: function (_seed, _bun) {
        
            var diff = 0;
        
            if (_seed.x < _bun.x)
            {
                diff = _bun.x - _seed.x;
                _seed.body.velocity.x = (-10 * diff);
            }
            else if (_seed.x > _bun.x)
            {
                diff = _seed.x -_bun.x;
                _seed.body.velocity.x = (10 * diff);
            }
            else
            {
                //  Ball is perfectly in the middle
                //  Add a little random X to stop it bouncing straight up!
                _seed.body.velocity.x = 2 + Math.random() * 8;
            }
        },

        burgerHitBun: function (_hamburger, _bun) {
            score += 100;
            scoreText.text = 'score: ' + score;

            var x = bun.x;
            var y = bun.y;

            bun.kill();
            hamburger.kill();

            bun = game.add.sprite(x, y, 'phase1');
            bun.anchor.setTo(0.5, 0.5);
            bun.scale.setTo(0.15, 0.15);
        
            game.physics.arcade.enable(bun);
        
            bun.body.collideWorldBounds = true;
            bun.body.bounce.set(1);
            bun.body.immovable = true;

            phase1 = true;
        },

        cheeseHitBun: function (_cheese, _bun) {
            score += 100;
            scoreText.text = 'score: ' + score;

            var x = bun.x;
            var y = bun.y;

            bun.kill();
            cheese.kill();

            bun = game.add.sprite(x, y, 'phase2');
            bun.anchor.setTo(0.5, 0.5);
            bun.scale.setTo(0.15, 0.15);
        
            game.physics.arcade.enable(bun);
        
            bun.body.collideWorldBounds = true;
            bun.body.bounce.set(1);
            bun.body.immovable = true;

            phase2 = true;
        },

        tomatoHitBun: function (_tomato, _bun) {
            score += 100;
            scoreText.text = 'score: ' + score;

            var x = bun.x;
            var y = bun.y;

            bun.kill();
            tomato.kill();

            bun = game.add.sprite(x, y, 'phase3');
            bun.anchor.setTo(0.5, 0.5);
            bun.scale.setTo(0.15, 0.15);
        
            game.physics.arcade.enable(bun);
        
            bun.body.collideWorldBounds = true;
            bun.body.bounce.set(1);
            bun.body.immovable = true;

            phase3 = true;
        },

        top_bunHitBun: function (_top_bun, _bun) {
            score += 100;
            scoreText.text = 'score: ' + score;

            var x = bun.x;
            var y = bun.y;

            bun.kill();
            top_bun.kill();

            bun = game.add.sprite(x, y, 'phase4');
            bun.anchor.setTo(0.5, 0.5);
            bun.scale.setTo(0.15, 0.15);
        
            game.physics.arcade.enable(bun);
        
            bun.body.collideWorldBounds = true;
            bun.body.bounce.set(1);
            bun.body.immovable = true;

            phase4 = true;
        }
    };
};
