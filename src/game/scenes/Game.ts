import { Scene } from "phaser";

type Teleport = Phaser.Types.Physics.Arcade.SpriteWithStaticBody & {
    destination?: { x: number; y: number };
};

export class Game extends Scene {
    score: number;
    snails: Phaser.Physics.Arcade.Group;
    snailTime: Phaser.Time.TimerEvent;
    flyTime: Phaser.Time.TimerEvent;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    scoreText: Phaser.GameObjects.Text;
    stars: Phaser.Physics.Arcade.StaticGroup;
    fly: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    baseY: number = 695;
    TILE_WIDTH: number = 70;
    camera: Phaser.Cameras.Scene2D.Camera;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    gameWinText: Phaser.GameObjects.Text;
    gravityGuns: Phaser.Physics.Arcade.StaticGroup;
    gravitySensors: Phaser.Physics.Arcade.StaticGroup;
    currentTeleporter: null | Teleport;

    constructor() {
        super("Game");
    }

    create() {
        //GAME SETUP
        this.score = 0;
        this.cursors = this.input.keyboard?.createCursorKeys();

        //BACKGROUND
        const screenCenterX: number =
            this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY: number =
            this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.add
            .image(screenCenterX, screenCenterY, "sky")
            .setScale(9, 2.7)
            .setScrollFactor(0);

        this.add.image(272, 582, "clouds").setScrollFactor(0);
        this.add.image(744, 582, "clouds").setScrollFactor(0);
        this.scoreText = this.add
            .text(170, 16, "Score: " + this.score, {
                fontSize: 32,
                fontFamily: "Arial",
                color: "black",
                fontStyle: "bold",
            })
            .setScrollFactor(0, 0)
            .setOrigin(1, 0);

        //PLATFORMS
        const platforms: Phaser.Physics.Arcade.StaticGroup =
            this.physics.add.staticGroup();

        //GROUND PLATFORMS
        const emptyTiles: number[] = [
            15, 19, 20, 21, 22, 29, 30, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
            49, 50, 51, 52, 53, 54, 55, 56,
        ];
        for (var i = 0; i < 86; i++) {
            if (emptyTiles.includes(i)) continue;
            platforms.create(
                35 + this.TILE_WIDTH * i,
                this.baseY + 35,
                "groundMid",
            );
        }

        //PARKOUR 1
        platforms.create(250, this.baseY - 90, "grassHalfLeft");
        platforms.create(320, this.baseY - 90, "grassHalfMid");
        platforms.create(390, this.baseY - 90, "grassHalfRight");
        platforms.create(550, this.baseY - 165, "grassHalfLeft");
        platforms.create(
            550 + this.TILE_WIDTH,
            this.baseY - 165,
            "grassHalfRight",
        );
        platforms.create(940, this.baseY - 245, "grassHalf");
        platforms.create(550 + this.TILE_WIDTH, this.baseY - 325, "grassHalf");

        //PARKOUR 2
        this.add.image(1815, this.baseY + 35, "castleBack");
        this.add.image(1885, this.baseY + 35, "castleBack");
        platforms.create(2205, this.baseY - 105, "grassHalfLeft");
        platforms.create(
            2205 + this.TILE_WIDTH,
            this.baseY - 105,
            "grassHalfRight",
        );
        this.add.image(2425, this.baseY + 35, "castleBack");
        platforms.create(2500, this.baseY - 35, "box");
        platforms.create(2500, this.baseY - 105, "box");
        platforms.create(2500 + this.TILE_WIDTH, this.baseY - 105, "box");
        platforms.create(2500 + 2 * this.TILE_WIDTH, this.baseY - 105, "box");
        platforms.create(2500 + 3 * this.TILE_WIDTH, this.baseY - 105, "box");
        platforms.create(2500 + 3 * this.TILE_WIDTH, this.baseY - 35, "box");
        platforms.create(2800, this.baseY - 230, "grassHalf");
        platforms.create(2500, this.baseY - 330, "grassHalf");
        platforms.create(2100, this.baseY - 290, "grassHalfRight");
        platforms.create(
            2100 - this.TILE_WIDTH,
            this.baseY - 290,
            "grassHalfLeft",
        );

        //PARKOUR 3
        platforms.create(3200, this.baseY - 100, "castle");
        platforms.create(3500, this.baseY - 180, "castle");
        platforms.create(3800, this.baseY - 100, "castle");
        platforms.create(
            4200 + 2 * this.TILE_WIDTH,
            this.baseY - 455,
            "castle",
        );

        //CASTLE
        this.createCastle(platforms);

        //PARKOUR 4
        platforms.create(5200, this.baseY - 260, "grassHalf");
        platforms.create(5420, this.baseY - 360, "grassHalf");

        //UFO PLATFORMS
        platforms.create(
            5750 - this.TILE_WIDTH,
            this.baseY - 330,
            "grassHalfLeft",
        );
        platforms.create(5750, this.baseY - 330, "grassHalfMid");
        platforms.create(
            5750 + this.TILE_WIDTH,
            this.baseY - 330,
            "grassHalfRight",
        );
        this.add.image(5750, this.baseY - 315, "castleBack");

        //PLAYER
        const spawnX: number = 50;
        const spawnY: number = 600;
        this.player = this.physics.add
            .sprite(spawnX, spawnY, "player")
            .setScale(0.7, 0.7)
            .setCollideWorldBounds(true);

        this.physics.add.collider(this.player, platforms);

        //TPS
        const teleporters: Phaser.Physics.Arcade.StaticGroup =
            this.physics.add.staticGroup();
        const tileA: Teleport = teleporters.create(
            2100 - this.TILE_WIDTH,
            this.baseY - 291,
            "teleporter",
        );
        const tileB: Teleport = teleporters.create(
            2500 + 2 * this.TILE_WIDTH,
            this.baseY + 19,
            "teleporter",
        );
        tileA.destination = {
            x: tileB.x,
            y: tileB.body.top - this.player.body.halfHeight,
        };
        tileB.destination = {
            x: tileA.x,
            y: tileA.body.top - this.player.body.halfHeight,
        };
        this.currentTeleporter = null;
        this.physics.add.overlap(
            this.player,
            teleporters,
            (_player, tp) => {
                this.currentTeleporter = tp as Teleport;
            },
            undefined,
            this,
        );

        //GRAVITY GUNS
        const GRAVITY_RANGE: number = 200;
        const gravityGunPositions: { x: number; y: number }[] = [
            { x: 1885, y: this.baseY + 35 },
            { x: 2425, y: this.baseY + 35 },
            { x: 5750, y: this.baseY - 315 },
        ];

        this.gravityGuns = this.physics.add.staticGroup();
        this.gravitySensors = this.physics.add.staticGroup();

        gravityGunPositions.forEach(({ x, y }) => {
            const gun = this.add.sprite(x, y, "gravityGun");
            this.gravityGuns.add(gun);

            const sensor = this.add.zone(
                x,
                y - GRAVITY_RANGE / 2,
                gun.width,
                GRAVITY_RANGE,
            );
            this.physics.add.existing(sensor, true);
            this.gravitySensors.add(sensor);
        });

        //CACTI
        const cactus: Phaser.Physics.Arcade.StaticGroup =
            this.physics.add.staticGroup();
        cactus.create(950, this.baseY - 73, "cactus");
        cactus.create(1950, this.baseY - 73, "cactus");
        cactus.create(2205 + this.TILE_WIDTH, this.baseY - 198, "cactus");
        this.physics.add.overlap(
            this.player,
            cactus,
            () => this.gameOver(false),
            undefined,
            this,
        );

        //UFO
        const ufo: Phaser.Types.Physics.Arcade.ImageWithDynamicBody =
            this.physics.add
                .image(5750, this.baseY - 630, "ufo")
                .setScale(0.25)
                .setGravity(0, -900);
        this.physics.add.overlap(
            this.player,
            ufo,
            () => this.gameOver(true),
            undefined,
            this,
        );

        //STARS
        this.stars = this.physics.add.staticGroup();
        this.stars.create(250, this.baseY - 90 - 45, "star");
        this.stars.create(320, this.baseY - 90 - 45, "star");
        this.stars.create(390, this.baseY - 90 - 45, "star");
        this.stars.create(550 + this.TILE_WIDTH, this.baseY - 370, "star");
        this.stars.create(1470, this.baseY - 100, "star");
        this.stars.create(1950, this.baseY - 200, "star");
        this.stars.create(2100, this.baseY - 330, "star");
        this.stars.create(2215, this.baseY - 148, "star");
        this.stars.create(2500 + this.TILE_WIDTH, this.baseY - 20, "star");
        this.stars.create(4200, this.baseY - 20, "star");
        this.stars.create(4200 + this.TILE_WIDTH, this.baseY - 80, "star");
        this.stars.create(4200 + 2 * this.TILE_WIDTH, this.baseY - 140, "star");
        this.stars.create(4200 + 3 * this.TILE_WIDTH, this.baseY - 80, "star");
        this.stars.create(4200 + 4 * this.TILE_WIDTH, this.baseY - 20, "star");
        this.stars.create(4200 + 2 * this.TILE_WIDTH, this.baseY - 515, "star");
        this.stars.create(4700, this.baseY - this.TILE_WIDTH * 7 - 20, "star");
        this.stars.create(5750, this.baseY - 530, "star");
        this.stars.create(5850, this.baseY - 20, "star");
        this.physics.add.overlap(
            this.player,
            this.stars,
            (_player, star) => this.collectStar(star),
            undefined,
            this,
        );

        //FLY
        this.fly = this.physics.add
            .sprite(900, 50, "fly")
            .setGravityY(-900)
            .setVelocityX(-600)
            .play("flyFlightLeft");

        this.flyTime = this.time.addEvent({
            delay: 1200,
            callback: this.flyChange,
            callbackScope: this,
            loop: true,
        });

        //FLY BOMBS
        const bombs: Phaser.Physics.Arcade.Group = this.physics.add.group();
        this.physics.add.overlap(
            this.player,
            bombs,
            () => this.gameOver(false),
            undefined,
            this,
        );
        this.time.addEvent({
            delay: 800,
            callback: () => {
                const xCordFly = this.fly.x;
                const yCordFly = this.fly.y + 18;

                bombs
                    .create(xCordFly, yCordFly, "bomb")
                    .setVelocity(Phaser.Math.Between(-200, 200), 20);
            },
            callbackScope: this,
            loop: true,
        });

        //SNAIL
        this.snails = this.physics.add.group({
            key: "snail",
            repeat: 1,
            setXY: { x: 4200, y: this.baseY - 15.5, stepX: 700 },
        });
        this.snailTime = this.time.addEvent({
            delay: 3000,
            callback: this.snailChange,
            callbackScope: this,
            loop: true,
            startAt: 3000,
        });
        this.physics.add.collider(this.snails, platforms);
        this.physics.add.overlap(
            this.player,
            this.snails,
            (_player, snail) => this.hitSnail(snail),
            undefined,
            this,
        );

        //CAMERA
        this.cameras.main.setBounds(0, 0, 6000, 800);
        this.physics.world.setBounds(0, 0, 6000, 800);
        this.camera = this.cameras.main
            .startFollow(this.player, true, 0.08, 0.08)
            .setDeadzone(100, 50);
        this.cameras.main.roundPixels = true;
        //RESTART BUTTON
        this.add
            .text(this.cameras.main.width - 20, 16, "Restart", {
                fontSize: "32px",
                color: "#000",
                backgroundColor: "#fff",
                fontStyle: "bold",
                padding: { x: 20, y: 10 },
            })
            .setScrollFactor(0, 0)
            .setOrigin(1, 0)
            .setInteractive()
            .on("pointerdown", () => this.scene.restart());

        //WIN TEXT
        this.gameWinText = this.add
            .text(screenCenterX, screenCenterY, "WYGRANA", {
                fontSize: 64,
                fontFamily: "Arial",
                color: "black",
                fontStyle: "bold",
            })
            .setOrigin(0.5)
            .setScrollFactor(0, 0)
            .setVisible(false);
    }

