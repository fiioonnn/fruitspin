import { canvas, ctx } from "../inc/canvas";
import * as settings from "../settings.json";
import Row from "./row.class";
import * as utils from "../core/utils";

class Reel {
	public x: number = 0;
	public y: number = 0;
	public width: number = 0;
	public height: number = 0;
	public position: number = 0;
	public rows: Array<Row> = [];
	public symbols: Array<Symbol> = [];
	// Rows
	public rowsMoved: number = 0;
	public rowOverlap: number = 0;
	// States
	public done: boolean = true;
	public spinning: boolean = false;
	public stopping: boolean = false;
	public stopTimeout: number = 0;
	// test
	public spinningState: number = 0; // 0 === stopped; 1 === spinning; 2 === stopping

	constructor(position: number) {
		this.position = position;

		// Initialize the reel
		this.init();
	}

	public init() {
		this.width = canvas.width / settings.slot.reels;
		this.height = canvas.height;
		this.x = this.width * this.position;

		// Add rows to the reel
		for (let i: number = -1; i < settings.slot.rows; i++) {
			this.rows.push(new Row(this.x, i));
		}
	}

	public update() {
		this.draw();
		this.animate();

		// Update and draw the rows
		for (let i: number = 0; i < this.rows.length; i++) {
			this.rows[i].update();
		}
	}

	public draw() {
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	public start(duration: number) {
		this.spinning = true;
		this.done = false;
		this.rowsMoved = 0;
		this.rowOverlap = 0;
		this.rows.forEach((row) => (row.speed = -10));
		// Auto stop after x duration
		this.stopTimeout = setTimeout(() => {
			this.stop();
		}, duration);
	}

	public stop() {
		this.spinningState = 2;
		this.stopping = true;
		setTimeout(() => {
			clearInterval(this.stopTimeout);
			this.spinning = false;
			setTimeout(() => (this.stopping = false), 300);
		}, 300);
	}

	public spin(duration: number) {
		if (this.stopping) return;
		if (this.spinning) {
			this.rows.forEach((row) => (row.speed = 40));
			this.stop();
			return;
		}
		this.start(duration);
		this.spinningState = 1;
	}

	public animate() {
		// Spinning logic
		this.rows.forEach((row) => {
			// When the reel is spinning,
			// move the row with the speed.
			if (this.spinning) {
				row.y += row.speed;
			}

			// Automatically move the row to the top
			// when it reaches the limit (canvas.height + row.height).
			if (row.y >= canvas.height + row.height) {
				const lastRow: Row = this.rows.pop() as Row;
				lastRow.y = this.rows[0].y - this.rows[0].height;

				// Generate a new symbol for the row
				lastRow.symbolIndex = utils.getRandomNumber(
					0,
					Object.keys(settings.slot.symbols).length - 1
				);

				// Add the row to the top
				this.rows.unshift(lastRow);
				this.rowsMoved++;
			}
		});

		// Calculate the overlap between the rows
		this.rowOverlap = Math.abs(this.rows[1].y + this.rows[1].height);

		if (
			this.rows[1].y + this.rows[1].height > 0 &&
			this.rows[1].y < 0 &&
			!this.spinning
		) {
			for (let i = 0; i < this.rows.length; i++) {
				const row = this.rows[i];
				row.y -= (this.rowOverlap / row.speed) * 10;

				if (this.rowOverlap < 0.5) {
					this.rowOverlap = 0;
					row.y = Math.floor(row.y);
					this.spinning = false;
					this.done = true;
					this.spinningState = 0;
				}
			}
		}
	}

	public getVisibleRows(): Array<Row> {
		const visibleRows: Array<Row> = [];

		for (let i = 0; i < settings.slot.rowsVisible; i++) {
			visibleRows.push(
				this.rows.find(
					(row) =>
						row.y === i * (settings.slot.height / settings.slot.rowsVisible)
				) as Row
			);
		}

		return visibleRows;
	}
}

export default Reel;
