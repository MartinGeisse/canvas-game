
namespace Game {

	export var globalBlockTypeTable : {[key : string] : BlockType} = {};

	export function initializeGlobalBlockTypeTable() {
		globalBlockTypeTable.empty = new BlockType(null, false);
        globalBlockTypeTable.block = new BlockType(Resources.textures.emptybox, true);
        globalBlockTypeTable.coinbox = new BlockType(Resources.textures.coinbox, true);
        globalBlockTypeTable.coin = new BlockType(Resources.textures.coin, false);
	};

}
