import Phaser from 'phaser';
import { v4 as uuidv4 } from 'uuid';

interface Player {
    id: string
    x: number
    y: number
    fish: string
}

enum PlayerEvents {
    Added = 'PLAYER_ADDED',
    Removed = 'PLAYER_REMOVED',
    Moved = 'PLAYER_MOVED'
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
        this.emit(PlayerEvents.Added, { id: uuidv4(), x: 0, y: 0, fish: 'blueJellyfish' } as Player);
    }
}

export { GameDispatcher, PlayerEvents };

export type { Player };
