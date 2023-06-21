import { initCanvas } from "../inc/canvas";
import { initSlot } from "./slot";
import * as settings from "../settings.json";
import { ladderInit } from "../inc/ladder";

const images: Array<HTMLImageElement> = [];

// Initialize
function init(settings: Settings) {
	// Initialize the canvas
	initCanvas(
		settings.slot.width,
		settings.slot.height,
		settings.slot.background
	);

	// Ladder init
	ladderInit();

	// Initialize the slot after preloading the images
	preload().then(() => {
		initSlot(settings.slot.fps);
	});
}

// Asynchronously load the images defined in settings.json
async function preload(): Promise<void> {
	const slot = settings.slot;

	const promises = Object.keys(slot.symbols).map((key) => {
		const url: string = slot.symbols[key].image;

		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				resolve(img);
			};
			img.onerror = (e) => {
				reject(e);
			};
			img.src = url;
		});
	});

	try {
		const imgs = await Promise.all(promises);
		imgs.forEach((img) => images.push(img));
	} catch (e) {
		console.error("Error loading images:", e);
	}
}

export { init, images };
