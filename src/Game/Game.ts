
namespace Game {

    export function initialize() {
        Resources.loadTextures(['emptybox', 'coinbox', 'coin', 'playerLeft', 'playerRight', 'bulletLeft', 'bulletRight', 'enemy', 'enemyHit']);
        Resources.loadAnimation('explosion', 'expl_01_$', 24, 0.3);
        initializeGlobalBlockTypeTable();
        Game.Rooms.start();

    }

}
