import {initializeGlobalBlockTypeTable} from "./GlobalBlockTypeTable";
import {startRoom} from "./Rooms/start";
import {loadAnimation, loadTextures} from "../Engine/Resources/Graphics/Graphics";
import {loadSounds} from "../Engine/Resources/Sound/Sounds";

export function initialize() {
    loadTextures(['emptybox', 'coinbox', 'coin', 'playerLeft', 'playerRight', 'bulletLeft', 'bulletRight', 'enemy', 'enemyHit', "deepGround"]);
    loadAnimation('explosion', 'expl_01_$', 24, 500);
    loadSounds(['shoot', 'kill', 'coin']);
    initializeGlobalBlockTypeTable();
    startRoom();
}
