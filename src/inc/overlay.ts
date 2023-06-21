import * as settings from "../settings.json";
import Reel from "../classes/reel.class";
import * as slot from "../core/slot";

const canvas = document.querySelector("#overlay") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const lineColors: string[] = [
	"#ff0000",
	"#00ff00",
	"#0000ff",
	"#ffff00",
	"#00ffff",
];

canvas.width = settings.slot.width;
canvas.height = settings.slot.height;

let highlightTimeout: number = 0;

function drawShadow() {
	clear();
	ctx.fillStyle = "rgba(0,0,0,0.5)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function highlight(lines: number[]) {
	if (!lines.length) return;

	clearInterval(highlightTimeout);

	lines.forEach((line, index) => {
		const winningLines = slot.winningLines[line];
		highlightTimeout = setTimeout(() => {
			if (slot.reels.some((reel) => reel.spinningState > 0)) return;
			drawShadow();

			winningLines.forEach((reelRow) => {
				const reel = slot.reels[reelRow[0]];
				const row = reel.getVisibleRows()[reelRow[1]];

				// clear other lines
				ctx.clearRect(reel.x, row.y, reel.width, row.height);
			});
		}, 1000 * index);
		setTimeout(() => {
			clear();
		}, lines.length * 1000);
	});
}

function showLines(lines: number[]) {
	lines.forEach((line, index) => {
		const winningLines = slot.winningLines[line];
		setTimeout(() => {
			drawShadow();
			winningLines.forEach((reelRow) => {
				const reel = slot.reels[reelRow[0]];
				const row = reel.getVisibleRows()[reelRow[1]];

				ctx.clearRect(reel.x, row.y, reel.width, row.height);
			});
			if (index === lines.length - 1) setTimeout(() => clear(), 1000);
		}, 1500 * index);
		// iterate with delay
	});
}

// function highlightLine(reels: Reel[], lines: number[]) {
// 	if (!lines.length) return;
// 	// showLines(lines);
// 	lines.forEach((line) => {
// 		const firstRowIndex = slot.winningLines[line][0];
// 		const lastRowIndex =
// 			slot.winningLines[line][slot.winningLines[line].length - 1];
// 		const firstRow = reels[firstRowIndex[0]].getVisibleRows()[firstRowIndex[1]];
// 		const lastRow = reels[lastRowIndex[0]].getVisibleRows()[lastRowIndex[1]];

// 		slot.winningLines[line].forEach((reelRow) => {
// 			const reel = reels[reelRow[0]];
// 			const row = reel.getVisibleRows()[reelRow[1]];

// 			// draw rect around the winning rows
// 			ctx.clearRect(reel.x, row.y, reel.width, row.height);
// 		});

// 		ctx.beginPath();
// 		if (line <= 2) {
// 			ctx.moveTo(firstRow.x, firstRow.y + firstRow.height / 2);
// 			ctx.lineTo(lastRow.x + lastRow.width, lastRow.y + lastRow.height / 2);
// 		}
// 		if (line === 3) {
// 			ctx.moveTo(firstRow.x, firstRow.y);
// 			ctx.lineTo(lastRow.x + lastRow.width, lastRow.y + lastRow.height);
// 		}

// 		if (line === 4) {
// 			ctx.moveTo(firstRow.x, firstRow.y + firstRow.height);
// 			ctx.lineTo(lastRow.x + lastRow.width, lastRow.y);
// 		}
// 		ctx.strokeStyle = lineColors[line];
// 		ctx.lineWidth = 5;
// 		ctx.stroke();
// 	});
// }

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export { canvas, ctx, clear, highlight };

// lines.forEach((line, index) => {
// 	slot.winningLines[line].forEach((reelRow: number[]) => {
// 		const reel = reels[reelRow[0]];
// 		const row = reel.getVisibleRows()[reelRow[1]];

// 		// draw a line from the center of the first row to the center of the last row
// 		if (index === 0) {
// 			ctx.beginPath();
// 			ctx.moveTo(
// 				reel.x + reel.width / 2,
// 				row.y + row.height / 2 - reel.height
// 			);
// 		}

// 		if (index === lines.length - 1) {
// 			ctx.lineTo(
// 				reel.x + reel.width / 2,
// 				row.y + row.height / 2 + reel.height
// 			);
// 			ctx.strokeStyle = "#ff0000";
// 			ctx.lineWidth = 10;
// 			ctx.stroke();
// 		}
// 	});
// });

// return reels;
