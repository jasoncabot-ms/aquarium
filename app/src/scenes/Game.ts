import Phaser from 'phaser';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.atlas('sea', 'assets/seacreatures.png', 'assets/seacreatures.json');
  }

  create() {
    this.anims.create({ key: 'purpleFish', frames: this.anims.generateFrameNames('sea', { prefix: 'purpleFish', end: 20, zeroPad: 4 }), repeat: -1 });

    const fish = this.add.sprite(600, 200, 'seacreatures').play('purpleFish');
    const x = this.physics.add.existing(fish);
    (fish as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody).body
      .setDamping(true)
      .setAngularDrag(1)
      .setCollideWorldBounds(false)
      .setMaxVelocity(250, 250)
      .setVelocity(0, 0)
      .setAcceleration(0, 0);

    this.cameras.main.startFollow(fish);
  }
}