    snailChange() {
        const snail: Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody =
            this.snails.getFirstAlive();
        if (!snail) {
            this.time.removeEvent(this.snailTime);
            return;
        }
        if (snail.body.velocity.x > 0) {
            this.snails.setVelocityX(-200).playAnimation("snailWalkingLeft");
        } else this.snails.setVelocityX(200).playAnimation("snailWalkingRight");
    }

    flyChange() {
        if (this.fly.body.velocity.x > 0) {
            this.fly.setVelocityX(-600).play("flyFlightLeft");
        } else this.fly.setVelocityX(600).play("flyFlightRight");
    }

    teleportPlayer(x: number, y: number) {
        this.player.disableBody(true, true); // disable physics momentarily

        this.time.delayedCall(100, () => {
            this.player.setPosition(x, y);
            this.player.enableBody(false, x, y, true, true);
        });

        this.currentTeleporter = null; // prevent repeat
    }

    gameOver(win: boolean) {
        this.physics.pause();
        this.time.removeAllEvents();
        this.player.setTint(win ? 0x00ff00 : 0xff0000);
        if (win) this.gameWinText.setVisible(true);

        this.registry.set("score", this.score);
        const highscore = this.registry.get("highscore") || 0;

        if (this.score > highscore) {
            this.registry.set("highscore", this.score);
        }

        this.time.delayedCall(2000, () =>
            win ? this.scene.start("MainMenu") : this.scene.start("GameOver"),
        );
    }

