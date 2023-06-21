import { canvas, ctx } from "../inc/ladder";

class Tile {
	public x: number = 0;
	public y: number = 0;
	public width: number = 0;
	public height: number = 0;
	public position: number = 0;

	constructor(position: number) {
		this.position = position;

		// Initialize
		this.init();
	}

	init() {
		this.width = 200;
		this.height = 20;
		this.x = 100;
		this.y = this.height * this.position;
		this.draw();
	}

	update() {
		this.draw();
	}

	draw() {
		ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

export default Tile;
