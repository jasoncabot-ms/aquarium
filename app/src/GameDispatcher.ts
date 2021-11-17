import Phaser from 'phaser';

interface Player {
    id: string
    x: number
    y: number
    fish: string
}

class GameDispatcher extends Phaser.Events.EventEmitter {
    constructor() {
        super()
    }

    handle?: number

    start() {
        if (!this.handle) {
            this.handle = setInterval(this.addPlayer.bind(this), 1000);
        }
    }

    stop() {
        clearInterval(this.handle);
        this.handle = undefined;
    }

    addPlayer() {
        // TODO: this should come from WebSocket events
        this.emit('PLAYER_ADDED', { id: '12345', x: 0, y: 0, fish: 'blueJellyfish' } as Player);
    }
}

export { GameDispatcher };

export type { Player };
