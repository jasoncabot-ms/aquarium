import Phaser from 'phaser';
import { GameDispatcher, Player } from '../GameDispatcher';
import { availableFish } from './Main';

enum PlayerEvents {
  Added = 'PLAYER_ADDED',
  Removed = 'PLAYER_REMOVED'
}

class Game extends Phaser.Scene {
  constructor() {
    super('GameScene');

    this.gameDispatcher = new GameDispatcher();
  }

  gameDispatcher: GameDispatcher
  fish: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined
  selectedFish: string = '';
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined
  timer: Phaser.Time.TimerEvent | undefined

  otherFish: Phaser.GameObjects.Sprite[] = []

  init(data: any) {
    this.selectedFish = availableFish[(data.selectedFishIndex || 0)].key;
  }

  preload() {
    this.load.spritesheet('bubbles', 'assets/bubbles.png', { frameWidth: 394, frameHeight: 512 });
    this.load.atlas('seacreatures', 'assets/seacreatures.png', 'assets/seacreatures.json');
  }

  create() {
    // Handle multiplayer elements
    this.gameDispatcher.start();

    this.gameDispatcher.on(PlayerEvents.Added, (player: Player) => {
      console.log(`Player with id ${player.id} joined...`);
      const other = this.add.sprite(player.x, player.y, 'seacreatures').play(player.fish);
      this.otherFish.push(other);
    });
    this.gameDispatcher.on(PlayerEvents.Removed, (player: Player) => {
      console.log(`Player with id ${player.id} left...`);
    });

    // Fade in
    this.cameras.main.setBackgroundColor('#33A5E7');
    this.cameras.main.fadeIn(1000, 0, 0, 0)

    // Setup sprites
    this.anims.create({ key: 'blueJellyfish', frames: this.anims.generateFrameNames('seacreatures', { prefix: 'blueJellyfish', end: 32, zeroPad: 4 }), repeat: -1 });
		this.anims.create({ key: 'crab', frames: this.anims.generateFrameNames('seacreatures', { prefix: 'crab1', end: 25, zeroPad: 4 }), repeat: -1 })

    this.fish = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'seacreatures')
      .setVelocity(0, 0)
      .setAcceleration(0, 0)
      .setMaxVelocity(250, 250);
    this.fish.play(this.selectedFish);

    this.anims.create({
      key: "pop",
      frameRate: 8,
      frames: this.anims.generateFrameNumbers("bubbles", { start: 1, end: 7 }),
      hideOnComplete: true
    });

    // Camera movement
    this.cameras.main.startFollow(this.fish);
    this.cursors = this.input.keyboard.createCursorKeys();

    // Random bubbling
    this.timer = this.time.addEvent({
      delay: 500,
      callback: (scene: Phaser.Scene) => {
        const generated = Phaser.Math.Between(0, 100);
        if (generated > 25) return; // %-chance of showing a bubble
        const random = scene.cameras.main.worldView.getRandomPoint();
        scene.add.sprite(random.x, random.y, "bubbles").play("pop").setScale(0.2);
      },
      args: [this],
      repeat: -1
    });
  }

  destroy() {
    this.gameDispatcher.off(PlayerEvents.Added);
    this.gameDispatcher.off(PlayerEvents.Removed);
    this.gameDispatcher.stop();
    this.time.removeEvent(this.timer!);
  }

  update() {
    this.fish?.setVelocity(0);

    if (this.cursors?.left.isDown && this.cursors?.right.isUp) this.fish?.setVelocityX(-300);
    if (this.cursors?.right.isDown && this.cursors?.left.isUp) this.fish?.setVelocityX(300);

    if (this.cursors?.up.isDown && this.cursors?.down.isUp) this.fish?.setVelocityY(-300);
    if (this.cursors?.down.isDown && this.cursors?.up.isUp) this.fish?.setVelocityY(300);
  }
}

export { Game };