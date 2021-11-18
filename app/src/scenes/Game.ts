import Phaser from 'phaser';
import { GameDispatcher, Player } from '../GameDispatcher';
import { availableFish } from './Main';

enum PlayerEvents {
  Added = 'PLAYER_ADDED',
  Removed = 'PLAYER_REMOVED',
  Moved = 'PLAYER_MOVED'
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

  playerSprites: Map<string, Phaser.GameObjects.Sprite> = new Map();

  init(data: any) {
    this.selectedFish = availableFish[(data.selectedFishIndex || 0)].key;
  }

  preload() {
    this.load.spritesheet('bubbles', 'assets/bubbles.png', { frameWidth: 394, frameHeight: 512 });
    this.load.atlas('seacreatures', 'assets/seacreatures.png', 'assets/seacreatures.json');
    this.load.image('bg-bubble', "assets/bubble_bg.png");
  }

  create() {
    // Handle multiplayer elements
    this.gameDispatcher.start();

    this.gameDispatcher.on(PlayerEvents.Added, (player: Player) => {
      console.log(`Player with id ${player.id} joined...`);
      const other = this.playerSprites.get(player.id) || this.add.sprite(player.x, player.y, 'seacreatures').play(player.fish);
      this.playerSprites.set(player.id, other);
      other.setPosition(player.x, player.y);
    });
    this.gameDispatcher.on(PlayerEvents.Removed, (player: Player) => {
      console.log(`Player with id ${player.id} left...`);
      const other = this.playerSprites.get(player.id);
      this.playerSprites.delete(player.id);
      other?.destroy(true);
    });
    this.gameDispatcher.on(PlayerEvents.Moved, (player: Player) => {
      const sprite = this.playerSprites.get(player.id);
      sprite?.setPosition(player.x, player.y);
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
        this.addRandomBubbles();
      },
      args: [],
      repeat: -1
    });
  }

  destroy() {
    this.gameDispatcher.off(PlayerEvents.Moved);
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

  addRandomBubbles = () => {
    for (let bubbleCount = 0; bubbleCount < Phaser.Math.Between(0, 20); bubbleCount++) {
      const pt = this.cameras.main.worldView.getRandomPoint();
      const size = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2][Phaser.Math.Between(0, 14)];
      const bubble = this.physics.add.image(pt.x, pt.y, 'bg-bubble')
        .setScale(size)
        .setVelocityY(-20)
        .setGravityY(-(32 / [1, 2, 4][size]))
        .setAlpha(0.4)
        .setScrollFactor(1.0 - (size * 0.1));

      this.tweens.add({
        targets: bubble,
        duration: Phaser.Math.Between(250, 2000),
        alpha: { value: 1 },
      });
    }
  }
}

export { Game };