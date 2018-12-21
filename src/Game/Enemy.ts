
namespace Game {

	// right "hand" touches a wall
	export class Enemy extends Sprite {

		private dx : number;
		private dy : number;

		constructor(wallTouchX : number, wallTouchY : number, dx : number, dy : number) {
			super();
			var size = 0.7;
			var halfSize = size / 2;

			this.width = size;
			this.height = size;
			this.x = wallTouchX - halfSize;
			this.y = wallTouchY - halfSize;
			this.dx = dx;
			this.dy = dy;
			this.drawable = Resources.textures.enemy;

			if (dy < 0) {
				this.x -= halfSize;
			}
			if (dx > 0) {
				this.y -= halfSize;
			}
		}

        logic() : void {
        	this.saveOldPosition();

        	// retry at most 3 times, so we don't crash the application if this enemy is stuck in a wall
        	var retries = 3;
        	while (retries > 0) {

				// try moving around an outer corner
				this.x -= this.dy;
				this.y += this.dx;
				if (!this.collidesWithBlockmap()) {
					this.turnRight();
					return;
				} else {
					this.x = this.oldX;
					this.y = this.oldY;
				}

				// try moving ahead
				this.x += this.dx;
				this.y += this.dy;
				if (!this.collidesWithBlockmap()) {
					return;
				} else {
					this.x = this.oldX;
					this.y = this.oldY;
				}

				// we hit an inner corner
				this.turnLeft();
				retries--;

        	}

        }

        private turnLeft() : void {
			var temp = this.dx;
			this.dx = this.dy;
			this.dy = -temp;
        }

        private turnRight() : void {
			var temp = this.dx;
			this.dx = -this.dy;
			this.dy = temp;
        }

	}

}
