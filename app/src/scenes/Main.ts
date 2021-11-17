import Phaser, { LEFT } from 'phaser';
import WebFontFile from '../WebFontFile';

enum Direction {
    Previous = 1,
    Next,
}

const availableFish = [{ key: 'blueJellyfish', frame: 'blueJellyfish0010' }, { key: 'crab', frame: 'crab20000' }];

class Main extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.atlas('seacreatures', 'assets/seacreatures.png', 'assets/seacreatures.json');
        this.load.addFile(new WebFontFile(this.load, 'Seaweed Script'));
    }

    currentFish: Phaser.GameObjects.Sprite | undefined
    currentFishIdx: number = 0

    previousFishButton: Phaser.GameObjects.Text | undefined
    nextFishButton: Phaser.GameObjects.Text | undefined

    create() {
        this.cameras.main.setBackgroundColor('#33A5E7');

        this.currentFish = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 150, 'seacreatures', availableFish[this.currentFishIdx].frame);

        const font = {
            fontFamily: `"Seaweed Script"`,
            fontSize: '50px'
        };
        const startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start', font)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', this.startGame)
            .on('pointerover', () => startButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => startButton.setStyle({ fill: '#FFF' }));

        const previousFishButton = this.add.text(this.cameras.main.centerX - 150, this.currentFish.y, '<', font)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.changeFish(Direction.Previous) })
            .on('pointerover', () => previousFishButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => previousFishButton.setStyle({ fill: '#FFF' }));
        this.previousFishButton = previousFishButton;

        const nextFishButton = this.add.text(this.cameras.main.centerX + 150, this.currentFish.y, '>', font)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.changeFish(Direction.Next) })
            .on('pointerover', () => nextFishButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => nextFishButton.setStyle({ fill: '#FFF' }));
        this.nextFishButton = nextFishButton;

        this.updateButtonVisibility();
    }

    startGame = () => {
        this.cameras.main.fadeOut(1000, 0, 0, 0)
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (_camera: Phaser.Cameras.Scene2D.Camera, _effect: any) => {
            this.scene.transition({ target: 'GameScene', data: { selectedFishIndex: this.currentFishIdx } });
        })
    }

    updateButtonVisibility() {
        this.previousFishButton!.visible = this.currentFishIdx > 0;
        this.nextFishButton!.visible = this.currentFishIdx < availableFish.length - 1;
    }

    changeFish = (direction: Direction) => {
        switch (direction) {
            case Direction.Next:
                this.currentFishIdx += 1;
                break;
            case Direction.Previous:
                this.currentFishIdx -= 1;
                break;
        }
        this.currentFishIdx = Phaser.Math.Clamp(this.currentFishIdx, 0, availableFish.length - 1)
        this.currentFish?.setFrame(availableFish[this.currentFishIdx].frame);
        this.updateButtonVisibility();
    }

}

export { Main, availableFish }