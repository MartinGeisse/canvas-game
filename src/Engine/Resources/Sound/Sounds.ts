
// TODO import properly
declare var Howl: any;

export interface Sounds {
    [key: string]: any
}
export const sounds: Sounds = {};

export function loadSound(name: string) {
    sounds[name] = new Howl({
        src: ['resources/sounds/' + name + '.wav'],
        html5: true,
    });
}

export function loadSounds(names: string[]) {
    for (const i in names) {
        loadSound(names[i]);
    }
}
