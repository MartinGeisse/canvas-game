
namespace StandardLibrary {

    export class BlockType {

        constructor(public image : HTMLImageElement) {
        }

    }

    export class Map implements Engine.SceneObject {

        public readonly width : number;
        public readonly height : number;
        public readonly matrix : Uint8Array;
        public readonly blockTable : BlockType[];

        public constructor(width : number, height : number, blockTable : BlockType[]) {
            if (blockTable.length < 1) {
                throw 'empty block table';
            }
            this.width = width;
            this.height = height;
            this.matrix = new Uint8Array(width * height);
            this.blockTable = blockTable;
        }

        public getCode(x : number, y : number) : number {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                return 0;
            } else {
                return this.matrix[y * this.width + x];
            }
        }

        public getBlock(x : number, y : number) : BlockType {
            var code : number = this.getCode(x, y);
            if (code < 0 || code >= this.blockTable.length) {
                code = 0;
            }
            return this.blockTable[code];
        }

        public setCode(x : number, y : number, code : number) : void {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.matrix[y * this.width + x] = code;
            }
        }

        public setBlock(x : number, y : number, blockType : BlockType) : void {
            this.setCode(x, y, this.findCodeForBlockType(blockType));
        }

        public findCodeForBlockType(blockType : BlockType) : number {
            for (var i : number = 0; i < this.blockTable.length; i++) {
                if (this.blockTable[i] === blockType) {
                    return i;
                }
            }
            return -1;
        }

        public logic() : void {
        }

        public draw(fraction : number) : void {
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    var blockType : BlockType = this.getBlock(x, y);
                    if (blockType.image != null) {
                        Engine.canvasContext.drawImage(blockType.image, x, y, 1, 1);
                    }
                }
            }
        }

        public getZIndex() : number {
            return 1;
        }

        public any(x1 : number, y1: number, x2 : number, y2 : number, predicate : (blockType: BlockType) => boolean) : boolean {
            return this.anyAll(x1, y1, x2, y2, predicate, true);
        }

        public all(x1 : number, y1: number, x2 : number, y2 : number, predicate : (blockType: BlockType) => boolean) : boolean {
            return this.anyAll(x1, y1, x2, y2, predicate, false);
        }

        private anyAll(x1 : number, y1: number, x2 : number, y2 : number, predicate : (blockType: BlockType) => boolean, onMixed : boolean) : boolean {
            for (var x = Math.floor(x1); x < Math.ceil(x2); x++) {
                for (var y = Math.floor(y1); y < Math.ceil(y2); y++) {
                    if (predicate(this.getBlock(x, y)) == onMixed) {
                        return onMixed;
                    }
                }
            }
            return !onMixed;
        }

    }

}