    collectStar(
        star:
            | Phaser.Physics.Arcade.Body
            | Phaser.Physics.Arcade.StaticBody
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
    ) {
        star.destroy();

        this.score += 10;
        this.scoreText.setText("Score: " + this.score);
    }

    hitSnail(
        snail:
            | Phaser.Physics.Arcade.Body
            | Phaser.Physics.Arcade.StaticBody
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
    ) {
        if (this.player.body.velocity.y > 0 && this.player.body.touching.down) {
            // Player is falling and hits snail from above
            snail.destroy();
            this.player.setVelocityY(-350); // Stronger bounce
            this.score += 20;
            this.scoreText.setText("Score: " + this.score);
        } else {
            // Player hits snail from side/below
            this.gameOver(false);
        }
    }

    createCastle(platforms: Phaser.Physics.Arcade.StaticGroup) {
        const TILE_SIZE = 70;
        const startX = 4700;
        const startY = this.baseY + TILE_SIZE / 2;

        const layout = [
            [
                { keys: "castleCenter" },
                { keys: "castleBack" },
                { keys: "castleBack" },
                { keys: "castleCenter" },
            ],
            [
                { keys: "castleCenter" },
                {
                    keys: ["castleBack", "castleLedgeRight"],
                    offsetX: [0, -TILE_SIZE / 2 + 1],
                    offsetY: [0, 10],
                },
                { keys: "castleBack" },
                { keys: "castleCenter" },
            ],
            [
                { keys: "castleCenter" },
                { keys: "castleBack" },
                {
                    keys: ["castleBack", "castleLedgeLeft"],
                    offsetX: [0, TILE_SIZE / 2 - 3],
                    offsetY: [0, 10],
                },
                { keys: "castleCenter" },
            ],
            [
                { keys: "castleCenter" },
                {
                    keys: ["castleBack", "castleLedgeRight"],
                    offsetX: [0, -TILE_SIZE / 2 + 1],
                    offsetY: [0, 10],
                },
                { keys: "castleBack" },
                { keys: "castleCenter" },
            ],
            [
                { keys: "castleCenter" },
                { keys: "castleBack" },
                { keys: "castleBack" },
                { keys: "castleBack" },
            ],
            [
                { keys: "castleCenter" },
                { keys: "castleCenter" },
                { keys: "castleCenter" },
                { keys: "castleCenter" },
            ],
            [
                { keys: "castleBack" },
                { keys: "castleBack" },
                { keys: "castleBack" },
                { keys: "castleBack" },
            ],
        ];

        const numRows = layout.length;

        const renderTile = (key: string, x: number, y: number) => {
            if (key === "castleBack") {
                this.add.image(x, y, key);
            } else {
                platforms.create(x, y, key);
            }
        };

        layout.forEach((row, rowIdx) => {
            const y = startY - (numRows - rowIdx) * TILE_SIZE;

            row.forEach((cell, colIdx) => {
                const x = startX + colIdx * TILE_SIZE;

                const keys = Array.isArray(cell.keys) ? cell.keys : [cell.keys];
                const offsetsX = cell.offsetX || keys.map(() => 0);
                const offsetsY = cell.offsetY || keys.map(() => 0);

                keys.forEach((key, i) => {
                    renderTile(key, x + offsetsX[i], y + offsetsY[i]);
                });
            });
        });
        // Create right edge
        platforms.create(
            startX + this.TILE_WIDTH * 4,
            startY - TILE_SIZE * 2 + 15,
            "castleHalfRight",
        );
    }

