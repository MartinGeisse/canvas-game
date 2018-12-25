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
Engine.scene.initializeMap(map, decoder);
Engine.scene.addPlayer(3, 5);
Engine.scene.add(new Enemy(10, 5, 0.1, 0));
