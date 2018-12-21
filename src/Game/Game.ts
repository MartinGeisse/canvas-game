
namespace Game {

    export function initialize() {

        Resources.loadTextures(['emptybox', 'coinbox', 'coin', 'playerLeft', 'playerRight', 'bulletLeft', 'bulletRight']);
        Resources.loadAnimation('explosion', 'expl_01_$', 24, 0.3);

        var scene : Scene = new Scene();
        Engine.scene = scene;

        var blockTable : StandardLibrary.BlockType[] = [
            new BlockType(null, false),
            new BlockType(Resources.textures['emptybox'], true),
            new BlockType(Resources.textures['coinbox'], true),
            new BlockType(Resources.textures['coin'], false),
        ];
        var map : StandardLibrary.Map = new StandardLibrary.Map(20, 10, blockTable);
        scene.map = map;

        for (var i = 0; i < 20; i++) {
            map.setCode(i, 0, 1);
            map.setCode(i, 9, 1);
        }
        for (var i = 0; i < 10; i++) {
            map.setCode(0, i, 1);
            map.setCode(19, i, 1);
        }
        map.setCode(1, 1, 2);
        map.setCode(18, 1, 2);
        for (var i = 10; i < 13; i++) {
            map.setCode(i, 6, 3);
        }
        map.setCode(17, 6, 2);
        map.setCode(18, 6, 2);

        scene.add(map);

        var player : Player = new Player();
        player.x = 2;
        player.y = 3.0;
        scene.add(player);
        scene.player = player;

    }

}