    update() {
        //DZIURA
        if (this.player.y >= 720) this.gameOver(false);
        //GRAVITY GUNS
        let inGravityField = false;

        this.physics.overlap(this.player, this.gravitySensors, () => {
            inGravityField = true;
        });
        this.player.body.setGravity(0, inGravityField ? -1000 : 0);

        //TP
        if (this.currentTeleporter && this.cursors?.down.isDown) {
            const dest = this.currentTeleporter.destination;
            if (dest) this.teleportPlayer(dest.x, dest.y);
        }

        //RUCH GRACZA
        if (!this.player.body!.touching.down && this.cursors?.right.isDown) {
            this.player.setTexture("playerJumpRight");
        }
        if (!this.player.body!.touching.down && this.cursors?.left.isDown) {
            this.player.setTexture("playerJumpLeft");
        }

        if (this.cursors?.right.isDown && !this.player.body?.blocked.right) {
            this.player.setVelocityX(300);
            this.player.anims.play("playerWalkingRight", true);
            if (this.cursors.up.isDown && this.player.body!.touching.down) {
                this.player.setVelocityY(-450);
            }
        } else if (
            this.cursors?.left.isDown &&
            !this.player.body?.blocked.left
        ) {
            this.player.setVelocityX(-300);
            this.player.anims.play("playerWalkingLeft", true);
            if (this.cursors.up.isDown && this.player.body!.touching.down) {
                this.player.setVelocityY(-450);
            }
        } else if (this.cursors?.up.isDown && this.player.body!.touching.down) {
            this.player.setVelocityY(-450);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.stop();
            this.player.setTexture("player");
        }
    }
}

