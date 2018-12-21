
namespace Game {

    export class PlayerBullet extends Sprite {

        public dx : number;
        public dy : number;

        constructor(x : number, y : number, dx : number, dy : number) {
            super();
            this.x = (dx > 0 ? x : (x - 0.4));
            this.y = y - 0.15;
            this.width = 0.4;
            this.height = 0.3;
            this.dx = dx;
            this.dy = dy;
            this.drawable = (dx > 0 ? Resources.textures.bulletRight : Resources.textures.bulletLeft);
        }

        logic() : void {
            this.saveOldPosition();
            this.move(this.dx, this.dy);
            var enemy = this.findCollidingSprite(Enemy);
            if (enemy) {
                Engine.scene.remove(this);
                enemy.hitByBullet();
            }
        }

        private move(dx : number, dy : number) : void {
            if (dx > 0.3 || dx < -0.3) {
                dx /= 2;
                dy /= 2;
                this.move(dx, dy);
                this.move(dx, dy);
            } else if (this.collidesWithBlockmap()) {
                Engine.scene.remove(this);
                Engine.scene.add(new ExplosionEffect(this.x + this.width / 2, this.y + this.height / 2, 0.6));
            } else {
                this.x += dx;
                this.y += dy;
            }
        }

    }

}
