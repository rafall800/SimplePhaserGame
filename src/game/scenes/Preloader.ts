import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(500, 400, "sky").setScale(9, 2.7).setScrollFactor(0);
        this.add.image(272, 582, "clouds").setScrollFactor(0);
        this.add.image(744, 582, "clouds").setScrollFactor(0);

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        const images = [
            { key: "ufo", path: "ufo.png" },
            { key: "groundMid", path: "grassMid.png" },
            { key: "grassHalf", path: "grassHalf.png" },
            { key: "grassHalfMid", path: "grassHalfMid.png" },
            { key: "grassHalfLeft", path: "grassHalfLeft.png" },
            { key: "grassHalfRight", path: "grassHalfRight.png" },
            { key: "box", path: "box.png" },
            { key: "teleporter", path: "teleporter.png" },
            { key: "castle", path: "castle.png" },
            { key: "castleCenter", path: "castleCenter.png" },
            { key: "castleHalfRight", path: "castleHalfRight.png" },
            { key: "castleLedgeRight", path: "castleLedgeRight.png" },
            { key: "castleLedgeLeft", path: "castleLedgeLeft.png" },
            { key: "castleBack", path: "castleBack.png" },
            { key: "gravityGun", path: "gravityGun.png" },
            { key: "cactus", path: "cactus.png" },
            { key: "player", path: "player.png" },
            { key: "bomb", path: "bomb.png" },
            { key: "star", path: "star.png" },
            { key: "playerJumpRight", path: "playerJumpRight.png" },
            { key: "playerJumpLeft", path: "playerJumpLeft.png" },
            { key: "snail", path: "snail.png" },
        ];
        const spritesheets = [
            {
                key: "playerWalkingRight",
                path: "playerWalkingRight.png",
                config: { frameWidth: 70, frameHeight: 94 },
            },
            {
                key: "playerWalkingLeft",
                path: "playerWalkingLeft.png",
                config: { frameWidth: 70, frameHeight: 94 },
            },
            {
                key: "flyFlightLeft",
                path: "flyFlightLeft.png",
                config: { frameWidth: 73.5, frameHeight: 36 },
            },
            {
                key: "flyFlightRight",
                path: "flyFlightRight.png",
                config: { frameWidth: 73.5, frameHeight: 36 },
            },
            {
                key: "snailWalkingLeft",
                path: "snailWalkingLeft.png",
                config: { frameWidth: 54, frameHeight: 31 },
            },
            {
                key: "snailWalkingRight",
                path: "snailWalkingRight.png",
                config: { frameWidth: 54, frameHeight: 31 },
            },
        ];
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets");

        images.forEach((asset) => {
            this.load.image(asset.key, asset.path);
        });
        spritesheets.forEach((asset) => {
            this.load.spritesheet(asset.key, asset.path, asset.config);
        });
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //ANIMACJE GRACZA
        this.anims.create({
            key: "playerWalkingRight",
            frames: this.anims.generateFrameNumbers("playerWalkingRight", {
                start: 0,
                end: 14,
            }),
            frameRate: 30,
            repeat: -1,
        });
        this.anims.create({
            key: "playerWalkingLeft",
            frames: this.anims.generateFrameNumbers("playerWalkingLeft", {
                start: 0,
                end: 14,
            }),
            frameRate: 30,
            repeat: -1,
        });
        //ANIMACJE MUCHY
        this.anims.create({
            key: "flyFlightLeft",
            frames: this.anims.generateFrameNumbers("flyFlightLeft", {
                start: 0,
                end: 1,
            }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: "flyFlightRight",
            frames: this.anims.generateFrameNumbers("flyFlightRight", {
                start: 0,
                end: 1,
            }),
            frameRate: 5,
            repeat: -1,
        });
        //ANIMACJE ŚLIMAKA
        this.anims.create({
            key: "snailWalkingLeft",
            frames: this.anims.generateFrameNumbers("snailWalkingLeft", {
                start: 0,
                end: 1,
            }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: "snailWalkingRight",
            frames: this.anims.generateFrameNumbers("snailWalkingRight", {
                start: 0,
                end: 1,
            }),
            frameRate: 5,
            repeat: -1,
        });

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.transition({
            target: "MainMenu",
            duration: 1000,
            moveBelow: true,
            onUpdate: (progress: number) => {
                this.cameras.main.setAlpha(1 - progress);
            },
        });
    }
}

