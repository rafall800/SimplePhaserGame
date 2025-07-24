import { Scene } from "phaser";

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;

    constructor() {
        super("GameOver");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor("#cf4a4a");

        const score = this.registry.get("score");
        const highscore = this.registry.get("highscore");

        this.add
            .text(512, 200, "Game Over", {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5);

        this.add
            .text(512, 300, `Score: ${score}`, {
                fontFamily: "Arial Black",
                fontSize: 48,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
                align: "center",
            })
            .setOrigin(0.5);

        this.add
            .text(512, 350, `High Score: ${highscore}`, {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4,
                align: "center",
            })
            .setOrigin(0.5);

        this.add
            .text(400, 450, "Restart", {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#000000",
                backgroundColor: "#ffffff",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", () => this.scene.start("Game"));

        this.add
            .text(624, 450, "Main Menu", {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#000000",
                backgroundColor: "#ffffff",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", () => this.scene.start("MainMenu"));
    }
}

