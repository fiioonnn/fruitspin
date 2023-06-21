import { canvas, ctx } from "../inc/canvas";
import * as settings from "../settings.json";
import * as core from "../core/core";

class Row {
	public x: number = 0;
	public y: number = 0;
	public width: number = 0;
	public height: number = 0;
	public color: string =
		"#" + Math.floor(Math.random() * 16777215).toString(16);
	public position: number = 0;
	public speed: number = -10;
	public maxSpeed: number = 30;
	public velocity: Velocity = {
		x: 0,
		y: 0,
	};
	public symbolIndex: number = 0;
	// highlight
	public highlightAlpha: number = 0;

	constructor(x: number, position: number) {
		this.x = x;
		this.position = position;

		// Initialize the row
		this.init();
	}

	public init() {
		this.width = canvas.width / settings.slot.reels;
		this.height = canvas.height / settings.slot.rowsVisible;
		this.y = this.height * this.position;
	}

	public update() {
		this.draw();

		// Update the speed
		if (this.speed <= this.maxSpeed) {
			this.speed += 1.5;
		}

		// fade the highlight in and out
		this.highlightAlpha += 0.05;

		// Debug
		if (settings.debug) {
			this.debug();
		}
	}

	public draw() {
		// ctx.fillStyle = this.color;
		// ctx.fillRect(this.x, this.y, this.width, this.height);

		// Draw the symbol
		const symbol = core.images[this.symbolIndex];
		ctx.drawImage(symbol, this.x, this.y, this.width, this.height);
	}

	public debug() {
		ctx.fillStyle = "#000000";
		ctx.font = "100px Arial";

		ctx.fillText(
			this.symbolIndex.toString(),
			this.x + this.width / 2 - 20,
			this.y + this.height / 2 + 35
		);
	}
}

export default Row;
