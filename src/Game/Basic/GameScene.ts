import {Scene} from "../../Engine/Scene";
import {Blockmap, NULL_BLOCK_MAP} from "../BlockMap/Blockmap";
import {Player} from "../Player";
import {MapDecodingLookup} from "../BlockMap/MapDecodingLookup";
import {createMap} from "../BlockMap/initializeMap";
import {scene} from "../../Engine/Engine";

export class GameScene extends Scene {

    public map: Blockmap;
    public player: Player;

    constructor() {
        super();
        this.scale = 30;
        this.map = NULL_BLOCK_MAP;
        this.player = new Player();
    }

    initializeMap(encodedMap: string[], decodingLookup: MapDecodingLookup) {
        this.map = createMap(encodedMap, decodingLookup);
        this.add(this.map);
    }

    initializePlayer(x: number, y: number) {
        this.player.x = x;
        this.player.y = y;
        this.add(this.player);
    }

}

export function getGameScene(): GameScene {
    if (scene instanceof GameScene) {
        return scene;
    } else {
        throw new Error("scene object is not a GameScene");
    }
}
