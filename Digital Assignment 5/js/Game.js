"use strict";

GameStates.makeGame = function( game, shared ) {

    var bun;
    var seed;
    var bricks;

    var hamburger;
    var tomato;
    var cheese;
    var topbun;

    var phase1 = false;
    var phase2 = false;
    var phase3 = false;
    var phase4 = false;

    var hLost = false;
    var tLost = false;
    var cLost = false;
    var tbLost = false;

    var seedOnBun = true;
    
    var lives = 3;
    var score = 0;

    var scoreText;
    var livesText;
    var introText;

    var hit;
    var caught;
    var bounce;
    var drop;
    var win;
    var game_over;
    var wall;

    
    function quitGame() {
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
            game.physics.startSystem(Phaser.Physics.ARCADE);


            game.physics.arcade.checkCollision.down = false;
        
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


        
            bun = game.add.sprite(game.world.centerX, 500, 'bottom_bun');
            bun.anchor.setTo(0.5, 0.5);
            bun.scale.setTo(0.15, 0.15);
        
            game.physics.arcade.enable(bun);
        
            bun.body.collideWorldBounds = true;
            bun.body.bounce.set(1);
            bun.body.immovable = true;

           //hamburger = game.add.sprite(550, 250,'hamburger');
            hamburger = game.add.sprite(game.rnd.integerInRange(120, 624), 250,'hamburger');
            hamburger.anchor.setTo(0.5, 0.5);
            hamburger.scale.setTo(0.15, 0.15);

            game.physics.arcade.enable(hamburger);
            hamburger.body.gravity.y = 200;
            hamburger.checkWorldBounds = true;

            //cheese = game.add.sprite(300, 145, 'cheese');
            cheese = game.add.sprite(game.rnd.integerInRange(120, 624), 145, 'cheese');
            cheese.anchor.setTo(0.5, 0.5);
            cheese.scale.setTo(0.15, 0.15);

            game.physics.arcade.enable(cheese);
            cheese.body.gravity.y = 200;
            cheese.checkWorldBounds = true;

            //tomato = game.add.sprite(150, 200, 'tomato');
            tomato = game.add.sprite(game.rnd.integerInRange(120, 624), 200, 'tomato');
            tomato.anchor.setTo(0.5, 0.5);
            tomato.scale.setTo(0.15, 0.15);

            game.physics.arcade.enable(tomato);
            tomato.body.gravity.y = 200;
            tomato.checkWorldBounds = true;

            //topbun = game.add.sprite(475, 90, 'top_bun');
            topbun = game.add.sprite(game.rnd.integerInRange(120, 624), 90, 'top_bun');
            topbun.anchor.setTo(0.5, 0.5);
            topbun.scale.setTo(0.15, 0.15);

            game.physics.arcade.enable(topbun);
            topbun.body.gravity.y = 200;
            topbun.checkWorldBounds = true;
        
            seed = game.add.sprite(game.world.centerX, bun.y - 16, 'seed');
            seed.anchor.set(0.5, 0.5);
            seed.scale.setTo(0.25, 0.25);
            seed.checkWorldBounds = true;
        
            game.physics.arcade.enable(seed);
        
            seed.body.collideWorldBounds = true;
            seed.body.bounce.set(1);
        
            //seed.animations.add('spin', [ 'ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png' ], 50, true, false);
        
            seed.events.onOutOfBounds.add(this.seedLost, this);
            hamburger.events.onOutOfBounds.add(this.hamburgerLost, this);
            tomato.events.onOutOfBounds.add(this.tomatoLost, this);
            cheese.events.onOutOfBounds.add(this.cheeseLost, this);
            topbun.events.onOutOfBounds.add(this.topbunLost, this);

            hit = game.add.audio('hit');
            caught = game.add.audio('catch');
            bounce = game.add.audio('bounce');
            drop = game.add.audio('drop');
            win = game.add.audio('win');
            game_over = game.add.audio('game_over');
            wall = game.add.audio('wall');
        
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

            if (hLost && cLost && tLost && tbLost) {
                this.gameOver();
            }
        
            if (seedOnBun)
            {
                seed.body.x = bun.x - 5;

                if (phase1 && !phase2 && !phase3) {
                    seed.body.y = bun.y - 38;
                } else if (!phase1 && phase2 && !phase3) {
                    seed.body.y = bun.y - 33;
                } else if (phase1 && phase2 && !phase3) {
                    seed.body.y = bun.y - 40;
                } else if (phase1 && phase3) {
                    seed.body.y = bun.y - 45;
                } else if (phase4) {
                    seed.body.y = bun.y - 50;
                }
            }
            else
            {
                game.physics.arcade.collide(seed, bun, this.seedHitBun, null, this);
                game.physics.arcade.collide(seed, bricks, this.seedHitBrick, null, this);
            }

            game.physics.arcade.collide(hamburger, bricks);
            game.physics.arcade.collide(hamburger, bun, this.burgerHitBun, null, this);
            game.physics.arcade.collide(tomato, bricks);
            game.physics.arcade.collide(tomato, bun, this.tomatoHitBun, null, this);
            game.physics.arcade.collide(cheese, bricks);
            game.physics.arcade.collide(cheese, bun, this.cheeseHitBun, null, this);
            game.physics.arcade.collide(topbun, bricks);
            game.physics.arcade.collide(topbun, bun, this.top_bunHitBun, null, this);

            if (seed.body.blocked.up || seed.body.blocked.left || seed.body.blocked.right) {
                wall.play();
            }

            if ((phase1 && phase2 && phase3 && phase4) || (hLost && phase2 && phase3 && phase4) || (phase1 && cLost && phase3 && phase4) ||
            (phase1 && phase2 && tLost && phase4) || (phase1 && phase2 && phase3 && tbLost) || (hLost && cLost && phase3 && phase4) ||
            (hLost && cLost && tLost && phase4) || (hLost && phase2 && tLost && phase4) || (hLost && phase2 && tLost && tbLost) || 
            (hLost && phase2 && phase3 && tbLost) || (hLost && cLost && phase3 && tbLost) || (phase1 && cLost && tLost && phase4) || 
            (phase1 && cLost && tLost && tbLost) || (phase1 && cLost && phase3 && tbLost) || (phase1 && phase2 && tLost && tbLost))
            {
                win.play();

                score += 1000;
                scoreText.text = 'score: ' + score;
                introText.text = '- Next Level -';
        
                seedOnBun = true;
                seed.body.velocity.set(0);
                seed.x = bun.x + 16;
                seed.y = bun.y - 16;

                phase1 = false;
                phase2 = false;
                phase3 = false;
                phase4 = false;

                hLost = false;
                cLost = false;
                tLost = false;
                tbLost = false;

                hamburger.reset(game.rnd.integerInRange(120, 624), 250);
                hamburger.anchor.setTo(0.5, 0.5);
                hamburger.scale.setTo(0.15, 0.15);

                game.physics.arcade.enable(hamburger);
                hamburger.body.gravity.y = 200;
                hamburger.checkWorldBounds = true;

                tomato.reset(game.rnd.integerInRange(120, 624), 200);
                tomato.anchor.setTo(0.5, 0.5);
                tomato.scale.setTo(0.15, 0.15);

                game.physics.arcade.enable(tomato);
                tomato.body.gravity.y = 200;
                tomato.checkWorldBounds = true;

                cheese.reset(game.rnd.integerInRange(120, 624), 145);
                cheese.anchor.setTo(0.5, 0.5);
                cheese.scale.setTo(0.15, 0.15);

                game.physics.arcade.enable(cheese);
                cheese.body.gravity.y = 200;
                cheese.checkWorldBounds = true;

                topbun.reset(game.rnd.integerInRange(120, 624), 90);
                topbun.anchor.setTo(0.5, 0.5);
                topbun.scale.setTo(0.15, 0.15);

                game.physics.arcade.enable(topbun);
                topbun.body.gravity.y = 200;
                topbun.checkWorldBounds = true;

                bricks.callAll('revive');
            }
        },
        
        releaseSeed: function () {
        
            if (seedOnBun)
            {
                seedOnBun = false;
                seed.body.velocity.y = -300;
                seed.body.velocity.x = -75;
                //seed.animations.play('spin');
                introText.visible = false;
            }
        
        },
        
        seedLost: function () {
            drop.play();
            lives--;
            livesText.text = 'lives: ' + lives;
        
            if (lives === 0)
            {
                this.gameOver();
            }
            else
            {
                seedOnBun = true;
        
                seed.reset(bun.body.x + 15, bun.y - 16);
                
                //seed.animations.stop();
            }
        
        },

        hamburgerLost: function() {
            drop.play();
            hLost = true;
        },

        tomatoLost: function() {
            drop.play();
            tLost = true;
        },

        cheeseLost: function() {
            drop.play();
            cLost = true;
        },

        topbunLost: function() {
            drop.play();
            tbLost = true;
        },
        
        gameOver: function () {
            game_over.play();

            seed.body.velocity.setTo(0, 0);
            
            introText.text = 'Game Over!';
            introText.visible = true;
        
        },
        
        seedHitBrick: function (_seed, _brick) {
            hit.play();

            _brick.kill();
        
            score += 10;
        
            scoreText.text = 'score: ' + score;        
        },
        
        seedHitBun: function (_seed, _bun) {
            
            bounce.play();
        
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
                _seed.body.velocity.x = 2 + Math.random() * 8;
            }
        },

        burgerHitBun: function (_hamburger, _bun) {
            if (!phase1) {
                caught.play();
                score += 100;
                scoreText.text = 'score: ' + score;
            }

            var x = bun.x;
            var y = bun.y;

            hamburger.kill();

            hamburger = game.add.sprite(x, y, 'hamburger');
            hamburger.anchor.setTo(0.5, 0.5);
            hamburger.scale.setTo(0.15, 0.15);
            game.physics.arcade.enable(hamburger);

            hamburger.x = bun.x;

            hamburger.y = bun.y - 5;

            hamburger.body.gravity.y = 0;
        
            //!game.physics.arcade.enable(hamburger);

            phase1 = true;
        },

        cheeseHitBun: function (_cheese, _bun) {
           if (!phase2) {
               caught.play();
                score += 100;
                scoreText.text = 'score: ' + score;
            }

            var x = bun.x;
            var y = bun.y;

            cheese.kill();

            cheese = game.add.sprite(x, y, 'cheese');
            cheese.anchor.setTo(0.5, 0.5);
            cheese.scale.setTo(0.15, 0.15);
            game.physics.arcade.enable(cheese);


            cheese.x = bun.x - 1;

            if (!phase1 && !phase3){
                cheese.y = bun.y - 4;
            } else if ((phase1 && !phase3) || (!phase1 && phase3)) {
                cheese.y = bun.y - 8;
            } else if (phase1 && phase3) {
                cheese.y = bun.y - 10;
            } else if (phase2 && phase3) {
                cheese.y = bun.y - 15;
            }

            cheese.body.gravity.y = 0;
        
            //!game.physics.arcade.enable(cheese);

            phase2 = true;
        },

        tomatoHitBun: function (_tomato, _bun) {
            if (!phase3) {
                caught.play();
                score += 100;
                scoreText.text = 'score: ' + score;
            }

            var x = bun.x;
            var y = bun.y;

            tomato.kill();

            tomato = game.add.sprite(x, y, 'tomato');
            tomato.anchor.setTo(0.5, 0.5);
            tomato.scale.setTo(0.15, 0.15);
            game.physics.arcade.enable(tomato);


            tomato.x = bun.x;

            if (!phase1 && !phase2){
                tomato.y = bun.y - 5;
            } else {
                tomato.y = bun.y - 10;
            } 

            tomato.body.gravity.y = 0;

            phase3 = true;
        },

        top_bunHitBun: function (_topbun, _bun) {
            if (!phase4) {
                caught.play();
                score += 100;
                scoreText.text = 'score: ' + score;
            }

            var x = bun.x;
            var y = bun.y;

            topbun.kill();

            topbun= game.add.sprite(x, y, 'top_bun');
            topbun.anchor.setTo(0.5, 0.5);
            topbun.scale.setTo(0.15, 0.15);
            game.physics.arcade.enable(topbun);


            topbun.x = bun.x;

            if (!phase1 && !phase2){
                topbun.y = bun.y - 10;
            } else {
                topbun.y = bun.y - 15;
            } 

            topbun.body.gravity.y = 0;

            phase4 = true;
        }
    };
};
