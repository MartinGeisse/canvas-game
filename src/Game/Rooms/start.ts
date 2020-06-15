
namespace Game.Rooms {

	export var start : () => any = function() {
        var map = [
            '#######################################################',
            '#                                                    ##',
            '#                                                     #',
            '# o o **                                              #',
            '#  o                                                  #',
            '#                                                     >',
            '###########     #######################################',
            '###########     #######################################',
            '###########     #######################################',
            '############   ########################################',
            '############   ########################################',
            '#######################################################',
            '#######################################################',
        ];
        var decoder = {
            ' ': 'empty',
            '#': 'block',
            '*': 'coinbox',
            'o': 'coin',
            '>': 'empty',
        };
        var scene : Scene = new Scene();
        scene.initializeMap(map, decoder);
        scene.addPlayer(3, 5);
        scene.add(new Enemy(10, 5, 0.1, 0));
        Engine.scene = scene;

	}

	export var second : () => any = function() {
        var map = [
            '##############################',
            '#                            #',
            '#                            #',
            '#                            #',
            '#                            #',
            '<                            #',
            '##############################',
        ];
        var decoder = {
            ' ': 'empty',
            '#': 'block',
            '*': 'coinbox',
            'o': 'coin',
            '<': 'empty',
        };
        var scene : Scene = new Scene();
        scene.initializeMap(map, decoder);
        scene.addPlayer(1, 5);
        Engine.scene = scene;
	}

}

