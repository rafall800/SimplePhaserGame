import { GameObjects, Scene } from "phaser";

export class MainMenu extends Scene {
    constructor() {
        super("MainMenu");
    }

    create() {
        //  Get the current highscore from the registry
        const score = this.registry.get("highscore");
        const textStyle = {
            fontFamily: "Arial Black",
            fontSize: 38,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
        };

        this.add.image(500, 400, "sky").setScale(9, 2.7).setScrollFactor(0);
        this.add.image(272, 582, "clouds").setScrollFactor(0);
        this.add.image(744, 582, "clouds").setScrollFactor(0);

        this.add
            .text(512, 550, "PARKOUR", {
                ...textStyle,
                fontSize: 100,
                align: "center",
            })
            .setOrigin(0.5);

        this.add
            .text(512, 460, "Press anything to start", {
                ...textStyle,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.add.text(32, 32, `High Score: ${score}`, textStyle);

        this.input.once("pointerdown", () => {
            this.scene.launch("Game");
            this.scene.sleep("MainMenu");
        });
        this.input.once("keydown", () => {
            this.scene.launch("Game");
            this.scene.sleep("MainMenu");
        });
    }
}

