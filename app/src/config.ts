import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#33A5E7',
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  dom: {
    createContainer: true
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      debugShowBody: false
    }
  }
};