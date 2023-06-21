import * as settings from "../settings.json";
import Tile from "../classes/tile.class";

const canvas = document.getElementById("ladder") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = settings.slot.width;
canvas.height = settings.slot.height;

const ladderSteps = [
	0,
	15,
	30,
	60,
	120,
	240,
	400,
	"Payout",
	800,
	1200,
	2000,
	3200,
	5200,
	8400,
	14000,
];

const ladderLevels = {
	0: [0, 1],
	1: [0, 2],
	2: [0, 3],
	3: [0, 4],
	4: [0, 5],
};

let ladderIndex = 0;
// let t = new Tile(0);
function buildLadder() {
	ladderSteps.forEach((step, index) => {});
}

function ladderInit() {
	// toggleLadder(0);
	// buildLadder();
}

function toggleLadder(win: number) {
	ctx.fillStyle = "rgba(0,0,0,0.5)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export { ladderInit, canvas, ctx };
