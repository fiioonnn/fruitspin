import Reel from "../classes/reel.class";
import Row from "../classes/row.class";
import { clearCanvas } from "../inc/canvas";
import * as settings from "../settings.json";
import * as overlay from "../inc/overlay";
import * as ui from "./ui";

const bets: Array<number> = [10, 20, 30, 40, 50, 60, 80, 100, 150, 200];
const reels: Array<Reel> = [];
const winningLines: WinningLines = {
	0: [
		[0, 0],
		[1, 0],
		[2, 0],
	],
	1: [
		[0, 1],
		[1, 1],
		[2, 1],
	],
	2: [
		[0, 2],
		[1, 2],
		[2, 2],
	],
	3: [
		[0, 0],
		[1, 1],
		[2, 2],
	],
	4: [
		[0, 2],
		[1, 1],
		[2, 0],
	],
};

let FPS: number = 0;
let TIMESTEP: number = 0;
let then: number = Date.now();
let gotResults: boolean = true;
let balance: number = 2000;
let betIndex: number = 0;
let autoStart: boolean = false;
let autoStartTimer: number = 0;
let autoStartPaused: boolean = false;
let spinDuration: number = 500;
let spinDelay: number = 166.66;

function initSlot(fps: number) {
	// Set the FPS and TIMESTEP
	FPS = fps;
	TIMESTEP = 1000 / FPS;
	// Add the reels to the loop
	addReels();
	// Start the loop
	drawReels();
}

function addReels() {
	for (let i: number = 0; i < settings.slot.reels; i++) {
		reels.push(new Reel(i));
	}
}

function drawReels() {
	const now: number = Date.now();
	const elapsed: number = now - then;
	if (elapsed >= TIMESTEP) {
		then = now - (elapsed % TIMESTEP);

		// console.log(reels.some((reel) => reel.done));
		// Clear the canvas
		clearCanvas();

		// Check if all reels are done
		if (reels.every((reel) => reel.done && !reel.spinning) && !gotResults) {
			const results: number[] = checkResults();
			overlay.highlight(checkResults());

			if (calculateMultiplier(results) > 0) {
				win(results);
			}

			gotResults = true;
		}

		// Update and draw the reels
		for (let i: number = 0; i < reels.length; i++) {
			reels[i].update();
		}
	}

	requestAnimationFrame(drawReels);
}

function win(results: number[]) {
	const multiplier = calculateMultiplier(results);
	const winAmount = bets[betIndex] * multiplier;

	changeBalance(winAmount);
	ui.changeStat("lastWin", winAmount);

	if (autoStart) {
		autoStartPaused = true;
		setTimeout(() => {
			autoStartPaused = false;
		}, 1000);
	}
}

function spinReels(delay: number, duration: number) {
	if (reels.some((reel) => reel.spinningState > 1)) return false;

	reels.forEach((reel, index) => {
		setTimeout(() => {
			reel.spin(duration);
		}, index * delay);
	});
	setTimeout(() => {
		gotResults = false;
	}, 10);

	if (reels.some((reel) => reel.spinningState > 0)) return;

	balance -= bets[betIndex];
	ui.changeStat("balance", balance);
	overlay.clear();
}

function getResults(): Array<number[]> {
	const result: Array<number[]> = [];

	for (let i = 0; i < reels.length; i++) {
		const rows: Row[][] = reels.map((reel) => reel.getVisibleRows());
		result.push(rows.map((row) => row[i].symbolIndex));
	}
	return result;
}

function checkResults(): number[] {
	const results: Array<number[]> = getResults();
	const lines: number[] = [];

	if (results[0][0] === results[0][1] && results[0][1] === results[0][2]) {
		lines.push(0);
	}

	if (results[1][0] === results[1][1] && results[1][1] === results[1][2]) {
		lines.push(1);
	}

	if (results[2][0] === results[2][1] && results[2][1] === results[2][2]) {
		lines.push(2);
	}

	if (results[0][0] === results[1][1] && results[1][1] === results[2][2]) {
		lines.push(3);
	}

	if (results[0][2] === results[1][1] && results[1][1] === results[2][0]) {
		lines.push(4);
	}

	return lines;
}

function calculateMultiplier(lines: number[]): number {
	const multiplier: number[] = [];

	lines.forEach((line) => {
		const winningLine = winningLines[line];

		winningLine.forEach((reelRow) => {
			const symbolsMultiplier: number = Object.values(settings.slot.symbols)[
				reels[reelRow[0]].getVisibleRows()[reelRow[1]].symbolIndex
			].multiplier;

			multiplier.push(symbolsMultiplier);
		});
	});

	return Math.round(multiplier.reduce((a, b) => a + b, 0) * 100) / 100;
}

//
// UI Functions
//

ui.changeStat("lastWin", 0);
ui.changeStat("balance", balance);
ui.changeStat("bet", bets[betIndex]);

ui.onButtonPressed("startBtn", () => {
	if (balance < bets[betIndex]) return;
	if (autoStart) {
		clearInterval(autoStartTimer);
		autoStart = false;
		ui.toggleClass("autoStartBtn", "interface__button--active");
	}

	spinReels(spinDelay, spinDuration);
});

ui.onButtonPressed("changeBetBtn", () => {
	if (autoStart) return;
	let maxPossibleBet = bets.filter((bet) => bet <= balance).pop();

	if (!maxPossibleBet) maxPossibleBet = bets[0];

	if (betIndex >= bets.length - 1 || bets[betIndex + 1] > maxPossibleBet) {
		betIndex = 0;
	} else {
		betIndex++;
	}

	ui.changeStat("bet", bets[betIndex]);
});

ui.onButtonPressed("maxBetBtn", () => {
	if (autoStart) return;

	const maxPossibleBet = bets.filter((bet) => bet <= balance).pop();
	if (!maxPossibleBet) return;

	betIndex = bets.indexOf(maxPossibleBet);

	ui.changeStat("bet", bets[betIndex]);
});

ui.onButtonPressed("autoStartBtn", (button: HTMLButtonElement) => {
	if (balance < bets[betIndex]) return;
	button.classList.toggle("interface__button--active");

	if (autoStart) {
		clearInterval(autoStartTimer);
		autoStart = false;
		return;
	}

	autoStart = true;

	spinReels(spinDelay, spinDuration);

	autoStartTimer = setInterval(() => {
		if (autoStartPaused) return;

		spinReels(spinDelay, spinDuration);
	}, spinDuration);
});

function changeBalance(amount: number) {
	balance += amount;
	ui.changeStat("balance", balance);
}

export { initSlot, reels, winningLines };
