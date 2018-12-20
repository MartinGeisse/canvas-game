
namespace Resources {

    interface Textures {
        [key: string]: HTMLImageElement
    }
    
    function loadImage(name : string, extension : string = 'png') : HTMLImageElement {
        var image = new Image();
        image.src = 'resources/' + name + '.' + extension;
        return image;
    }

    export function loadTextures(names : string[]) {
        for (var i in names) {
            var name = names[i];
            textures[name] = loadImage(name);
        }
    }

    export var textures : Textures = {};

}
