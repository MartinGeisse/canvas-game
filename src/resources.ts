
namespace Resources {

    interface Textures {
        [key: string]: HTMLImageElement
    }
    
    function loadImage(name : string, extension : string = 'png') : HTMLImageElement {
        var image = new Image();
        image.src = 'resources/' + name + '.' + extension;
        return image;
    }

    export var textures : Textures = {
        'emptybox': loadImage('emptybox'),
        'coinbox': loadImage('coinbox'),
        'coin': loadImage('coin'),
    };

}
