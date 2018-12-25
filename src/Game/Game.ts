
namespace Game {

    export function initialize() {

        Resources.loadTextures(['emptybox', 'coinbox', 'coin', 'playerLeft', 'playerRight', 'bulletLeft', 'bulletRight', 'enemy', 'enemyHit']);
        Resources.loadAnimation('explosion', 'expl_01_$', 24, 0.3);
        initializeGlobalBlockTypeTable();

        // copied from test room
        var map = [
            '###############',
            '#            ##',
            '#             #',
            '# o o **      #',
            '#  o          #',
            '#             #',
            '###############',
        ];
        var decoder = {
            ' ': 'empty',
            '#': 'block',
            '*': 'coinbox',
            'o': 'coin'
        };
        var scene : Scene = new Scene();
        scene.initializeMap(map, decoder);
        scene.addPlayer(3, 5);
        scene.add(new Enemy(10, 5, 0.1, 0));
        Engine.scene = scene;

    }

}
